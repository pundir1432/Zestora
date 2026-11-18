'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { BiEnvelope, BiCheckCircle, BiRightArrowAlt, BiRefresh } from 'react-icons/bi';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || 'owner@restaurant.com';
  const name = searchParams.get('name') || 'Business Owner';
  const phone = searchParams.get('phone') || '+91 98765 43210';

  const [otp, setOtp] = useState(['8', '4', '9', '2', '0', '1']);
  const [success, setSuccess] = useState(false);
  const [resendNotice, setResendNotice] = useState(false);

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) val = val[0];
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => {
      router.push(`/verify-otp?phone=${encodeURIComponent(phone)}&email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}`);
    }, 1000);
  };

  const handleResend = () => {
    setResendNotice(true);
    setTimeout(() => setResendNotice(false), 3000);
  };

  return (
    <div className="min-vh-100 bg-surface d-flex flex-column justify-content-between">
      {/* Header */}
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
          <span className="badge badge-soft-brand px-3 py-2 rounded-pill small">
            Email Verification
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="container my-auto py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-6 col-lg-5">
            <div className="app-card p-3 p-sm-4 p-md-5 bg-white shadow-lg rounded-4 text-center">
              <div className="mx-auto bg-brand bg-opacity-10 text-brand p-3 rounded-circle mb-3 d-inline-flex">
                <BiEnvelope size={36} />
              </div>

              <h4 className="fw-bold text-navy mb-1">Verify Your Email Address</h4>
              <p className="text-muted-custom small mb-4">
                We sent a 6-digit confirmation code to <br />
                <strong className="text-navy">{email}</strong>
              </p>

              {success ? (
                <div className="alert alert-success d-flex align-items-center justify-content-center gap-2 py-3 rounded-3">
                  <BiCheckCircle size={22} />
                  <strong>Email Verified! Redirecting to setup wizard...</strong>
                </div>
              ) : (
                <form onSubmit={handleVerify}>
                  <div className="d-flex justify-content-center gap-1 gap-sm-2 mb-4">
                    {otp.map((digit, idx) => (
                      <input
                        key={idx}
                        type="text"
                        maxLength={1}
                        inputMode="numeric"
                        className="form-control text-center fs-5 fs-sm-4 fw-bold border-2 text-navy"
                        style={{ width: 'clamp(36px, 11vw, 48px)', height: 'clamp(44px, 13vw, 56px)', borderRadius: '8px', padding: '0' }}
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        required
                      />
                    ))}
                  </div>

                  <button
                    type="submit"
                    className="btn btn-brand w-100 py-2 fw-semibold d-flex align-items-center justify-content-center gap-2 shadow-sm text-white mb-3"
                  >
                    <span>Verify & Continue Setup</span>
                    <BiRightArrowAlt size={20} />
                  </button>

                  <div className="d-flex align-items-center justify-content-between pt-2">
                    <button
                      type="button"
                      className="btn btn-sm btn-link text-brand p-0 text-decoration-none"
                      onClick={() => setOtp(['8', '4', '9', '2', '0', '1'])}
                    >
                      Fill Demo Code (849201)
                    </button>

                    <button
                      type="button"
                      className="btn btn-sm btn-link text-muted p-0 text-decoration-none d-flex align-items-center gap-1"
                      onClick={handleResend}
                    >
                      <BiRefresh size={16} />
                      <span>{resendNotice ? 'Code Resent!' : 'Resend Code'}</span>
                    </button>
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

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="p-5 text-center">Loading verification screen...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
