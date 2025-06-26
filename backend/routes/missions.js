const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
    getAllMissions,
    getMission,
    createMission,
    updateMission,
    updateMissionStatus,
    deleteMission
} = require('../controllers/missionController');

// Get all missions
router.get('/', auth, getAllMissions);

// Get single mission
router.get('/:id', auth, getMission);

// Create mission
router.post('/', auth, createMission);

// Update mission
router.put('/:id', auth, updateMission);

// Update mission status
router.patch('/:id/status', auth, updateMissionStatus);

// Delete mission
router.delete('/:id', auth, deleteMission);

module.exports = router; 