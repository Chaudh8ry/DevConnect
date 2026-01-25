require('dotenv').config();
const mongoose = require("mongoose")
const mongoURI = process.env.mongoDB_url;

// "connectDB" will store a Promise returned by mongoose.connect
const connectDB = async() => {
    await mongoose.connect(mongoURI) //returns a Promise
}

module.exports = {connectDB}