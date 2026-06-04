const Course = require('../models/Course.model');
const User = require('../models/User.model');

// ────────────────────────────────────────────────────────────────────────────
// @desc    Get all published courses
// @route   GET /api/courses
// @access  Public
// ────────────────────────────────────────────────────────────────────────────
const getCourses = async (req, res, next) => {
  try {
    const { category, level, search, page = 1, limit = 12 } = req.query;
    const query = { isPublished: true };

    if (category) query.category = category;
    if (level) query.level = level;
    if (search) query.title = { $regex: search, $options: 'i' };

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [courses, total] = await Promise.all([
      Course.find(query)
        .populate('instructor', 'name avatar')
        .select('-lessons')
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 })
        .lean(),
      Course.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      courses,
    });
  } catch (err) {
    next(err);
  }
};

// ────────────────────────────────────────────────────────────────────────────
// @desc    Get single course by ID
// @route   GET /api/courses/:id
// @access  Public
// ────────────────────────────────────────────────────────────────────────────
const getCourseById = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name avatar bio');

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    res.status(200).json({ success: true, course });
  } catch (err) {
    next(err);
  }
};

// ────────────────────────────────────────────────────────────────────────────
// @desc    Create course
// @route   POST /api/courses
// @access  Private (instructor/admin)
// ────────────────────────────────────────────────────────────────────────────
const createCourse = async (req, res, next) => {
  try {
    const course = await Course.create({ ...req.body, instructor: req.user._id });
    res.status(201).json({ success: true, message: 'Course created', course });
  } catch (err) {
    next(err);
  }
};

// ────────────────────────────────────────────────────────────────────────────
// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private (instructor/admin)
// ────────────────────────────────────────────────────────────────────────────
const updateCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this course' });
    }

    const updated = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({ success: true, message: 'Course updated', course: updated });
  } catch (err) {
    next(err);
  }
};

// ────────────────────────────────────────────────────────────────────────────
// @desc    Enroll in course
// @route   POST /api/courses/:id/enroll
// @access  Private (student)
// ────────────────────────────────────────────────────────────────────────────
const enrollCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

    const alreadyEnrolled = course.enrolledStudents.includes(req.user._id);
    if (alreadyEnrolled) {
      return res.status(400).json({ success: false, message: 'Already enrolled in this course' });
    }

    await Promise.all([
      Course.findByIdAndUpdate(req.params.id, { $addToSet: { enrolledStudents: req.user._id } }),
      User.findByIdAndUpdate(req.user._id, { $addToSet: { enrolledCourses: course._id } }),
    ]);

    res.status(200).json({ success: true, message: `Successfully enrolled in "${course.title}"` });
  } catch (err) {
    next(err);
  }
};

// ────────────────────────────────────────────────────────────────────────────
// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private (admin)
// ────────────────────────────────────────────────────────────────────────────
const deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    res.status(200).json({ success: true, message: 'Course deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getCourses, getCourseById, createCourse, updateCourse, enrollCourse, deleteCourse };
