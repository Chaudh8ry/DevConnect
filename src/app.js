const express = require("express");

const app = express();

app.use("/test",(req,res) => {
    res.send("Hello from server");
})

// GET
app.get("/user",(req,res)=> {
    res.send({
        name : "Vishal",
        profession: "Rich"
    })
})

// POST
app.post("/user",(req,res) => {
    res.send("Data successfully tuhdud sent to DataBase")
})

// DELETE
app.delete("/user",(req,res) => {
    res.send("Data Deleted")
})

app.listen(8888,() => {
    console.log("Server is listening on port 8888");
})
