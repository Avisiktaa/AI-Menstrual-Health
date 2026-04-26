import React, { useState } from 'react';
import { Plus, HeartCrack, Droplets, CalendarOff, AlertTriangle, ChevronDown, ChevronUp, ArrowRight, Calculator, Calendar, ArrowLeft } from 'lucide-react';

export default function InputForm({ onAnalyze, t }) {
  const [cycles, setCycles] = useState([]);
  const [cycleInput, setCycleInput] = useState('');
  const [symptoms, setSymptoms] = useState([]);
  const [showOptional, setShowOptional] = useState(false);
  const [optionalData, setOptionalData] = useState({ age: '', weight: '', height: '' });
  const [lastPeriodDate, setLastPeriodDate] = useState('');
  
  // Calculator state
  const [calcDate1, setCalcDate1] = useState('');
  const [calcDate2, setCalcDate2] = useState('');
  const [calcResult, setCalcResult] = useState(null);

  const calculateDays = () => {
    if (calcDate1 && calcDate2) {
      const d1 = new Date(calcDate1);
      const d2 = new Date(calcDate2);
      const diff = Math.abs(d2 - d1);
      const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
      setCalcResult(days);
    }
  };

  const availableSymptoms = [
    { id: 'pain', label: t.painLabel, icon: <HeartCrack size={24} /> },
    { id: 'heavy_flow', label: t.heavyLabel, icon: <Droplets size={24} /> },
    { id: 'missed_period', label: t.missedLabel, icon: <CalendarOff size={24} /> },
    { id: 'irregular', label: t.irregularLabel, icon: <AlertTriangle size={24} /> },
  ];

  const handleAddCycle = (e) => {
    e.preventDefault();
    const val = parseInt(cycleInput);
    if (val > 0 && val < 100) {
      setCycles([...cycles, val]);
      setCycleInput('');
    }
  };

  const handleRemoveCycle = (index) => {
    setCycles(cycles.filter((_, i) => i !== index));
  };

  const toggleSymptom = (id) => {
    if (symptoms.includes(id)) {
      setSymptoms(symptoms.filter(s => s !== id));
    } else {
      setSymptoms([...symptoms, id]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cycles.length === 0) {
      alert('Please add at least one cycle length to proceed.');
      return;
    }
    onAnalyze({ cycles, symptoms, lastPeriodDate, ...optionalData });
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '40px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <div>
          <h1 className="header-title" style={{ fontSize: '28px', marginBottom: '4px' }}>{t.cycleDetails}</h1>
          <p className="subtitle" style={{ marginBottom: 0 }}>{t.understandPattern}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
        
        {/* Section 1: Cycle History & Calculator */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <h3 className="section-title">{t.cycleHistory}</h3>
            <div className="glass-card" style={{ padding: '12px 16px', fontSize: '13px', maxWidth: '240px', background: 'var(--primary-light)', border: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontWeight: '700', color: 'var(--primary)' }}>
                <Calculator size={14} /> {t.calculateCycle}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <input type="date" value={calcDate1} onChange={e => setCalcDate1(e.target.value)} style={{ fontSize: '12px', padding: '4px', borderRadius: '4px', border: '1px solid var(--border-color)' }} />
                <input type="date" value={calcDate2} onChange={e => setCalcDate2(e.target.value)} style={{ fontSize: '12px', padding: '4px', borderRadius: '4px', border: '1px solid var(--border-color)' }} />
                <button type="button" onClick={calculateDays} style={{ background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '4px', padding: '4px', cursor: 'pointer' }}>Calc</button>
                {calcResult && <div style={{ fontWeight: '600', textAlign: 'center' }}>{calcResult} {t.days}</div>}
              </div>
            </div>
          </div>
          
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '16px' }}>{t.enterCycleDays}</p>
          
          <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
            <input 
              type="number" 
              className="input-field" 
              placeholder="e.g. 28" 
              value={cycleInput}
              onChange={(e) => setCycleInput(e.target.value)}
              style={{ flex: 1 }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddCycle(e);
                }
              }}
            />
            <button type="button" className="btn-secondary" onClick={handleAddCycle}>
              <Plus size={20} /> {t.addBtn}
            </button>
          </div>

          <div className="chip-container">
            {cycles.map((c, i) => (
              <div key={i} className="chip animate-fade-in">
                {c} {t.days}
                <button type="button" onClick={() => handleRemoveCycle(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)', display: 'flex', fontSize: '18px' }}>
                  &times;
                </button>
              </div>
            ))}
            {cycles.length === 0 && <span style={{ color: '#b2bec3', fontSize: '14px' }}>{t.noCycles}</span>}
          </div>

          {/* New: Last Period Start Date */}
          <div style={{ marginTop: '24px' }}>
            <h4 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '12px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={16} color="var(--primary)" /> {t.lastPeriodDate}
            </h4>
            <input 
              type="date" 
              className="input-field" 
              value={lastPeriodDate} 
              onChange={e => setLastPeriodDate(e.target.value)} 
            />
          </div>
        </section>

        {/* Section 2: Symptoms */}
        <section>
          <h3 className="section-title">{t.recentSymptoms}</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '16px' }}>{t.selectSymptoms}</p>
          
          <div className="grid-2">
            {availableSymptoms.map(s => (
              <div 
                key={s.id} 
                className={`flashcard ${symptoms.includes(s.id) ? 'selected' : ''}`}
                onClick={() => toggleSymptom(s.id)}
              >
                <div className="icon" style={{ color: symptoms.includes(s.id) ? 'var(--primary)' : 'var(--text-muted)' }}>{s.icon}</div>
                <span style={{ fontWeight: '500', fontSize: '15px' }}>{s.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Optional Inputs */}
        <section>
          <button 
            type="button" 
            onClick={() => setShowOptional(!showOptional)} 
            style={{ width: '100%', background: 'var(--card-bg)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>{t.addMoreDetails}</span>
            {showOptional ? <ChevronUp size={20} color="var(--primary)" /> : <ChevronDown size={20} color="var(--text-muted)" />}
          </button>
          
          {showOptional && (
            <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px', padding: '0 8px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>{t.age}</label>
                <input type="number" className="input-field" value={optionalData.age} onChange={e => setOptionalData({...optionalData, age: e.target.value})} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>{t.weight}</label>
                <input type="number" className="input-field" value={optionalData.weight} onChange={e => setOptionalData({...optionalData, weight: e.target.value})} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>{t.height}</label>
                <input type="number" className="input-field" value={optionalData.height} onChange={e => setOptionalData({...optionalData, height: e.target.value})} />
              </div>
            </div>
          )}
        </section>

        {/* Submit */}
        <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>
          {t.analyzeBtn}
          <ArrowRight size={20} />
        </button>

      </form>
    </div>
  );
}
