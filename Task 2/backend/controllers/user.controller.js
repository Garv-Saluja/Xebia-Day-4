const User = require('../models/User.model');

// ────────────────────────────────────────────────────────────────────────────
// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
// ────────────────────────────────────────────────────────────────────────────
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('enrolledCourses', 'title thumbnail category level instructor')
      .lean();

    res.status(200).json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

// ────────────────────────────────────────────────────────────────────────────
// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
// ────────────────────────────────────────────────────────────────────────────
const updateProfile = async (req, res, next) => {
  try {
    const { name, bio, avatar } = req.body;

    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { name, bio, avatar },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, message: 'Profile updated', user: updated });
  } catch (err) {
    next(err);
  }
};

// ────────────────────────────────────────────────────────────────────────────
// @desc    Get all users (admin only)
// @route   GET /api/users
// @access  Private/Admin
// ────────────────────────────────────────────────────────────────────────────
const getAllUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find().skip(skip).limit(limit).lean(),
      User.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      total,
      page,
      pages: Math.ceil(total / limit),
      users,
    });
  } catch (err) {
    next(err);
  }
};

// ────────────────────────────────────────────────────────────────────────────
// @desc    Delete own account
// @route   DELETE /api/users/profile
// @access  Private
// ────────────────────────────────────────────────────────────────────────────
const deleteAccount = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { isActive: false });
    res.status(200).json({ success: true, message: 'Account deactivated successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getProfile, updateProfile, getAllUsers, deleteAccount };
