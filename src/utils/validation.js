const validator = require("validator")

const validateSignUpData = (req) => {
    const {firstName,lastName,emailID,password} = req.body
    if(!firstName || !lastName){
        throw new Error ("Enter Valid Name!!!")
    }else if(!validator.isEmail(emailID)){
        throw new Error ("Enter a valid Email")
    }else if(!validator.isStrongPassword(password)){
        throw new Error("Enter a Strong Password")
    }
}
// Function to validate if the fields being edited are allowed
 const vlaidateEditProfileData = (req) => { 
    
    // List of fields that a user is permitted to edit 
    const allowedEditFields = [ 
        "firstName", 
        "lastName", 
        "age", 
        "skills", 
        "about", 
        "gender", 
        "photoUrl"
    ] 
    
    // Check if every field in the request body is part of the allowed list 
    const isEditAllowed = Object.keys(req.body).every((field) => allowedEditFields.includes(field) ) 
    
    // Return true if all fields are valid, false otherwise 
    return isEditAllowed }

module.exports = {
    validateSignUpData,
    vlaidateEditProfileData
}