const express = require("express")
const {userAuth} = require("../middlewears/auth.js")

const profileRouter = express.Router()

// Profile Route - Protected endpoint that requires a valid JWT
profileRouter.get("/profile",userAuth,async (req,res) => {
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

module.exports = profileRouter