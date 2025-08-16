// routes/habitRoutes.js

const express = require('express');
const router = express.Router();

// NEW: Import the controller function we just created.
const { createHabit,getHabits,updateHabit,deleteHabit } = require('../controllers/habitController');
// NEW: Import our authentication middleware.
const { protect } = require('../middleware/authMiddleware');

// @desc    Get all habits for the logged-in user
// @route   GET /api/habits
// @access  Private
// router.get('/', protect , getHabits);

// // @desc    Create a new habit
// // @route   POST /api/habits
// // @access  Private
// router.post('/', protect , createHabit )

// // @desc    Update a specific habit
// // @route   PUT /api/habits/:id
// // @access  Private
// router.put('/:id', protect, updateHabit);

// // @desc    Delete a specific habit
// // @route   DELETE /api/habits/:id
// // @access  Private
// router.delete('/:id', protect,deleteHabit );

router.route('/').get(protect, getHabits).post(protect, createHabit);

// Chain the routes for the path with an ID parameter '/:id'
// This is a clean way to handle multiple verbs (PUT, DELETE) for the same endpoint.
router
  .route('/:id')
  .put(protect, updateHabit)
  .delete(protect, deleteHabit); // <-- ADD THIS

// Export the router so it can be used in our main server.js file
module.exports = router;