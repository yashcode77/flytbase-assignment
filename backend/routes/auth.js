const express = require('express');
const passport = require('passport');
const router = express.Router();

// Local signup
router.post('/register', require('../controllers/auth').register);
// Local login
router.post('/login', require('../controllers/auth').login);
// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login', session: true }), require('../controllers/auth').googleCallback);
// Logout
router.get('/logout', require('../controllers/auth').logout);

module.exports = router; 