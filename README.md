# 🎓 University Event Registration System (Cloud-Based)

A serverless, cloud-deployed web application that allows students to register for university events and manage their registrations.

---

## 🚀 Live Demo

Access the application here:
👉 https://https://registration-service-369601970557.asia-south1.run.app/

---

## 📌 Features

### 👤 User Features

* Signup and Login (secure authentication)
* View available events
* Register for events
* Submit additional details (Full Name, College ID)
* View registered events
* Delete event registrations

### 🛠️ System Features

* Cloud-hosted backend using serverless architecture
* Persistent data storage using PostgreSQL
* REST API-based communication
* Secure password hashing
* Environment-based configuration

---

## 🏗️ Tech Stack

### Frontend

* HTML
* CSS
* JavaScript (Vanilla)

### Backend

* Node.js
* Express.js

### Database

* PostgreSQL (Cloud SQL)

### Cloud & DevOps

* Google Cloud Run (Serverless deployment)
* Google Cloud SQL
* Docker (Containerization)
* GitHub (Version control)

---

## ☁️ Architecture Overview

```
User (Browser)
      ↓
Frontend (HTML/CSS/JS)
      ↓
Cloud Run (Node.js Server)
      ↓
Cloud SQL (PostgreSQL Database)
```

---

## 📂 Project Structure

```
project-root/
│
├── server.js          # Backend server
├── package.json       # Dependencies
├── Dockerfile         # Container config
├── .env               # Environment variables (NOT committed)
├── .gitignore         # Ignore sensitive files
└── public/
    └── index.html     # Frontend UI
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root:

```
DB_HOST=YOUR_DB_IP
DB_USER=postgres
DB_PASSWORD=YOUR_PASSWORD
DB_NAME=university_app
DB_PORT=5432
PORT=8080
```

---

## 🐳 Deployment (Google Cloud Run)

### Build & Deploy

```
gcloud run deploy registration-service \
  --source . \
  --region asia-south1 \
  --allow-unauthenticated
```

---

## 🧪 API Endpoints

| Method | Endpoint              | Description            |
| ------ | --------------------- | ---------------------- |
| POST   | /signup               | Create new user        |
| POST   | /login                | Authenticate user      |
| GET    | /events               | Fetch all events       |
| POST   | /register-event       | Register for event     |
| GET    | /my-registrations/:id | Get user registrations |
| POST   | /delete-registration  | Delete registration    |

---

## 🔐 Security

* Passwords are hashed using bcrypt
* Environment variables used for sensitive data
* No credentials stored in source code

---

## 📊 Database Schema (Simplified)

### Users

* id
* name
* email
* password

### Events

* id
* title
* description

### Registrations

* user_id
* event_id
* full_name
* college_id

---

## 🎯 Future Improvements

* Admin dashboard (create/manage events)
* Prevent duplicate registrations
* JWT-based authentication
* UI enhancements
* Email notifications

---

## 👨‍💻 Authors

* Your Name
* Team Members (if any)

---

## 📜 License

This project is for academic purposes.
