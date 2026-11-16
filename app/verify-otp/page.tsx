'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  BiPhone, 
  BiCheckCircle, 
  BiRightArrowAlt, 
  BiRefresh, 
  BiCheckShield, 
  BiChat,
  BiEditAlt 
} from 'react-icons/bi';

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = searchParams.get('phone') || '+91 98765 43210';
  const email = searchParams.get('email') || 'owner@restaurant.com';
  const name = searchParams.get('name') || 'Business Owner';

  const { setSubscriptionStatus } = useAuth();

  const [otp, setOtp] = useState(['5', '2', '9', '1', '4', '3']);
  const [success, setSuccess] = useState(false);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [whatsappSent, setWhatsappSent] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleOtpChange = (index: number, value: string) => {
    // Only accept numeric
    const cleanVal = value.replace(/[^0-9]/g, '');
    if (!cleanVal && value !== '') return;

    const newOtp = [...otp];
    if (cleanVal.length > 1) {
      // Paste handling
      const pasted = cleanVal.slice(0, 6).split('');
      for (let i = 0; i < 6; i++) {
        if (pasted[i]) newOtp[i] = pasted[i];
      }
      setOtp(newOtp);
      const nextIndex = Math.min(pasted.length, 5);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    newOtp[index] = cleanVal;
    setOtp(newOtp);

    // Auto advance
    if (cleanVal && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
    // Ensure subscription is set to Trial
    setSubscriptionStatus('Trial');

    setTimeout(() => {
      router.push('/onboarding');
    }, 1200);
  };

  const handleResend = () => {
    setTimer(30);
    setCanResend(false);
  };

  const handleSendWhatsApp = () => {
    setWhatsappSent(true);
    setTimeout(() => setWhatsappSent(false), 4000);
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
          <div className="d-flex align-items-center gap-2">
            <span className="badge bg-success bg-opacity-25 text-success border border-success border-opacity-50 px-3 py-1.5 rounded-pill small fw-semibold">
              Step 2 of 3 • Mobile OTP
            </span>
          </div>
        </div>
      </header>

      {/* Main Form */}
      <main className="container my-auto py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-7 col-lg-5">
            <div className="app-card p-3 p-sm-4 p-md-5 bg-white shadow-lg rounded-4 text-center">
              <div className="mx-auto bg-brand bg-opacity-10 text-brand p-3 rounded-circle mb-3 d-inline-flex">
                <BiPhone size={36} />
              </div>

              <span className="badge bg-brand text-white rounded-pill px-3 py-1 mb-2 small text-uppercase">
                Instant 7-Day Free Trial
              </span>
              <h4 className="fw-bold text-navy mb-1">Verify Mobile Number</h4>
              <p className="text-muted-custom small mb-2">
                We sent a 6-digit SMS verification code to
              </p>
              <div className="d-inline-flex align-items-center gap-2 px-3 py-1 bg-light rounded-pill border mb-4">
                <strong className="text-navy">{phone}</strong>
                <Link href="/register" className="text-brand text-decoration-none small" title="Change Phone Number">
                  <BiEditAlt size={16} />
                </Link>
              </div>

              {whatsappSent && (
                <div className="alert alert-success py-2 small mb-3 rounded-3 d-flex align-items-center justify-content-center gap-2">
                  <BiChat size={18} />
                  <span>OTP also dispatched via WhatsApp to {phone}!</span>
                </div>
              )}

              {success ? (
                <div className="alert alert-success py-4 rounded-3 text-center">
                  <div className="text-success mb-2">
                    <BiCheckCircle size={44} />
                  </div>
                  <h6 className="fw-bold mb-1">Mobile Verified Successfully!</h6>
                  <p className="small text-muted mb-0">
                    Activating your 7-Day full access Free Trial...
                  </p>
                </div>
              ) : (
                <form onSubmit={handleVerify}>
                  {/* 6 Digit OTP Inputs */}
                  <div className="d-flex justify-content-center gap-1 gap-sm-2 mb-4">
                    {otp.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => { inputRefs.current[idx] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        className="form-control text-center fs-5 fs-sm-4 fw-bold border-2 text-navy"
                        style={{ width: 'clamp(36px, 11vw, 48px)', height: 'clamp(44px, 13vw, 56px)', borderRadius: '8px', padding: '0' }}
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(idx, e)}
                        required
                      />
                    ))}
                  </div>

                  <button
                    type="submit"
                    className="btn btn-brand w-100 py-2.5 fw-semibold d-flex align-items-center justify-content-center gap-2 shadow-sm text-white mb-3"
                  >
                    <span>Verify & Start 7-Day Free Trial</span>
                    <BiRightArrowAlt size={20} />
                  </button>

                  <div className="d-flex align-items-center justify-content-between pt-2 border-top">
                    <button
                      type="button"
                      className="btn btn-sm btn-link text-brand p-0 text-decoration-none fw-semibold"
                      onClick={() => setOtp(['5', '2', '9', '1', '4', '3'])}
                    >
                      Fill Demo OTP (529143)
                    </button>

                    <div>
                      {canResend ? (
                        <button
                          type="button"
                          className="btn btn-sm btn-link text-navy p-0 text-decoration-none fw-semibold d-flex align-items-center gap-1"
                          onClick={handleResend}
                        >
                          <BiRefresh size={16} />
                          <span>Resend SMS OTP</span>
                        </button>
                      ) : (
                        <span className="small text-muted">
                          Resend in <strong>{timer}s</strong>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-top d-flex align-items-center justify-content-center gap-3">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-success rounded-pill px-3 d-flex align-items-center gap-1.5"
                      onClick={handleSendWhatsApp}
                    >
                      <BiChat size={16} />
                      <span>Send OTP via WhatsApp</span>
                    </button>
                  </div>
                </form>
              )}

              <div className="mt-4 pt-3 border-top text-center">
                <div className="d-flex align-items-center justify-content-center gap-1 text-muted-custom small">
                  <BiCheckShield className="text-success" size={18} />
                  <span>256-Bit Bank Grade SSL Encrypted Verification</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-3 text-center border-top bg-white">
        <span className="text-muted-custom small">
          Zestora Multi-Tenant SaaS Platform &copy; 2026. All rights reserved.
        </span>
      </footer>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<div className="p-5 text-center">Loading phone verification...</div>}>
      <VerifyOtpContent />
    </Suspense>
  );
}
