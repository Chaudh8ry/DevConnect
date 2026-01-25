const express = require("express");

const app = express();

// Authorization : Handle Auth middlewear for all HTTP methods
app.use("/admin",(req,res,next) => {
    const token = "xyz"
    const isAdminAuthorized = token === "xyz"
    if(!isAdminAuthorized){
        res.status(401).send("Unauthorized requests")
    }else{
        console.log("chlra 1")
        next()
    }
})

app.get("/admin/getAllData",(req,res) => {
    res.send("Here is all your Data")
})

app.get("/admin/deleteUser", (req,res) => {
    res.send("User is Deleted")
})

app.listen(8888,() => {
    console.log("Server is listening on port 8888");
})
