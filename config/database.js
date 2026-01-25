const mongoose = require("mongoose")

// "connectDB" will store a Promise returned by mongoose.connect
const connectDB = async() => {
    await mongoose.connect("mongodb+srv://chaudh8ry:8178968399@cluster0.92sowgu.mongodb.net/devCoonnect") //returns a Promise
}

module.exports = {connectDB}