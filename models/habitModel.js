const mongoose = require('mongoose');

const habitSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: [true, 'Please add a name for the habit'],
    },
    type: {
      type: String,
      required: true,
      enum: ['daily', 'weekly'],
      default: 'daily',
    },
    frequency: {
      type: Number,
      default: null,
    },
    goal: {
      type: Number,
      default: null,
    },
    completions: [
      {
        date: {
          type: Date,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Habit', habitSchema);