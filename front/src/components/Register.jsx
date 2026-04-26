import React, { useState } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { UserPlus, Mail, Lock, Sparkles, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

export default function Register({ onSwitch, t }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

  const getStrength = (pass) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const validatePassword = (pass) => {
    if (pass.length < 8) return "Password must be at least 8 characters.";
    if (!/[A-Z]/.test(pass)) return "Add at least one uppercase letter.";
    if (!/[0-9]/.test(pass)) return "Add at least one number.";
    if (!/[^A-Za-z0-9]/.test(pass)) return "Add at least one special character.";
    if (pass.includes(' ')) return t.noSpacesError;
    return null;
  };

  const strength = getStrength(password);
  const strengthLabels = ["Very Weak", "Weak", "Medium", "Strong"];
  const strengthColors = ["#FF7675", "#fab1a0", "#fdcb6e", "#55e6c1"];

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    
    const passError = validatePassword(password);
    if (passError) {
      setError(passError);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
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
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--text-main)' }}>Create Account</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Join us for a healthier cycle</p>
        </div>

        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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

          {/* Strength Indicator */}
          {password && (
            <div style={{ marginTop: '-10px' }}>
              <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
                {[1, 2, 3, 4].map((i) => (
                  <div 
                    key={i} 
                    style={{ 
                      flex: 1, 
                      height: '4px', 
                      borderRadius: '2px', 
                      background: i <= strength ? strengthColors[strength - 1] : 'var(--border-color)',
                      transition: 'all 0.3s'
                    }} 
                  />
                ))}
              </div>
              <p style={{ fontSize: '12px', fontWeight: '600', color: strengthColors[strength - 1] }}>
                Password is {strengthLabels[strength - 1]}
              </p>
            </div>
          )}

          {/* Password Requirements Checklist */}
          <div style={{ background: 'rgba(162, 155, 254, 0.08)', padding: '16px', borderRadius: '16px', fontSize: '13px' }}>
            <p style={{ fontWeight: '700', marginBottom: '10px', color: 'var(--text-main)', fontSize: '14px' }}>Password Requirements:</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: password.length >= 8 ? 'var(--success)' : 'var(--text-muted)' }}>
                {password.length >= 8 ? <CheckCircle2 size={14} /> : <div style={{ width: 14, height: 14, borderRadius: '50%', border: '1px solid var(--border-color)' }} />}
                8+ Characters
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: /[A-Z]/.test(password) ? 'var(--success)' : 'var(--text-muted)' }}>
                {/[A-Z]/.test(password) ? <CheckCircle2 size={14} /> : <div style={{ width: 14, height: 14, borderRadius: '50%', border: '1px solid var(--border-color)' }} />}
                Uppercase
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: /[0-9]/.test(password) ? 'var(--success)' : 'var(--text-muted)' }}>
                {/[0-9]/.test(password) ? <CheckCircle2 size={14} /> : <div style={{ width: 14, height: 14, borderRadius: '50%', border: '1px solid var(--border-color)' }} />}
                Number
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: /[^A-Za-z0-9]/.test(password) ? 'var(--success)' : 'var(--text-muted)' }}>
                {/[^A-Za-z0-9]/.test(password) ? <CheckCircle2 size={14} /> : <div style={{ width: 14, height: 14, borderRadius: '50%', border: '1px solid var(--border-color)' }} />}
                Special Char
              </div>
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type={showConfirmPassword ? "text" : "password"} 
              className="input-field" 
              placeholder="Confirm Password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value.replace(/\s/g, ''))}
              style={{ paddingLeft: '44px', paddingRight: '44px' }}
              required 
            />
            <button 
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', padding: 0 }}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && <p style={{ color: 'var(--danger)', fontSize: '13px', textAlign: 'center' }}>{error}</p>}

          <button type="submit" className="btn-primary">
            Create Account <UserPlus size={18} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            Already have an account? 
            <button onClick={onSwitch} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '600', cursor: 'pointer', padding: '0 4px' }}>
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
