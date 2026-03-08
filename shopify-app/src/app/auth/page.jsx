'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AuthPage() {
  const router = useRouter();
  const { login, register, error, loading } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [showPass, setShowPass] = useState(false);

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '',
  });

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    let success;
    if (mode === 'login') {
      success = await login(form.email, form.password);
    } else {
      success = await register(form.firstName, form.lastName, form.email, form.password);
    }
    if (success) router.push('/profile');
  }

  return (
    <div className="page-container max-w-md mx-auto">
      {/* Back */}
      <Link href="/" className="back-btn mb-6">
        <ArrowLeft size={20} />
        <span>Back to Home</span>
      </Link>

      {/* Logo */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-black" style={{ color: '#1C1C1E' }}>
          Quick<span style={{ color: '#FFC107' }}>bee</span> 🐝
        </h1>
        <p className="text-sm mt-1" style={{ color: '#8A8A8E' }}>Delivery in minutes</p>
      </div>

      {/* Card */}
      <div className="auth-card">
        {/* Tabs */}
        <div className="auth-tabs">
          <button
            className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
            onClick={() => setMode('login')}
          >
            Login
          </button>
          <button
            className={`auth-tab ${mode === 'register' ? 'active' : ''}`}
            onClick={() => setMode('register')}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          {mode === 'register' && (
            <div className="grid grid-cols-2 gap-3">
              <div className="form-field">
                <label className="form-label">First Name</label>
                <input
                  name="firstName" type="text" required
                  value={form.firstName} onChange={handleChange}
                  className="form-input" placeholder="Rahul"
                />
              </div>
              <div className="form-field">
                <label className="form-label">Last Name</label>
                <input
                  name="lastName" type="text" required
                  value={form.lastName} onChange={handleChange}
                  className="form-input" placeholder="Sharma"
                />
              </div>
            </div>
          )}

          <div className="form-field">
            <label className="form-label">Email</label>
            <input
              name="email" type="email" required
              value={form.email} onChange={handleChange}
              className="form-input" placeholder="you@example.com"
            />
          </div>

          <div className="form-field">
            <label className="form-label">Password</label>
            <div className="relative">
              <input
                name="password" type={showPass ? 'text' : 'password'} required
                value={form.password} onChange={handleChange}
                className="form-input pr-10" placeholder="••••••••"
                minLength={5}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: '#8A8A8E' }}
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm bg-red-50 p-3 rounded-xl">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-green w-full py-3.5 rounded-xl font-bold text-base disabled:opacity-60"
          >
            {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm mt-4" style={{ color: '#8A8A8E' }}>
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            className="font-semibold" style={{ color: '#1DB954' }}
          >
            {mode === 'login' ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
}
