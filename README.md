# Finora AI

**Finora AI** is a modern personal finance management web application built to help users track their income and expenses, monitor financial activity, manage savings goals, and understand their spending through an interactive dashboard.

The application provides a clean, responsive interface with secure Firebase authentication, personalized user profiles, transaction management, analytics, notifications, and data export functionality.

## 🚀 Live Demo

**Deployed Application:**

https://finora-ai-sepia.vercel.app/

---

## 📌 Overview

Finora AI is designed as a complete personal finance management solution.

Users can create an account, securely sign in, personalize their username, manage transactions, monitor their financial activity, analyze spending patterns, create savings goals, and export their transaction data.

The project demonstrates modern frontend development using React, Vite, Tailwind CSS, Firebase, and component-based architecture.

---

## ✨ Features

### 🔐 Authentication

- User registration with email and password
- Secure email/password login
- Google authentication
- Forgot password functionality
- Firebase Authentication integration
- Authentication error handling
- Protected application experience after login

### 👤 User Profile

- Personalized username
- Username editing option
- Username stored in Firestore
- Automatic username fallback using Firebase profile information
- Personalized avatar based on username
- Real-time user information display

### 💰 Transaction Management

- Add income transactions
- Add expense transactions
- Categorize transactions
- Track transaction amounts
- Store transaction details
- Edit and manage financial records
- View transaction history
- Organized transaction interface

### 📊 Dashboard

- Financial overview
- Income summary
- Expense summary
- Balance information
- Recent transactions
- Financial activity overview
- Responsive dashboard layout

### 📈 Analytics

- Visual financial analytics
- Income and expense analysis
- Spending insights
- Transaction-based financial visualization
- Easy-to-understand financial information

### 🎯 Savings Goals

- Create savings goals
- Track savings progress
- Monitor financial targets
- Manage personal savings objectives

### 🔔 Notifications

- Notification system
- Unread notification counter
- Mark individual notifications as read
- Mark all notifications as read
- Clear notifications
- Success, warning, and information notification types

### 🌙 User Interface

- Responsive design
- Dark mode
- Light mode
- Mobile-friendly sidebar
- Modern dashboard interface
- Interactive navigation
- Clean and accessible components

### 📥 Data Export

- Export transaction data to CSV
- Download financial records for external use
- Easy data management

---

## 🛠️ Tech Stack

### Frontend

- **React.js**
- **JavaScript (ES6+)**
- **Vite**
- **Tailwind CSS**
- **Lucide React**

### Backend / Cloud Services

- **Firebase Authentication**
- **Firebase Firestore**

### Development Tools

- **Git**
- **GitHub**
- **Visual Studio Code**
- **ESLint**

### Deployment

- **Vercel**

---

## 🏗️ Application Architecture

Finora AI follows a component-based React architecture.

```text
finora-ai/
│
├── public/
│
├── src/
│   ├── assets/
│   │
│   ├── components/
│   │   ├── auth/
│   │   ├── layout/
│   │   ├── dashboard/
│   │   └── ...
│   │
│   ├── pages/
│   │
│   ├── context/
│   │
│   ├── firebase.js
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── package.json
├── package-lock.json
├── vite.config.js
├── eslint.config.js
├── postcss.config.js
└── README.md
