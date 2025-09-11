const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const { startOfDay, isToday, isYesterday, subDays, isSameDay, differenceInCalendarDays, format } = require('date-fns');
const Habit = require('../models/habitModel');

const getHabitById = asyncHandler(async (req, res) => {
  const habit = await Habit.findById(req.params.id);

  if (!habit) {
    res.status(404);
    throw new Error('Habit not found');
  }

  if (habit.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized to view this habit');
  }

  res.status(200).json(habit);
});

const getHabits = asyncHandler(async (req, res) => {
  const habits = await Habit.find({ user: req.user.id });
  res.status(200).json(habits);
});

const createHabit = asyncHandler(async (req, res) => {
  const { name, type, goal, frequency } = req.body;

  if (!name) {
    res.status(400);
    throw new Error('Please add a name for the habit');
  }

  if (type === 'weekly' && (!frequency || frequency < 1)) {
    res.status(400);
    throw new Error('Weekly habits require a frequency of at least 1');
  }

  const habitData = {
    name: name,
    user: req.user.id,
    type: type || 'daily',
  };

  if (goal && goal > 0) {
    habitData.goal = goal;
  }

  if (type === 'weekly' && frequency && frequency > 0) {
    habitData.frequency = frequency;
  }

  const habit = await Habit.create(habitData);
  res.status(201).json(habit);
});

const updateHabit = asyncHandler(async (req, res) => {
  const habit = await Habit.findById(req.params.id);

  if (!habit) {
    res.status(404);
    throw new Error('Habit not found');
  }

  if (habit.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized to update this habit');
  }

  const updatedHabit = await Habit.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).json(updatedHabit);
});

const deleteHabit = asyncHandler(async (req, res) => {
  const habit = await Habit.findById(req.params.id);

  if (!habit) {
    res.status(404);
    throw new Error('Habit not found');
  }

  if (habit.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized to delete this habit');
  }

  await habit.deleteOne();
  res.status(200).json({ id: req.params.id, message: 'Habit removed' });
});

const trackHabit = asyncHandler(async (req, res) => {
  const habit = await Habit.findById(req.params.id);

  if (!habit) {
    res.status(404);
    throw new Error('Habit not found');
  }

  if (habit.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized to update this habit');
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const completionIndex = habit.completions.findIndex(
    (completion) => completion.date.getTime() === today.getTime()
  );

  if (completionIndex > -1) {
    habit.completions.splice(completionIndex, 1);
  } else {
    habit.completions.push({ date: today });
  }

  const updatedHabit = await habit.save();
  res.status(200).json(updatedHabit);
});

const calculateCurrentStreak = (completionDates) => {
  if (!completionDates || completionDates.length === 0) {
    return 0;
  }

  let streak = 0;
  const sortedDates = completionDates.map(date => new Date(date)).sort((a, b) => b - a);
  
  const today = startOfDay(new Date());
  const yesterday = startOfDay(subDays(today, 1));

  let latestCompletion = startOfDay(sortedDates[0]);

  if (!isSameDay(latestCompletion, today) && !isSameDay(latestCompletion, yesterday)) {
    return 0;
  }

  let expectedDate = isToday(latestCompletion) ? today : yesterday;

  for (const completion of sortedDates) {
    const completionDay = startOfDay(new Date(completion));

    if (isSameDay(completionDay, expectedDate)) {
      streak++;
      expectedDate = subDays(expectedDate, 1);
    } else {
      break;
    }
  }

  return streak;
};


const calculateLongestStreak = (dates) => {
  // If there are no completions, there's no streak.
  if (dates.length === 0) {
    return 0;
  }

  // Initialize both longest and current streak. If there's at least one
  // completion, the streak is at least 1.
  let longestStreak = 1;
  let currentStreak = 1;

  // Loop through the sorted dates, starting from the second element.
  for (let i = 1; i < dates.length; i++) {
    const currentDate = new Date(dates[i]);
    // The previous day in the array we are comparing against.
    const previousDate = new Date(dates[i - 1]);

    // Calculate what the expected previous day should be for a consecutive streak.
    const expectedPreviousDay = subDays(currentDate, 1);

    // Check if the actual previous completion date is the one we expected.
    if (isSameDay(previousDate, expectedPreviousDay)) {
      // If it is, the streak continues! Increment the current streak count.
      currentStreak++;
    } else {
      // If it's not consecutive, the streak is broken.
      // First, check if the streak we just finished is the new longest streak.
      longestStreak = Math.max(longestStreak, currentStreak);
      // Then, reset the current streak count to 1 for the new, non-consecutive day.
      currentStreak = 1;
    }
  }

  // After the loop, there's one final check. The very last streak counted
  // might be the longest one, so we compare it against the longest streak found so far.
  return Math.max(longestStreak, currentStreak);
};


const calculateCompletionPercentage = (completionCount, createdAt) => {
  // If there are no completions, the percentage is 0.
  if (completionCount === 0) {
    return 0;
  }
  
  // Get today's date.
  const today = new Date();
  
  // Use date-fns to find the number of full days that have passed since creation.
  const daysSinceCreation = differenceInCalendarDays(today, new Date(createdAt));
  
  // The denominator is the total number of days the habit could have been tracked.
  // We add 1 because if a habit is created today, daysSinceCreation is 0,
  // but there has been 1 trackable day (today).
  const totalPossibleDays = daysSinceCreation + 1;

  // This should not happen with our logic, but it's a good practice to prevent division by zero.
  if (totalPossibleDays <= 0) {
    return 0;
  }
  
  // Calculate the percentage.
  const percentage = (completionCount / totalPossibleDays) * 100;
  
  // Return the percentage rounded to the nearest whole number for a clean display.
  return Math.round(percentage);
};

const getHabitStats = asyncHandler(async (req, res) => {
  // The Aggregation Pipeline prepares the data efficiently in the database.
  const statsPipeline = [
    { $match: { _id: new mongoose.Types.ObjectId(req.params.id) } },
    { $unwind: '$completions' },
    { $sort: { 'completions.date': 1 } },
    {
      $group: {
        _id: '$_id',
        user: { $first: '$user' },
        createdAt: { $first: '$createdAt' },
        completionDates: { $push: '$completions.date' },
      },
    },
  ];

  const statsResult = await Habit.aggregate(statsPipeline);

  // Handle cases where the habit has no completions or doesn't exist.
  if (statsResult.length === 0) {
    const habit = await Habit.findById(req.params.id).lean();
    if (!habit) {
      res.status(404);
      throw new Error('Habit not found');
    }
    if (habit.user.toString() !== req.user.id) {
      res.status(401);
      throw new Error('User not authorized');
    }
    // For habits that exist but have no completions, return a zeroed-out stats object.
    res.status(200).json({ 
      totalCompletions: 0,
      currentStreak: 0, 
      longestStreak: 0, 
      completionPercentage: 0
    });
    return;
  }

  const habitStats = statsResult[0];

  // Final security check for ownership.
  if (habitStats.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized to view these stats');
  }

  // --- The Assembly Stage ---
  // Here, you call your helper functions to get the final numbers.
  const totalCompletions = habitStats.completionDates.length;
  const currentStreak = calculateCurrentStreak(habitStats.completionDates);
  const longestStreak = calculateLongestStreak(habitStats.completionDates);
  const completionPercentage = calculateCompletionPercentage(
    totalCompletions,
    habitStats.createdAt
  );
  
  // Create the final JavaScript object that holds all your insights.
  const finalStats = {
    totalCompletions,
    currentStreak,
    longestStreak,
    completionPercentage,
  };

  // --- THE DELIVERY ---
  // This single line fulfills the current task's requirement.
  // It takes your `finalStats` object and sends it as a JSON response.
  res.status(200).json(finalStats);
});


const getChartData = asyncHandler(async (req, res) => {
    // Read the 'period' query parameter from the request URL.
  // Default to '30d' if it's not provided.
  const periodQuery = req.query.period || '30d'; 

  let periodInDays;

  // Use a switch statement to determine the number of days based on the query.
  // This is a secure way to handle user input, preventing unexpected values.
  switch (periodQuery) {
    case '7d':
      periodInDays = 7;
      break;
    case '90d':
      periodInDays = 90;
      break;
    case '30d':
    default: // The default case handles '30d' and any other invalid values.
      periodInDays = 30;
      break;
  } 
  // Get the start of today to ensure consistent date comparisons.
  const today = startOfDay(new Date());
  // Calculate the first day of our chart's date range.
  const startDate = subDays(today, periodInDays - 1);

  // --- PART 1: Database Aggregation ---
  const pipeline = [
    // STAGE 1: Match habits belonging to the currently logged-in user.
    // This is a critical first step for security and performance.
    {
      $match: {
        user: new mongoose.Types.ObjectId(req.user.id),
      },
    },
    // STAGE 2: Deconstruct the 'completions' array to process each one.
    {
      $unwind: '$completions',
    },
    // STAGE 3: Filter the individual completions to be within our desired date range.
    {
      $match: {
        'completions.date': {
          $gte: startDate, // Greater than or equal to our start date (30 days ago).
        },
      },
    },
    // STAGE 4: Group the completions by calendar day and count them.
    {
      $group: {
        // We group by the date part of the completion's timestamp.
        // `$dateToString` converts the full ISODate to a 'YYYY-MM-DD' string,
        // effectively ignoring the time and grouping all completions from the
        // same day together.
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$completions.date' },
        },
        // For each document in a group (i.e., for each completion on a given day),
        // we add 1 to the 'count'.
        count: { $sum: 1 },
      },
    },
    // STAGE 5: Sort the results by date in ascending chronological order.
    {
      $sort: { _id: 1 },
    },
    // STAGE 6: Reshape the output for easier use in our app.
    {
      $project: {
        _id: 0, // Exclude the default _id field from the output.
        date: '$_id', // Rename the '_id' field (which holds our date string) to 'date'.
        count: 1, // Include the 'count' field.
      },
    },
  ];

  // Execute the pipeline on the Habit collection.
  const dailyCompletions = await Habit.aggregate(pipeline);

  // --- PART 2: Application-Layer Densification ---
  // The result from the DB is sparse. Now we fill in the gaps for days with zero completions.

  // Create a JavaScript Map for fast lookups of completion counts by date.
  const completionsMap = new Map(
    dailyCompletions.map(item => [item.date, item.count])
  );

  const chartData = [];
  // Loop for each of the last 30 days, from the start date to today.
  for (let i = 0; i < periodInDays; i++) {
    const currentDate = subDays(today, periodInDays - 1 - i);
    // Format the current date of the loop into 'YYYY-MM-DD' to match our map keys.
    const formattedDateKey = format(currentDate, 'yyyy-MM-dd');

    // Look up the count for this date in our map. If it doesn't exist, it means
    // there were no completions, so we default to 0.
    const count = completionsMap.get(formattedDateKey) || 0;

    // Add a perfectly formatted object to our final chartData array.
    chartData.push({
      // We format the date for a more human-readable label on the chart (e.g., 'Oct 28').
      date: format(currentDate, 'MMM d'),
      // The key for our chart data will be 'completions'.
      completions: count,
    });
  }

  // Send the final, dense, and perfectly formatted array as a JSON response.
  res.status(200).json(chartData);
});



// Export the controller function so it can be used in our routes.
module.exports = {
  createHabit,
  getHabits,
  trackHabit,
  updateHabit,
  deleteHabit,
  getHabitById,
  getHabitStats,
  calculateCurrentStreak,
  calculateLongestStreak,
  calculateCompletionPercentage,
  getChartData,

};