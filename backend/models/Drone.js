const mongoose = require('mongoose');

const DroneSchema = new mongoose.Schema({
    name: { type: String, required: true },
    model: { type: String, required: true },
    serialNumber: { type: String, unique: true, required: true },
    status: {
        type: String,
        enum: ['available', 'in_mission', 'maintenance', 'offline', 'retired', 'low_battery'],
        default: 'available'
    },
    maxAltitude: { type: Number, default: 120 }, // in meters
    maxSpeed: { type: Number, default: 50 }, // in km/h
    batteryCapacity: { type: Number, default: 100 }, // in mAh
    batteryLevel: { type: Number, default: 100 }, // percentage
    cameraResolution: { type: String, default: '4K' },
    currentLocation: {
        latitude: Number,
        longitude: Number,
        altitude: Number,
        lastUpdated: Date
    },
    totalFlightHours: { type: Number, default: 0 },
    lastMaintenance: { type: Date },
    nextMaintenance: { type: Date },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Drone', DroneSchema); 