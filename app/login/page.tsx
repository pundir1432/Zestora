'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { DEMO_ACCOUNTS } from '@/data/authData';
import { UserRole } from '@/types/auth';
import { 
  BiShieldQuarter, 
  BiStore, 
  BiBuilding, 
  BiCreditCard, 
  BiLockAlt, 
  BiEnvelope, 
  BiRightArrowAlt,
  BiCheckCircle,
  BiUser,
  BiCalculator
} from 'react-icons/bi';
import { MdOutlinePointOfSale, MdTableRestaurant } from 'react-icons/md';
import { TbToolsKitchen2 } from 'react-icons/tb';

export default function LoginPage() {
  const router = useRouter();
  const { loginAsRole, login } = useAuth();

  const [email, setEmail] = useState('owner@foodpalace.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');

  const handleFormLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    const success = login(email, password);
    if (!success) {
      setError('Invalid credentials');
    }
  };

  const handleQuickLogin = (role: UserRole) => {
    loginAsRole(role);
  };

  const getRoleIcon = (r: UserRole) => {
    switch (r) {
      case 'super_admin': return BiShieldQuarter;
      case 'restaurant_owner': return BiStore;
      case 'branch_manager': return BiBuilding;
      case 'cashier': return MdOutlinePointOfSale;
      case 'waiter': return MdTableRestaurant;
      case 'kitchen_staff': return TbToolsKitchen2;
      case 'accountant': return BiCalculator;
      default: return BiUser;
    }
  };

  return (
    <div className="min-vh-100 bg-surface d-flex flex-column justify-content-between">
      {/* Top Brand Bar */}
      <header className="bg-navy py-3 px-4 border-bottom border-secondary border-opacity-25">
        <div className="container d-flex align-items-center justify-content-between">
          <Link href="/" className="d-flex align-items-center gap-2 text-decoration-none">
            <div 
              className="d-flex align-items-center justify-content-center rounded-3 bg-brand text-white fw-bold shadow-sm"
              style={{ width: '38px', height: '38px', fontSize: '20px' }}
            >
              Z
            </div>
            <span className="fw-bold fs-4 text-white">
              ZEST<span className="text-brand">ORA</span>
            </span>
          </Link>
          <div className="d-flex align-items-center gap-2">
            <span className="badge badge-soft-brand px-3 py-2 rounded-pill small d-none d-sm-inline">
              Multi-Tenant Restaurant SaaS
            </span>
            <Link href="/register" className="btn btn-sm btn-brand text-white px-3 shadow-sm">
              Register Business
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container my-auto py-5">
        <div className="row justify-content-center align-items-center g-4">
          {/* Left Column: Form & Welcome */}
          <div className="col-12 col-lg-5">
            <div className="app-card p-3 p-sm-4 p-md-5 bg-white shadow-lg rounded-4">
              <div className="mb-4">
                <span className="badge bg-brand text-white text-uppercase rounded-pill px-3 py-1 mb-2" style={{ fontSize: '11px' }}>
                  Tenant Access Portal
                </span>
                <h3 className="fw-bold text-navy mb-1">Welcome to Zestora</h3>
                <p className="text-muted-custom small">
                  Sign in to your business workspace or select a 1-click demo role on the right.
                </p>
              </div>

              {error && (
                <div className="alert alert-danger py-2 small mb-3 rounded-2">
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
                      placeholder="e.g. owner@foodpalace.com"
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
                  className="btn btn-brand w-100 py-2.5 fw-semibold d-flex align-items-center justify-content-center gap-2 shadow-sm text-white"
                >
                  <span>Sign In to Dashboard</span>
                  <BiRightArrowAlt size={20} />
                </button>
              </form>

              <div className="pt-4 mt-4 border-top text-center">
                <span className="small text-muted-custom">New business owner? </span>
                <Link href="/register" className="small fw-bold text-brand text-decoration-none">
                  Register your business & start free trial
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: 1-Click Role Accounts */}
          <div className="col-12 col-lg-7">
            <div className="app-card p-3 p-sm-4 p-md-5 bg-white shadow-lg rounded-4">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div>
                  <h5 className="fw-bold text-navy mb-1">Interactive 1-Click Role Testing</h5>
                  <p className="text-muted-custom small mb-0">
                    Click any pre-configured persona below to immediately experience tenant role-based permissions.
                  </p>
                </div>
                <span className="badge badge-soft-success d-none d-sm-inline-block">Instant Demo</span>
              </div>

              <div className="row g-2">
                {DEMO_ACCOUNTS.map((account) => {
                  const Icon = getRoleIcon(account.role);
                  return (
                    <div key={account.role} className="col-12 col-sm-6">
                      <button
                        type="button"
                        onClick={() => handleQuickLogin(account.role)}
                        className="btn btn-outline-light text-start p-3 w-100 h-100 rounded-3 border transition-all hover-border-brand position-relative"
                        style={{ backgroundColor: '#FAFBFD' }}
                      >
                        <div className="d-flex align-items-start gap-2 mb-2">
                          <div className="p-2 rounded-2 bg-white border border-subtle shadow-2xs text-brand">
                            <Icon size={20} />
                          </div>
                          <div className="overflow-hidden flex-grow-1">
                            <span className="fw-bold text-navy d-block text-truncate small">
                              {account.name}
                            </span>
                            <span className="text-muted-custom small d-block" style={{ fontSize: '11px' }}>
                              {account.roleTitle}
                            </span>
                          </div>
                        </div>

                        <p className="text-muted-custom small mb-2 line-clamp-2" style={{ fontSize: '11px' }}>
                          {account.description}
                        </p>

                        <div className="d-flex align-items-center justify-content-between pt-1 border-top border-subtle">
                          <span className={`badge ${account.badgeColor}`} style={{ fontSize: '10px' }}>
                            {account.role.replace('_', ' ')}
                          </span>
                          <span className="text-brand small fw-semibold" style={{ fontSize: '11px' }}>
                            Sign in &rarr;
                          </span>
                        </div>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-3 text-center border-top bg-white">
        <span className="text-muted-custom small">
          Zestora Multi-Tenant Restaurant SaaS Platform &copy; 2026. Frontend demo with reactive tenant state.
        </span>
      </footer>
    </div>
  );
}
