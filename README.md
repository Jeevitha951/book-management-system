# 📚 Book Management App

A full-stack web application for managing books with **User Authentication** and **Role-Based Access Control (RBAC)**. Built with **MERN Stack (MongoDB, Express, React, Node.js)**.

---

## 🔑 Features

- User registration and login using JWT
- Secure password hashing using bcrypt
- Role-based access: 
  - **Admin** can add/update/delete books
  - **User** can only view books
- MongoDB Atlas for cloud database
- Protected API routes with middleware
- Fully tested using **Jest** and **Supertest**

---

## 🏗️ Tech Stack

| Layer        | Technology            |
|--------------|------------------------|
| Frontend     | React.js, Axios        |
| Backend      | Node.js, Express.js    |
| Database     | MongoDB Atlas          |
| Auth         | JWT, bcrypt            |
| Testing      | Jest, Supertest        |

---


## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone <repo-url>
cd book-management-app


## 2. 🔧 Backend Setup

Navigate to the backend folder and install dependencies:

```bash
cd backend
npm install


### ✅ Configure `.env`

Create a `.env` file inside the `backend/` directory and add the following:

```env
PORT=5000
MONGO_URI=your_mongo_atlas_connection_string
JWT_SECRET=your_jwt_secret_key


## 3. 💻 Frontend Setup

Navigate to the frontend folder, install dependencies, and start the development server:

```bash
cd ../frontend
npm install
npm start




## 4. 📡 API Routes

### ✅ Public Routes

| Method | Endpoint              | Description            |
|--------|-----------------------|------------------------|
| POST   | `/api/users/register` | Register a new user    |
| POST   | `/api/users/login`    | Login and get JWT token |



### 🔒 Protected Routes

| Method | Endpoint           | Access | Description      |
|--------|--------------------|--------|------------------|
| GET    | `/api/books`       | All    | View all books   |
| POST   | `/api/books`       | Admin  | Add a new book   |
| PUT    | `/api/books/:id`   | Admin  | Update a book    |
| DELETE | `/api/books/:id`   | Admin  | Delete a book    |




## 🧪 Testing (Unit Tests)

### 🛠️ Tools Used
- [Jest](https://jestjs.io/)
- [Supertest](https://github.com/visionmedia/supertest)

### ⚙️ Setup Test Environment

Create a separate `.env.test` file inside the `/backend` directory:

```env
MONGO_URI=mongodb+srv://<your-user>:<pass>@cluster.mongodb.net/book_management_test
JWT_SECRET=your_test_jwt_secret


### ▶️ Run Tests

Navigate to the backend folder and run:

```bash
cd backend
npm test

### 📊 Test Coverage

- `auth.test.js` — Tests user registration and login functionality.
- `rbac.test.js` — Tests role-based access control (RBAC) for book routes.


## 📄 Author

👤 **Jeevitha**  
Engineering Student | Full Stack Developer (MERN)

