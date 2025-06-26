const Report = require('../models/Report');
const Mission = require('../models/Mission');
const Drone = require('../models/Drone');

// Get all reports for a user
const getAllReports = async (req, res) => {
    try {
        const { page = 1, limit = 10, reportType, startDate, endDate } = req.query;

        const query = { generatedBy: req.user.id };

        if (reportType) {
            query.reportType = reportType;
        }

        if (startDate && endDate) {
            query.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        const reports = await Report.find(query)
            .populate('missionId', 'name status missionType coordinates')
            .populate('generatedBy', 'name email')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Report.countDocuments(query);

        res.json({
            reports,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        console.error('Error fetching reports:', error);
        res.status(500).json({ message: 'Error fetching reports' });
    }
};

// Get single report by ID
const getReportById = async (req, res) => {
    try {
        const report = await Report.findById(req.params.id)
            .populate('missionId', 'name status missionType coordinates startTime endTime')
            .populate('generatedBy', 'name email');

        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }

        // Check if user has access to this report
        if (report.generatedBy._id.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to access this report' });
        }

        res.json(report);
    } catch (error) {
        console.error('Error fetching report:', error);
        res.status(500).json({ message: 'Error fetching report' });
    }
};

// Generate new report
const generateReport = async (req, res) => {
    try {
        const { missionId, reportType, title, content, data, analysis } = req.body;

        if (!missionId || !title) {
            return res.status(400).json({ message: 'Mission ID and title are required' });
        }

        // Verify mission exists and belongs to user
        const mission = await Mission.findById(missionId);
        if (!mission) {
            return res.status(404).json({ message: 'Mission not found' });
        }

        if (mission.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to access this mission' });
        }

        // Calculate additional data if not provided
        let reportData = data || {};
        if (!reportData.flightTime && mission.startTime && mission.endTime) {
            const duration = new Date(mission.endTime) - new Date(mission.startTime);
            reportData.flightTime = Math.round(duration / (1000 * 60)); // Convert to minutes
        }

        const report = new Report({
            missionId,
            reportType: reportType || 'summary',
            title,
            content,
            data: reportData,
            analysis,
            generatedBy: req.user.id
        });

        await report.save();

        const populatedReport = await Report.findById(report._id)
            .populate('missionId', 'name status missionType')
            .populate('generatedBy', 'name email');

        res.status(201).json(populatedReport);
    } catch (error) {
        console.error('Error generating report:', error);
        res.status(500).json({ message: 'Error generating report' });
    }
};

// Update report
const updateReport = async (req, res) => {
    try {
        const report = await Report.findById(req.params.id);
        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }

        if (report.generatedBy.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to update this report' });
        }

        const updatedReport = await Report.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        ).populate('missionId', 'name status missionType')
            .populate('generatedBy', 'name email');

        res.json(updatedReport);
    } catch (error) {
        console.error('Error updating report:', error);
        res.status(500).json({ message: 'Error updating report' });
    }
};

// Delete report
const deleteReport = async (req, res) => {
    try {
        const report = await Report.findById(req.params.id);
        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }

        if (report.generatedBy.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to delete this report' });
        }

        await Report.findByIdAndDelete(req.params.id);
        res.json({ message: 'Report deleted successfully' });
    } catch (error) {
        console.error('Error deleting report:', error);
        res.status(500).json({ message: 'Error deleting report' });
    }
};

// Generate analytics report
const generateAnalyticsReport = async (req, res) => {
    try {
        const { startDate, endDate, missionType, reportType = 'analytics' } = req.body;

        const query = { createdBy: req.user.id };
        if (startDate && endDate) {
            query.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }
        if (missionType) {
            query.missionType = missionType;
        }

        const missions = await Mission.find(query);
        const drones = await Drone.find({ createdBy: req.user.id });

        const analytics = {
            totalMissions: missions.length,
            completedMissions: missions.filter(m => m.status === 'completed').length,
            failedMissions: missions.filter(m => m.status === 'failed').length,
            pendingMissions: missions.filter(m => m.status === 'pending').length,
            inProgressMissions: missions.filter(m => m.status === 'in-progress').length,
            averageDuration: 0,
            totalFlightTime: 0,
            missionTypes: {},
            statusDistribution: {},
            droneUtilization: {},
            monthlyTrends: {},
            efficiencyMetrics: {
                successRate: 0,
                averageBatteryEfficiency: 0,
                averageDistanceCovered: 0
            }
        };

        let totalDuration = 0;
        let completedCount = 0;
        let totalBatteryEfficiency = 0;
        let totalDistanceCovered = 0;

        missions.forEach(mission => {
            if (mission.duration) {
                totalDuration += mission.duration;
                completedCount++;
            }

            // Mission type distribution
            analytics.missionTypes[mission.missionType] =
                (analytics.missionTypes[mission.missionType] || 0) + 1;

            // Status distribution
            analytics.statusDistribution[mission.status] =
                (analytics.statusDistribution[mission.status] || 0) + 1;

            // Monthly trends
            const month = new Date(mission.createdAt).toISOString().slice(0, 7);
            analytics.monthlyTrends[month] = (analytics.monthlyTrends[month] || 0) + 1;

            // Drone utilization
            if (mission.droneId) {
                analytics.droneUtilization[mission.droneId] =
                    (analytics.droneUtilization[mission.droneId] || 0) + 1;
            }
        });

        if (completedCount > 0) {
            analytics.averageDuration = Math.round(totalDuration / completedCount);
            analytics.efficiencyMetrics.successRate = Math.round((analytics.completedMissions / missions.length) * 100);
        }

        analytics.totalFlightTime = totalDuration;

        // Create analytics report
        const report = new Report({
            missionId: null, // Analytics report doesn't belong to a specific mission
            reportType,
            title: `Analytics Report - ${startDate ? new Date(startDate).toLocaleDateString() : 'All Time'} to ${endDate ? new Date(endDate).toLocaleDateString() : 'Present'}`,
            content: `Comprehensive analytics report covering ${analytics.totalMissions} missions`,
            data: analytics,
            analysis: {
                efficiency: analytics.efficiencyMetrics.successRate,
                riskAssessment: analytics.failedMissions > 0 ? 'Medium' : 'Low',
                recommendations: [
                    analytics.failedMissions > 0 ? 'Review failed missions for improvement opportunities' : 'Maintain current operational standards',
                    analytics.completedMissions < missions.length * 0.8 ? 'Focus on mission completion rates' : 'Excellent mission completion rate',
                    'Consider expanding drone fleet for increased capacity'
                ],
                compliance: true
            },
            generatedBy: req.user.id
        });

        await report.save();

        const populatedReport = await Report.findById(report._id)
            .populate('generatedBy', 'name email');

        res.json(populatedReport);
    } catch (error) {
        console.error('Error generating analytics report:', error);
        res.status(500).json({ message: 'Error generating analytics report' });
    }
};

// Get report statistics
const getReportStats = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const query = { generatedBy: req.user.id };
        if (startDate && endDate) {
            query.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }

        const totalReports = await Report.countDocuments(query);
        const thisMonth = await Report.countDocuments({
            generatedBy: req.user.id,
            createdAt: {
                $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                $lte: new Date()
            }
        });

        const reportTypes = await Report.aggregate([
            { $match: query },
            { $group: { _id: '$reportType', count: { $sum: 1 } } }
        ]);

        const stats = {
            totalReports,
            thisMonth,
            reportTypes: reportTypes.reduce((acc, type) => {
                acc[type._id] = type.count;
                return acc;
            }, {})
        };

        res.json(stats);
    } catch (error) {
        console.error('Error fetching report stats:', error);
        res.status(500).json({ message: 'Error fetching report statistics' });
    }
};

// Export report as PDF (placeholder for future implementation)
const exportReport = async (req, res) => {
    try {
        const report = await Report.findById(req.params.id)
            .populate('missionId', 'name status missionType coordinates')
            .populate('generatedBy', 'name email');

        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }

        if (report.generatedBy._id.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to export this report' });
        }

        // For now, return the report data as JSON
        // In a real implementation, you would generate a PDF here
        res.json({
            message: 'Report export functionality will be implemented',
            report: report
        });
    } catch (error) {
        console.error('Error exporting report:', error);
        res.status(500).json({ message: 'Error exporting report' });
    }
};

module.exports = {
    getAllReports,
    getReportById,
    generateReport,
    updateReport,
    deleteReport,
    generateAnalyticsReport,
    getReportStats,
    exportReport
}; 