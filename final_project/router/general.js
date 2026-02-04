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
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

// ============================================================================
// ROUTER AND DATA STORAGE
// ============================================================================

/** Express router for public routes */
const public_users = express.Router();

/** Temporary storage for search results */
let selectedBooks = [];

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
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!isValid(username)) {
            users.push({ username: username, password: password });
            return res.status(200).json({ message: "User successfully registered. Now you can login" });
        } else {
            return res.status(400).json({ message: "User already exists!" });
        }
    }
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
public_users.get('/', function (req, res) {
    // Return complete book catalog with pretty formatting
    //res.send(JSON.stringify(books, null, 4));
    // 1. Function that returns a Promise
    const getBooks = () => {
        return new Promise((resolve, reject) => {
            // Simulating a delay of 1 second (e.g., database fetch)
            setTimeout(() => {
                if (books) {
                    resolve(books); // Success: fulfill with data
                } else {
                    reject("Books not found"); // Error: reject
                }
            }, 1000);
        });
    };

    // Call the function and use .then() to get the results
    console.log("Fetching books...");

    getBooks()
        .then((booksList) => {
            console.log("Books received:");
            res.send(JSON.stringify(booksList, null, 4));
            //console.log(booksList);
        })
        .catch((error) => {
            //console.error(error);
            res.send("Books not found");
        });
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
public_users.get('/isbn/:isbn', function (req, res) {
    const book = books[req.params.isbn];
    if (book) {
        res.send(JSON.stringify(book, null, 4));
    } else {
        res.send("Book not found");
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
public_users.get('/author/:author', function (req, res) {
    // Find all books by the specified author
    selectedBooks = [];

    for (const key in books) {
        if (books.hasOwnProperty(key)) {
            let book = books[key];
            if (book.author === req.params.author) {
                selectedBooks.push(book);
            }
        }
    }

    if (selectedBooks.length > 0) {
        res.send(JSON.stringify(selectedBooks, null, 4));
    } else {
        res.send("Book not found");
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
public_users.get('/title/:title', function (req, res) {
    // Find all books with the specified title
    selectedBooks = [];

    for (const key in books) {
        if (books.hasOwnProperty(key)) {
            let book = books[key];
            if (book.title === req.params.title) {
                selectedBooks.push(book);
            }
        }
    }

    if (selectedBooks.length > 0) {
        res.send(JSON.stringify(selectedBooks, null, 4));
    } else {
        res.send("Book not found");
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
    // Get the book by ISBN and return its reviews
    const book = books[req.params.isbn];
    if (book) {
        if (Object.keys(book.reviews).length === 0) {
            res.send("No reviews found for this book");
            return;
        }
    } else {
        res.send("Book not found");
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
