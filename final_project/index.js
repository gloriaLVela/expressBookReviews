const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer", session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true }))

app.use("/customer/auth/*", function auth(req, res, next) {
    // Check if user is logged in and has valid access token
    if (req.session.authorization) {
        let token = req.session.authorization['accessToken'];

        // Verify JWT token signature and expiration
        jwt.verify(token, "access", (err, user) => {
            if (!err) {
                // Attach decoded user data to request object for use in route handlers
                req.user = user;
                next(); // Proceed to the next middleware/route handler
            } else {
                // Return 403 Forbidden if token verification fails
                return res.status(403).json({ message: "User not authenticated" });
            }
        });
    } else {
        // Return 403 Forbidden if no valid session exists
        return res.status(403).json({ message: "User not logged in" });
    }
});

app.post("/register/:username/:password", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Validate that both username and password are provided
    if (username && password) {
        // Ensure the username is not already registered
        if (!authenticatedUser(username, password)) {
            // Add the new user to the in-memory users array
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registered. Now you can login" });
        } else {
            // Return error if username is already taken
            return res.status(404).json({ message: "User already exists!" });
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({ message: "Unable to register user." });
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
