
require('dotenv').config();





// NEW: Import the database connection function
const connectDB = require('./config/db');

// NEW: Call the function to connect to the database
connectDB();

const express = require('express');

const cors = require('cors');

// We call the express() function to create a new application instance.
// This 'app' object has methods for routing HTTP requests, configuring middleware,
// and starting the server.
const app = express();
app.use(cors());


const PORT = process.env.PORT || 3000;


app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})

