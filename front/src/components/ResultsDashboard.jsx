import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  Activity, 
  AlertCircle, 
  Calendar, 
  RefreshCcw, 
  Sparkles, 
  CheckCircle2, 
  Download, 
  Volume2, 
  Bell, 
  Zap, 
  Droplets, 
  Apple, 
  Moon, 
  Sun,
  ShieldCheck,
  Award
} from 'lucide-react';

export default function ResultsDashboard({ formData, aiData, onRestart, t }) {
  const cycleAvg = aiData?.predictedCycle || 28;
  const confidence = aiData?.confidence || 0;
  const risk = aiData?.risk || 'Low';
  const irregularScore = aiData?.irregularScore || 0;
  const advice = aiData?.advice || '';
  
  const translateNumber = (num) => {
    if (!num && num !== 0) return '';
    if (t.langCode === 'en') return num;
    const digits = {
      '0': t.langCode === 'hi' ? '०' : '০',
      '1': t.langCode === 'hi' ? '१' : '১',
      '2': t.langCode === 'hi' ? '२' : '২',
      '3': t.langCode === 'hi' ? '३' : '৩',
      '4': t.langCode === 'hi' ? '४' : '৪',
      '5': t.langCode === 'hi' ? '५' : '৫',
      '6': t.langCode === 'hi' ? '६' : '৬',
      '7': t.langCode === 'hi' ? '७' : '৭',
      '8': t.langCode === 'hi' ? '८' : '৮',
      '9': t.langCode === 'hi' ? '९' : '৯',
      '.': '.'
    };
    return num.toString().split('').map(d => digits[d] || d).join('');
  };

  // Phase Detection Logic
  const calculatePhase = () => {
    if (!formData.lastPeriodDate) return { name: 'Unknown', day: 0 };
    const lastDate = new Date(formData.lastPeriodDate);
    const today = new Date();
    const diffTime = Math.abs(today - lastDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const currentDay = diffDays % cycleAvg;

    if (currentDay <= 5) return { name: t.menstrual, day: currentDay, color: '#FF7675' };
    if (currentDay <= 13) return { name: t.follicular, day: currentDay, color: '#55E6C1' };
    if (currentDay <= 15) return { name: t.ovulation, day: currentDay, color: '#A29BFE' };
    return { name: t.luteal, day: currentDay, color: '#FDCB6E' };
  };

  const currentPhase = calculatePhase();

  // Recommendations Data (Localized)
  const getRecs = () => {
    const l = t.langCode;
    
    const data = {
      en: {
        menstrual: { food: "Iron-rich (Spinach, lentils), Dark chocolate", water: "2.5L - Hydrate to reduce bloating", exercise: "Light stretching or walking", yoga: [{name: "Child's Pose", benefit: "Relieves cramps"}, {name: "Bound Angle", benefit: "Opens pelvic region"}] },
        follicular: { food: "Protein-rich foods, Fermented vegetables", water: "2.2L - Essential for metabolism", exercise: "Moderate cardio", yoga: [{name: "Sun Salutation", benefit: "Boosts energy"}, {name: "Tree Pose", benefit: "Improves focus"}] },
        ovulation: { food: "Fiber-rich fruits, Anti-inflammatory", water: "2.8L - High activity needs more", exercise: "HIIT or strength training", yoga: [{name: "Cobra Pose", benefit: "Stimulates organs"}, {name: "Bridge Pose", benefit: "Strengthens core"}] },
        luteal: { food: "Complex carbs, Magnesium (Nuts)", water: "2.4L - Helps skin clarity", exercise: "Yoga or Pilates", yoga: [{name: "Legs Up Wall", benefit: "Reduces anxiety"}, {name: "Cat-Cow", benefit: "Gentle spinal movement"}] },
        unknown: { food: "Maintain a balanced diet with leafy greens.", water: "2.5L - Consistent hydration.", exercise: "Regular moderate activity.", yoga: [{name: "Mountain Pose", benefit: "Improves balance"}, {name: "Butterfly Pose", benefit: "Pelvic health"}] }
      },
      hi: {
        menstrual: { food: "आयरन युक्त (पालक, दालें), डार्क चॉकलेट", water: "2.5L - सूजन कम करने के लिए पानी पिएं", exercise: "हल्का स्ट्रेचिंग या पैदल चलना", yoga: [{name: "बालासन", benefit: "मासिक धर्म के दर्द से राहत"}, {name: "बद्ध कोणासन", benefit: "श्रोणि क्षेत्र को खोलता है"}] },
        follicular: { food: "प्रोटीन युक्त भोजन, किण्वित सब्जियां", water: "2.2L - मेटाबॉलिज्म के लिए आवश्यक", exercise: "मध्यम कार्डियो", yoga: [{name: "सूर्य नमस्कार", benefit: "ऊर्जा बढ़ाता है"}, {name: "वृक्षासन", benefit: "एकाग्रता सुधारता है"}] },
        ovulation: { food: "फाइबर युक्त फल, एंटी-इंफ्लेमेटरी", water: "2.8L - अधिक गतिविधि के लिए ज्यादा पानी", exercise: "HIIT या शक्ति प्रशिक्षण", yoga: [{name: "भुजंगासन", benefit: "अंगों को उत्तेजित करता है"}, {name: "सेतुबंधासन", benefit: "कोर को मजबूत करता है"}] },
        luteal: { food: "जटिल कार्ब्स, मैग्नीशियम (नट्स)", water: "2.4L - त्वचा के लिए अच्छा", exercise: "योग या पिलेट्स", yoga: [{name: "विपरीत करणी", benefit: "चिंता कम करता है"}, {name: "मार्जरी आसन", benefit: "रीढ़ की हड्डी के लिए अच्छा"}] },
        unknown: { food: "पत्तेदार सब्जियों के साथ संतुलित आहार लें।", water: "2.5L - नियमित हाइड्रेशन।", exercise: "नियमित मध्यम गतिविधि।", yoga: [{name: "ताड़ासन", benefit: "संतुलन सुधारता है"}, {name: "तितली आसन", benefit: "श्रोणि स्वास्थ्य"}] }
      },
      bn: {
        menstrual: { food: "আয়রন সমৃদ্ধ (পালং শাক, ডাল), ডার্ক চকলেট", water: "2.5L - ফোলাভাব কমাতে জল খান", exercise: "হালকা স্ট্রেচিং বা হাঁটা", yoga: [{name: "চাইল্ডস পোজ", benefit: "পিরিয়ড ব্যথা উপশম করে"}, {name: "বাউন্ড অ্যাঙ্গেল", benefit: "পেলভিক অঞ্চল খোলে"}] },
        follicular: { food: "প্রোটিন সমৃদ্ধ খাবার, গেঁজানো সবজি", water: "2.2L - বিপাকের জন্য অপরিহার্য", exercise: "মাঝারি কার্ডিও", yoga: [{name: "সূর্য নমস্কার", benefit: "শক্তি বাড়ায়"}, {name: "বৃক্ষাসন", benefit: "মনঃসংযোগ উন্নত করে"}] },
        ovulation: { food: "ফাইবার সমৃদ্ধ ফল, অ্যান্টি-ইনফ্লেমেটরি", water: "2.8L - বেশি জল প্রয়োজন", exercise: "HIIT বা শক্তি প্রশিক্ষণ", yoga: [{name: "কোবরা পোজ", benefit: "অঙ্গ উদ্দীপিত করে"}, {name: "ব্রিজ পোজ", benefit: "কোর শক্তিশালী করে"}] },
        luteal: { food: "জটিল কার্বোহাইড্রেট, ম্যাগনেসিয়াম", water: "2.4L - ত্বকের স্বচ্ছতায় সাহায্য করে", exercise: "যোগব্যায়াম বা পাইলেটস", yoga: [{name: "লেগস আপ ওয়াল", benefit: "উদ্বেগ কমায়"}, {name: "ক্যাট-কাউ", benefit: "মেরুদণ্ডের জন্য ভালো"}] },
        unknown: { food: "শাকসবজি সহ সুষম খাদ্য বজায় রাখুন।", water: "2.5L - নিয়মিত জলপান।", exercise: "নিয়মিত মাঝারি কার্যকলাপ।", yoga: [{name: "তাড়াসন", benefit: "ভারসাম্য উন্নত করে"}, {name: "প্রজাপতি আসন", benefit: "পেলভিক স্বাস্থ্য"}] }
      }
    };

    const currentLangData = data[l] || data['en'];
    
    if (currentPhase.name === t.menstrual) return currentLangData.menstrual;
    if (currentPhase.name === t.follicular) return currentLangData.follicular;
    if (currentPhase.name === t.ovulation) return currentLangData.ovulation;
    if (currentPhase.name === t.luteal) return currentLangData.luteal;
    return currentLangData.unknown;
  };

  const currentRecs = getRecs();

  // Health Score Calculation (Mock)
  const calculateHealthScore = () => {
    let score = 95;
    if (risk === 'High') score -= 30;
    else if (risk === 'Medium') score -= 15;
    
    if (irregularScore > 5) score -= 10;
    if (formData.symptoms.length > 2) score -= 10;
    
    return Math.max(score, 30);
  };

  const healthScore = calculateHealthScore();

  // Sleep Analysis
  const getSleepInsight = () => {
    if (!formData.sleepTime || !formData.wakeTime) return null;
    const [sH, sM] = formData.sleepTime.split(':').map(Number);
    const [wH, wM] = formData.wakeTime.split(':').map(Number);
    
    let duration = wH - sH;
    if (duration < 0) duration += 24;
    
    if (duration < 7 || duration > 9) return t.sleepInsight;
    return null;
  };

  const sleepInsight = getSleepInsight();

  const variation = formData.cycles.length > 1 
    ? Math.max(...formData.cycles) - Math.min(...formData.cycles)
    : 0;

  const chartData = formData.cycles.map((len, idx) => ({
    name: `${t.cycleShort || 'C'}${translateNumber(idx + 1)}`,
    days: len
  }));

  const handleDownload = () => window.print();

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(advice || "Generating advice");
      if (t.langCode === 'hi') utterance.lang = 'hi-IN';
      else if (t.langCode === 'bn') utterance.lang = 'bn-IN';
      else utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '20px 0', maxWidth: '900px' }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h1 className="header-title" style={{ fontSize: '32px', marginBottom: '8px' }}>{t.yourInsights}</h1>
          <p className="subtitle" style={{ marginBottom: 0 }}>{t.aiComplete}</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={handleDownload} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Download size={18} /> {t.downloadReport}
          </button>
          <button onClick={onRestart} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <RefreshCcw size={18} /> {t.startOver}
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        
        {/* Current Phase Card */}
        <div className="glass-card" style={{ borderLeft: `8px solid ${currentPhase.color || 'var(--primary)'}`, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: '-10px', bottom: '-10px', opacity: 0.1 }}>
            <Calendar size={80} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>
            <Activity size={18} color={currentPhase.color || 'var(--primary)'} /> {t.currentPhase}
          </div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '4px' }}>
            {currentPhase.name === 'Unknown' ? t.recPhaseNotSet : currentPhase.name}
          </div>
          <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            {currentPhase.name === 'Unknown' 
              ? t.recPhasePrompt 
              : `Day ${translateNumber(currentPhase.day)} of your cycle`}
          </div>
        </div>

        {/* Health Score Card */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '14px', fontWeight: '600' }}>
              <Award size={18} color="var(--accent-teal)" /> {t.healthScore}
            </div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: healthScore > 70 ? 'var(--success)' : 'var(--warning)' }}>
              {translateNumber(healthScore)}/{translateNumber(100)}
            </div>
          </div>
          <div style={{ background: 'var(--primary-light)', height: '10px', borderRadius: '5px', overflow: 'hidden' }}>
            <div style={{ background: 'linear-gradient(90deg, var(--accent-teal), var(--success))', width: `${healthScore}%`, height: '100%', transition: 'width 1.5s ease' }}></div>
          </div>
        </div>

        {/* Risk Assessment Card */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>
            <ShieldCheck size={18} color={risk === 'High' ? 'var(--danger)' : 'var(--success)'} /> {t.pcodRisk}
          </div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: risk === 'High' ? 'var(--danger)' : 'var(--success)' }}>{risk === 'High' ? t.riskHigh : t.riskLow}</div>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>AI Confidence: {translateNumber(confidence)}%</div>
        </div>
      </div>

      {/* Recommendations & Yoga Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        
        {/* Daily Tips */}
        <div className="glass-card">
          <h3 className="section-title"><Sparkles size={20} color="var(--primary)" /> {t.phaseRecs}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{ padding: '10px', background: 'rgba(255, 118, 117, 0.1)', borderRadius: '12px' }}><Apple size={20} color="#FF7675" /></div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)' }}>{t.recDiet}</div>
                <div style={{ fontSize: '15px', color: 'var(--text-main)' }}>{currentRecs.food}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{ padding: '10px', background: 'rgba(0, 206, 201, 0.1)', borderRadius: '12px' }}><Droplets size={20} color="#00CEC9" /></div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)' }}>{t.recHydration}</div>
                <div style={{ fontSize: '15px', color: 'var(--text-main)' }}>{currentRecs.water}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{ padding: '10px', background: 'rgba(162, 155, 254, 0.1)', borderRadius: '12px' }}><Zap size={20} color="#A29BFE" /></div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)' }}>{t.recExercise}</div>
                <div style={{ fontSize: '15px', color: 'var(--text-main)' }}>{currentRecs.exercise}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Yoga Section */}
        <div className="glass-card" style={{ background: 'linear-gradient(135deg, rgba(162, 155, 254, 0.05), rgba(253, 167, 223, 0.05))' }}>
          <h3 className="section-title"><Sun size={20} color="var(--warning)" /> {t.recYoga}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '20px' }}>
            {currentRecs.yoga.map((y, idx) => (
              <div key={idx} style={{ background: 'var(--card-bg)', padding: '16px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontWeight: '700', color: 'var(--primary)', marginBottom: '4px' }}>{y.name}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.4' }}>{y.benefit}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Advice & Sleep Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div className="glass-card" style={{ background: 'linear-gradient(135deg, rgba(162, 155, 254, 0.1), rgba(253, 167, 223, 0.1))' }}>
          <h3 className="section-title" style={{ color: 'var(--primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={20} /> AI Health Advice
            </div>
            <button onClick={handleSpeak} className="btn-secondary" style={{ borderRadius: '50%', width: '36px', height: '36px', padding: 0 }}>
              <Volume2 size={18} />
            </button>
          </h3>
          <p style={{ fontSize: '15px', lineHeight: '1.6', color: 'var(--text-main)', marginTop: '12px' }}>
            {advice || "Generating personalized advice based on your hormonal profile..."}
          </p>
          
          {sleepInsight && (
            <div style={{ marginTop: '20px', padding: '12px', background: 'rgba(255, 118, 117, 0.1)', borderRadius: '12px', display: 'flex', gap: '10px', alignItems: 'center' }}>
              <Moon size={18} color="var(--danger)" />
              <div style={{ fontSize: '13px', fontWeight: '500', color: 'var(--danger)' }}>{sleepInsight}</div>
            </div>
          )}
        </div>

        <div className="glass-card">
          <h3 className="section-title"><Activity size={20} color="var(--primary)" /> {t.stabilityHeader || 'Cycle Stability'}</h3>
          <div style={{ width: '100%', height: '350px', marginTop: '10px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                <Line type="monotone" dataKey="days" stroke="var(--primary)" strokeWidth={3} dot={{ r: 4, fill: 'var(--primary)' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
