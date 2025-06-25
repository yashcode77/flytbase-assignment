const express = require('express');
const router = express.Router();
const Report = require('../models/Report');
const Mission = require('../models/Mission');
const auth = require('../middleware/auth');

// Get all reports
router.get('/', auth, async (req, res) => {
    try {
        const reports = await Report.find({ generatedBy: req.user.id })
            .populate('missionId', 'name status')
            .populate('generatedBy', 'name email')
            .sort({ createdAt: -1 });
        res.json(reports);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching reports' });
    }
});

// Get single report
router.get('/:id', auth, async (req, res) => {
    try {
        const report = await Report.findById(req.params.id)
            .populate('missionId', 'name status coordinates')
            .populate('generatedBy', 'name email');
        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }
        res.json(report);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching report' });
    }
});

// Generate new report
router.post('/', auth, async (req, res) => {
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
            return res.status(403).json({ message: 'Not authorized' });
        }

        const report = new Report({
            missionId,
            reportType,
            title,
            content,
            data,
            analysis,
            generatedBy: req.user.id
        });

        await report.save();
        res.status(201).json(report);
    } catch (error) {
        res.status(500).json({ message: 'Error generating report' });
    }
});

// Update report
router.put('/:id', auth, async (req, res) => {
    try {
        const report = await Report.findById(req.params.id);
        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }

        if (report.generatedBy.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const updatedReport = await Report.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedReport);
    } catch (error) {
        res.status(500).json({ message: 'Error updating report' });
    }
});

// Delete report
router.delete('/:id', auth, async (req, res) => {
    try {
        const report = await Report.findById(req.params.id);
        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }

        if (report.generatedBy.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await Report.findByIdAndDelete(req.params.id);
        res.json({ message: 'Report deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting report' });
    }
});

// Generate analytics report
router.post('/analytics', auth, async (req, res) => {
    try {
        const { startDate, endDate, missionType } = req.body;

        const query = { createdBy: req.user.id };
        if (startDate && endDate) {
            query.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }
        if (missionType) {
            query.missionType = missionType;
        }

        const missions = await Mission.find(query);

        const analytics = {
            totalMissions: missions.length,
            completedMissions: missions.filter(m => m.status === 'completed').length,
            failedMissions: missions.filter(m => m.status === 'failed').length,
            averageDuration: 0,
            totalFlightTime: 0,
            missionTypes: {},
            statusDistribution: {}
        };

        let totalDuration = 0;
        let completedCount = 0;

        missions.forEach(mission => {
            if (mission.duration) {
                totalDuration += mission.duration;
                completedCount++;
            }

            analytics.missionTypes[mission.missionType] =
                (analytics.missionTypes[mission.missionType] || 0) + 1;

            analytics.statusDistribution[mission.status] =
                (analytics.statusDistribution[mission.status] || 0) + 1;
        });

        if (completedCount > 0) {
            analytics.averageDuration = Math.round(totalDuration / completedCount);
        }

        analytics.totalFlightTime = totalDuration;

        res.json(analytics);
    } catch (error) {
        res.status(500).json({ message: 'Error generating analytics' });
    }
});

module.exports = router; 