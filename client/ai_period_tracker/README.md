# 🌸 AI Menstrual Health Tracker

An AI-powered menstrual health tracking web application built with React and Firebase.

## Features

- User authentication (Sign up / Login / Logout)
- Track menstrual cycle data
- AI-based cycle prediction
- Symptom and weight tracking
- Interactive dashboard with results

## Tech Stack

- **Frontend:** React.js, React Router
- **Authentication:** Firebase Auth
- **Database:** Firebase Firestore
- **Styling:** CSS (Playfair Display font)

## Getting Started

### Prerequisites

- Node.js installed
- Firebase project set up

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/Avisiktaa/AI-Menstrual-Health.git
   ```

2. Navigate to the project folder
   ```bash
   cd client/ai_period_tracker
   ```

3. Install dependencies
   ```bash
   npm install
   ```

4. Add your Firebase config in `src/firebase/config.js`

5. Start the app
   ```bash
   npm start
   ```

The app will run at `http://localhost:3000`

## Project Structure

```
src/
├── assets/
├── components/
│   ├── chart.jsx
│   ├── cycleform.jsx
│   ├── dashboard.jsx
│   └── result.jsx
├── firebase/
│   ├── auth.js
│   ├── config.js
│   └── firestore.js
├── pages/
│   ├── home.jsx
│   ├── login.jsx
│   └── register.jsx
├── services/
│   └── api.js
└── App.js
```
