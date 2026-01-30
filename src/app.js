// Import the Express framework
const express = require("express");
const app = express();
const {connectDB} = require("./config/database.js");
const User = require("./models/user.js");
const { default: mongoose } = require("mongoose");
const {validateSignUpData} = require("./utils/validation.js")
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken")

// express.json is a middlewear provided by express that converts JSON into JS Object
app.use(express.json()) 
app.use(cookieParser())

// Route to Add user in DB
app.post("/signup",async(req,res) => {

    try{
        //Validation
        validateSignUpData(req)
        
        //Encryption
        const {firstName,lastName,emailID,password,age} = req.body

        const passwordHash = await bcrypt.hash(password,10 )

        // Create a new instance of the User model using the req sent by User in JSON fromat 
        // 'User' here is a Mongoose model that maps to a MongoDB collection. 
        const user = new User({firstName,lastName,emailID,age,password: passwordHash}); 

        // Save the new user document into the MongoDB database. 
        // This is an asynchronous operation, so we use 'await'. 
        await user.save(); 
        
        // Send a response back to the client confirming success. 
        res.send("user added Successfully");
    }catch(err){
        res.status(400).send("ERROR: " + err.message)
    }
})

// Login Route
app.post("/login",async (req,res) => {

    try{
        //Extracting EmailId and Password from request body
        const {emailID,password} = req.body

        //Find user in the database by emailID
        const user = await User.findOne({emailID : emailID})
        //if no user found throw error
        if(!user){
            throw new Error("Invalid EmailId")
        }

        //comapring provided password with the hashed password stored in DB
        const isPasswordValid = await bcrypt.compare(password,user.password)
        // SUCCESS: If password matches
        if(isPasswordValid){

            // Create a JWT token with the user's unique ID (_id). 
            // The secret key "DEV@CONNECT$123" is used to sign the token.
            const token = await jwt.sign({_id : user._id}, "DEV@CONNECT$123")

            // Store the token in a cookie named "token".
            // This allows the client (browser) to automatically send it with future requests.
            res.cookie("token",token)

            res.send("User Login Successful")
        }else{
            // ERROR: Password doesnt match  
            throw new Error("Password is not Valid")
        }
    }catch(err){
        res.status(400).send("ERROR: " + err.message)
    }
})

// Profile Route - Protected endpoint that requires a valid JWT
app.get("/profile",async (req,res) => {
    try{
        // Access cookies sent by the client.
        const cookies = req.cookies;

        // Extracting token form the cookies
        const {token} = cookies
        if(!token){
            throw new Error("Invalid Token")
        }

        // Verify the token using the same secret key. 
        // If valid, jwt.verify returns the decoded payload (user info).
        const decodedMessage = await jwt.verify(token,"DEV@CONNECT$123")
        
        // Extract the user ID from the decoded payload.
        const {_id} = decodedMessage
        console.log("Logged in user is: " + _id)
        
        // Find the user in the database using the extracted ID.
        const user = await User.findById(_id)
        if(!user){
            throw new Error("User does not exist")
        }

        res.send(user)
    }catch(err){
        res.status(400).send("Something went Wrong" + err.message);
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

// Define a PATCH route to update a user by their ID
app.patch("/user/:userID", async (req, res) => {
    // Extract the userID from the request parameters
    const userID = req.params?.userID
    
    // Extract the request body (data to update)
    const data = req.body
    
    try {
        // Define which fields are allowed to be updated
        const ALLOWED_UPDATES = [
            "about",
            "gender",
            "age",
            "skills",
        ]

        // Check if every key in the request body is allowed
        // NOTE: Using arrow function without braces automatically returns the expression
        const isUpdateAllowed = Object.keys(data).every((k) =>
            ALLOWED_UPDATES.includes(k)
        )

        // If any field is not allowed, throw an error
        if (!isUpdateAllowed) {
            throw new Error("Update not Allowed")
        }

        // Validate that skills array does not exceed 4 items
        if (data?.skills.length > 4) {
            throw new Error("Skills cannot be more than 4")
        }

        // Update the user in the database
        await User.findByIdAndUpdate(userID, data, { runValidators: true })

        // Send success response
        res.send("User Updated successfully")
    } catch (err) {
        // Handle errors and send a 400 response with the error message
        res.status(400).send("Error Occured: " + err.message)
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