// models/habitModel.js

const mongoose = require('mongoose');

// Define the schema for the Habit collection.
const habitSchema = mongoose.Schema(
  {
    // This is the most important field for creating a relationship.
    // It will store the ID of the user who created this habit.
    user: {
      // The type of this field is a special MongoDB ObjectId.
      // This is the unique identifier format used by MongoDB for every document.
      type: mongoose.Schema.Types.ObjectId,
      required: true, // A habit must belong to a user, so this is a mandatory field.
      ref: 'User',    // The 'ref' property tells Mongoose which model to link to.
                      // In this case, the ObjectId stored here refers to a document in the 'User' collection.
    },
    name: {
      type: String,
      required: [true, 'Please add a name for the habit'], // The habit must have a name.
    },
  },
  {
    // As with the User schema, we add timestamps.
    // This will automatically create `createdAt` and `updatedAt` fields,
    // which are perfect for tracking when a habit was created.
    timestamps: true,
  }
);

// Compile the schema into a model and export it.
// Mongoose will create a 'habits' collection in the database based on the 'Habit' model name.
module.exports = mongoose.model('Habit', habitSchema);