# 🌸 AI Menstrual Health Tracker

An AI-powered menstrual health tracking web application that predicts PCOD risk, tracks symptoms, and provides personalized health advice using machine learning and Google Gemini AI.

---

## 📌 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [ML Model Details](#ml-model-details)
- [Environment Variables](#environment-variables)
- [Team](#team)

---

## Overview

AI Menstrual Health Tracker helps users log their menstrual cycle data and symptoms. The app uses a Random Forest ML model to predict PCOD risk levels (Low/Medium/High) with confidence scores, and integrates Google Gemini AI to provide personalized health advice. Features secure user authentication via Firebase and a responsive UI with dark mode support.

---

## Features

✅ **User Authentication** - Secure login/register with Firebase Auth
✅ **Cycle Tracking** - Log multiple cycle lengths and symptoms
✅ **PCOD Risk Prediction** - ML-powered risk assessment (Low/Medium/High)
✅ **Confidence Scores** - Probability distribution for each risk level
✅ **AI Health Advice** - Personalized recommendations via Google Gemini (health-only queries)
✅ **Multilingual Support** - English, Hindi, and Bengali language options
✅ **Dark Mode Support** - Automatic theme detection with proper text visibility
✅ **Responsive Design** - Works seamlessly on all devices
✅ **Health-Only Chatbot** - AI assistant restricted to menstrual/reproductive health topics

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js, Vite, React Router, Firebase Auth |
| Backend | Node.js, Express.js |
| ML Service | Python, scikit-learn, Random Forest, SMOTE |
| AI Service | Google Gemini 1.5 Flash |
| Database | Firebase Firestore |
| Styling | CSS, Playfair Display (Google Fonts) |

---

## Project Structure

```
AI-Menstrual-Health/
├── front/                              # Frontend (React + Vite)
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   │   └── background.jpg
│   │   ├── components/
│   │   │   ├── chart.jsx           # Cycle chart visualization
│   │   │   ├── cycleform.jsx       # Form to input cycle data
│   │   │   ├── cycleform.css       # Form styling with dark mode
│   │   │   ├── dashboard.jsx       # Dashboard UI
│   │   │   ├── dashboard.css       # Dashboard styling with dark mode
│   │   │   └── result.jsx          # Prediction result card
│   │   ├── context/
│   │   │   └── LanguageContext.js  # Language context for i18n
│   │   ├── firebase/
│   │   │   ├── auth.js             # Login / Register functions
│   │   │   ├── config.js           # Firebase initialization
│   │   │   └── firestore.js        # Firestore operations
│   │   ├── pages/
│   │   │   ├── home.jsx            # Home page (protected)
│   │   │   ├── home.css            # Home styling with dark mode
│   │   │   ├── login.jsx           # Login page with language selector
│   │   │   ├── login.css           # Login styling
│   │   │   └── register.jsx        # Register page
│   │   ├── services/
│   │   │   └── api.js              # API calls to backend
│   │   ├── translations.js         # i18n translations (EN, HI, BN)
│   │   ├── App.js                  # Routes and auth protection
│   │   └── index.css               # Global styles
│   ├── .env                        # Firebase credentials (not pushed)
│   ├── .gitignore
│   ├── package.json
│   └── vite.config.js              # Vite configuration
│
├── server/                             # Backend (Node.js/Express)
│   ├── routes/
│   │   ├── predict.js                  # ML prediction endpoint
│   │   └── advice.js                   # Gemini AI advice endpoint (health-only)
│   ├── .env                            # Gemini API key (not pushed)
│   ├── index.js                        # Express server
│   └── package.json
│
├── ml-service/                         # ML Model (Python)
│   ├── explore.py                      # Data exploration & preprocessing
│   ├── train.py                        # Model training with SMOTE
│   ├── predict.py                      # Prediction script (JSON output)
│   ├── model.pkl                       # Trained Random Forest model
│   ├── processed.csv                   # Processed training data
│   └── period - Copy.csv               # Raw dataset
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
cd front
npm install
```

Create a `.env` file in `front/` with your Firebase credentials:

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
npm run dev
```

App runs at `http://localhost:5173` (Vite default)

### 3. Setup Backend

```bash
cd server
npm install
```

Create a `.env` file in `server/` with your Gemini API key:

```env
GEMINI_API_KEY=your_gemini_api_key
PORT=5000
```

Start the backend:

```bash
npm start
```

Server runs at `http://localhost:5000`

### 4. Setup ML Service

```bash
cd ml-service
pip install pandas scikit-learn joblib imbalanced-learn
```

Train the model (optional - model.pkl already included):

```bash
python train.py
```

Test prediction:

```bash
python predict.py 1 10 12 45
# Output: {"risk": "High", "confidence": 91.0}
```

---

## API Endpoints

### POST `/predict`

Predict PCOD risk based on cycle data.

**Request Body:**
```json
{
  "cycles": [28, 30, 27],
  "symptoms": ["pain", "heavy_flow"]
}
```

**Response:**
```json
{
  "predictedCycle": 28,
  "irregularScore": 5.33,
  "risk": "Low",
  "confidence": 100.0
}
```

### POST `/advice`

Get personalized health advice from Gemini AI. **Note:** The chatbot only responds to menstrual/reproductive health queries. Non-health questions will be politely declined.

**Request Body:**
```json
{
  "cycles": [28, 30, 27],
  "symptoms": ["pain", "heavy_flow"],
  "risk": "Low",
  "confidence": 100.0,
  "message": "What should I do about irregular periods?",
  "lang": "en"
}
```

**Response:**
```json
{
  "advice": "Your cycles are fairly regular with a low PCOD risk. The pain and heavy flow you're experiencing are common. Consider tracking your symptoms, staying hydrated, and maintaining a balanced diet. If symptoms worsen, consult a healthcare professional."
}
```

**Non-health query response:**
```json
{
  "advice": "I'm a menstrual health assistant and can only provide advice related to menstrual health, PCOD/PCOS, and reproductive wellness. Please ask health-related questions."
}
```

---

## ML Model Details

### Algorithm
- **Model**: Random Forest Classifier (200 trees, max depth 10)
- **Features**: 
  - `long_cycle` (0 or 1): Whether cycle > 35 days
  - `irregular_score`: Cycle variation + symptom score
  - `cycle_variation`: Absolute difference from average
  - `Length_of_cycle`: Actual cycle length in days

### Training Process
- **Dataset**: 162 menstrual cycle records
- **Class Imbalance**: Original distribution - 79% Low, 17% Medium, 4% High
- **Solution**: SMOTE (Synthetic Minority Over-sampling) with k_neighbors=2
- **Cross-validation**: 3-fold Stratified K-Fold
- **Accuracy**: 99.67% (cross-validation), 100% (test set)

### Feature Engineering
- **Symptom Scoring**:
  - Pain: +2 points
  - Heavy flow: +2 points
  - Missed period: +3 points
  - Irregular: +2 points
- **Irregular Score**: cycle_variation + symptom_score

### Risk Levels
- **Low (0)**: Normal cycles (≤35 days), minimal symptoms
- **Medium (1)**: Moderate irregularity, some symptoms
- **High (2)**: Significant irregularity (>35 days), multiple symptoms

### Prediction Output
```json
{
  "risk": "Medium",
  "confidence": 71.5
}
```

### Model Improvements
- Fixed feature order mismatch between training and prediction
- Added absolute path resolution for model.pkl
- Suppressed sklearn version warnings
- JSON output format for seamless backend integration

---

## Key Features & Improvements

### 🤖 ML Model Integration
- Random Forest classifier with SMOTE for handling class imbalance
- 99.67% cross-validation accuracy
- Real-time PCOD risk prediction with confidence scores
- Seamless Python-Node.js integration via child process

### 🎨 Dark Mode Support
- Automatic theme detection using `prefers-color-scheme`
- Fixed white text on white background issue in input fields
- Proper color contrast for all UI elements
- Smooth transitions between light and dark themes

### 🌐 Multilingual Support
- English, Hindi, and Bengali language options
- Language context with React Context API
- Localized UI and AI responses

### 🔒 Health-Only Chatbot
- AI assistant restricted to menstrual/reproductive health topics
- Politely declines non-health queries
- Provides evidence-based advice without medical diagnosis
- Multi-language support for health advice

### 🔧 Technical Improvements
- Separated `/predict` and `/advice` API endpoints
- Fixed model.pkl path resolution for cross-directory execution
- Added comprehensive error handling
- JSON-based communication between services
- Suppressed sklearn version warnings in production

---

## Environment Variables

### Frontend (.env in `front/`)

| Variable | Description |
|----------|-------------|
| `REACT_APP_FIREBASE_API_KEY` | Firebase Web API Key |
| `REACT_APP_FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain |
| `REACT_APP_FIREBASE_PROJECT_ID` | Firebase Project ID |
| `REACT_APP_FIREBASE_STORAGE_BUCKET` | Firebase Storage Bucket |
| `REACT_APP_FIREBASE_MESSAGING_SENDER_ID` | Firebase Messaging Sender ID |
| `REACT_APP_FIREBASE_APP_ID` | Firebase App ID |

### Backend (.env in `server/`)

| Variable | Description |
|----------|-------------|
| `GEMINI_API_KEY` | Google Gemini API Key |
| `PORT` | Server port (default: 5000) |

> ⚠️ Never push your `.env` files to GitHub.

---

## Team

- **Full Stack Development** — Avisiktaa
- **ML Model & Integration** — Avisiktaa
- **AI Integration (Gemini)** — Avisiktaa

---

## License

MIT License - feel free to use this project for learning and development.

---

## Acknowledgments

- Dataset: Menstrual cycle health data
- Google Gemini AI for health advice generation
- Firebase for authentication and database
- scikit-learn for ML model training
