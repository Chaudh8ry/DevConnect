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

profileRouter.patch("/profile/edit",userAuth,async(req,res) => {
    try{
        if(!vlaidateEditProfileData(req)){
            throw new Error("Invalid Edit Request")
        }else{
            const loggedInUser = req.user

            Object.keys(req.body).every((key) => (loggedInUser[key] = req.body[key]))

            await loggedInUser.save()
            res.send(`${loggedInUser.firstName}, your profile is updated Successfully`)
        }
    }catch(err){
        res.status(400).send("ERROR: " + err.message)
    }
})

module.exports = profileRouter