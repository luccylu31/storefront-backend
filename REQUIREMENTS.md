# API Requirements

The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

## API Endpoints

### Products
- Index 
  - **GET /products**
- Show
  - **GET /products/:id**
- Create [token required]
  - **POST /products**
- [OPTIONAL] Top 5 most popular products 
  - **GET /products/top-popular**
- [OPTIONAL] Products by category (args: product category)
  - **GET /products/category/:category**

### Users
- Index [token required]
  - **GET /users**
- Show [token required]
  - **GET /users/:id**
- Create [token required]
  - **POST /users**

### Orders
- Current Order by user (args: user id) [token required]
  - **GET /orders/current/:userId**
- [OPTIONAL] Completed Orders by user (args: user id) [token required]
  - **GET /orders/completed/:userId**

## Data Shapes

### Product
- `id`: number
- `name`: string
- `price`: number
- [OPTIONAL] `category`: string

### User
- `id`: number
- `firstName`: string
- `lastName`: string
- `password`: string

### Orders
- `id`: number
- `products`: array of objects with the following properties:
  - `product_id`: number
  - `quantity`: number
- `user_id`: number
- `status`: string (active or complete)

## Database Schema

### Users Table
| Column Name | Data Type | Constraints                 |
|-------------|-----------|-----------------------------|
| id          | SERIAL    | PRIMARY KEY                 |
| first_name  | VARCHAR   | NOT NULL                    |
| last_name   | VARCHAR   | NOT NULL                    |
| username    | VARCHAR   | NOT NULL, UNIQUE            |
| password    | VARCHAR   | NOT NULL                    |

### Products Table
| Column Name | Data Type | Constraints                 |
|-------------|-----------|-----------------------------|
| id          | SERIAL    | PRIMARY KEY                 |
| name        | VARCHAR   | NOT NULL                    |
| price       | NUMERIC   | NOT NULL                    |
| category    | VARCHAR   |                             |

### Orders Table
| Column Name | Data Type | Constraints                 |
|-------------|-----------|-----------------------------|
| id          | SERIAL    | PRIMARY KEY                 |
| user_id     | INTEGER   | REFERENCES users(id), NOT NULL |
| status      | VARCHAR   | NOT NULL                    |

### Order_Products Table
| Column Name | Data Type | Constraints                 |
|-------------|-----------|-----------------------------|
| id          | SERIAL    | PRIMARY KEY                 |
| order_id    | INTEGER   | REFERENCES orders(id), NOT NULL |
| product_id  | INTEGER   | REFERENCES products(id), NOT NULL |
| quantity    | INTEGER   | NOT NULL                    |


