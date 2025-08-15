// controllers/habitController.js

const asyncHandler = require('express-async-handler');

// We need our Habit model to interact with the habits collection in the database.
const Habit = require('../models/habitModel');
// We also need the User model to ensure we're working with a valid user.


const getHabits = asyncHandler(async (req, res) => {
  // Our 'protect' middleware has already run and attached the user to the request.
  // We can access the logged-in user's ID via `req.user.id`.

  // We use the Habit model to find all habits in the database.
  // The crucial part is the filter object: { user: req.user.id }.
  // This tells Mongoose to only return habits where the 'user' field
  // exactly matches the ID of the currently authenticated user.
  // This ensures users can only ever see their own habits.
  const habits = await Habit.find({ user: req.user.id });

  // Respond with a 200 OK status and the array of habits found.
  // If no habits are found for the user, this will correctly return an empty array [].
  res.status(200).json(habits);
});
// @desc    Create a new habit
// @route   POST /api/habits
// @access  Private (requires authentication)
const createHabit = asyncHandler(async (req, res) => {
  // We expect the name of the habit to be in the request body.
  const { name } = req.body;

  // Basic validation: ensure the 'name' field was sent.
  if (!name) {
    res.status(400); // 400 Bad Request
    throw new Error('Please add a name for the habit');
  }

  // The 'protect' middleware (which we will add to the route) has already
  // verified the JWT and attached the user object to the request.
  // We can access the logged-in user's ID via `req.user.id`.

  // Create the habit in the database using our Habit model.
  const habit = await Habit.create({
    name: name,         // The name of the habit from the request body.
    user: req.user.id,  // This is the crucial line that links the habit to the logged-in user.
  });

  // If the habit was created successfully, send it back to the client.
  // A 201 status code indicates that a resource was successfully created.
  res.status(201).json(habit);
});

// @desc    Update a specific habit
// @route   PUT /api/habits/:id
// @access  Private
const updateHabit = asyncHandler(async (req, res) => {
  // 1. Find the habit by its ID from the URL parameters.
  const habit = await Habit.findById(req.params.id);

  // 2. Check if the habit exists.
  if (!habit) {
    res.status(404); // 404 Not Found
    throw new Error('Habit not found');
  }

  // The user object is attached to the request by our 'protect' middleware.
  // const user = req.user; // We already have the user from the token

  // 3. CRITICAL: Verify that the logged-in user is the owner of the habit.
  // The `habit.user` field is an ObjectId, so we convert it to a string for comparison.
  if (habit.user.toString() !== req.user.id) {
    res.status(401); // 401 Unauthorized
    throw new Error('User not authorized to update this habit');
  }

  // 4. If the habit exists and the user is authorized, perform the update.
  // Habit.findByIdAndUpdate() finds the document by ID and updates it with the new data from `req.body`.
  // The `{ new: true }` option ensures that the updated document is returned.
  const updatedHabit = await Habit.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  // 5. Respond with the updated habit.
  res.status(200).json(updatedHabit);
});
// Export the controller function so it can be used in our routes.
module.exports = {
  createHabit,
  getHabits,
  updateHabit,
};