const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
    getAllDrones,
    getAvailableDrones,
    getDrone,
    createDrone,
    updateDrone,
    updateDroneBattery,
    deleteDrone
} = require('../controllers/droneController');

// Get all drones
router.get('/', auth, getAllDrones);

// Get available drones for mission assignment
router.get('/available/list', auth, getAvailableDrones);

// Get single drone
router.get('/:id', auth, getDrone);

// Create drone
router.post('/', auth, createDrone);

// Update drone
router.put('/:id', auth, updateDrone);

// Update drone battery level
router.patch('/:id/battery', auth, updateDroneBattery);

// Delete drone
router.delete('/:id', auth, deleteDrone);

module.exports = router; 