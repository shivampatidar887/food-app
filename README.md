# Food Ordering App - Backend
## Usage

### Install dependencies
```
npm install
```

### Run Backend Server 
```
npm run server
```
## Overview

This repository contains the backend implementation of a food ordering app, supporting two types of users: regular users and admin owners. The backend is responsible for handling various APIs related to user authentication, food orders, and payment processing using Stripe.

## Technologies Used

- **Node.js:** Server-side JavaScript runtime.
- **Express.js:** Web application framework for Node.js.
- **MongoDB:** NoSQL database for storing user information, food orders, etc.
- **Stripe:** Payment processing API for handling transactions securely.

## Key Features

1. **User Authentication:**
   - Allows users to create accounts and authenticate using secure JSON Web Tokens (JWT).

2. **Food Ordering:**
   - Implements APIs for users to browse food items, add them to their cart, and place orders.

3. **Admin Owner Functionality:**
   - Admin owners can manage food items, update menu details, and view order history.

4. **Payment Processing:**
   - Integrated Stripe for secure and efficient payment processing.

## Project Structure

- **`models/`:** Contains Mongoose models for User, Food Item, Order, etc.
- **`controllers/`:** Defines controllers for handling API logic.
- **`routes/`:** Configures routes using Express Router, connecting controllers to specific endpoints.

