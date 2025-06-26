const Report = require('../models/Report');
const Mission = require('../models/Mission');

// Get all reports
const getReports = async (req, res) => {
    try {
        const reports = await Report.find({ userId: req.user.id })
            .populate('missionId', 'name missionType status')
            .sort({ createdAt: -1 });
        res.json({ reports });
    } catch (error) {
        console.error('Error fetching reports:', error);
        res.status(500).json({ message: 'Failed to fetch reports' });
    }
};

// Get single report
const getReport = async (req, res) => {
    try {
        const report = await Report.findOne({ _id: req.params.id, userId: req.user.id })
            .populate('missionId', 'name missionType status duration distance');

        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }

        res.json({ report });
    } catch (error) {
        console.error('Error fetching report:', error);
        res.status(500).json({ message: 'Failed to fetch report' });
    }
};

// Create report
const createReport = async (req, res) => {
    try {
        const { missionId, reportType, title, content, isPublic } = req.body;

        const report = new Report({
            userId: req.user.id,
            missionId,
            reportType,
            title,
            content,
            isPublic: isPublic || false
        });

        await report.save();

        const populatedReport = await Report.findById(report._id)
            .populate('missionId', 'name missionType status');

        res.status(201).json(populatedReport);
    } catch (error) {
        console.error('Error creating report:', error);
        res.status(500).json({ message: 'Failed to create report' });
    }
};

// Update report
const updateReport = async (req, res) => {
    try {
        const { title, content, isPublic } = req.body;

        const report = await Report.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            { title, content, isPublic },
            { new: true }
        ).populate('missionId', 'name missionType status');

        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }

        res.json({ report });
    } catch (error) {
        console.error('Error updating report:', error);
        res.status(500).json({ message: 'Failed to update report' });
    }
};

// Delete report
const deleteReport = async (req, res) => {
    try {
        const report = await Report.findOneAndDelete({ _id: req.params.id, userId: req.user.id });

        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }

        res.json({ message: 'Report deleted successfully' });
    } catch (error) {
        console.error('Error deleting report:', error);
        res.status(500).json({ message: 'Failed to delete report' });
    }
};

// Generate mission summary report
const generateMissionSummary = async (req, res) => {
    try {
        const { missionId } = req.params;

        const mission = await Mission.findOne({ _id: missionId, userId: req.user.id });
        if (!mission) {
            return res.status(404).json({ message: 'Mission not found' });
        }

        // Generate survey data based on mission details
        const surveyData = {
            distanceCovered: mission.distance || Math.floor(Math.random() * 5000) + 1000,
            flightTime: mission.duration || Math.floor(Math.random() * 120) + 30,
            batteryConsumption: Math.floor(Math.random() * 30) + 60,
            imagesCaptured: Math.floor(Math.random() * 50) + 10,
            altitude: Math.floor(Math.random() * 100) + 50,
            weatherConditions: ['Clear', 'Partly Cloudy', 'Overcast'][Math.floor(Math.random() * 3)],
            windSpeed: Math.floor(Math.random() * 20) + 5
        };

        // Generate analysis
        const analysis = {
            efficiency: Math.floor(Math.random() * 30) + 70,
            riskAssessment: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
            recommendations: [
                'Consider optimizing flight path for better coverage',
                'Monitor battery levels more closely during long missions',
                'Adjust altitude for better image quality'
            ]
        };

        const report = new Report({
            userId: req.user.id,
            missionId: mission._id,
            reportType: 'survey_summary',
            title: `Survey Summary - ${mission.name}`,
            content: `Comprehensive survey report for mission: ${mission.name}. This mission covered ${surveyData.distanceCovered}m with a flight time of ${surveyData.flightTime} minutes.`,
            data: surveyData,
            analysis: analysis,
            isPublic: false
        });

        await report.save();

        const populatedReport = await Report.findById(report._id)
            .populate('missionId', 'name missionType status');

        res.status(201).json(populatedReport);
    } catch (error) {
        console.error('Error generating mission summary:', error);
        res.status(500).json({ message: 'Failed to generate mission summary' });
    }
};

// Get reports statistics
const getReportsStats = async (req, res) => {
    try {
        const totalReports = await Report.countDocuments({ userId: req.user.id });

        const reportTypes = await Report.aggregate([
            { $match: { userId: req.user.id } },
            { $group: { _id: '$reportType', count: { $sum: 1 } } }
        ]);

        const thisMonth = new Date();
        thisMonth.setDate(1);
        thisMonth.setHours(0, 0, 0, 0);

        const thisMonthReports = await Report.countDocuments({
            userId: req.user.id,
            createdAt: { $gte: thisMonth }
        });

        const stats = {
            totalReports,
            thisMonthReports,
            reportTypes: {}
        };

        reportTypes.forEach(type => {
            stats.reportTypes[type._id] = type.count;
        });

        res.json(stats);
    } catch (error) {
        console.error('Error fetching reports stats:', error);
        res.status(500).json({ message: 'Failed to fetch reports statistics' });
    }
};

// Generate analytics
const generateAnalytics = async (req, res) => {
    try {
        const { startDate, endDate } = req.body;

        // Get all missions within the date range
        const query = { userId: req.user.id };
        if (startDate && endDate) {
            query.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        const missions = await Mission.find(query).populate('droneId', 'name model');

        if (missions.length === 0) {
            return res.status(200).json({
                totalMissions: 0,
                averageDuration: 0,
                efficiencyMetrics: {
                    successRate: 0,
                    totalDistance: 0,
                    averageBatteryEfficiency: 0
                },
                missionTypes: {},
                statusDistribution: {},
                recentPerformance: []
            });
        }

        // Calculate basic metrics
        const totalMissions = missions.length;
        const completedMissions = missions.filter(m => m.status === 'completed');
        const successRate = totalMissions > 0 ? Math.round((completedMissions.length / totalMissions) * 100) : 0;

        // Calculate duration metrics
        const durations = missions.map(m => m.duration || 0).filter(d => d > 0);
        const averageDuration = durations.length > 0 ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length) : 0;

        // Calculate distance metrics
        const distances = missions.map(m => m.distance || 0).filter(d => d > 0);
        const totalDistance = distances.reduce((a, b) => a + b, 0);

        // Calculate battery efficiency (simulated based on duration and distance)
        const batteryEfficiencies = missions.map(mission => {
            if (!mission.duration || !mission.distance) return 0;
            // Simulate battery efficiency based on duration and distance
            const baseEfficiency = 85; // Base efficiency percentage
            const durationFactor = Math.min(mission.duration / 60, 2); // Normalize to 2 hours
            const distanceFactor = Math.min(mission.distance / 10000, 1); // Normalize to 10km
            return Math.max(60, Math.min(95, baseEfficiency - (durationFactor * 5) - (distanceFactor * 10)));
        });
        const averageBatteryEfficiency = batteryEfficiencies.length > 0 ?
            Math.round(batteryEfficiencies.reduce((a, b) => a + b, 0) / batteryEfficiencies.length) : 0;

        // Mission type distribution
        const missionTypes = {};
        missions.forEach(mission => {
            const type = mission.missionType || 'unknown';
            missionTypes[type] = (missionTypes[type] || 0) + 1;
        });

        // Status distribution
        const statusDistribution = {};
        missions.forEach(mission => {
            const status = mission.status || 'unknown';
            statusDistribution[status] = (statusDistribution[status] || 0) + 1;
        });

        // Recent performance (last 5 missions)
        const recentMissions = missions
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5)
            .map(mission => ({
                id: mission._id,
                name: mission.name,
                status: mission.status,
                duration: mission.duration || 0,
                distance: mission.distance || 0,
                missionType: mission.missionType,
                createdAt: mission.createdAt,
                efficiency: mission.duration && mission.distance ?
                    Math.round((mission.distance / mission.duration) * 100) : 0
            }));

        res.json({
            totalMissions,
            averageDuration,
            efficiencyMetrics: {
                successRate,
                totalDistance,
                averageBatteryEfficiency
            },
            missionTypes,
            statusDistribution,
            recentPerformance: recentMissions
        });
    } catch (error) {
        console.error('Error generating analytics:', error);
        res.status(500).json({ message: 'Failed to generate analytics' });
    }
};

module.exports = {
    getReports,
    getReport,
    createReport,
    updateReport,
    deleteReport,
    generateMissionSummary,
    getReportsStats,
    generateAnalytics
}; 