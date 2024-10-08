# Assignment Submission Portal

## Overview

A backend system for an assignment submission portal using Node.js and MongoDB.

## Requirements

- Node.js
- MongoDB

## Setup

1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Ensure MongoDB is running (locally or via MongoDB Atlas).
4. Run `node server.js` to start the server.
5. Use Postman or Curl to test the endpoints.

## Endpoints

- **User Endpoints**
  - `POST /register` - Register a new user.
  - `POST /login` - User login.
  - `POST /upload` - Upload an assignment (requires authentication).
  - `GET /admins` - Fetch all admins (requires authentication).
- **Admin Endpoints**
  - `POST /admin/login` - Admin login.
  - `GET /assignments` - View assignments tagged to the admin (requires authentication).
  - `POST /assignments/:id/accept` - Accept an assignment (requires authentication).
  - `POST /assignments/:id/reject` - Reject an assignment (requires authentication).

## Testing

Use Postman or Curl to test the API endpoints.
