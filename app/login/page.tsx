'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  BiLockAlt, 
  BiEnvelope, 
  BiRightArrowAlt,
  BiCheckCircle,
  BiStore
} from 'react-icons/bi';

export default function LoginPage() {
  const router = useRouter();
  const { login, loginAsRole } = useAuth();

  const [email, setEmail] = useState('owner@foodpalace.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFormLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    setIsLoading(true);
    const success = login(email, password);
    if (!success) {
      setError('Invalid credentials. You can use: owner@foodpalace.com / password123');
      setIsLoading(false);
    }
  };

  const handleQuickDemo = () => {
    setEmail('owner@foodpalace.com');
    setPassword('password123');
    loginAsRole('restaurant_owner');
  };

  return (
    <div className="min-vh-100 bg-surface d-flex flex-column justify-content-between">
      {/* Top Brand Bar */}
      <header className="bg-white py-3 px-4 border-bottom border-subtle">
        <div className="container d-flex align-items-center justify-content-between">
          <Link href="/" className="d-flex align-items-center gap-2 text-decoration-none">
            <div 
              className="d-flex align-items-center justify-content-center text-white fw-bold shadow-sm"
              style={{
                width: '38px',
                height: '38px',
                fontSize: '20px',
                lineHeight: 1,
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #E63946 0%, #FF6B6B 100%)',
              }}
            >
              Z
            </div>
            <span className="fw-bold fs-4 text-navy">
              ZEST<span className="text-brand">ORA</span>
            </span>
          </Link>
          <div className="d-flex align-items-center gap-2">
            <span className="badge badge-soft-brand px-3 py-2 rounded-pill small d-none d-sm-inline">
              Restaurant POS Platform
            </span>
          </div>
        </div>
      </header>

      {/* Main Single Centered Card */}
      <main className="container my-auto py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-8 col-lg-5 col-xl-4">
            <div className="app-card p-4 p-sm-5 bg-white shadow-sm border border-subtle">
              <div className="text-center mb-4">
                <div 
                  className="d-inline-flex align-items-center justify-content-center text-white fw-bold shadow-sm mb-3"
                  style={{
                    width: '48px',
                    height: '48px',
                    fontSize: '24px',
                    lineHeight: 1,
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #E63946 0%, #FF6B6B 100%)',
                  }}
                >
                  Z
                </div>
                <h3 className="fw-bold text-navy mb-1">Welcome Back</h3>
                <p className="text-muted-custom small mb-0">
                  Sign in to your restaurant dashboard
                </p>
              </div>

              {error && (
                <div className="alert alert-danger py-2 small mb-3 rounded-3" style={{ backgroundColor: '#FFF0F3', borderColor: '#FFD1D8', color: '#E63946' }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleFormLogin}>
                <div className="mb-3">
                  <label className="form-label small fw-semibold text-navy">Email Address</label>
                  <div className="input-group">
                    <span className="input-group-text bg-surface border-subtle text-muted">
                      <BiEnvelope size={18} />
                    </span>
                    <input
                      type="email"
                      className="form-control border-subtle"
                      placeholder="owner@foodpalace.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <label className="form-label small fw-semibold text-navy mb-0">Password</label>
                    <Link href="/forgot-password" className="small text-brand text-decoration-none">
                      Forgot Password?
                    </Link>
                  </div>
                  <div className="input-group">
                    <span className="input-group-text bg-surface border-subtle text-muted">
                      <BiLockAlt size={18} />
                    </span>
                    <input
                      type="password"
                      className="form-control border-subtle"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-check mb-4">
                  <input className="form-check-input" type="checkbox" id="rememberMe" defaultChecked />
                  <label className="form-check-label small text-muted-custom" htmlFor="rememberMe">
                    Remember me for 30 days
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn btn-brand w-100 py-2 fw-semibold d-flex align-items-center justify-content-center gap-2 shadow-sm text-white"
                  style={{ minHeight: '44px' }}
                >
                  <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
                  <BiRightArrowAlt size={20} />
                </button>
              </form>

              {/* Quick Demo Access Pill */}
              <div className="mt-4 pt-3 border-top text-center">
                <button
                  type="button"
                  onClick={handleQuickDemo}
                  className="btn btn-soft-brand btn-sm w-100 d-flex align-items-center justify-content-center gap-2 py-2"
                >
                  <BiStore size={16} />
                  <span>1-Click Demo Login (Restaurant Owner)</span>
                </button>
                <div className="mt-2 text-muted-custom" style={{ fontSize: '11px' }}>
                  Auto-fills demo account: <code>owner@foodpalace.com</code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-3 text-center border-top bg-white">
        <span className="text-muted-custom small">
          Zestora &bull; Restaurant Management & POS &copy; 2026.
        </span>
      </footer>
    </div>
  );
}
