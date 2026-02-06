/**
 * General/Public Router Module
 * 
 * Handles public API endpoints for user registration and book discovery.
 * All routes are accessible without authentication.
 * 
 * Provides functionality for:
 * - User registration
 * - Browsing the complete book catalog
 * - Searching books by ISBN, author, or title
 * - Viewing public reviews for any book
 */

// ============================================================================
// DEPENDENCIES
// ============================================================================

const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

// ============================================================================
// ROUTER AND DATA STORAGE
// ============================================================================

/** Express router for public routes */
const public_users = express.Router();

// ============================================================================
// REGISTRATION ROUTE
// ============================================================================

/**
 * User registration endpoint
 * Allows new users to create an account with username and password.
 * Prevents duplicate usernames from being registered.
 * 
 * @route POST /register
 * @param {string} username - Username for the new account (required, from request body)
 * @param {string} password - Password for the new account (required, from request body)
 * @returns {Object} 200 - Registration successful
 * @returns {Object} 400 - Username already exists or missing credentials
 * 
 * @example
 * POST /register
 * Body: { "username": "john", "password": "pass123" }
 * Response: { "message": "User successfully registered. Now you can login" }
 */
public_users.post("/register", (req, res) => {
    // Extract username and password from request body
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Verify the username is not already registered
        if (!isValid(username)) {
            // Add new user to the users array
            users.push({ username: username, password: password });
            return res.status(200).json({ message: "User successfully registered user " + username + ". Now you can login" });
        } else {
            // Return error if username already exists in the system
            return res.status(400).json({ message: "User already exists!" });
        }
    }
    // Return error if username or password is missing
    return res.status(400).json({ message: "Unable to register user." });
});

// ============================================================================
// BOOK DISCOVERY ROUTES
// ============================================================================

/**
 * Get all books in the catalog
 * Returns a complete list of all available books with full details.
 * 
 * @route GET /
 * @returns {Array<Object>} Array of all books with author, title, and reviews
 * 
 * @example
 * GET /
 * Response: { "1": { "author": "Chinua Achebe", "title": "Things Fall Apart", "reviews": {...} }, ... }
 */
public_users.get('/', async function (req, res) {
    try {
        // Simulate fetching books asynchronously with a 1 second delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Return all books if available
        if (books) {
            // Format response with proper JSON indentation for readability
            res.send(JSON.stringify(books, null, 4));
        } else {
            res.status(404).send("Books not found");
        }
    } catch (error) {
        // Handle any errors during fetch operation
        res.status(404).send("Books not found");
    }
});

/**
 * Get book details by ISBN
 * Retrieves a specific book's information using its ISBN identifier.
 * 
 * @route GET /isbn/:isbn
 * @param {number} isbn - Book ISBN (1-10, from URL parameter)
 * @returns {Object} 200 - Book object with author, title, and reviews
 * @returns {string} 404 - "Book not found" if ISBN doesn't exist
 * 
 * @example
 * GET /isbn/1
 * Response: { "author": "Chinua Achebe", "title": "Things Fall Apart", "reviews": {...} }
 */
public_users.get('/isbn/:isbn', async function (req, res) {
    try {
        // Extract ISBN from URL parameters
        const isbn = req.params.isbn;

        // Simulate fetching book details asynchronously with a 500ms delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Look up the book in the books database using ISBN as key
        const book = books[isbn];
        if (book) {
            // Return the book details with formatted JSON
            res.status(200).send(JSON.stringify(book, null, 4));
        } else {
            res.status(404).send("Book not found");
        }
    } catch (error) {
        // Handle any errors during book lookup
        res.status(404).send(error);
    }
});

/**
 * Search books by author
 * Finds all books written by the specified author.
 * Performs exact matching on the author name.
 * 
 * @route GET /author/:author
 * @param {string} author - Author name to search for (from URL parameter)
 * @returns {Array<Object>} Array of books by the specified author
 * @returns {string} 404 - "Book not found" if no books match the author
 * 
 * @example
 * GET /author/Jane%20Austen
 * Response: [{ "author": "Jane Austen", "title": "Pride and Prejudice", "reviews": {...} }]
 */
public_users.get('/author/:author', async function (req, res) {
    try {
        // Extract author name from URL parameter
        const author = req.params.author;

        // Fetch books data asynchronously using Axios HTTP client
        const response = await axios.get('http://localhost:3000/books');
        const booksData = response.data;

        // Filter books by matching the author name exactly
        const bookList = Object.values(booksData).filter(book => book.author === author);

        // Return matching books if found
        if (bookList.length > 0) {
            res.status(200).send(JSON.stringify(bookList, null, 4));
        } else {
            res.status(404).send("Book not found");
        }
    } catch (error) {
        // Handle any errors during Axios call or filtering
        res.status(404).send(error.message);
    }
});

/**
 * Search books by title
 * Finds all books with the specified title.
 * Performs exact matching on the book title.
 * 
 * @route GET /title/:title
 * @param {string} title - Book title to search for (from URL parameter)
 * @returns {Array<Object>} Array of books matching the specified title
 * @returns {string} 404 - "Book not found" if no books match the title
 * 
 * @example
 * GET /title/Pride%20and%20Prejudice
 * Response: [{ "author": "Jane Austen", "title": "Pride and Prejudice", "reviews": {...} }]
 */
public_users.get('/title/:title', async function (req, res) {
    try {
        // Extract book title from URL parameter
        const title = req.params.title;

        // Simulate fetching book details asynchronously with a 500ms delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Convert books object to array and filter by exact title match
        const bookList = Object.values(books).filter(book => book.title === title);

        // Return matching books if any found
        if (bookList.length > 0) {
            res.status(200).send(JSON.stringify(bookList, null, 4));
        } else {
            res.status(404).send("Book not found");
        }
    } catch (error) {
        // Handle any errors during title search
        res.status(404).send(error);
    }
});

/**
 * Get all reviews for a specific book
 * Retrieves the reviews object for a book, containing all user reviews.
 * Reviews are public and can be viewed without authentication.
 * 
 * @route GET /review/:isbn
 * @param {number} isbn - Book ISBN (from URL parameter)
 * @returns {Object} Object with username keys and review text values
 * @returns {string} 404 - "Book not found" if ISBN doesn't exist
 * 
 * @example
 * GET /review/1
 * Response: { "john": "Great book!", "jane": "Highly recommended" }
 */
public_users.get('/review/:isbn', function (req, res) {
    // Look up the book by ISBN from URL parameters
    const book = books[req.params.isbn];
    if (book) {
        // Transform reviews object into an array of review objects
        // This converts { username: review } to [{ username, review }]
        const reviewsArray = Object.entries(book.reviews).map(([username, review]) => ({
            username,
            review
        }));
        // Return formatted reviews array wrapped in a reviews property
        res.send(JSON.stringify({ reviews: reviewsArray }, null, 4));
    } else {
        // Return 404 if book with given ISBN doesn't exist
        res.status(404).send("Book not found");
    }
});

// ============================================================================
// MODULE EXPORTS
// ============================================================================

/**
 * Export public user routes router
 * Makes the router available to the main application
 */
module.exports.general = public_users;
