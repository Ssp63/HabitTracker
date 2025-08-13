// config/db.js

// Import the Mongoose library, which is our Object Data Modeling (ODM) tool for MongoDB.
const mongoose = require('mongoose');

// Define an asynchronous function to connect to the database.
// 'async' allows us to use the 'await' keyword inside the function,
// which pauses the function execution until a Promise is resolved.
const connectDB = async () => {
  try {
    // Attempt to connect to the MongoDB database using the URI from our environment variables.
    // mongoose.connect() returns a Promise, so we 'await' its completion.
    const conn = await mongoose.connect(process.env.MONGO_URI);

    // If the connection is successful, log a confirmation message to the console.
    // We can access the host of the connected database from the connection object.
    // The 'cyan.underline' is just for styling the console output, using a package we might add later or you can just use console.log.
    // For now we'll just log it plainly.
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // If an error occurs during the connection attempt, we catch it here.
    console.error(`Error: ${error.message}`);
    
    // Exit the Node.js process with a "failure" code (1).
    // This is important because if we can't connect to the database,
    // our application is useless and should not continue to run.
    process.exit(1);
  }
};

// Export the connectDB function so it can be imported and used in other files,
// specifically our main server.js file.
module.exports = connectDB;