import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, AlertCircle, Calendar, RefreshCcw, Sparkles, CheckCircle2, Download, Volume2, Bell } from 'lucide-react';

export default function ResultsDashboard({ formData, aiData, onRestart, t }) {
  const cycleAvg = aiData?.predictedCycle || 28;
  const confidence = aiData?.confidence || 0;
  const risk = aiData?.risk || 'Low';
  const irregularScore = aiData?.irregularScore || 0;
  const advice = aiData?.advice || '';
  
  const translateNumber = (num) => {
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

  const variation = formData.cycles.length > 1 
    ? Math.max(...formData.cycles) - Math.min(...formData.cycles)
    : 0;

  let riskColor = 'var(--success)';
  let riskScoreNum = 20; 
  let riskLabel = t.riskLow;

  if (risk === 'High') {
    riskColor = 'var(--danger)';
    riskScoreNum = 90;
    riskLabel = t.riskHigh;
  } else if (risk === 'Medium') {
    riskColor = 'var(--warning)';
    riskScoreNum = 50;
    riskLabel = t.riskMedium;
  }

  const nextPeriodDate = formData.lastPeriodDate && cycleAvg
    ? new Date(new Date(formData.lastPeriodDate).getTime() + cycleAvg * 24 * 60 * 60 * 1000)
    : null;

  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString(t.langCode === 'en' ? 'en-US' : t.langCode === 'hi' ? 'hi-IN' : 'bn-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const chartData = formData.cycles.map((len, idx) => ({
    name: `C${idx + 1}`,
    days: len
  }));

  const handleDownload = () => {
    window.print();
  };

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(advice);
      
      // Attempt to find a voice matching the language
      const voices = window.speechSynthesis.getVoices();
      if (t.langCode === 'hi') {
        utterance.lang = 'hi-IN';
      } else if (t.langCode === 'bn') {
        utterance.lang = 'bn-IN';
      } else {
        utterance.lang = 'en-US';
      }
      
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Sorry, your browser does not support voice assistance.");
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '40px 20px', maxWidth: '800px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 className="header-title" style={{ fontSize: '28px' }}>{t.yourInsights}</h1>
          <p className="subtitle" style={{ marginBottom: 0 }}>{t.aiComplete}</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handleDownload} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Download size={16} /> {t.downloadReport}
          </button>
          <button onClick={onRestart} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <RefreshCcw size={16} /> {t.startOver}
          </button>
        </div>
      </div>

      {/* Confidence Bar */}
      <div className="glass-card" style={{ padding: '16px 24px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Sparkles color="var(--primary)" size={24} />
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
            <span>{t.aiConfidence}</span>
            <span>{translateNumber(confidence)}%</span>
          </div>
          <div style={{ background: '#DFE6E9', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ background: 'linear-gradient(90deg, var(--primary), var(--accent-teal))', width: `${confidence}%`, height: '100%', borderRadius: '4px' }}></div>
          </div>
        </div>
      </div>

      {/* Flashcards / Key Results */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        <div className="flashcard">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '14px', fontWeight: '500' }}>
            <Calendar size={18} color="var(--primary)" /> {t.predictedCycle}
          </div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: 'var(--text-main)' }}>~{translateNumber(cycleAvg)} {t.days}</div>
        </div>

        <div className="flashcard">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '14px', fontWeight: '500' }}>
            <Activity size={18} color={riskColor} /> {t.pcodRisk}
          </div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: riskColor }}>{riskLabel}</div>
        </div>

        <div className="flashcard">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '14px', fontWeight: '500' }}>
            <AlertCircle size={18} color="var(--accent-pink)" /> Irregular Score
          </div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: 'var(--text-main)', lineHeight: 1.2 }}>{translateNumber(irregularScore.toFixed(3))}</div>
        </div>

        {nextPeriodDate && (
          <div className="flashcard" style={{ background: 'rgba(85, 230, 193, 0.1)', borderColor: 'var(--success)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '14px', fontWeight: '500' }}>
              <Bell size={18} color="var(--success)" /> Next Expected
            </div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-main)' }}>{formatDate(nextPeriodDate)}</div>
          </div>
        )}
      </div>
      
      {/* Hormone Risk Score (Progress Bar) */}
      <div className="glass-card" style={{ padding: '16px 24px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', fontWeight: '600', marginBottom: '8px' }}>
          <span>Hormone Risk Score</span>
          <span style={{ color: riskColor }}>{riskLabel}</span>
        </div>
        <div style={{ background: '#DFE6E9', height: '10px', borderRadius: '5px', overflow: 'hidden' }}>
          <div style={{ background: riskColor, width: `${riskScoreNum}%`, height: '100%', borderRadius: '5px', transition: 'width 1s ease' }}></div>
        </div>
      </div>

      {/* Graph */}
      <div className="glass-card" style={{ marginBottom: '32px' }}>
        <h3 className="section-title">{t.cycleHistoryTrend}</h3>
        <div style={{ width: '100%', height: '250px', marginTop: '20px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#DFE6E9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} dx={-10} domain={['dataMin - 2', 'dataMax + 2']} />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '12px', 
                  border: '1px solid var(--border-color)', 
                  boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                  background: 'var(--card-bg)',
                  color: 'var(--text-main)'
                }}
                itemStyle={{ color: 'var(--primary)', fontWeight: '600' }}
              />
              <Line 
                type="monotone" 
                dataKey="days" 
                stroke="var(--primary)" 
                strokeWidth={4}
                dot={{ r: 6, fill: 'var(--primary)', stroke: 'white', strokeWidth: 2 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Advice & Insights */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
        <div className="glass-card" style={{ background: 'linear-gradient(135deg, rgba(162, 155, 254, 0.1), rgba(253, 167, 223, 0.1))' }}>
          <h3 className="section-title" style={{ color: 'var(--primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={20} /> {t.aiHealthAdvice}
            </div>
            <button 
              onClick={handleSpeak}
              style={{ background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 10px rgba(162, 155, 254, 0.3)' }}
              title="Read Advice"
            >
              <Volume2 size={16} />
            </button>
          </h3>
          <p style={{ fontSize: '15px', lineHeight: '1.6', color: 'var(--text-main)', padding: '10px 0' }}>
            {advice || "We could not generate advice at this moment. Please check your network connection."}
          </p>
        </div>

        <div className="glass-card">
          <h3 className="section-title">{t.smartInsights}</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <li style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <CheckCircle2 size={18} color="var(--success)" style={{ marginTop: '2px', flexShrink: 0 }} />
              <span style={{ fontSize: '15px', color: 'var(--text-main)' }}>
                {t.insightAvgCycle.replace('{days}', translateNumber(cycleAvg))}
              </span>
            </li>
            <li style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <CheckCircle2 size={18} color={formData.symptoms.length > 0 ? "var(--warning)" : "var(--success)"} style={{ marginTop: '2px', flexShrink: 0 }} />
              <span style={{ fontSize: '15px', color: 'var(--text-main)' }}>
                {t.insightSymptoms.replace('{count}', translateNumber(formData.symptoms.length))}
              </span>
            </li>
            {variation > 5 && (
              <li style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <CheckCircle2 size={18} color="var(--warning)" style={{ marginTop: '2px', flexShrink: 0 }} />
                <span style={{ fontSize: '15px', color: 'var(--text-main)' }}>
                  {t.insightVariation.replace('{days}', translateNumber(variation))}
                </span>
              </li>
            )}
          </ul>
        </div>
      </div>

    </div>
  );
}
