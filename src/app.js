// Import the Express framework
const express = require("express");
const app = express();
const {connectDB} = require("./config/database.js");
const User = require("./models/user.js")

app.post("/signup",async(req,res) => {
    const userObj = {
        firstName: "Vishal",
        lastName: "Chaudhary",
        emailID: "vishals8172@gmail.com",
        password: "1243379",
        age: "22",
        gender: "Male"
    }

    // Create a new instance of the User model using the userObj. 
    // 'User' here is a Mongoose model that maps to a MongoDB collection. 
    const user = new User(userObj); 

   // Save the new user document into the MongoDB database. 
   // This is an asynchronous operation, so we use 'await'. 
   await user.save(); 
   
   // Send a response back to the client confirming success. 
   res.send("user added Successfully");
})

connectDB()
    .then(() => {
        console.log("Connection established")
        app.listen(8888, () => {
            console.log("Server is listening on port 8888");
        })
    })
    .catch((err) => {
        console.error("Database cannot be connected!!!")
    })