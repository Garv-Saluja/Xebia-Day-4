const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, getAllUsers, deleteAccount } = require('../controllers/user.controller');
const { protect, authorize } = require('../middleware/auth.middleware');
const { updateProfileRules, validate } = require('../middleware/validation.middleware');

router.use(protect); // All user routes require auth

router.get('/profile', getProfile);
router.put('/profile', updateProfileRules, validate, updateProfile);
router.delete('/profile', deleteAccount);

// Admin only
router.get('/', authorize('admin'), getAllUsers);

module.exports = router;
