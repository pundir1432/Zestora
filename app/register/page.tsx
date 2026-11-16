'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { BusinessType } from '@/types/restaurant';
import { BUSINESS_TYPES_META } from '@/data/businessTypesData';
import { 
  BiStore, 
  BiUser, 
  BiEnvelope, 
  BiPhone, 
  BiLockAlt, 
  BiBuilding, 
  BiMapPin, 
  BiRightArrowAlt,
  BiCheckCircle,
  BiLayer
} from 'react-icons/bi';

export default function RegisterPage() {
  const router = useRouter();
  const { registerBusiness, saveOnboardingDraft } = useAuth();

  const [ownerName, setOwnerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState<BusinessType>('Cafe / Coffee Shop');
  const [businessCategory, setBusinessCategory] = useState('Beverages & Bakery');
  const [branchCount, setBranchCount] = useState<number>(1);
  const [businessAddress, setBusinessAddress] = useState('');
  const [city, setCity] = useState('Bengaluru');
  const [state, setState] = useState('Karnataka');
  const [error, setError] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownerName || !email || !phone || !password || !businessName) {
      setError('Please fill in all required fields.');
      return;
    }

    // Save initial registration data into onboarding draft
    saveOnboardingDraft({
      step: 1,
      ownerName,
      ownerEmail: email,
      ownerPhone: phone,
      businessName,
      businessType,
      businessCategory,
      branchCount,
      businessAddress,
      city,
      state,
    });

    // Also register the business in the multi-tenant store
    registerBusiness({
      ownerName,
      ownerEmail: email,
      ownerPhone: phone,
      password,
      businessName,
      businessType,
      businessCategory,
      branchCount,
      businessAddress,
      city,
      state,
      subscriptionPlan: 'Free Trial',
    });

    // Redirect to Email Verification screen
    router.push(`/verify-email?email=${encodeURIComponent(email)}&name=${encodeURIComponent(ownerName)}&phone=${encodeURIComponent(phone)}`);
  };

  return (
    <div className="min-vh-100 bg-surface d-flex flex-column justify-content-between">
      {/* Top Header */}
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
            <span className="text-white-50 small d-none d-sm-inline">Already have an account?</span>
            <Link href="/login" className="btn btn-sm btn-outline-light px-3">
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Main Form */}
      <main className="container my-auto py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8 col-xl-7">
            <div className="app-card p-4 p-md-5 bg-white shadow-lg rounded-4">
              <div className="text-center mb-4">
                <span className="badge bg-brand text-white text-uppercase rounded-pill px-3 py-1 mb-2" style={{ fontSize: '11px' }}>
                  14-Day Free SaaS Trial • No Card Required
                </span>
                <h3 className="fw-bold text-navy mb-1">Register Your Food Business</h3>
                <p className="text-muted-custom small">
                  Join 15,000+ restaurants, cafes, cloud kitchens and bakeries scaling with Zestora SaaS.
                </p>
              </div>

              {error && (
                <div className="alert alert-danger py-2 small mb-3 rounded-2">
                  {error}
                </div>
              )}

              <form onSubmit={handleRegister}>
                {/* SECTION 1: OWNER IDENTITY */}
                <h6 className="fw-bold text-navy text-uppercase small pb-2 border-bottom border-subtle mb-3 d-flex align-items-center gap-2">
                  <BiUser className="text-brand" size={18} /> Owner Information
                </h6>

                <div className="row g-3 mb-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold text-navy">Full Name *</label>
                    <div className="input-group">
                      <span className="input-group-text bg-surface border-subtle text-muted">
                        <BiUser size={18} />
                      </span>
                      <input
                        type="text"
                        className="form-control border-subtle"
                        placeholder="e.g. Vikram Singhania"
                        value={ownerName}
                        onChange={(e) => setOwnerName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold text-navy">Email Address *</label>
                    <div className="input-group">
                      <span className="input-group-text bg-surface border-subtle text-muted">
                        <BiEnvelope size={18} />
                      </span>
                      <input
                        type="email"
                        className="form-control border-subtle"
                        placeholder="owner@yourrestaurant.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold text-navy">Mobile Number *</label>
                    <div className="input-group">
                      <span className="input-group-text bg-surface border-subtle text-muted">
                        <BiPhone size={18} />
                      </span>
                      <input
                        type="tel"
                        className="form-control border-subtle"
                        placeholder="+91 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold text-navy">Password *</label>
                    <div className="input-group">
                      <span className="input-group-text bg-surface border-subtle text-muted">
                        <BiLockAlt size={18} />
                      </span>
                      <input
                        type="password"
                        className="form-control border-subtle"
                        placeholder="At least 8 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* SECTION 2: BUSINESS DETAILS */}
                <h6 className="fw-bold text-navy text-uppercase small pb-2 border-bottom border-subtle mb-3 mt-4 d-flex align-items-center gap-2">
                  <BiStore className="text-brand" size={18} /> Business Profile & Format
                </h6>

                <div className="row g-3 mb-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold text-navy">Business / Brand Name *</label>
                    <div className="input-group">
                      <span className="input-group-text bg-surface border-subtle text-muted">
                        <BiStore size={18} />
                      </span>
                      <input
                        type="text"
                        className="form-control border-subtle"
                        placeholder="e.g. The Roastery Cafe or Cloud Kitchen Central"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold text-navy">Business Type *</label>
                    <div className="input-group">
                      <span className="input-group-text bg-surface border-subtle text-muted">
                        <BiLayer size={18} />
                      </span>
                      <select
                        className="form-select border-subtle fw-semibold text-navy"
                        value={businessType}
                        onChange={(e) => setBusinessType(e.target.value as BusinessType)}
                      >
                        {BUSINESS_TYPES_META.map(b => (
                          <option key={b.type} value={b.type}>
                            {b.type} ({b.category})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold text-navy">Primary Cuisine / Category</label>
                    <input
                      type="text"
                      className="form-control border-subtle"
                      placeholder="e.g. Specialty Coffee, Artisan Bakery, North Indian"
                      value={businessCategory}
                      onChange={(e) => setBusinessCategory(e.target.value)}
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold text-navy">Initial Number of Outlets</label>
                    <input
                      type="number"
                      min={1}
                      max={50}
                      className="form-control border-subtle"
                      value={branchCount}
                      onChange={(e) => setBranchCount(Number(e.target.value))}
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label small fw-semibold text-navy">Main Outlet Address</label>
                    <div className="input-group">
                      <span className="input-group-text bg-surface border-subtle text-muted">
                        <BiMapPin size={18} />
                      </span>
                      <input
                        type="text"
                        className="form-control border-subtle"
                        placeholder="100 Feet Road, HAL 2nd Stage, Indiranagar"
                        value={businessAddress}
                        onChange={(e) => setBusinessAddress(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="col-6">
                    <label className="form-label small fw-semibold text-navy">City</label>
                    <input
                      type="text"
                      className="form-control border-subtle"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>

                  <div className="col-6">
                    <label className="form-label small fw-semibold text-navy">State</label>
                    <input
                      type="text"
                      className="form-control border-subtle"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-check mb-4 mt-3">
                  <input className="form-check-input" type="checkbox" id="termsCheck" defaultChecked required />
                  <label className="form-check-label small text-muted-custom" htmlFor="termsCheck">
                    I agree to the <Link href="#" className="text-brand text-decoration-none">Terms of Service</Link> and <Link href="#" className="text-brand text-decoration-none">Privacy Policy</Link>.
                  </label>
                </div>

                <button
                  type="submit"
                  className="btn btn-brand w-100 py-2.5 fw-semibold d-flex align-items-center justify-content-center gap-2 shadow-sm text-white"
                >
                  <span>Create Account & Continue to Onboarding</span>
                  <BiRightArrowAlt size={20} />
                </button>
              </form>

              <div className="pt-4 mt-4 border-top text-center">
                <span className="small text-muted-custom">Already have an account? </span>
                <Link href="/login" className="small fw-bold text-brand text-decoration-none">
                  Sign in here
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-3 text-center border-top bg-white">
        <span className="text-muted-custom small">
          Zestora Multi-Tenant Restaurant SaaS Platform &copy; 2026.
        </span>
      </footer>
    </div>
  );
}
