# Store API

A REST API for a product catalog built with Node.js, Express, MongoDB, and Mongoose. The API supports JWT authentication, role-aware users, product searching, filtering, sorting, field selection, and pagination.

This project started from a backend tutorial and is being extended into a more production-style API suitable for a backend portfolio.

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- dotenv
- bcryptjs
- jsonwebtoken

## Current Features

- Connects to MongoDB using Mongoose
- User registration and login
- Password hashing with bcrypt
- JWT-based authentication
- Role-aware users with `user` and `admin` roles
- Admin registration protected by a server-side admin code
- Product model with validation
- Get all products
- Filter products by:
  - `featured`
  - `company`
  - `name`
- Numeric filtering for:
  - `price`
  - `rating`
- Sort query results
- Select specific response fields
- Paginate product results
- Centralized 404 middleware
- Centralized error-handling middleware
- Database seed script using `products.json`

## Project Structure

```txt
.
├── app.js
├── controllers/
│   ├── auth.js
│   └── products.js
├── db/
│   └── connect.js
├── middleware/
│   ├── authentication.js
│   ├── authorize.js
│   ├── error-handler.js
│   └── not-found.js
├── models/
│   ├── product.js
│   └── user.js
├── routes/
│   ├── auth.js
│   └── products.js
├── populate.js
├── products.json
├── package.json
└── README.md
```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Create an environment file

Create a `.env` file in the project root:

```env
MONGO_URI=your_mongodb_connection_string
PORT=3000
JWT_SECRET=your_long_random_jwt_secret
JWT_LIFETIME=1d
ADMIN_REGISTRATION_CODE=your_private_admin_registration_code
```

### 3. Seed the database

```bash
node populate.js
```

### 4. Start the server

```bash
npm start
```

The server runs on:

```txt
http://localhost:3000
```

## API Endpoints

### Health / Home

```http
GET /
```

Returns a simple HTML response with a link to the products route.

## Authentication

### Register a User

```http
POST /api/v1/auth/register
```

Request body:

```json
{
  "name": "Bagus",
  "email": "bagus@example.com",
  "password": "secret123"
}
```

Example response:

```json
{
  "user": {
    "name": "Bagus",
    "email": "bagus@example.com",
    "role": "user"
  },
  "token": "jwt_token_here"
}
```

### Register an Admin

Admin registration requires the `ADMIN_REGISTRATION_CODE` value from the server environment. This prevents users from making themselves admins just by sending `"role": "admin"`.

```http
POST /api/v1/auth/register
```

Request body:

```json
{
  "name": "Admin",
  "email": "admin@example.com",
  "password": "secret123",
  "role": "admin",
  "adminCode": "your_private_admin_registration_code"
}
```

### Login

```http
POST /api/v1/auth/login
```

Request body:

```json
{
  "email": "bagus@example.com",
  "password": "secret123"
}
```

Example response:

```json
{
  "user": {
    "name": "Bagus",
    "email": "bagus@example.com",
    "role": "user"
  },
  "token": "jwt_token_here"
}
```

### Using the JWT

Protected routes expect the JWT in the `Authorization` header:

```http
Authorization: Bearer jwt_token_here
```

The authentication middleware verifies the token and attaches the decoded user data to `req.user`:

```js
req.user = {
  userId,
  name,
  role
}
```

Admin-only routes can use the authorization middleware:

```js
router
  .route('/')
  .post(authenticationMiddleware, authorizeRoles('admin'), createProduct)
```

## Products

### Get All Products

```http
GET /api/v1/products
```

Example response:

```json
{
  "products": [
    {
      "_id": "product_id",
      "name": "accent chair",
      "price": 25,
      "featured": false,
      "rating": 4.5,
      "company": "marcos"
    }
  ],
  "nbHits": 1
}
```

### Static Products Query

```http
GET /api/v1/products/static
```

Returns products sorted by price and only includes the `name` and `price` fields.

## Query Parameters

### Filter by featured

```http
GET /api/v1/products?featured=true
```

### Filter by company

```http
GET /api/v1/products?company=ikea
```

Supported companies:

- `ikea`
- `liddy`
- `caressa`
- `marcos`

### Search by product name

```http
GET /api/v1/products?name=chair
```

### Sort products

```http
GET /api/v1/products?sort=price
GET /api/v1/products?sort=-price
GET /api/v1/products?sort=price,rating
```

### Select specific fields

```http
GET /api/v1/products?fields=name,price,rating
```

### Numeric filters

```http
GET /api/v1/products?numericFilters=price>30
GET /api/v1/products?numericFilters=rating>=4.5
GET /api/v1/products?numericFilters=price>30,rating>=4
```

Supported numeric filter fields:

- `price`
- `rating`

Supported operators:

- `>`
- `>=`
- `=`
- `<`
- `<=`

### Pagination

```http
GET /api/v1/products?page=2
```

## Example Requests

```http
GET /api/v1/products?featured=true&company=ikea&sort=-price&fields=name,price
```

```http
GET /api/v1/products?name=table&numericFilters=price>40,rating>=4&page=1
```

## Scripts

```bash
npm start
```

Starts the Express server with Nodemon.

```bash
node populate.js
```

Deletes existing products and seeds the database from `products.json`.

