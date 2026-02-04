/**
 * Authenticated Users Router Module
 * 
 * Handles user authentication, session management, and review operations
 * for registered users. Provides endpoints for user login and book reviews
 * management (add/update and delete).
 * 
 * All review endpoints require JWT authentication via middleware.
 */

// ============================================================================
// DEPENDENCIES
// ============================================================================

const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");

// ============================================================================
// ROUTER AND DATA STORAGE
// ============================================================================

/** Express router for authenticated user routes */
const regd_users = express.Router();

/** In-memory user storage for registered users */
let users = [];

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

/**
 * Validates if a username already exists in the system.
 * Used during registration to prevent duplicate usernames.
 * 
 * @param {string} username - The username to check for existence
 * @returns {boolean} - True if username exists, false otherwise
 */
const isValid = (username) => {
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
const authenticatedUser = (username, password) => {
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

// ============================================================================
// AUTHENTICATION ROUTES
// ============================================================================

/**
 * User login endpoint
 * Validates user credentials and issues a JWT access token
 * Token is stored in session for subsequent authenticated requests
 * 
 * @route POST /login
 * @param {string} username - Username (required, from request body)
 * @param {string} password - Password (required, from request body)
 * @returns {Object} 200 - Login successful with access token
 * @returns {Object} 400 - Missing username or password
 * @returns {Object} 401 - Invalid credentials (username/password mismatch)
 * 
 * @example
 * POST /login
 * Body: { "username": "john", "password": "pass123" }
 * Response: { "message": "User successfully logged in", "accessToken": "eyJhb..." }
 */
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

// ============================================================================
// REVIEW MANAGEMENT ROUTES
// ============================================================================

/**
 * Add or update a book review
 * Allows authenticated users to add new reviews or update existing ones.
 * If a review already exists for the user, it will be replaced.
 * 
 * @route PUT /auth/review/:isbn
 * @authenticated Required - User must be logged in
 * @param {string} isbn - Book ISBN from URL parameter (required)
 * @param {string} review - Review text from request body (required)
 * @returns {Object} 200 - Review added/updated successfully
 * @returns {Object} 400 - Missing ISBN parameter
 * @returns {Object} 404 - Book not found
 * 
 * @example
 * PUT /auth/review/978-0-13-110362-7
 * Headers: Authorization required (JWT token)
 * Body: { "review": "Great book! Highly recommended." }
 * Response: { "message": "Review added" }
 */
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;  // Get ISBN from URL parameters

    if (!isbn) {
        return res.status(400).json({ message: "ISBN is required" });
    }

    // Get the book by ISBN from the books database
    const book = books[isbn];
    const username = req.session.authorization.username;
    const review = req.body.review;

    if (book) {
        // Add or update the review for the authenticated user
        book.reviews[username] = review;
        res.send("Review added");
    } else {
        res.send("Book not found");
    }
});

/**
 * Delete a user's book review
 * Allows authenticated users to delete their own reviews for a specific book.
 * 
 * @route DELETE /auth/review/:isbn
 * @authenticated Required - User must be logged in
 * @param {string} isbn - Book ISBN from URL parameter (required)
 * @returns {Object} 200 - Review deleted successfully
 * @returns {Object} 400 - Missing ISBN parameter
 * @returns {Object} 401 - User not logged in
 * @returns {Object} 404 - Book not found or review not found for user
 * 
 * @example
 * DELETE /auth/review/978-0-13-110362-7
 * Headers: Authorization required (JWT token)
 * Response: { "message": "Review deleted successfully" }
 */
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;  // Get ISBN from URL parameters

    if (!isbn) {
        return res.status(400).json({ message: "ISBN is required" });
    }

    // Get the book by ISBN from the books database
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

// ============================================================================
// MODULE EXPORTS
// ============================================================================

/** Export authenticated user routes router */
module.exports.authenticated = regd_users;

/** Export username validation function */
module.exports.isValid = isValid;

/** Export users array for access by other modules */
module.exports.users = users;
