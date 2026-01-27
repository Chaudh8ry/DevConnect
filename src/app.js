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

// Route: GET user by Email
app.get("/user", async (req, res) => {
    // Extract the emailID from the request body
    // NOTE: For GET requests, usually query params are used instead of body
    const userEmail = req.body.emailID;

    try {
        // Search the User collection for documents matching the given emailID
        const users = await User.find({ emailID: userEmail });

        // If no user is found, return a 404 (Not Found) response
        if (users.length === 0) {
            res.status(404).send("User not Found");
        } else {
            // If user(s) are found, send them back in the response
            res.send(users);
        }
    } catch (err) {
        // If any error occurs during database query, send a 400 (Bad Request) response
        res.status(400).send("Something went Wrong");
    }
});

// Route: GET /feed - Fetch all users from the database
app.get("/feed", async (req, res) => {
    try {
        // Retrieve all documents from the User collection
        const feed = await User.find({});
        
        // Send the list of all users as the response
        res.send(feed);
    } catch (err) {
        // Handle errors gracefully with a 400 response
        res.status(400).send("Something went wrong");
    }
});

//Route: DLETE user by ID
app.delete("/user",async (req,res) => {
    const userID = req.body.userID
    try{
       const user = await User.findByIdAndDelete(userID)
       res.send("user deleted successfully ")
    }catch(err){
        res.status(400).send("Something is Wrong")
    }
})

//Route: PATCH 
app.patch("/user",async (req,res) => {
    const userID = req.body.userID
    const data = req.body
    try{
        await User.findByIdAndUpdate({_id : userID},data) 
        res.send("User Updated successfully")
    }catch(err){
        res.status(400).send("Something went wrong")
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