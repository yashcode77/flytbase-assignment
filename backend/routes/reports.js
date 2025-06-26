const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
    getAllReports,
    getReportById,
    generateReport,
    updateReport,
    deleteReport,
    generateAnalyticsReport,
    getReportStats,
    exportReport
} = require('../controllers/reports');

// Get all reports
router.get('/', auth, getAllReports);

// Get report statistics
router.get('/stats', auth, getReportStats);

// Get single report
router.get('/:id', auth, getReportById);

// Generate new report
router.post('/', auth, generateReport);

// Generate analytics report
router.post('/analytics', auth, generateAnalyticsReport);

// Update report
router.put('/:id', auth, updateReport);

// Delete report
router.delete('/:id', auth, deleteReport);

// Export report
router.get('/:id/export', auth, exportReport);

module.exports = router; 