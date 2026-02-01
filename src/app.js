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
const {userAuth} = require("./middlewears/auth.js")

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
        const isPasswordValid = await user.validatePassword(password)
        // SUCCESS: If password matches
        if(isPasswordValid){

            // Create a JWT token with the user's unique ID (_id). 
            // The secret key "DEV@CONNECT$123" is used to sign the token.
            const token = await user.getJWT()

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
app.get("/profile",userAuth,async (req,res) => {
    try{
        // Find the user in the database using the extracted ID.
        const user = req.user
        if(!user){
            throw new Error("User does not exist")
        }

        res.send(user)
    }catch(err){
        res.status(400).send("Something went Wrong" + err.message);
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