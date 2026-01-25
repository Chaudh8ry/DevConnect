// Authorization : Handle Auth middlewear for all HTTP methods
const adminAuth = (req,res,next) => {
    const token = "xyz"
    const isAdminAuthorized = token === "xyz"
    if(!isAdminAuthorized){
        res.status(401).send("Unauthorized requests")
    }else{
        next()
    }
}

const userAuth = (req,res,next) => {
    const token = "abc"
    const isUserAuthorized = token === "abc"
    if(!isUserAuthorized){
        res.status(401).send("Unauthorized requests")
    }else{
        next()
    }
}

module.exports = {
    adminAuth,
    userAuth
}