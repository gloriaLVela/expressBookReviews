/**
 * Books Database Module
 * 
 * Contains a pre-populated database of classic books with metadata.
 * Each book entry includes author information, title, and a reviews object
 * for storing user reviews indexed by username.
 * 
 * Data Structure:
 * - Key: ISBN (numeric identifier 1-10)
 * - Value: Book object with author, title, and reviews
 * 
 * Reviews are stored as key-value pairs where:
 * - Key: Username of the reviewer
 * - Value: Review text provided by the user
 */

/**
 * Books database object
 * 
 * Contains classic literature titles with the following properties:
 * @typedef {Object} Book
 * @property {string} author - Name of the book's author
 * @property {string} title - Title of the book
 * @property {Object} reviews - Object storing user reviews (username: review_text)
 * 
 * @type {Object<number, Book>}
 * 
 * @example
 * // Accessing a book
 * const book = books[1];
 * console.log(book.title); // "Things Fall Apart"
 * console.log(book.author); // "Chinua Achebe"
 * 
 * @example
 * // Accessing a review
 * const userReview = books[1].reviews["john"];
 * 
 * @example
 * // Adding a review
 * books[1].reviews["john"] = "Excellent novel!";
 */
let books = {
      /**
       * ISBN 1: Things Fall Apart
       * A seminal African novel by Chinua Achebe
       */
      1: {
            "author": "Chinua Achebe",
            "title": "Things Fall Apart",
            "reviews": {}
      },

      /**
       * ISBN 2: Fairy tales
       * Classic fairy tales by Hans Christian Andersen
       */
      2: {
            "author": "Hans Christian Andersen",
            "title": "Fairy tales",
            "reviews": {}
      },

      /**
       * ISBN 3: The Divine Comedy
       * Epic poem by Dante Alighieri
       */
      3: {
            "author": "Dante Alighieri",
            "title": "The Divine Comedy",
            "reviews": {}
      },

      /**
       * ISBN 4: The Epic Of Gilgamesh
       * Ancient Mesopotamian epic poem, author unknown
       */
      4: {
            "author": "Unknown",
            "title": "The Epic Of Gilgamesh",
            "reviews": {}
      },

      /**
       * ISBN 5: The Book Of Job
       * Biblical text, author unknown
       */
      5: {
            "author": "Unknown",
            "title": "The Book Of Job",
            "reviews": {}
      },

      /**
       * ISBN 6: One Thousand and One Nights
       * Collection of Middle Eastern tales, author unknown
       */
      6: {
            "author": "Unknown",
            "title": "One Thousand and One Nights",
            "reviews": {}
      },

      /**
       * ISBN 7: Njál's Saga
       * Icelandic saga, author unknown
       */
      7: {
            "author": "Unknown",
            "title": "Njál's Saga",
            "reviews": {}
      },

      /**
       * ISBN 8: Pride and Prejudice
       * Novel of manners by Jane Austen
       */
      8: {
            "author": "Jane Austen",
            "title": "Pride and Prejudice",
            "reviews": {}
      },

      /**
       * ISBN 9: Le Père Goriot
       * Novel by Honoré de Balzac
       */
      9: {
            "author": "Honoré de Balzac",
            "title": "Le Père Goriot",
            "reviews": {}
      },

      /**
       * ISBN 10: Molloy, Malone Dies, The Unnamable, the trilogy
       * Trilogy of novels by Samuel Beckett
       */
      10: {
            "author": "Samuel Beckett",
            "title": "Molloy, Malone Dies, The Unnamable, the trilogy",
            "reviews": {}
      }
}

// ============================================================================
// MODULE EXPORTS
// ============================================================================

/**
 * Export books database
 * Makes the books object available to other modules for reading and modifying
 * book data and user reviews.
 */
module.exports = books;
