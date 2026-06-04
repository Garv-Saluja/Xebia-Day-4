const express = require('express');
const router = express.Router();
const { getStudentDashboard, getAdminDashboard, getInstructorDashboard } = require('../controllers/dashboard.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.get('/student', protect, authorize('student'), getStudentDashboard);
router.get('/instructor', protect, authorize('instructor'), getInstructorDashboard);
router.get('/admin', protect, authorize('admin'), getAdminDashboard);

module.exports = router;
