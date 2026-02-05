const express = require("express")
const User = require("../models/user.js")
const bcrypt = require("bcrypt"); 

const {validateSignUpData} = require("../utils/validation.js")

const authRouter = express.Router()

// Route to Add user in DB
authRouter.post("/signup",async(req,res) => {

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
authRouter.post("/login",async (req,res) => {

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

// Logout Route
authRouter.post("/logout", async (req, res) => {
    // Clear the authentication token cookie by setting it to null
    res.cookie("token", null, {
        // Expire the cookie immediately by setting the expiration to the current time
        expires: new Date(Date.now()),
    });

    // Send a response back to the client confirming successful logout
    res.send("Logged Out Successfully");
});

module.exports = authRouter