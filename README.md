# 🏥 MiniHealth

MiniHealth is a backend-focused healthcare platform designed to manage users, roles, and secure access to healthcare-related services. The project demonstrates clean backend architecture, authentication, authorization, and database design using industry-relevant technologies.

This project is built with a **recruitment-first mindset**, focusing on scalability, security, and best backend practices.

---

## 🚀 Features

* 🔐 JWT-based Authentication & Authorization
* 👤 Role-based Access Control (Patient / Doctor)
* 🔑 Secure Password Hashing (bcrypt)
* 📦 RESTful API Architecture
* 🛡️ Security Middlewares (Helmet, CORS)
* 📋 Input Validation (express-validator)
* 🗃️ Relational Database Design using MySQL
* 📊 Request Logging (Morgan)

---

## 🛠️ Tech Stack

**Backend**

* Node.js
* Express.js

**Database**

* MySQL (mysql2)

**Security & Auth**

* JWT (jsonwebtoken)
* bcrypt / bcryptjs
* Helmet
* CORS

**Utilities**

* dotenv (Environment Configuration)
* Morgan (Logging)
* Nodemon (Development)

---

## 🗂️ Project Structure

```
MiniHealth/
│
├── src/
│   ├── app.js            # Application entry point
│   ├── routes/           # API routes
│   ├── controllers/      # Request handling logic
│   ├── middleware/       # Auth & custom middleware
│   ├── models/           # Database queries & logic
│   ├── config/           # DB & environment config
│   └── utils/            # Helper functions
│
├── .env                  # Environment variables
├── package.json
└── README.md
```

---

## 🔐 Authentication Flow

1. User registers with role (patient / doctor)
2. Password is securely hashed using bcrypt
3. JWT token is generated on login
4. Protected routes are accessed using token-based middleware

---

## 🧠 Database Design Highlights

* Normalized relational schema
* Primary & Foreign Keys
* Role-based user management
* Secure handling of sensitive data

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=minihealth
JWT_SECRET=your_secret_key
```

---

## ▶️ How to Run Locally

```bash
npm install
npm run dev
```

Server will start at:

```
http://localhost:3000
```

---

## 🎯 Purpose of This Project

MiniHealth was built to:

* Apply backend engineering concepts in a real-world scenario
* Practice secure authentication and authorization
* Strengthen DBMS and API design skills
* Prepare for backend-focused technical interviews

---

## 📌 Future Enhancements

* Appointment scheduling
* Medical record management
* Audit logs
* API documentation (Swagger)
* Deployment with Docker & Cloud

---

## 👩‍💻 Author

**Suhani Gajre**
Backend Developer | Node.js • Express • MySQL
Focused on building secure and scalable backend systems

---

⭐ *If you find this project useful, feel free to star the repository!*
