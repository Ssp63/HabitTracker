// middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

// The 'protect' middleware function.
// This function will be added to any route we want to protect.
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // 1. Check for the token in the authorization header.
  // We expect the header to be in the format 'Bearer <token>'.
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // 2. Extract the token from the header.
      // The token is the second part of the string after splitting by space.
      token = req.headers.authorization.split(' ')[1];

      // 3. Verify the token's authenticity.
      // jwt.verify() decodes the token. If the signature is invalid or the token is expired, it will throw an error.
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 4. Attach the user to the request object.
      // We use the ID from the decoded token's payload to find the user in our database.
      // We explicitly exclude the password field from the returned user object for security.
      req.user = await User.findById(decoded.id).select('-password');

      // 5. If everything is successful, call next() to pass control to the next middleware or the route's controller.
      next();
    } catch (error) {
      // This block catches errors from jwt.verify() (e.g., invalid signature, expired token).
      console.error(error);
      res.status(401); // 401 Unauthorized
      throw new Error('Not authorized, token failed');
    }
  }

  // If the token is not present in the header at all.
  if (!token) {
    res.status(401); // 401 Unauthorized
    throw new Error('Not authorized, no token');
  }
});

// Export the middleware so we can use it in our route files.
module.exports = { protect };