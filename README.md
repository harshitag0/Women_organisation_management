Overview

WomenConnect is a full-stack web application designed to streamline the management of women-led organizations. The system provides role-based access for administrators and members, enabling efficient handling of organizational data, communication, and financial tracking through a centralized platform.

The application ensures seamless synchronization between different user roles by leveraging a shared backend and database architecture.

System Architecture

The platform follows a client-server architecture:

Frontend: Handles user interface and user interactions
Backend: Manages business logic and API endpoints
Database: Stores user, event, and transactional data

All operations performed by administrators are persisted in the database and reflected across member dashboards via API-driven data fetching.

Technology Stack

Frontend

React.js
HTML5, CSS3, JavaScript
Axios

Backend

Node.js
Express.js

Database

MongoDB

Development Tools

Git & GitHub
Postman
Visual Studio Code
Project Structure
project-root/
│
├── client/            # Frontend application (React)
├── server/            # Backend application (Node.js & Express)
├── .env.example       # Environment variables template
├── package.json
└── README.md
Installation and Setup
1. Clone the Repository
git clone https://github.com/your-username/your-repository-name.git
cd your-repository-name
2. Install Dependencies

Backend

cd server
npm install

Frontend

cd client
npm install
Environment Configuration

Create a .env file inside the server directory and configure the following variables:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
Running the Application

Start Backend Server

cd server
npm start

Start Frontend Application

cd client
npm start

The application will be available on:

Frontend: http://localhost:3000
Backend: http://localhost:5000
API Design

The backend exposes RESTful APIs for handling authentication, user management, and data operations. These endpoints facilitate communication between the frontend and the database, ensuring consistent and real-time data updates across different user roles.

