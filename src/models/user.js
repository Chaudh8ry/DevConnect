const mongoose = require("mongoose")
const validator = require("validator")
const jwt = require("jsonwebtoken")

const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
    },
    emailID:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email address: " + value)
            } 
        }
    },
    password:{
        type: String,
        required: true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Please add a Strong Password: " + value)
            } 
        }
    },
    age:{
        type: Number,
        required: true,
        min: 18
    },
    gender:{
        type: String,
        validate(value){
            if(!["male","female","others"].includes(value)){
                throw new Error("Gender data is not Valid")
            }
        }
    },
    about:{
        type: String,
        default: "hello ji kaisai ho aap sab log"
    },
    skills: {
        type: [String]
    },
    photoUrl: {
        type: String,
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid Photo URL: " + value)
            } 
        }
    }
},{
    timestamps: true
})

// Method to generate a JWT token for a user
userSchema.methods.getJWT = async function() {
    const user = this; // 'this' refers to the current user document instance

    // Create a JWT token containing the user's unique ID (_id).
    // The token is signed using the secret key "DEV@CONNECT$123".
    // The token will expire in 1 day (specified by expiresIn).
    const token = await jwt.sign(
        { _id: user._id },          // Payload: user ID
        "DEV@CONNECT$123",          // Secret key for signing
        { expiresIn: "1d" }         // Expiration time (1 day)
    );

    return token; // Return the generated token
};

// Method to validate a user's password
userSchema.methods.validatePassword = async function(passwordInputByUser) {
    const user = this;              // Current user document instance
    const passwordHash = user.password; // Stored hashed password in DB

    // Compare the plain-text password entered by the user
    // with the hashed password stored in the database.
    // bcrypt.compare returns true if they match, false otherwise.
    const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash);

    return isPasswordValid; // Return the result of the comparison
};


// mongoose.model("schemaName",schema)
module.exports = mongoose.model("User",userSchema)