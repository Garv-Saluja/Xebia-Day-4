const User = require('../models/User.model');
const Course = require('../models/Course.model');

// ────────────────────────────────────────────────────────────────────────────
// @desc    Get student dashboard data
// @route   GET /api/dashboard/student
// @access  Private (student)
// ────────────────────────────────────────────────────────────────────────────
const getStudentDashboard = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: 'enrolledCourses',
        select: 'title thumbnail category level instructor rating totalLessons',
        populate: { path: 'instructor', select: 'name avatar' },
      })
      .lean();

    // Available courses (not enrolled)
    const availableCourses = await Course.find({
      isPublished: true,
      _id: { $nin: user.enrolledCourses.map((c) => c._id) },
    })
      .limit(6)
      .populate('instructor', 'name avatar')
      .select('title thumbnail category level rating enrolledStudents isFree price')
      .lean();

    const stats = {
      totalEnrolled: user.enrolledCourses.length,
      completedCourses: 0, // Extend with progress tracking
      hoursLearned: 0,     // Extend with progress tracking
      streak: 0,           // Extend with activity tracking
    };

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          bio: user.bio,
          lastLogin: user.lastLogin,
        },
        stats,
        enrolledCourses: user.enrolledCourses,
        availableCourses,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ────────────────────────────────────────────────────────────────────────────
// @desc    Get admin dashboard data
// @route   GET /api/dashboard/admin
// @access  Private (admin)
// ────────────────────────────────────────────────────────────────────────────
const getAdminDashboard = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalCourses,
      totalStudents,
      totalInstructors,
      recentUsers,
      recentCourses,
    ] = await Promise.all([
      User.countDocuments({ isActive: true }),
      Course.countDocuments(),
      User.countDocuments({ role: 'student', isActive: true }),
      User.countDocuments({ role: 'instructor', isActive: true }),
      User.find({ isActive: true }).sort({ createdAt: -1 }).limit(5).select('name email role createdAt').lean(),
      Course.find().sort({ createdAt: -1 }).limit(5).populate('instructor', 'name').select('title category isPublished enrolledStudents createdAt').lean(),
    ]);

    // Monthly signup data (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlySignups = await User.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        stats: { totalUsers, totalCourses, totalStudents, totalInstructors },
        recentUsers,
        recentCourses,
        monthlySignups,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ────────────────────────────────────────────────────────────────────────────
// @desc    Get instructor dashboard data
// @route   GET /api/dashboard/instructor
// @access  Private (instructor)
// ────────────────────────────────────────────────────────────────────────────
const getInstructorDashboard = async (req, res, next) => {
  try {
    const courses = await Course.find({ instructor: req.user._id })
      .select('title thumbnail category isPublished enrolledStudents rating createdAt')
      .lean();

    const totalStudents = courses.reduce((acc, c) => acc + c.enrolledStudents.length, 0);
    const publishedCourses = courses.filter((c) => c.isPublished).length;

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalCourses: courses.length,
          publishedCourses,
          draftCourses: courses.length - publishedCourses,
          totalStudents,
        },
        courses,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getStudentDashboard, getAdminDashboard, getInstructorDashboard };
