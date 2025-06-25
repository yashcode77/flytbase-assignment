const mongoose = require('mongoose');

const MissionSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    status: {
        type: String,
        enum: ['pending', 'active', 'completed', 'failed', 'cancelled'],
        default: 'pending'
    },
    coordinates: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
        altitude: { type: Number, default: 100 }
    },
    flightPath: [{
        latitude: Number,
        longitude: Number,
        altitude: Number,
        timestamp: Date
    }],
    scheduledAt: { type: Date },
    startedAt: { type: Date },
    completedAt: { type: Date },
    duration: { type: Number }, // in minutes
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    droneId: { type: String },
    missionType: {
        type: String,
        enum: ['surveillance', 'mapping', 'inspection', 'delivery'],
        default: 'surveillance'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'medium'
    }
}, { timestamps: true });

module.exports = mongoose.model('Mission', MissionSchema); 