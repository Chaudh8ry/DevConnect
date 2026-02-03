// Import the Express framework
const express = require("express");
const app = express();
const {connectDB} = require("./config/database.js")
const cookieParser = require("cookie-parser")

// express.json is a middlewear provided by express that converts JSON into JS Object
app.use(express.json()) 
app.use(cookieParser())

const authRouter = require("./routes/auth.js")
const profileRouter = require("./routes/profile.js")
const requestRouter = require("./routes/requests.js")

app.use("/",authRouter)
app.use("/",profileRouter)
app.use("/",requestRouter)

connectDB()
    .then(() => {
        console.log("Connection established")
        app.listen(8888, () => {
            console.log("Server is listening on port 8888");
        })
    })
    .catch((err) => {
        console.error("Database cannot be connected!!!")
    })