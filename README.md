# Storefront Backend Project

This project is a backend for an online storefront built with Node.js, Express, and PostgreSQL. It provides APIs for user authentication, product management, and order processing.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- Node.js and npm
- PostgreSQL

## Setup Instructions

### Step 1: Clone the Repository

First, clone the project repository to your local machine:

```bash
git clone https://github.com/luccylu31/storefront-backend.git
cd storefront-backend


### Step 2: Install Dependencies
1. Install the required project dependencies using npm:
npm install

Step 3: Set Up the Database
Create PostgreSQL databases:

Open your PostgreSQL terminal (psql) and run the following commands to create a new user and two databases (one for development and one for testing):
CREATE USER ahopping_user WITH PASSWORD 'password123';
CREATE DATABASE shopping;
GRANT ALL PRIVILEGES ON DATABASE shopping TO ahopping_user;

2. Configure environment variables:

Create a .env file in the root directory of the project and add the following environment variables:
TOKEN_SECRET=your_secret_key

POSTGRES_HOST=127.0.0.1
POSTGRES_DB=shopping
POSTGRES_TEST_DB=shopping
POSTGRES_USER=shopping_user
POSTGRES_PASSWORD=password123
ENV=dev

SALT_ROUNDS=10
BCRYPT_PASSWORD=speak-friend-and-enter


3. Migrate the database:
Run the database migrations to set up the database schema:
npm run migrate

### Step 4: Start the Server
Start the development server using the following command:
npm run dev

The backend server will start on http://localhost:3000.

### Step 5: Running Tests
To run the tests, use the following command:
npm run test

### Ports
Backend server: The backend server runs on port 3000 by default.
PostgreSQL database: The PostgreSQL database typically runs on port 5432.

### API Endpoints
The following are the main API endpoints available in the project:

POST /signup: Create a new user.
POST /login: Authenticate a user and get a token.
GET /users: Get a list of users (protected route).
GET /users/:id: Get user details by ID (protected route).
POST /products: Create a new product (protected route).
GET /products: Get a list of products.
GET /products/:id: Get product details by ID.
GET /products/category/:category: Get products by category.
GET /orders: Get a list of orders (protected route).
POST /orders: Create a new order (protected route).
POST /orders/:id/products: Add a product to an order (protected route)

### File testcase for model and endpoint
/src/handlers/tests
/src/handlers/tests