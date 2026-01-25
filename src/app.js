// Import the Express framework
const express = require("express");
const app = express();
const {connectDB} = require("./config/database.js");

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