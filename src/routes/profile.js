const express = require("express")
const {userAuth} = require("../middlewears/auth.js")
const {vlaidateEditProfileData} = require("../utils/validation.js")
const profileRouter = express.Router()

// Profile Route - Protected endpoint that requires a valid JWT
profileRouter.get("/profile/view",userAuth,async (req,res) => {
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

// Route handler for editing user profile
profileRouter.patch("/profile/edit",userAuth,async(req,res) => {
    try{
        // Validate the incoming request body fields
        if(!vlaidateEditProfileData(req)){
            // If invalid fields are found, throw an error
            throw new Error("Invalid Edit Request")
        }else{
            // Get the currently logged-in user from request
            const loggedInUser = req.user

            // Update the logged-in user's fields with the request body values
            Object.keys(req.body).every((key) => (loggedInUser[key] = req.body[key]))

            // Save the updated user profile to the database
            await loggedInUser.save()
            
            // Send a success response back to the client
            res.send(`${loggedInUser.firstName}, your profile is updated Successfully`)
        }
    }catch(err){
        res.status(400).send("ERROR: " + err.message)
    }
})

module.exports = profileRouter