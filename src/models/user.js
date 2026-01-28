const mongoose = require("mongoose")

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
        lowercase: true
    },
    password:{
        type: String,
        required: true,
        
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
    }
},{
    timestamps: true
})

// mongoose.model("schemaName",schema)
module.exports = mongoose.model("User",userSchema)