/**
 * Express Book Reviews API Server
 * 
 * Main entry point for the Express.js application that handles book management
 * and user reviews with JWT-based authentication.
 * 
 * Features:
 * - Session-based user authentication
 * - JWT token verification for protected routes
 * - Public and authenticated book endpoints
 * - Review management for authenticated users
 */

// ============================================================================
// DEPENDENCIES
// ============================================================================

const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const { isValid } = require('./router/auth_users.js');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

// ============================================================================
// INITIALIZATION
// ============================================================================

/** Create Express application instance */
const app = express();

/** Server port configuration */
const PORT = 5000;

// ============================================================================
// MIDDLEWARE CONFIGURATION
// ============================================================================

/**
 * Parse incoming JSON request bodies
 * Enables JSON data in POST/PUT requests
 */
app.use(express.json());

/**
 * Configure session middleware for customer routes
 * Stores session data on the server with encrypted session IDs in cookies
 * 
 * Options:
 * - secret: Encryption key for session IDs
 * - resave: Forces session to be saved even if unmodified
 * - saveUninitialized: Forces uninitialized session to be saved
 */
app.use("/customer", session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true
}));

/**
 * Authentication middleware for protected customer routes
 * Verifies JWT token from session before allowing access to /customer/auth/* endpoints
 * 
 * Flow:
 * 1. Checks if session contains authorization data
 * 2. Extracts JWT access token from session
 * 3. Verifies token signature and expiration
 * 4. If valid, attaches decoded user data to req.user
 * 5. If invalid, returns 403 Forbidden response
 * 
 * @param {Object} req - Express request object
 * @param {Object} req.session.authorization - Session authorization data
 * @param {string} req.session.authorization.accessToken - JWT access token
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware in chain
 * @returns {void}
 */
app.use("/customer/auth/*", function auth(req, res, next) {
    // Check if user has an active session with authorization
    if (req.session.authorization) {
        let token = req.session.authorization['accessToken'];

        // Verify JWT token signature and expiration with the secret key
        jwt.verify(token, "access", (err, user) => {
            if (!err) {
                // Token is valid - attach decoded user data to request
                req.user = user;
                // Proceed to the next middleware/route handler
                next();
            } else {
                // Token verification failed - user not authenticated
                return res.status(403).json({ message: "User not authenticated" });
            }
        });
    } else {
        // No valid session exists - user not logged in
        return res.status(403).json({ message: "User not logged in" });
    }
});

// ============================================================================
// ROUTE CONFIGURATION
// ============================================================================

/**
 * Mount authenticated customer routes
 * Includes: register, login, reviews management
 * Routes under /customer are protected by session and JWT middleware
 */
app.use("/customer", customer_routes);

/**
 * Mount public general routes
 * Includes: book listing, search, and public reviews
 * No authentication required
 */
app.use("/", genl_routes);

// ============================================================================
// SERVER STARTUP
// ============================================================================

/**
 * Start the Express server and listen for incoming requests
 * Logs confirmation message when server is successfully running
 */
app.listen(PORT, () => console.log("Server is running"));
