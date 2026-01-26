// Import the Express framework
const express = require("express");
const app = express();
const {connectDB} = require("./config/database.js");
const User = require("./models/user.js");
const { default: mongoose } = require("mongoose");

// express.json is a middlewear provided by express that converts JSON into JS Object
app.use(express.json()) 

app.post("/signup",async(req,res) => {

    // Create a new instance of the User model using the req sent by User in JSON fromat 
    // 'User' here is a Mongoose model that maps to a MongoDB collection. 
    const user = new User(req.body); 

    try{
        // Save the new user document into the MongoDB database. 
        // This is an asynchronous operation, so we use 'await'. 
        await user.save(); 
        
        // Send a response back to the client confirming success. 
        res.send("user added Successfully");
    }catch(err){
        res.status(400).send("Error saving the user: " + err.message)
    }
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