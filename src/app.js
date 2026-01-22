const express = require("express");

const app = express();

app.use("/test",(req,res) => {
    res.send("Hello from server");
})

app.use("/hello", (req,res) => {
    res.send("Hello hello hello");
})

app.listen(8888,() => {
    console.log("Server is listening on port 8888");
})
