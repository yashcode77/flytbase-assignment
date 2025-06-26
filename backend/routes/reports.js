const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const reportsController = require('../controllers/reportsController');

// Get all reports
router.get('/', auth, reportsController.getReports);

// Get report statistics
router.get('/stats/overview', auth, reportsController.getReportsStats);

// Get single report
router.get('/:id', auth, reportsController.getReport);

// Create new report
router.post('/', auth, reportsController.createReport);

// Update report
router.put('/:id', auth, reportsController.updateReport);

// Delete report
router.delete('/:id', auth, reportsController.deleteReport);

// Generate analytics report
router.post('/analytics', auth, reportsController.generateAnalytics);

// Generate mission summary report
router.post('/mission/:missionId/summary', auth, reportsController.generateMissionSummary);

module.exports = router; 