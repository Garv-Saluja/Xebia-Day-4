const express = require('express');
const router = express.Router();
const { register, login, getMe, logout, changePassword } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');
const { registerRules, loginRules, validate } = require('../middleware/validation.middleware');

// Public routes
router.post('/register', registerRules, validate, register);
router.post('/login', loginRules, validate, login);

// Protected routes
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);
router.put('/change-password', protect, changePassword);

module.exports = router;
