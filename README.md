# 🛒 E-Commerce Backend (MERN)

This is the **backend** of the MERN stack E-commerce application.  
It is built with **Node.js, Express.js, MongoDB, and Mongoose**, providing REST APIs for user authentication, product management, cart, and enquiry features.

---

## 🚀 Features
- User Authentication (Register, Login, Forgot Password)
- Product APIs (CRUD Operations)
- Cart & Enquiry APIs
- Secure Password Hashing (bcrypt)
- JWT-based Authentication
- Nodemailer for Email Services
- MongoDB Integration with Mongoose

---

## 📂 Folder Structure
backend/
│── controllers/ # API logic
│── models/ # Mongoose schemas
│── routes/ # API routes
│── utils/ # Helper functions (e.g. sendEmail.js)
│── config/ # Database & environment config
│── server.js # Main entry point
│── package.json
│── .env # Environment variables



---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository
```bash
git clone https://github.com/Ayushpandey2026/E_Shop_Backend.git
cd E_Shop_Backend

2️⃣ Install Dependencies
npm install

3️⃣ Configure Environment Variables

Create a .env file in the root and add:

PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_app_password   # Gmail App Password

4️⃣ Run Server
npm run dev

📡 API Endpoints
🔑 Auth Routes

POST /api/auth/register → Register User

POST /api/auth/login → Login User

POST /api/auth/forgot-password → Send Reset Link

📦 Product Routes

GET /api/products → Get all products

GET /api/products/:id → Get single product

POST /api/products → Add new product

PUT /api/products/:id → Update product

DELETE /api/products/:id → Delete product

🛒 Cart Routes

POST /api/cart/add → Add item to cart

DELETE /api/cart/remove/:id → Remove item

📩 Enquiry Routes

POST /api/enquiry → Submit enquiry

🛠️ Technologies Used

Node.js + Express.js

MongoDB + Mongoose

JWT (JSON Web Token)

Bcrypt (Password Hashing)

Nodemailer (Email Service)

Dotenv (Environment Variables)

🚀 Deployment Guide

Push code to GitHub

Create account on Render / Railway / Vercel

Add environment variables in hosting panel

Connect GitHub repo and deploy 🚀

Your backend API will be live 🎉

Developed by Ayush Pandey
Full Stack Developer | MERN Stack | Problem Solver
