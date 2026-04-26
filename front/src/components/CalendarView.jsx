import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, query, where, getDocs, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus, Trash2, Check } from 'lucide-react';

export default function CalendarView({ t }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [markedDates, setMarkedDates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get month data
  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  useEffect(() => {
    fetchMarkedDates();
  }, [currentDate]);

  const fetchMarkedDates = async () => {
    if (!auth.currentUser) return;
    setLoading(true);
    try {
      const q = query(
        collection(db, 'period_dates'),
        where('userId', '==', auth.currentUser.uid)
      );
      const querySnapshot = await getDocs(q);
      const dates = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMarkedDates(dates);
    } catch (err) {
      console.error("Error fetching dates:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const toggleDate = async (day) => {
    if (!auth.currentUser) return;
    
    const clickedDate = new Date(year, month, day).toISOString().split('T')[0];
    const existing = markedDates.find(d => d.date === clickedDate);

    if (existing) {
      // Delete
      try {
        await deleteDoc(doc(db, 'period_dates', existing.id));
        setMarkedDates(prev => prev.filter(d => d.id !== existing.id));
      } catch (err) {
        console.error(err);
      }
    } else {
      // Add
      try {
        const newDoc = await addDoc(collection(db, 'period_dates'), {
          userId: auth.currentUser.uid,
          date: clickedDate,
          timestamp: serverTimestamp()
        });
        setMarkedDates(prev => [...prev, { id: newDoc.id, date: clickedDate }]);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const isMarked = (day) => {
    const dateStr = new Date(year, month, day).toISOString().split('T')[0];
    return markedDates.some(d => d.date === dateStr);
  };

  const isToday = (day) => {
    const today = new Date();
    return today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
  };

  return (
    <div className="container animate-fade-in" style={{ maxWidth: '600px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
        <div style={{ background: 'var(--primary)', color: 'white', padding: '12px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(162, 155, 254, 0.3)' }}>
          <CalendarIcon size={24} />
        </div>
        <div>
          <h1 className="header-title" style={{ marginBottom: '4px' }}>{t.calendar}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{t.markPeriod}</p>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '24px' }}>
        {/* Calendar Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <button onClick={handlePrevMonth} className="btn-secondary" style={{ padding: '8px' }}>
            <ChevronLeft size={20} />
          </button>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-main)' }}>
            {monthNames[month]} {year}
          </h2>
          <button onClick={handleNextMonth} className="btn-secondary" style={{ padding: '8px' }}>
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Days of Week */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', marginBottom: '12px', textAlign: 'center' }}>
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
            <div key={d} style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{d}</div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
          {Array(firstDay).fill(null).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => (
            <div 
              key={day} 
              onClick={() => toggleDate(day)}
              style={{
                aspectRatio: '1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '15px',
                fontWeight: '600',
                transition: 'all 0.2s',
                position: 'relative',
                background: isMarked(day) ? 'var(--primary)' : isToday(day) ? 'rgba(162, 155, 254, 0.1)' : 'transparent',
                color: isMarked(day) ? 'white' : 'var(--text-main)',
                border: isToday(day) ? '2px solid var(--primary)' : '1px solid transparent'
              }}
              onMouseEnter={(e) => {
                if (!isMarked(day)) e.currentTarget.style.background = 'var(--primary-light)';
              }}
              onMouseLeave={(e) => {
                if (!isMarked(day)) e.currentTarget.style.background = isToday(day) ? 'rgba(162, 155, 254, 0.1)' : 'transparent';
              }}
            >
              {day}
              {isMarked(day) && (
                <div style={{ position: 'absolute', top: '4px', right: '4px' }}>
                  <Check size={8} strokeWidth={4} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Legend / Stats */}
      <div style={{ marginTop: '24px', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>
          <div style={{ width: '12px', height: '12px', background: 'var(--primary)', borderRadius: '3px' }}></div>
          {t.markedDates}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>
          <div style={{ width: '12px', height: '12px', border: '2px solid var(--primary)', borderRadius: '3px' }}></div>
          {t.today}
        </div>
      </div>
    </div>
  );
}
