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

const vlaidateEditProfileData = (req) => {
    const allowedEditFields = [
        "firstName",
        "lastName",
        "age",
        "skills",
        "about",
        "gender",
        "photoUrl"
    ]

    const isEditAllowed = Object.keys(req.body).every((field) =>
        allowedEditFields.includes(field)
    )

    return isEditAllowed 
}

module.exports = {
    validateSignUpData,
    vlaidateEditProfileData
}