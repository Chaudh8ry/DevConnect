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

module.exports = {
    validateSignUpData
}