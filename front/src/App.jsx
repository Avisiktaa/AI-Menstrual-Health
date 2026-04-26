import { useState, useEffect } from 'react';
import Home from './components/Home';
import InputForm from './components/InputForm';
import ResultsDashboard from './components/ResultsDashboard';
import History from './components/History';
import CalendarView from './components/CalendarView';
import Chatbot from './components/Chatbot';
import Login from './components/Login';
import Register from './components/Register';
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
    setStep(2);
    
    try {
      const res = await fetch('/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          cycles: data.cycles,
          symptoms: data.symptoms,
          lang: lang // Pass language to backend
        })
      });
      
      const result = await res.json();
      setAiData(result);
      
      // Save to Firestore if user is logged in
      if (user) {
        try {
          await addDoc(collection(db, 'user_results'), {
            userId: user.uid,
            userEmail: user.email,
            formData: data,
            prediction: result,
            timestamp: serverTimestamp(),
            lastPeriodDate: data.lastPeriodDate
          });
          console.log("Successfully saved result to Firestore");
        } catch (fsErr) {
          console.error("Error saving to Firestore:", fsErr);
        }
      }

      setStep(3);
    } catch (err) {
      console.error('Failed to fetch from ML backend', err);
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
    <div className="app-wrapper">
      {/* Header Controls */}
      <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 10, display: 'flex', gap: '12px', alignItems: 'center' }}>
        {user && (
          <>
            <button 
              onClick={toggleTheme}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--card-bg)', cursor: 'pointer', color: 'var(--text-main)' }}
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            {step > 0 && (
              <button 
                onClick={handleBack}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--card-bg)', cursor: 'pointer', fontSize: '14px', fontWeight: '500', color: 'var(--text-main)' }}
              >
                <ArrowLeft size={16} />
              </button>
            )}
            <button 
              onClick={() => setStep(0)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--card-bg)', cursor: 'pointer', fontSize: '14px', fontWeight: '500', color: 'var(--text-main)' }}
            >
              <HomeIcon size={16} />
            </button>
            <button 
              onClick={handleViewHistory}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--card-bg)', cursor: 'pointer', fontSize: '14px', fontWeight: '500', color: 'var(--text-main)' }}
            >
              <HistoryIcon size={16} /> {lang === 'hi' ? 'इतिहास' : lang === 'bn' ? 'ইতিহাস' : 'History'}
            </button>
            <button 
              onClick={handleViewCalendar}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--card-bg)', cursor: 'pointer', fontSize: '14px', fontWeight: '500', color: 'var(--text-main)' }}
            >
              <HistoryIcon size={16} /> {lang === 'hi' ? 'कैलेंडर' : lang === 'bn' ? 'ক্যালেন্ডার' : 'Calendar'}
            </button>
            <button 
              onClick={handleLogout}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--card-bg)', cursor: 'pointer', fontSize: '14px', fontWeight: '500', color: 'var(--text-main)' }}
            >
              <LogOut size={16} /> Logout
            </button>
          </>
        )}
        <select 
          value={lang} 
          onChange={(e) => setLang(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--card-bg)', color: 'var(--text-main)', cursor: 'pointer', outline: 'none' }}
        >
          <option value="en">English</option>
          <option value="hi">हिंदी</option>
          <option value="bn">বাংলা</option>
        </select>
      </div>

      {step === 0 && <Home onStart={handleStart} t={t} />}
      {step === 1 && <InputForm onAnalyze={handleAnalyze} t={t} />}
      {step === 2 && (
        <div className="container animate-fade-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
          <div className="loader-container text-center">
            <div className="loader"></div>
            <h2 className="header-title" style={{ fontSize: '24px', textAlign: 'center' }}>{t.analyzeBtn}...</h2>
            <p className="subtitle" style={{ textAlign: 'center' }}>{t.understandPattern}</p>
          </div>
        </div>
      )}
      {step === 3 && <ResultsDashboard formData={formData} aiData={aiData} onRestart={handleRestart} t={t} />}
      {step === 4 && <History onViewResult={handleViewDetails} t={t} />}
      {step === 5 && <CalendarView t={t} />}

      <Chatbot t={t} formData={formData} aiData={aiData} lang={lang} />
    </div>
  );
}

export default App;
