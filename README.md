# Express Book Reviews API

A modern RESTful API built with Express.js for managing book information and customer reviews. This project demonstrates authentication, session management, and JWT token verification.

## Overview

The Express Book Reviews API provides endpoints for browsing books and allows authenticated users to manage their reviews. It features user authentication with JWT tokens and session-based authorization.

## Project Structure

```
expressBookReviews/
├── final_project/
│   ├── index.js                 # Main server entry point
│   ├── package.json             # Project dependencies and scripts
│   ├── cookies.txt              # Session cookie configuration
│   ├── router/
│   │   ├── general.js           # Public book routes
│   │   ├── auth_users.js        # Authenticated user routes
│   │   └── booksdb.js           # Book database
│   └── README.md
├── LICENSE
└── README.md
```

## Features

- **Authentication**: JWT-based authentication with session management
- **Public Access**: Browse all books and their reviews without authentication
- **User Authentication**: Register and login functionality
- **Protected Routes**: Add, modify, and delete reviews (authenticated users only)
- **Session Management**: Secure session handling with configurable timeouts
- **Book Database**: Pre-populated database with book information and reviews

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js 4.18.1
- **Authentication**:
  - jsonwebtoken 8.5.1 (JWT)
  - express-session 1.17.3 (Session management)
- **Development**: nodemon 2.0.19 (Auto-restart on file changes)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd expressBookReviews
   ```

2. Navigate to the project directory:

   ```bash
   cd final_project
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

### Running the Server

Start the development server:

```bash
npm start
```

The server will run on `http://localhost:5000` with hot-reload enabled via nodemon.

## API Endpoints

### Public Routes (General)

- `GET /` - API information and available endpoints
- `GET /books` - Get all books
- `GET /books/:isbn` - Get book by ISBN

### Authentication Routes

- `POST /customer/register` - Register a new user
- `POST /customer/login` - Login with credentials

### Protected Customer Routes

- `GET /customer/auth/reviews` - Get user's reviews
- `POST /customer/auth/add-review` - Add a book review
- `PUT /customer/auth/update-review` - Update existing review
- `DELETE /customer/auth/delete-review` - Delete a review

## Authentication Flow

1. Users register or login via POST endpoints
2. Server issues a JWT token stored in session
3. Protected routes verify JWT token signature and expiration
4. Token must be provided in request headers for authenticated endpoints
5. Invalid or missing tokens return a 403 Forbidden response

## Configuration

### Session Configuration

- Secret key: `fingerprint_customer`
- Session persistence enabled
- Uninitialized sessions saved

### JWT Configuration

- Secret: `access`
- Used for token signing and verification

## License

MIT License - See LICENSE file for details

## Author

Created as a Coursera practice project
