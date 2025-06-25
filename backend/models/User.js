const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Not required for Google users
    name: { type: String, required: true },
    googleId: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema); 