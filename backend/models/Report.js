const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
    missionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Mission', required: true },
    reportType: {
        type: String,
        enum: ['summary', 'detailed', 'analytics', 'incident'],
        default: 'summary'
    },
    title: { type: String, required: true },
    content: { type: String },
    data: {
        distanceCovered: { type: Number }, // in meters
        flightTime: { type: Number }, // in minutes
        batteryConsumption: { type: Number }, // percentage
        imagesCaptured: { type: Number },
        videosCaptured: { type: Number },
        anomalies: [String],
        weatherConditions: {
            temperature: Number,
            windSpeed: Number,
            visibility: Number
        }
    },
    analysis: {
        efficiency: { type: Number }, // percentage
        riskAssessment: { type: String },
        recommendations: [String],
        compliance: { type: Boolean, default: true }
    },
    attachments: [{
        type: { type: String, enum: ['image', 'video', 'document'] },
        url: String,
        filename: String,
        size: Number
    }],
    generatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isPublic: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Report', ReportSchema); 