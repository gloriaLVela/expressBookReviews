const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
let selectedBooks = [];

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

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    // Send JSON response with formatted friends data
    res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const book = books[req.params.isbn];
    if (book) {
        res.send(JSON.stringify(book, null, 4));
    } else {
        res.send("Book not found");
    }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    // Find book by author
    selectedBooks = [];
    
    for (const key in books) {
        if (books.hasOwnProperty(key)) {
          let book = books[key];
          if (book.author === req.params.author){
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

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    // Find book by title
    selectedBooks = [];
    
    for (const key in books) {
        if (books.hasOwnProperty(key)) {
          let book = books[key];
          if (book.title === req.params.title){
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

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    //Write your code here
    // Get the book by id
    const book = books[req.params.isbn];
    if (book) {
        res.send(book.reviews);
    } else {
        res.send("Book not found");
    }
});

module.exports.general = public_users;
