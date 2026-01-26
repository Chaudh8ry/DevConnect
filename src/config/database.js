require('dotenv').config();
const mongoose = require("mongoose")
const URI = process.env.DB_url;

// "connectDB" will store a Promise returned by mongoose.connect
const connectDB = async() => {
    await mongoose.connect(URI) //returns a Promise
}

module.exports = {connectDB}