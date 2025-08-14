// models/userModel.js

// Import the mongoose library, which provides the tools for modeling our application data.
const mongoose = require('mongoose');

// Define the schema for the User collection using mongoose.Schema.
// A schema maps to a MongoDB collection and defines the shape of the documents within that collection.
const userSchema = mongoose.Schema(
  {
    // Define the 'name' field.
    name: {
      type: String, // The data type is a string.
      required: [true, 'Please add a name'], // This field is mandatory. If not provided, the custom error message will be used.
    },
    // Define the 'email' field.
    email: {
      type: String, // The data type is a string.
      required: [true, 'Please add an email'], // This field is mandatory.
      unique: true, // This ensures that no two users can register with the same email address. Mongoose will create a unique index in MongoDB for this field.
    },
    // Define the 'password' field.
    password: {
      type: String, // The data type is a string.
      required: [true, 'Please add a password'], // This field is mandatory. This will store the HASHED password, not the plain text one.
    },
  },
  {
    // The second argument to mongoose.Schema is an options object.
    // 'timestamps: true' is a powerful option that tells Mongoose to automatically add
    // two fields to our schema: `createdAt` and `updatedAt`.
    timestamps: true,
  }
);

// Export the Mongoose model.
// mongoose.model() compiles a model from the schema.
// The first argument 'User' is the singular name for our model.
// Mongoose will automatically look for the plural, lowercased version of this name
// for the collection in the database (i.e., the 'users' collection).
// The second argument is the schema we defined above.
module.exports = mongoose.model('User', userSchema);