# Finora AI

**Finora AI** is a modern personal finance web application designed to help users manage their income, expenses, budgets, transactions, savings goals, and financial insights through a clean and responsive dashboard.

## Live Demo

**Deployed Application:**  
https://finora-ai-sepia.vercel.app/

## Overview

Finora AI provides a centralized platform for personal financial management.

Users can securely sign in, manage their financial transactions, monitor spending activity, analyze financial data, create savings goals, and manage their personal profile.

The application combines modern React development, responsive UI design, Firebase authentication, cloud database functionality, and reusable component-based architecture.

## Features

### 🔐 Authentication

- Email and password authentication
- Google Sign-In
- Forgot password / password recovery
- Secure Firebase Authentication
- User-specific data management

### 👤 User Profile

- Personalized username
- Username editing
- User avatar
- Firebase-based user profile storage

### 💰 Finance Management

- Add income transactions
- Add expense transactions
- Edit transactions
- Delete transactions
- Transaction categorization
- Income and expense tracking

### 📊 Dashboard

- Financial overview
- Income summary
- Expense summary
- Balance tracking
- Recent transactions
- Financial statistics

### 📈 Analytics

- Spending analysis
- Income and expense visualization
- Transaction insights
- Financial activity monitoring

### 🎯 Savings Goals

- Create savings goals
- Track goal progress
- Monitor financial targets
- Visual progress indicators

### 🔔 Notifications

- Financial notifications
- Unread notification counter
- Mark notifications as read
- Clear notifications

### 📁 Data Export

- Export transaction data
- CSV download functionality

### 🎨 User Experience

- Responsive design
- Dark mode
- Mobile-friendly interface
- Modern dashboard UI
- Reusable React components
- Smooth interactions and animations

## Tech Stack

### Frontend

- React.js
- Vite
- JavaScript (ES6+)
- Tailwind CSS
- Lucide React

### Backend / Cloud Services

- Firebase Authentication
- Firebase Firestore

### Development Tools

- Git
- GitHub
- Visual Studio Code

### Deployment

- Vercel

## Project Structure

```text
finora-ai/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── layout/
│   │   └── ...
│   ├── pages/
│   ├── context/
│   ├── firebase.js
│   └── ...
├── package.json
├── vite.config.js
├── eslint.config.js
├── index.html
└── README.md
