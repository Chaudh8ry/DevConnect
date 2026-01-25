// Import the Express framework
const express = require("express");

// Create an Express application instance
const app = express();

// Import custom middleware functions for authentication
// adminAuth: checks if the request is authorized as an admin
// userAuth: checks if the request is authorized as a regular user
const { adminAuth, userAuth } = require("../middlewears/auth.js")

// Apply adminAuth middleware to ALL routes starting with "/admin"
// This means any request to /admin/* will first go through adminAuth
app.use("/admin", adminAuth)

// -------------------- USER ROUTES --------------------

// Route: GET /user/login
// Purpose: Simulates a user login (no real authentication here, just a response)
app.get("/user/login", (req, res) => {
    res.send("User logged in successfully")
})

// Route: GET /user/data
// Purpose: Returns user data, but only if userAuth middleware passes
// userAuth runs before the handler to validate the request
app.get("/user/data", userAuth, (req, res) => {
    res.send("User Data Sent")
})

// -------------------- ADMIN ROUTES --------------------

// Route: GET /admin/getAllData
// Purpose: Returns all data for admin users
// Since app.use("/admin", adminAuth) is applied, adminAuth runs first
app.get("/admin/getAllData", (req, res) => {
    res.send("Here is all your Data")
})

// Route: GET /admin/deleteUser
// Purpose: Deletes a user (simulated here with a simple response)
// Again, adminAuth middleware runs before this route
app.get("/admin/deleteUser", (req, res) => {
    res.send("User is Deleted")
})

// -------------------- SERVER SETUP --------------------

// Start the server on port 8888
// When the server starts, log a message to the console
app.listen(8888, () => {
    console.log("Server is listening on port 8888");
})
