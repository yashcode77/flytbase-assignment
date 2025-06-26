const Report = require('../models/Report');
const Mission = require('../models/Mission');
const User = require('../models/User');

// Get all reports for a user
exports.getAllReports = async (req, res) => {
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
exports.getReportById = async (req, res) => {
    try {
        const report = await Report.findById(req.params.id)
            .populate('missionId', 'name status missionType coordinates surveyArea flightPath')
            .populate('generatedBy', 'name email');

        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }

        // Check if user owns this report
        if (report.generatedBy._id.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to view this report' });
        }

        res.json(report);
    } catch (error) {
        console.error('Error fetching report:', error);
        res.status(500).json({ message: 'Error fetching report' });
    }
};

// Create new report
exports.createReport = async (req, res) => {
    try {
        const { missionId, reportType, title, content, data, analysis, isPublic } = req.body;

        if (!missionId || !title) {
            return res.status(400).json({ message: 'Mission ID and title are required' });
        }

        // Verify mission exists and belongs to user
        const mission = await Mission.findById(missionId);
        if (!mission) {
            return res.status(404).json({ message: 'Mission not found' });
        }

        if (mission.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to create report for this mission' });
        }

        // Auto-generate some data if not provided
        let reportData = data || {};
        if (!reportData.distanceCovered && mission.flightPath && mission.flightPath.length > 1) {
            reportData.distanceCovered = calculateDistance(mission.flightPath);
        }

        if (!reportData.flightTime && mission.duration) {
            reportData.flightTime = mission.duration;
        }

        const report = new Report({
            missionId,
            reportType: reportType || 'summary',
            title,
            content,
            data: reportData,
            analysis,
            generatedBy: req.user.id,
            isPublic: isPublic || false
        });

        await report.save();

        const populatedReport = await Report.findById(report._id)
            .populate('missionId', 'name status missionType')
            .populate('generatedBy', 'name email');

        res.status(201).json(populatedReport);
    } catch (error) {
        console.error('Error creating report:', error);
        res.status(500).json({ message: 'Error creating report' });
    }
};

// Update report
exports.updateReport = async (req, res) => {
    try {
        const { title, content, data, analysis, isPublic } = req.body;

        const report = await Report.findById(req.params.id);
        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }

        if (report.generatedBy.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to update this report' });
        }

        const updatedReport = await Report.findByIdAndUpdate(
            req.params.id,
            { title, content, data, analysis, isPublic },
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
exports.deleteReport = async (req, res) => {
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
exports.generateAnalytics = async (req, res) => {
    try {
        const { startDate, endDate, missionType, reportType } = req.body;

        const query = { createdBy: req.user.id };
        if (startDate && endDate) {
            query.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }
        if (missionType) {
            query.missionType = missionType;
        }

        const missions = await Mission.find(query);
        const reports = await Report.find({ generatedBy: req.user.id });

        const analytics = {
            totalMissions: missions.length,
            completedMissions: missions.filter(m => m.status === 'completed').length,
            failedMissions: missions.filter(m => m.status === 'failed').length,
            activeMissions: missions.filter(m => m.status === 'active').length,
            pendingMissions: missions.filter(m => m.status === 'pending').length,
            totalReports: reports.length,
            averageDuration: 0,
            totalFlightTime: 0,
            missionTypes: {},
            statusDistribution: {},
            reportTypes: {},
            monthlyTrends: {},
            efficiencyMetrics: {
                successRate: 0,
                averageFlightTime: 0,
                totalDistance: 0
            }
        };

        let totalDuration = 0;
        let completedCount = 0;
        let totalDistance = 0;

        // Process missions
        missions.forEach(mission => {
            if (mission.duration) {
                totalDuration += mission.duration;
                completedCount++;
            }

            if (mission.flightPath && mission.flightPath.length > 1) {
                totalDistance += calculateDistance(mission.flightPath);
            }

            analytics.missionTypes[mission.missionType] =
                (analytics.missionTypes[mission.missionType] || 0) + 1;

            analytics.statusDistribution[mission.status] =
                (analytics.statusDistribution[mission.status] || 0) + 1;

            // Monthly trends
            const month = new Date(mission.createdAt).toISOString().slice(0, 7);
            analytics.monthlyTrends[month] = (analytics.monthlyTrends[month] || 0) + 1;
        });

        // Process reports
        reports.forEach(report => {
            analytics.reportTypes[report.reportType] =
                (analytics.reportTypes[report.reportType] || 0) + 1;
        });

        // Calculate efficiency metrics
        if (completedCount > 0) {
            analytics.averageDuration = Math.round(totalDuration / completedCount);
            analytics.efficiencyMetrics.averageFlightTime = analytics.averageDuration;
        }

        if (missions.length > 0) {
            analytics.efficiencyMetrics.successRate =
                Math.round((analytics.completedMissions / missions.length) * 100);
        }

        analytics.totalFlightTime = totalDuration;
        analytics.efficiencyMetrics.totalDistance = Math.round(totalDistance);

        res.json(analytics);
    } catch (error) {
        console.error('Error generating analytics:', error);
        res.status(500).json({ message: 'Error generating analytics' });
    }
};

// Generate mission summary report
exports.generateMissionSummary = async (req, res) => {
    try {
        const { missionId } = req.params;

        const mission = await Mission.findById(missionId);
        if (!mission) {
            return res.status(404).json({ message: 'Mission not found' });
        }

        if (mission.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Calculate mission statistics
        const distanceCovered = mission.flightPath && mission.flightPath.length > 1
            ? calculateDistance(mission.flightPath)
            : 0;

        // Calculate survey area if surveyArea is provided
        let surveyAreaData = {};
        if (mission.surveyArea && mission.surveyArea.length > 2) {
            // Simple area calculation (for demonstration)
            const area = mission.surveyArea.length * 100; // Mock calculation
            surveyAreaData = {
                totalArea: area,
                coveragePercentage: Math.floor(Math.random() * 20) + 80, // 80-100%
                resolution: Math.floor(Math.random() * 5) + 2 // 2-7 cm/pixel
            };
        }

        const summaryData = {
            distanceCovered,
            flightTime: mission.duration || 0,
            batteryConsumption: Math.floor(Math.random() * 30) + 70, // Mock data
            imagesCaptured: Math.floor(Math.random() * 50) + 10, // Mock data
            videosCaptured: Math.floor(Math.random() * 5) + 1, // Mock data
            weatherConditions: {
                temperature: Math.floor(Math.random() * 20) + 15, // Mock data
                windSpeed: Math.floor(Math.random() * 15) + 5, // Mock data
                visibility: Math.floor(Math.random() * 10) + 5 // Mock data
            },
            surveyArea: surveyAreaData,
            siteInformation: {
                siteName: mission.name,
                location: `${mission.coordinates.latitude.toFixed(4)}, ${mission.coordinates.longitude.toFixed(4)}`,
                facilityType: mission.missionType,
                inspectionAreas: ['Perimeter', 'Roof', 'Equipment', 'Safety Systems']
            }
        };

        const analysis = {
            efficiency: Math.floor(Math.random() * 20) + 80, // Mock data
            riskAssessment: mission.status === 'completed' ? 'Low' : 'Medium',
            recommendations: [
                'Maintain regular maintenance schedule',
                'Monitor weather conditions before flight',
                'Ensure proper pre-flight checks',
                'Review survey data quality regularly'
            ],
            compliance: true,
            surveyQuality: {
                imageQuality: Math.floor(Math.random() * 3) + 8, // 8-10 scale
                coverageCompleteness: Math.floor(Math.random() * 10) + 90, // 90-100%
                dataAccuracy: Math.floor(Math.random() * 5) + 95 // 95-100%
            }
        };

        const report = new Report({
            missionId,
            reportType: 'survey_summary',
            title: `Survey Summary: ${mission.name}`,
            content: `Comprehensive survey report for ${mission.name} completed on ${new Date().toLocaleDateString()}. This survey covered ${mission.missionType} operations with detailed analysis of site conditions and data quality.`,
            data: summaryData,
            analysis,
            generatedBy: req.user.id
        });

        await report.save();

        const populatedReport = await Report.findById(report._id)
            .populate('missionId', 'name status missionType')
            .populate('generatedBy', 'name email');

        res.status(201).json(populatedReport);
    } catch (error) {
        console.error('Error generating mission summary:', error);
        res.status(500).json({ message: 'Error generating survey summary' });
    }
};

// Get report statistics
exports.getReportStats = async (req, res) => {
    try {
        const totalReports = await Report.countDocuments({ generatedBy: req.user.id });

        const thisMonth = new Date();
        thisMonth.setDate(1);
        const thisMonthReports = await Report.countDocuments({
            generatedBy: req.user.id,
            createdAt: { $gte: thisMonth }
        });

        const reportTypes = await Report.aggregate([
            { $match: { generatedBy: req.user.id } },
            { $group: { _id: '$reportType', count: { $sum: 1 } } }
        ]);

        const stats = {
            totalReports,
            thisMonthReports,
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

// Get survey statistics for organization-wide overview
exports.getSurveyStats = async (req, res) => {
    try {
        const { timeframe = '30d' } = req.body;

        // Calculate date range based on timeframe
        const endDate = new Date();
        let startDate = new Date();

        switch (timeframe) {
            case '7d':
                startDate.setDate(endDate.getDate() - 7);
                break;
            case '30d':
                startDate.setDate(endDate.getDate() - 30);
                break;
            case '90d':
                startDate.setDate(endDate.getDate() - 90);
                break;
            case '1y':
                startDate.setFullYear(endDate.getFullYear() - 1);
                break;
            default:
                startDate.setDate(endDate.getDate() - 30);
        }

        const query = {
            createdBy: req.user.id,
            createdAt: { $gte: startDate, $lte: endDate }
        };

        const missions = await Mission.find(query);
        const reports = await Report.find({
            generatedBy: req.user.id,
            createdAt: { $gte: startDate, $lte: endDate }
        });

        // Calculate comprehensive survey statistics
        const surveyStats = {
            totalSurveys: missions.length,
            totalSites: new Set(missions.map(m => `${m.coordinates.latitude},${m.coordinates.longitude}`)).size,
            totalFlightTime: 0,
            totalDistance: 0,
            completedSurveys: 0,
            failedSurveys: 0,
            averageDuration: 0,
            missionTypeDistribution: {},
            statusDistribution: {},
            siteCoverage: [],
            monthlyTrends: {},
            efficiencyMetrics: {
                successRate: 0,
                averageFlightTime: 0,
                totalDistance: 0,
                coverageEfficiency: 0
            }
        };

        let totalDuration = 0;
        let completedCount = 0;
        let totalDistance = 0;

        // Process missions for statistics
        missions.forEach(mission => {
            if (mission.duration) {
                totalDuration += mission.duration;
                completedCount++;
            }

            if (mission.flightPath && mission.flightPath.length > 1) {
                totalDistance += calculateDistance(mission.flightPath);
            }

            // Count by status
            surveyStats.statusDistribution[mission.status] =
                (surveyStats.statusDistribution[mission.status] || 0) + 1;

            // Count by mission type
            surveyStats.missionTypeDistribution[mission.missionType] =
                (surveyStats.missionTypeDistribution[mission.missionType] || 0) + 1;

            // Monthly trends
            const month = new Date(mission.createdAt).toISOString().slice(0, 7);
            surveyStats.monthlyTrends[month] = (surveyStats.monthlyTrends[month] || 0) + 1;

            // Count completed and failed
            if (mission.status === 'completed') {
                surveyStats.completedSurveys++;
            } else if (mission.status === 'failed') {
                surveyStats.failedSurveys++;
            }
        });

        // Calculate site coverage data
        const siteMap = new Map();
        missions.forEach(mission => {
            const siteKey = `${mission.coordinates.latitude.toFixed(4)},${mission.coordinates.longitude.toFixed(4)}`;
            if (!siteMap.has(siteKey)) {
                siteMap.set(siteKey, {
                    name: `Site ${siteMap.size + 1}`,
                    location: `${mission.coordinates.latitude.toFixed(4)}, ${mission.coordinates.longitude.toFixed(4)}`,
                    surveys: 0,
                    totalDistance: 0,
                    totalFlightTime: 0
                });
            }

            const site = siteMap.get(siteKey);
            site.surveys++;
            if (mission.duration) site.totalFlightTime += mission.duration;
            if (mission.flightPath && mission.flightPath.length > 1) {
                site.totalDistance += calculateDistance(mission.flightPath);
            }
        });

        surveyStats.siteCoverage = Array.from(siteMap.values());

        // Calculate efficiency metrics
        if (completedCount > 0) {
            surveyStats.averageDuration = Math.round(totalDuration / completedCount);
            surveyStats.efficiencyMetrics.averageFlightTime = surveyStats.averageDuration;
        }

        if (missions.length > 0) {
            surveyStats.efficiencyMetrics.successRate =
                Math.round((surveyStats.completedSurveys / missions.length) * 100);
        }

        surveyStats.totalFlightTime = totalDuration;
        surveyStats.efficiencyMetrics.totalDistance = Math.round(totalDistance);

        // Calculate coverage efficiency (sites surveyed vs total missions)
        if (missions.length > 0) {
            surveyStats.efficiencyMetrics.coverageEfficiency =
                Math.round((surveyStats.totalSites / missions.length) * 100);
        }

        res.json(surveyStats);
    } catch (error) {
        console.error('Error generating survey stats:', error);
        res.status(500).json({ message: 'Error generating survey statistics' });
    }
};

// Helper function to calculate distance between coordinates
function calculateDistance(flightPath) {
    if (!flightPath || flightPath.length < 2) return 0;

    let totalDistance = 0;
    for (let i = 1; i < flightPath.length; i++) {
        const prev = flightPath[i - 1];
        const curr = flightPath[i];

        const R = 6371e3; // Earth's radius in meters
        const φ1 = prev.latitude * Math.PI / 180;
        const φ2 = curr.latitude * Math.PI / 180;
        const Δφ = (curr.latitude - prev.latitude) * Math.PI / 180;
        const Δλ = (curr.longitude - prev.longitude) * Math.PI / 180;

        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        totalDistance += R * c;
    }

    return Math.round(totalDistance);
} 