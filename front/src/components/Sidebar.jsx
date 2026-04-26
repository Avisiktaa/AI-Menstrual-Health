import React from 'react';
import { 
  LayoutDashboard, 
  Activity, 
  History as HistoryIcon, 
  MessageSquare, 
  Settings, 
  LogOut, 
  ChevronLeft, 
  ChevronRight, 
  Sun, 
  Moon, 
  Sparkles,
  Calendar
} from 'lucide-react';

export default function Sidebar({ 
  step, 
  setStep, 
  theme, 
  toggleTheme, 
  onLogout, 
  collapsed, 
  setCollapsed,
  t,
  lang,
  setLang
}) {
  const menuItems = [
    { id: 0, label: t.dashboard || 'Dashboard', icon: LayoutDashboard },
    { id: 1, label: t.analyzeCycle || 'Analyze Cycle', icon: Activity },
    { id: 5, label: t.calendar || 'Calendar', icon: Calendar },
    { id: 4, label: t.historyTitle || 'History', icon: HistoryIcon },
    { id: 'chat', label: t.chatTitle || 'Chatbot', icon: MessageSquare },
  ];

  const handleNav = (id) => {
    if (id === 'chat') {
      // Trigger chatbot open or focus
      const event = new CustomEvent('open-chatbot');
      window.dispatchEvent(event);
      return;
    }
    setStep(id);
  };

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px', padding: '0 8px' }}>
        <div style={{ background: 'var(--primary)', padding: '8px', borderRadius: '12px', color: 'white' }}>
          <Sparkles size={20} />
        </div>
        {!collapsed && (
          <h1 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>
            FemHealth AI
          </h1>
        )}
      </div>

      <nav style={{ flex: 1 }}>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNav(item.id)}
            className={`sidebar-item ${step === item.id ? 'active' : ''}`}
          >
            <item.icon size={20} />
            {!collapsed && <span className="sidebar-label">{item.label}</span>}
          </button>
        ))}
      </nav>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {!collapsed && (
          <div style={{ padding: '0 8px 16px' }}>
            <select 
              value={lang} 
              onChange={(e) => setLang(e.target.value)}
              className="input-field"
              style={{ padding: '8px', fontSize: '14px' }}
            >
              <option value="en">English</option>
              <option value="hi">हिंदी</option>
              <option value="bn">বাংলা</option>
            </select>
          </div>
        )}

        <button onClick={toggleTheme} className="sidebar-item">
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          {!collapsed && <span className="sidebar-label">{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>}
        </button>

        <button onClick={() => setCollapsed(!collapsed)} className="sidebar-item">
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          {!collapsed && <span className="sidebar-label">Collapse</span>}
        </button>

        <button onClick={onLogout} className="sidebar-item logout">
          <LogOut size={20} />
          {!collapsed && <span className="sidebar-label">Logout</span>}
        </button>
      </div>
    </div>
  );
}
