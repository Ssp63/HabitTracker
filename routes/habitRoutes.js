const express = require('express');
const router = express.Router();
const { 
  createHabit,
  getHabits,
  updateHabit,
  deleteHabit,
  trackHabit,
  getHabitById,
  getHabitStats,
  getChartData
} = require('../controllers/habitController');
const { protect } = require('../middleware/authMiddleware');

router.route('/chart-data').get(protect, getChartData);
router.route('/').get(protect, getHabits).post(protect, createHabit);
router
  .route('/:id')
  .get(protect, getHabitById)
  .put(protect, updateHabit)
  .delete(protect, deleteHabit);

router.route('/:id/track').post(protect, trackHabit);
router.route('/:id/stats').get(protect, getHabitStats);

module.exports = router;