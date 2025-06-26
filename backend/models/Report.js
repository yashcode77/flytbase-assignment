const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
    missionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Mission', required: true },
    reportType: {
        type: String,
        enum: ['survey_summary', 'summary', 'detailed', 'analytics', 'incident'],
        default: 'survey_summary'
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
        },
        surveyArea: {
            totalArea: Number, // in square meters
            coveragePercentage: Number,
            resolution: Number // in cm/pixel
        },
        siteInformation: {
            siteName: String,
            location: String,
            facilityType: String,
            inspectionAreas: [String]
        }
    },
    analysis: {
        efficiency: { type: Number }, // percentage
        riskAssessment: { type: String },
        recommendations: [String],
        compliance: { type: Boolean, default: true },
        surveyQuality: {
            imageQuality: Number, // 1-10 scale
            coverageCompleteness: Number, // percentage
            dataAccuracy: Number // percentage
        }
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