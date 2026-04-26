import { useState, useEffect } from 'react';
import Home from './components/Home';
import InputForm from './components/InputForm';
import ResultsDashboard from './components/ResultsDashboard';
import History from './components/History';
import CalendarView from './components/CalendarView';
import Chatbot from './components/Chatbot';
import Login from './components/Login';
import Register from './components/Register';
import Sidebar from './components/Sidebar';
import { translations } from './translations';
import { auth, db } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { LogOut, History as HistoryIcon, Home as HomeIcon, Sun, Moon, ArrowLeft } from 'lucide-react';

function App() {
  // 0: Home, 1: Form, 2: Loading, 3: Results, 4: History
  const [step, setStep] = useState(0);
  const [prevStep, setPrevStep] = useState(0);
  const [formData, setFormData] = useState({
    cycles: [],
    symptoms: [],
    age: '',
    weight: '',
    height: ''
  });
  const [aiData, setAiData] = useState(null);
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState('light');
  
  const [lang, setLang] = useState('en');
  const [collapsed, setCollapsed] = useState(false);
  const t = translations[lang];

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Re-fetch advice if language changes while viewing results
  useEffect(() => {
    if (step === 3 && aiData && formData) {
      const fetchNewAdvice = async () => {
        try {
          const res = await fetch('/api/predict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              cycles: formData.cycles,
              symptoms: formData.symptoms,
              lang: lang
            })
          });
          const result = await res.json();
          setAiData(prev => ({ ...prev, advice: result.advice }));
        } catch (err) {
          console.error("Failed to re-fetch advice", err);
        }
      };
      fetchNewAdvice();
    }
  }, [lang]);

  const handleLogout = () => {
    signOut(auth);
    handleRestart();
  };

  const handleBack = () => {
    setStep(prevStep);
  };

  const handleStart = () => {
    setPrevStep(0);
    setStep(1);
  };

  const handleAnalyze = async (data) => {
    setFormData(data);
    setPrevStep(1);
    setStep(2); // Loading
    
    // 1. SAVE INPUT DATA TO HISTORY IMMEDIATELY (Safety first)
    let docId = null;
    const currentUser = auth.currentUser;
    if (currentUser) {
      try {
        const docRef = await addDoc(collection(db, 'user_results'), {
          userId: currentUser.uid,
          userEmail: currentUser.email,
          formData: data,
          prediction: null, // Pending AI
          timestamp: serverTimestamp(),
          localTimestamp: Date.now(),
          lastPeriodDate: data.lastPeriodDate || null
        });
        docId = docRef.id;
        console.log("Input saved to history. ID:", docId);
      } catch (err) {
        console.error("Failed to save initial data:", err);
      }
    }

    // 2. CALL AI BACKEND
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

    try {
      const res = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cycles: data.cycles,
          symptoms: data.symptoms,
          lang: lang
        }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!res.ok) throw new Error(`Server responded with ${res.status}`);
      
      const result = await res.json();
      setAiData(result);
      
      // 3. UPDATE HISTORY WITH PREDICTION
      if (docId) {
        try {
          const { updateDoc, doc } = await import('firebase/firestore');
          await updateDoc(doc(db, 'user_results', docId), {
            prediction: result
          });
          console.log("AI results appended to history.");
        } catch (updErr) {
          console.error("Failed to update history with AI data:", updErr);
        }
      }

      setStep(3); // Show results
    } catch (err) {
      clearTimeout(timeoutId);
      console.error('Analysis failed:', err);
      
      // Fallback: Show results anyway but with "Offline" status
      setAiData({
        predictedCycle: Math.round(data.cycles.reduce((a,b)=>a+b, 0) / data.cycles.length),
        risk: 'Calculation Offline',
        confidence: 0,
        advice: "The AI analysis is currently unavailable. Showing basic calculations based on your history.",
        isOffline: true
      });
      setStep(3);
    }
  };

  const handleRestart = () => {
    setFormData({
      cycles: [],
      symptoms: [],
      age: '',
      weight: '',
      height: ''
    });
    setAiData(null);
    setStep(0);
  };

  const handleViewHistory = () => {
    setPrevStep(step);
    setStep(4);
  };

  const handleViewDetails = (formData, aiData) => {
    setFormData(formData);
    setAiData(aiData);
    setStep(3);
  };

  const handleViewCalendar = () => {
    setPrevStep(step);
    setStep(5);
  };

  if (loading) {
    return (
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <div className="loader"></div>
      </div>
    );
  }

  if (!user) {
    return authMode === 'login' 
      ? <Login onSwitch={() => setAuthMode('register')} t={t} /> 
      : <Register onSwitch={() => setAuthMode('login')} t={t} />;
  }

  return (
    <div className="app-container">
      <Sidebar 
        step={step} 
        setStep={setStep} 
        theme={theme} 
        toggleTheme={toggleTheme} 
        onLogout={handleLogout}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        t={t}
        lang={lang}
        setLang={setLang}
      />
      
      <main className="main-content">
        {/* Simplified Header for Desktop */}
        <div className="header-controls" style={{ position: 'absolute', top: '24px', right: '40px', zIndex: 10, display: 'flex', gap: '12px', alignItems: 'center' }}>
          {step > 0 && (
            <button 
              onClick={handleBack}
              className="btn-secondary back-btn"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px' }}
            >
              <ArrowLeft size={16} /> {t.backBtn || 'Back'}
            </button>
          )}
        </div>

        {step === 0 && <Home onStart={handleStart} t={t} />}
        {step === 1 && <InputForm onAnalyze={handleAnalyze} t={t} />}
        {step === 2 && (
          <div className="loader-container">
            <div className="loader"></div>
            <h2 className="header-title" style={{ fontSize: '24px' }}>{t.analyzeBtn}...</h2>
            <p className="subtitle">{t.understandPattern}</p>
          </div>
        )}
        {step === 3 && <ResultsDashboard formData={formData} aiData={aiData} onRestart={handleRestart} t={t} />}
        {step === 4 && <History onViewResult={handleViewDetails} t={t} />}
        {step === 5 && <CalendarView t={t} />}

        <Chatbot t={t} formData={formData} aiData={aiData} lang={lang} />
      </main>
    </div>
  );
}

export default App;
