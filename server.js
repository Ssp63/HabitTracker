
require('dotenv').config();

const connectDB = require('./config/db');

const express = require('express');

const cors = require('cors');

connectDB();


const app = express();
app.use(cors());

app.use(express.json());

app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/habits', require('./routes/habitRoutes'));

const PORT = process.env.PORT || 3000;


app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})

