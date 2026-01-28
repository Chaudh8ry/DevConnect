const mongoose = require("mongoose")
const validator = require("validator")

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

// mongoose.model("schemaName",schema)
module.exports = mongoose.model("User",userSchema)