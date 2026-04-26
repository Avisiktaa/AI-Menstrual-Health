import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { LogIn, Mail, Lock, ArrowRight, Sparkles, AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';

export default function Login({ onSwitch, t }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const validatePassword = (pass) => {
    if (pass.length < 6) return t.passwordError;
    if (pass.includes(' ')) return t.noSpacesError;
    return null;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const passError = validatePassword(password);
    if (passError) {
      setError(passError);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError("Please enter your email first.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(t.resetEmailSent);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '16px' }}>
            <Sparkles color="var(--primary)" size={28} />
            <h1 className="header-title" style={{ marginBottom: 0 }}>{t.appTitle}</h1>
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--text-main)' }}>Welcome Back</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Please login to your account</p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ position: 'relative' }}>
            <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="email" 
              className="input-field" 
              placeholder="Email Address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ paddingLeft: '44px' }}
              required 
            />
          </div>
          <div style={{ position: 'relative' }}>
            <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type={showPassword ? "text" : "password"} 
              className="input-field" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value.replace(/\s/g, ''))}
              style={{ paddingLeft: '44px', paddingRight: '44px' }}
              required 
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', padding: 0 }}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button 
              type="button" 
              onClick={handleResetPassword}
              style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '13px', fontWeight: '500', cursor: 'pointer', padding: 0 }}
            >
              {t.forgotPassword}
            </button>
          </div>

          {error && (
            <div style={{ color: 'var(--danger)', fontSize: '13px', textAlign: 'center', display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
              <AlertCircle size={14} /> {error}
            </div>
          )}
          {success && (
            <div style={{ color: 'var(--success)', fontSize: '13px', textAlign: 'center', display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
              <CheckCircle2 size={14} /> {success}
            </div>
          )}

          <button type="submit" className="btn-primary">
            Login <LogIn size={18} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            Don't have an account? 
            <button onClick={onSwitch} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '600', cursor: 'pointer', padding: '0 4px' }}>
              Register
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
