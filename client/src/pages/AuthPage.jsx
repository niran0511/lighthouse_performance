import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { api, readApiError } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { Logo } from '../components/Logo.jsx';

export function AuthPage({ mode }) {
  const isRegister = mode === 'register';
  const { isAuthenticated, authenticate } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const handleChange = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    if (isRegister && form.name.trim().length < 2) { setError('Please enter your name.'); return; }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) { setError('Enter a valid email address.'); return; }
    if (form.password.length < 8) { setError('Your password must contain at least 8 characters.'); return; }
    setIsSubmitting(true);
    try {
      const endpoint = isRegister ? '/auth/register' : '/auth/login';
      const { data } = await api.post(endpoint, isRegister ? form : { email: form.email, password: form.password });
      authenticate(data);
      navigate(location.state?.from?.pathname || '/dashboard', { replace: true });
    } catch (requestError) {
      setError(readApiError(requestError));
    } finally { setIsSubmitting(false); }
  };

  return <div className="auth-layout">
    <section className="auth-intro"><div className="auth-brand"><Logo /><span>Lighthouse<span>Monitor</span></span></div><div className="intro-content"><span className="eyebrow">Performance intelligence</span><h1>Find the friction<br />before your users do.</h1><p>Continuous, actionable Lighthouse analysis for teams that care about a fast web.</p><div className="intro-stats"><div><strong>5</strong><span>Core Web Vitals</span></div><div><strong>4</strong><span>Quality dimensions</span></div><div><strong>1</strong><span>Clear next step</span></div></div></div><p className="intro-foot">Built for QA and performance engineering teams.</p></section>
    <main className="auth-main"><div className="auth-card"><div className="auth-card-head"><span className="eyebrow">{isRegister ? 'Get started' : 'Welcome back'}</span><h2>{isRegister ? 'Create your workspace' : 'Sign in to your workspace'}</h2><p>{isRegister ? 'Start turning performance data into purposeful improvements.' : 'Enter your details to continue monitoring.'}</p></div><form onSubmit={handleSubmit} noValidate>{isRegister && <label className="form-field">Name<input name="name" autoComplete="name" placeholder="Your name" value={form.name} onChange={handleChange} /></label>}<label className="form-field">Email address<input name="email" type="email" autoComplete="email" placeholder="you@company.com" value={form.email} onChange={handleChange} /></label><label className="form-field">Password<input name="password" type="password" autoComplete={isRegister ? 'new-password' : 'current-password'} placeholder="At least 8 characters" value={form.password} onChange={handleChange} /></label>{error && <p className="form-alert" role="alert">{error}</p>}<button className="button primary wide" disabled={isSubmitting}>{isSubmitting ? 'Please wait…' : isRegister ? 'Create account' : 'Sign in'} <span aria-hidden="true">→</span></button></form><p className="auth-switch">{isRegister ? 'Already have an account?' : 'New to Lighthouse Monitor?'} <Link to={isRegister ? '/login' : '/register'}>{isRegister ? 'Sign in' : 'Create an account'}</Link></p></div></main>
  </div>;
}

