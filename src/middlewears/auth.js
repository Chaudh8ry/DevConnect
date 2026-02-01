const jwt = require("jsonwebtoken")
const User = require("../models/user.js")
// const { user } = require("")

const userAuth = async(req,res,next) => {
    try{
        // Read the Token from the req cookies
        const {token} = req.cookies
        if(!token){
            throw new Error("Invalid Token")
        }
        // Verify the token using the same secret key. 
        // If valid, jwt.verify returns the decoded payload (user info).
        const decodedObj= await jwt.verify(token,"DEV@CONNECT$123") 
        
        // Extract the user ID from the decoded payload.
        const {_id} = decodedObj
        
        // Find the user in the database using the extracted ID.
        const user = await User.findById(_id)
        if(!user){
            throw new Error("User Not Found")
        }
        req.user = user
        next()
    }catch(err){
        res.status(400).send("ERROR: " + err.message )
    }
}

module.exports = {
    userAuth
}