# 🌸 AI Menstrual Health Tracker

An AI-powered menstrual health tracking web application that predicts cycle patterns, tracks symptoms, and provides health insights using machine learning.

---

## 📌 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Team](#team)

---

## Overview

AI Menstrual Health Tracker helps users log their menstrual cycle data, symptoms, and weight. The app uses an AI/ML model to predict the next cycle and assess health risk levels. It features secure user authentication via Firebase and a clean, responsive UI.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js, React Router, Firebase Auth |
| Backend | Node.js / Express (in progress) |
| ML Service | Python / Flask (in progress) |
| Database | Firebase Firestore |
| Styling | CSS, Playfair Display (Google Fonts) |

---

## Project Structure

```
AI-Menstrual-Health/
├── client/
│   └── ai_period_tracker/
│       ├── public/
│       │   └── index.html
│       ├── src/
│       │   ├── assets/
│       │   │   └── background.jpg
│       │   ├── components/
│       │   │   ├── chart.jsx          # Cycle chart visualization
│       │   │   ├── cycleform.jsx      # Form to input cycle data
│       │   │   ├── dashboard.jsx      # Dashboard UI
│       │   │   └── result.jsx         # Prediction result card
│       │   ├── firebase/
│       │   │   ├── auth.js            # Login / Register functions
│       │   │   ├── config.js          # Firebase initialization
│       │   │   └── firestore.js       # Firestore operations
│       │   ├── pages/
│       │   │   ├── home.jsx           # Home page (protected)
│       │   │   ├── login.jsx          # Login page
│       │   │   └── register.jsx       # Register page
│       │   ├── services/
│       │   │   └── api.js             # API calls to backend/ML service
│       │   └── App.js                 # Routes and auth protection
│       ├── .env                       # Firebase credentials (not pushed)
│       ├── .gitignore
│       └── package.json
│
├── server/                            # Backend - Node.js/Express (in progress)
│
├── ml-service/                        # ML Model - Python/Flask (in progress)
│
├── .gitignore
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm
- Firebase account
- Python 3.x (for ML service)

### 1. Clone the repository

```bash
git clone https://github.com/Avisiktaa/AI-Menstrual-Health.git
cd AI-Menstrual-Health
```

### 2. Setup Frontend

```bash
cd client/ai_period_tracker
npm install
```

Create a `.env` file in `client/ai_period_tracker/` with your Firebase credentials:

```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

Start the frontend:

```bash
npm start
```

App runs at `http://localhost:3000`

### 3. Setup Backend (coming soon)

```bash
cd server
npm install
npm start
```

### 4. Setup ML Service (coming soon)

```bash
cd ml-service
pip install -r requirements.txt
python app.py
```

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `REACT_APP_FIREBASE_API_KEY` | Firebase Web API Key |
| `REACT_APP_FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain |
| `REACT_APP_FIREBASE_PROJECT_ID` | Firebase Project ID |
| `REACT_APP_FIREBASE_STORAGE_BUCKET` | Firebase Storage Bucket |
| `REACT_APP_FIREBASE_MESSAGING_SENDER_ID` | Firebase Messaging Sender ID |
| `REACT_APP_FIREBASE_APP_ID` | Firebase App ID |

> ⚠️ Never push your `.env` file to GitHub.

---

## Team

- **Frontend & Firebase** — Avisiktaa
- **Backend & ML Service** — (Partner)
