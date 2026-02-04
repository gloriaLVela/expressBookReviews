const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    return userswithsamename.length > 0;
}

/**
 * Validates user credentials by checking if a user with the given username
 * and password exists in the system.
 * 
 * @param {string} username - The username to validate
 * @param {string} password - The password to validate
 * @returns {boolean} - True if credentials are valid, false otherwise
 */
const authenticatedUser = (username, password) => { //returns boolean
    // Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Validate that both username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    // Verify credentials against registered users
    if (authenticatedUser(username, password)) {
        // Generate JWT access token with 1-hour expiration
        const secret = process.env.ACCESS_TOKEN_SECRET || 'access';
        let accessToken = jwt.sign({ username }, secret, { expiresIn: 60 * 60 });

        // Store access token and username in session for authenticated requests
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).json({ message: "User successfully logged in", accessToken });
    } else {
        // Return error if credentials don't match any registered user
        return res.status(401).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;  // Get ISBN from URL parameters

    if (!isbn) {
        return res.status(400).json({ message: "ISBN is required" });
    }
    // Get the book by id
    const book = books[isbn];
    const username = req.session.authorization.username;
    const review = req.body.review;
    if (book) {
        // Add or update the review for the user
        book.reviews[username] = review;
        res.send("Review added");
    } else {
        res.send("Book not found");
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;  // Get ISBN from URL parameters

    if (!isbn) {
        return res.status(400).json({ message: "ISBN is required" });
    }

    // Get the book by ISBN
    const book = books[isbn];

    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }

    const username = req.session.authorization?.username;

    if (!username) {
        return res.status(401).json({ message: "User not logged in" });
    }

    if (book.reviews && book.reviews[username]) {
        delete book.reviews[username];
        return res.status(200).json({ message: "Review deleted successfully" });
    } else {
        return res.status(404).json({ message: "Review not found for this user" });
    }
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
