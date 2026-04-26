import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import { collection, query, where, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { Calendar, ChevronRight, History as HistoryIcon, AlertCircle, Clock, Trash2 } from 'lucide-react';

export default function History({ onViewResult, t }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!auth.currentUser) return;
      
      try {
        const q = query(
          collection(db, 'user_results'),
          where('userId', '==', auth.currentUser.uid)
        );
        
        const querySnapshot = await getDocs(q);
        const docs = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Sort in JS to avoid index requirement
        docs.sort((a, b) => {
          const t1 = a.timestamp?.toMillis() || 0;
          const t2 = b.timestamp?.toMillis() || 0;
          return t2 - t1;
        });
        
        setHistory(docs);
      } catch (err) {
        console.error("Error fetching history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const handleDelete = async (e, docId) => {
    e.stopPropagation(); // Prevent opening the result view
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        await deleteDoc(doc(db, 'user_results', docId));
        setHistory(prev => prev.filter(item => item.id !== docId));
      } catch (err) {
        console.error("Error deleting record:", err);
        alert("Failed to delete the record.");
      }
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    return date.toLocaleDateString(undefined, { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const translateNumber = (num) => {
    if (t.langCode === 'en') return num;
    const digits = {
      '0': t.langCode === 'hi' ? '०' : '০',
      '1': t.langCode === 'hi' ? '१' : '১',
      '2': t.langCode === 'hi' ? '२' : '২',
      '3': t.langCode === 'hi' ? '३' : '৩',
      '4': t.langCode === 'hi' ? '४' : '৪',
      '5': t.langCode === 'hi' ? '५' : '৫',
      '6': t.langCode === 'hi' ? '৬' : '৬',
      '7': t.langCode === 'hi' ? '७' : '৭',
      '8': t.langCode === 'hi' ? '८' : '৮',
      '9': t.langCode === 'hi' ? '৯' : '৯',
    };
    return num.toString().split('').map(d => digits[d] || d).join('');
  };

  const getRiskLabel = (risk) => {
    if (risk === 'High') return t.riskHigh;
    if (risk === 'Medium') return t.riskMedium;
    return t.riskLow;
  };

  if (loading) {
    return (
      <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
        <div style={{ background: 'var(--primary)', color: 'white', padding: '12px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(162, 155, 254, 0.3)' }}>
          <HistoryIcon size={24} />
        </div>
        <div>
          <h1 className="header-title" style={{ marginBottom: '4px' }}>{t.historyTitle}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{history.length} records saved</p>
        </div>
      </div>

      {history.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <AlertCircle size={48} color="var(--text-muted)" style={{ marginBottom: '16px', opacity: 0.5 }} />
          <p style={{ color: 'var(--text-muted)', fontSize: '18px' }}>{t.noHistory}</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {history.map((item) => (
            <div 
              key={item.id} 
              className="glass-card" 
              style={{ 
                padding: '20px', 
                cursor: 'pointer', 
                transition: 'transform 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderLeft: `6px solid ${item.prediction?.risk === 'High' ? 'var(--danger)' : item.prediction?.risk === 'Medium' ? 'var(--warning)' : 'var(--success)'}`
              }}
              onClick={() => onViewResult(item.formData, item.prediction)}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(8px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '13px' }}>
                  <Calendar size={14} />
                  {formatDate(item.timestamp)}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontWeight: '700', fontSize: '18px', color: 'var(--text-main)' }}>
                    Risk: {getRiskLabel(item.prediction?.risk)}
                  </span>
                  <div style={{ height: '4px', width: '4px', borderRadius: '50%', background: '#DFE6E9' }}></div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '15px' }}>
                    {translateNumber(item.prediction?.confidence)}% {t.aiConfidence}
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button 
                  onClick={(e) => handleDelete(e, item.id)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '8px', borderRadius: '50%', transition: 'all 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--danger)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                >
                  <Trash2 size={18} />
                </button>
                <ChevronRight color="var(--text-muted)" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
