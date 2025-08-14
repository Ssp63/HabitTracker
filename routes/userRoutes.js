// routes/userRoutes.js

const express = require('express');
const router = express.Router();
// NEW: Import the controller function
// 1. Update the controller import to include getMe
const {
  registerUser,
  loginUser,
  getMe,
} = require('../controllers/userController');

// 2. Import the protect middleware
const { protect } = require('../middleware/authMiddleware');

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
// NEW: Replace the placeholder function with our actual controller function
router.post('/register', registerUser);

// @desc    Authenticate a user (login)
// @route   POST /api/users/login
// @access  Public
router.post('/login', loginUser);

// @desc    Get user data
// @route   GET /api/users/me
// @access  Private
router.get('/me', protect, getMe);

module.exports = router;