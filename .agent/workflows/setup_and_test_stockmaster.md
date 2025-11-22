---
description: Setup and Test StockMaster Application
---

# Overview
This workflow guides you through installing dependencies, starting the backend and frontend servers, and manually testing the critical user flows that were recently fixed:
- Signup with optional role selection
- Login (role retained)
- Product creation, update, and deletion (accessible to staff)

# Prerequisites
- Node.js (v18+ recommended) installed
- MongoDB instance running and `MONGODB_URI` configured in a `.env` file at the project root
- Environment variables `JWT_SECRET`, `CLIENT_ORIGIN`, and `PORT` defined in `.env`

# Steps
1. **Install backend dependencies**
   ```bash
   cd c:/Users/prash/OneDrive/Desktop/odoo/backend
   npm install
   ```
2. **Install frontend dependencies**
   ```bash
   cd c:/Users/prash/OneDrive/Desktop/odoo/frontend
   npm install
   ```
3. **Start the backend server** (use nodemon for auto‑restart)
   ```bash
   cd c:/Users/prash/OneDrive/Desktop/odoo/backend
   nodemon index.js
   ```
   The server should listen on the port defined in `.env` (default 3000) and expose the `/api/*` routes.
4. **Start the frontend development server**
   ```bash
   cd c:/Users/prash/OneDrive/Desktop/odoo/frontend
   npm run dev
   ```
   The app will be available at `http://localhost:5173` (or the port set in Vite config).
5. **Manual testing**
   - Open the frontend in a browser.
   - **Signup**: navigate to the signup page, fill all required fields, optionally select a role (`manager` or `staff`). Submit and verify you receive a JWT token and the user object includes the chosen role.
   - **Login**: use the newly created credentials, ensure login succeeds and the returned user retains the role.
   - **Product Management**:
     - As a **staff** user, go to the product creation form and create a new product. Verify it succeeds (no 403 error).
     - Update the product and delete it, confirming each operation returns the expected response.
6. **Optional: Run automated API tests** (if test scripts exist)
   ```bash
   npm test   # from the backend directory, assuming a test suite is configured
   ```

# Clean‑up
- Stop both servers (`Ctrl+C`).
- Remove any test data from MongoDB if desired.

# Notes
- The `authController` now supports a `role` field on signup and no longer restricts product mutating routes to managers only.
- Ensure the `.env` file contains `JWT_SECRET` and `MONGODB_URI` before starting the servers.
