'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BiEnvelope, BiCheckCircle, BiRightArrowAlt, BiLockAlt, BiArrowBack } from 'react-icons/bi';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('owner@foodpalace.com');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
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
          <Link href="/login" className="btn btn-sm btn-outline-light px-3">
            Back to Sign In
          </Link>
        </div>
      </header>

      {/* Main Form */}
      <main className="container my-auto py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-6 col-lg-5">
            <div className="app-card p-4 p-md-5 bg-white shadow-lg rounded-4">
              <div className="text-center mb-4">
                <div className="mx-auto bg-brand bg-opacity-10 text-brand p-3 rounded-circle mb-3 d-inline-flex">
                  <BiLockAlt size={36} />
                </div>
                <h4 className="fw-bold text-navy mb-1">Recover Your Password</h4>
                <p className="text-muted-custom small">
                  Enter your registered business account email and we will send a password reset link.
                </p>
              </div>

              {submitted ? (
                <div className="text-center">
                  <div className="alert alert-success py-3 rounded-3 mb-4 text-start">
                    <div className="d-flex align-items-start gap-2">
                      <BiCheckCircle size={22} className="text-success flex-shrink-0 mt-0.5" />
                      <div>
                        <strong>Password Reset Link Dispatched!</strong>
                        <p className="small mb-0 mt-1">
                          We sent password reset instructions to <strong>{email}</strong>. For this demo, click below to open the reset screen directly.
                        </p>
                      </div>
                    </div>
                  </div>

                  <Link
                    href={`/reset-password?email=${encodeURIComponent(email)}&token=demo-reset-9921`}
                    className="btn btn-brand w-100 py-2.5 fw-semibold d-flex align-items-center justify-content-center gap-2 shadow-sm text-white mb-3"
                  >
                    <span>Proceed to Reset Password</span>
                    <BiRightArrowAlt size={20} />
                  </Link>

                  <button
                    type="button"
                    className="btn btn-sm btn-link text-muted"
                    onClick={() => setSubmitted(false)}
                  >
                    Try another email address
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="form-label small fw-semibold text-navy">Account Email Address</label>
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

                  <button
                    type="submit"
                    className="btn btn-brand w-100 py-2.5 fw-semibold d-flex align-items-center justify-content-center gap-2 shadow-sm text-white mb-3"
                  >
                    <span>Send Recovery Instructions</span>
                    <BiRightArrowAlt size={20} />
                  </button>

                  <div className="text-center pt-2">
                    <Link href="/login" className="small text-muted text-decoration-none d-inline-flex align-items-center gap-1">
                      <BiArrowBack size={16} />
                      <span>Back to Sign In</span>
                    </Link>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-3 text-center border-top bg-white">
        <span className="text-muted-custom small">
          Zestora Multi-Tenant SaaS Platform &copy; 2026.
        </span>
      </footer>
    </div>
  );
}
