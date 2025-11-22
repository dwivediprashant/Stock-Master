# StockMaster - Inventory Management System

StockMaster is a comprehensive and modular Inventory Management System (IMS) designed to streamline warehouse operations. It provides a robust solution for managing products, warehouses, and stock movements, ensuring real-time visibility and control over inventory.

## Features
- **Product Management**: Create and manage products with details like SKU, cost, and price.
- **Warehouse Operations**: Handle various stock operations including:
  - **Receipts**: Manage incoming stock from vendors.
  - **Deliveries**: Process outgoing stock to customers.
  - **Internal Transfers**: Move stock between warehouse locations.
  - **Adjustments**: Correct stock levels manually.
- **Real-time Stock Tracking**: Automatic updates to stock levels upon validation of operations.
- **Role-Based Access**: Secure access for Managers and Staff.

## Tech Stack

### Frontend
- **Framework**: React (Vite)
- **Styling**: Bootstrap 5, Custom CSS
- **State Management & Routing**: React Router DOM
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (with Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Bcrypt for password hashing

## How to Run Locally

### Prerequisites
- Node.js installed
- MongoDB installed and running locally (or a MongoDB Atlas URI)

### 1. Backend Setup
Navigate to the backend directory:
```bash
cd backend
```

Install dependencies:
```bash
npm install
```

Create a `.env` file in the `backend` directory with the following variables:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/stockmaster
JWT_SECRET=your_super_secret_key
CLIENT_ORIGIN=http://localhost:5173
```

Start the server:
```bash
npm start
# or for development with auto-restart:
# nodemon index.js
```

### 2. Frontend Setup
Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

Install dependencies:
```bash
npm install
```

Start the development server:
```bash
npm run dev
```

Access the application at `http://localhost:5173`.

---

**Note: This repo is for ODOO hackathon spit 2025**
