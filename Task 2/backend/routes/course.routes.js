const express = require('express');
const router = express.Router();
const {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  enrollCourse,
  deleteCourse,
} = require('../controllers/course.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

// Public
router.get('/', getCourses);
router.get('/:id', getCourseById);

// Private
router.post('/', protect, authorize('instructor', 'admin'), createCourse);
router.put('/:id', protect, authorize('instructor', 'admin'), updateCourse);
router.post('/:id/enroll', protect, authorize('student'), enrollCourse);
router.delete('/:id', protect, authorize('admin'), deleteCourse);

module.exports = router;
