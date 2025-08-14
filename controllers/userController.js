// controllers/userController.js

// NEW: Import express-async-handler
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); 


const generateToken = (id) => {
  // jwt.sign() creates the token.
  // It takes the payload, the secret, and optional settings.
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // The token will expire in 30 days.
  });
};
// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
// NEW: Wrap the async function with asyncHandler
const registerUser = asyncHandler(async (req, res) => {
  // The entire logic from before goes here.
  // NO try-catch block is needed! asyncHandler handles it for us.
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please add all fields');
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

    // 1. Generate a salt
  // bcrypt.genSalt() is an async function that creates the salt.
  // The argument (e.g., 10) is the "cost factor" or "salt rounds".
  // A higher number means more processing time is needed to hash, making it more secure against brute-force attacks. 10 is a good default.
  const salt = await bcrypt.genSalt(10);

  // 2. Hash the password
  // We take the plain-text password from the request body and the generated salt,
  // and pass them to bcrypt.hash(), which is also an async function.
  const hashedPassword = await bcrypt.hash(password, salt);


  const user = await User.create({
    name,
    email,
    password : hashedPassword,
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
       token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});


const loginUser = asyncHandler(async (req, res) => {
  // 1. Destructure email and password from the request body.
  const { email, password } = req.body;

  // 2. Find the user in the database by their unique email.
  const user = await User.findOne({ email });


  if (user && (await bcrypt.compare(password, user.password))) {
    // If both checks pass, the user is authenticated.
    res.status(200).json({
      _id: user.id,
      name: user.name,
      email: user.email,
    token: generateToken(user._id),
      
    });
  } else {
   
    res.status(400);
    throw new Error('Invalid credentials');
  }
});

const getMe = asyncHandler(async (req, res) => {
  // The 'protect' middleware has already run, validated the token,
  // and attached the user document to the request object as `req.user`.
  // The user object contains the _id, name, and email (since we excluded the password).
  // All we need to do is send this user object back in the response.
  res.status(200).json(req.user);
});

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
