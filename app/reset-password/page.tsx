'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { BiLockAlt, BiCheckCircle, BiRightArrowAlt } from 'react-icons/bi';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || 'owner@foodpalace.com';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      router.push('/login');
    }, 1800);
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
            Sign In
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
                <h4 className="fw-bold text-navy mb-1">Set New Password</h4>
                <p className="text-muted-custom small">
                  Create a new secure password for <strong className="text-navy">{email}</strong>
                </p>
              </div>

              {error && (
                <div className="alert alert-danger py-2 small mb-3 rounded-2">
                  {error}
                </div>
              )}

              {success ? (
                <div className="alert alert-success py-3 rounded-3 text-center">
                  <BiCheckCircle size={32} className="text-success mb-2 d-block mx-auto" />
                  <strong>Password Updated Successfully!</strong>
                  <p className="small mb-0 mt-1">Redirecting you to the sign-in screen...</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-navy">New Password</label>
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

                  <div className="mb-4">
                    <label className="form-label small fw-semibold text-navy">Confirm New Password</label>
                    <div className="input-group">
                      <span className="input-group-text bg-surface border-subtle text-muted">
                        <BiLockAlt size={18} />
                      </span>
                      <input
                        type="password"
                        className="form-control border-subtle"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-brand w-100 py-2 fw-semibold d-flex align-items-center justify-content-center gap-2 shadow-sm text-white"
                  >
                    <span>Update Password & Sign In</span>
                    <BiRightArrowAlt size={20} />
                  </button>
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="p-5 text-center">Loading reset screen...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
