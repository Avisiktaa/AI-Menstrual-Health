import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import illustration from '../assets/illustration.png';

export default function Home({ onStart, t }) {
  return (
    <div className="container animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', textAlign: 'center' }}>
      
      <div style={{ marginBottom: '30px' }}>
        <img 
          src={illustration} 
          alt="Women's Health AI Illustration" 
          style={{ width: '100%', maxWidth: '350px', borderRadius: '24px', boxShadow: '0 20px 40px rgba(162, 155, 254, 0.15)' }} 
        />
      </div>

      <div className="glass-card" style={{ width: '100%', maxWidth: '500px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '16px' }}>
          <Sparkles color="var(--primary)" size={28} />
          <h1 className="header-title" style={{ marginBottom: 0 }}>{t.appTitle}</h1>
        </div>
        
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px', color: 'var(--text-main)' }}>
          {t.tagline}
        </h2>
        
        <p className="subtitle">
          {t.description}
        </p>

        <button className="btn-primary" onClick={onStart} style={{ marginTop: '10px' }}>
          {t.startAnalysis}
          <ArrowRight size={20} />
        </button>
      </div>

    </div>
  );
}
