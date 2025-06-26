const express = require('express');
const router = express.Router();
const Drone = require('../models/Drone');
const auth = require('../middleware/auth');

// Get all drones
router.get('/', auth, async (req, res) => {
    try {
        const drones = await Drone.find({ owner: req.user.id }).sort({ createdAt: -1 });
        res.json(drones);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get available drones for mission assignment
router.get('/available/list', auth, async (req, res) => {
    try {
        const drones = await Drone.find({
            owner: req.user.id,
            status: 'available',
            batteryLevel: { $gte: 20 } // Only drones with sufficient battery
        }).select('name model batteryLevel status');

        res.json(drones);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get single drone
router.get('/:id', auth, async (req, res) => {
    try {
        const drone = await Drone.findById(req.params.id);

        if (!drone) {
            return res.status(404).json({ message: 'Drone not found' });
        }

        // Check if user owns this drone
        if (drone.owner.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        res.json(drone);
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Drone not found' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

// Create drone
router.post('/', auth, async (req, res) => {
    try {
        const {
            name,
            model,
            serialNumber,
            maxAltitude,
            maxSpeed,
            batteryCapacity,
            cameraResolution,
            notes
        } = req.body;

        // Validation
        if (!name || !model || !serialNumber) {
            return res.status(400).json({ message: 'Please provide name, model, and serial number' });
        }

        const newDrone = new Drone({
            name,
            model,
            serialNumber,
            maxAltitude: maxAltitude || 120,
            maxSpeed: maxSpeed || 50,
            batteryCapacity: batteryCapacity || 100,
            batteryLevel: 100,
            cameraResolution: cameraResolution || '4K',
            status: 'available',
            owner: req.user.id,
            notes: notes || ''
        });

        const drone = await newDrone.save();
        res.status(201).json(drone);
    } catch (error) {
        console.error('Drone creation error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update drone
router.put('/:id', auth, async (req, res) => {
    try {
        const drone = await Drone.findById(req.params.id);

        if (!drone) {
            return res.status(404).json({ message: 'Drone not found' });
        }

        // Check if user owns this drone
        if (drone.owner.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const {
            name,
            model,
            serialNumber,
            maxAltitude,
            maxSpeed,
            batteryCapacity,
            cameraResolution,
            status,
            notes
        } = req.body;

        // Update fields
        if (name !== undefined) drone.name = name;
        if (model !== undefined) drone.model = model;
        if (serialNumber !== undefined) drone.serialNumber = serialNumber;
        if (maxAltitude !== undefined) drone.maxAltitude = maxAltitude;
        if (maxSpeed !== undefined) drone.maxSpeed = maxSpeed;
        if (batteryCapacity !== undefined) drone.batteryCapacity = batteryCapacity;
        if (cameraResolution !== undefined) drone.cameraResolution = cameraResolution;
        if (status !== undefined) drone.status = status;
        if (notes !== undefined) drone.notes = notes;

        const updatedDrone = await drone.save();
        res.json(updatedDrone);
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Drone not found' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

// Update drone battery level
router.patch('/:id/battery', auth, async (req, res) => {
    try {
        const { batteryLevel } = req.body;

        if (batteryLevel === undefined || batteryLevel < 0 || batteryLevel > 100) {
            return res.status(400).json({ message: 'Battery level must be between 0 and 100' });
        }

        const drone = await Drone.findById(req.params.id);

        if (!drone) {
            return res.status(404).json({ message: 'Drone not found' });
        }

        // Check if user owns this drone
        if (drone.owner.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        drone.batteryLevel = batteryLevel;

        // Update status based on battery level
        if (batteryLevel < 10) {
            drone.status = 'maintenance';
        } else if (batteryLevel < 20) {
            drone.status = 'low_battery';
        } else if (drone.status === 'low_battery' || drone.status === 'maintenance') {
            drone.status = 'available';
        }

        const updatedDrone = await drone.save();
        res.json(updatedDrone);
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Drone not found' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete drone
router.delete('/:id', auth, async (req, res) => {
    try {
        const drone = await Drone.findById(req.params.id);

        if (!drone) {
            return res.status(404).json({ message: 'Drone not found' });
        }

        // Check if user owns this drone
        if (drone.owner.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Check if drone is currently on a mission
        if (drone.status === 'in_mission') {
            return res.status(400).json({
                message: 'Cannot delete drone that is currently on a mission'
            });
        }

        await drone.deleteOne();
        res.json({ message: 'Drone deleted' });
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Drone not found' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 