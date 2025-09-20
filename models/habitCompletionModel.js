const mongoose = require('mongoose');

const habitCompletionSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    habitId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      // Note: We don't use ref: 'Habit' because habits can be deleted
    },
    habitName: {
      type: String,
      required: true,
    },
    completionDate: {
      type: Date,
      required: true,
    },
    // Optional: Store additional metadata
    habitType: {
      type: String,
      enum: ['daily', 'weekly'],
      default: 'daily',
    },
    // This field helps us track when the habit was active
    habitCreatedAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for efficient querying
habitCompletionSchema.index({ user: 1, completionDate: 1 });
habitCompletionSchema.index({ user: 1, habitId: 1 });

module.exports = mongoose.model('HabitCompletion', habitCompletionSchema);