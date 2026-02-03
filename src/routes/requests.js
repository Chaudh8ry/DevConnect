const express = require("express")
const User = require("../models/user.js")
const { userAuth } = require("../middlewears/auth.js")
const requestRouter = express.Router()

requestRouter.post("/sendConnectionRequest",userAuth,async(req,res) => {
    const user = req.user;

    console.log("Sending a connection request")
    res.send(user.firstName + "sent the connection Request!!!")
})

module.exports = requestRouter