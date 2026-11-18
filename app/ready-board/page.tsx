'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useHospitality } from '@/context/HospitalityContext';
import { ReadyBoardStage } from '@/mock/orders';
import {
  BiTv,
  BiTimeFive,
  BiCheckCircle,
  BiRightArrowAlt,
  BiVolumeFull,
  BiArrowBack,
  BiGlobe,
  BiHide,
  BiShow,
} from 'react-icons/bi';

const STAGES: { key: ReadyBoardStage; labelEn: string; labelHi: string; headerBg: string; accent: string }[] = [
  { key: 'NEW', labelEn: 'NEW ORDERS', labelHi: 'नए ऑर्डर', headerBg: '#3478D4', accent: '#3478D4' },
  { key: 'PREPARING', labelEn: 'PREPARING', labelHi: 'बन रहा है', headerBg: '#F47B35', accent: '#F47B35' },
  { key: 'READY', labelEn: 'READY FOR PICKUP', labelHi: 'पिकअप के लिए तैयार', headerBg: '#16A36A', accent: '#16A36A' },
  { key: 'SERVED', labelEn: 'PICKED UP / SERVED', labelHi: 'परोसा गया', headerBg: '#475569', accent: '#64748B' },
];

export default function OrderReadyBoardPage() {
  const { readyBoardOrders, advanceOrderStage, activeOutlet, language, toggleLanguage } = useHospitality();
  const [tvOnlyMode, setTvOnlyMode] = useState(false);
  const [lastChimeToken, setLastChimeToken] = useState<string | null>(null);

  const handleAdvance = (id: string, token: string, next: ReadyBoardStage) => {
    advanceOrderStage(id, next);
    if (next === 'READY') {
      setLastChimeToken(token);
      setTimeout(() => setLastChimeToken(null), 4000);
    }
  };

  const nextStageMap: Record<ReadyBoardStage, ReadyBoardStage | null> = {
    NEW: 'PREPARING',
    PREPARING: 'READY',
    READY: 'SERVED',
    SERVED: null,
  };

  return (
    <div className="min-vh-100 d-flex flex-column" style={{ backgroundColor: '#0F172A', color: '#FFFFFF' }}>
      {/* Top Broadcast Bar */}
      <header
        className="px-3 px-md-4 py-3 d-flex flex-wrap align-items-center justify-content-between gap-2"
        style={{ backgroundColor: '#18263B', borderBottom: '2px solid rgba(244, 123, 53, 0.4)' }}
      >
        <div className="d-flex align-items-center gap-3">
          <div
            className="d-flex align-items-center justify-content-center rounded-3 bg-brand text-white fw-bold shadow"
            style={{ width: '44px', height: '44px', fontSize: '22px' }}
          >
            Z
          </div>
          <div>
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <h4 className="fw-bold mb-0 text-white d-flex align-items-center gap-2">
                <BiTv className="text-brand" />
                {language === 'en' ? 'ORDER READY BOARD' : 'ऑर्डर रेडी बोर्ड'}
              </h4>
              <span className="badge bg-success rounded-pill px-3 py-1" style={{ fontSize: '11px' }}>
                LIVE TV STREAM
              </span>
            </div>
            <div className="text-white-50 small">
              {activeOutlet.name} &bull; {language === 'en' ? 'Track your order token from Kitchen to Pickup' : 'किचन से पिकअप तक अपना ऑर्डर टोकन देखें'}
            </div>
          </div>
        </div>

        <div className="d-flex align-items-center gap-2 flex-wrap">
          {lastChimeToken && (
            <span className="badge bg-success text-white px-3 py-2 d-flex align-items-center gap-1 fs-6">
              <BiVolumeFull size={18} /> Ding! Token #{lastChimeToken} is READY!
            </span>
          )}
          <button
            type="button"
            onClick={toggleLanguage}
            className="btn btn-sm btn-outline-light d-flex align-items-center gap-1"
          >
            <BiGlobe size={15} /> {language === 'en' ? 'हिंदी' : 'English'}
          </button>
          <button
            type="button"
            onClick={() => setTvOnlyMode(!tvOnlyMode)}
            className="btn btn-sm btn-outline-warning d-flex align-items-center gap-1"
          >
            {tvOnlyMode ? <BiShow size={15} /> : <BiHide size={15} />}
            {tvOnlyMode ? 'Show Staff Controls' : 'Pure TV Mode'}
          </button>
          <Link href="/owner/dashboard" className="btn btn-sm btn-brand text-white fw-semibold d-flex align-items-center gap-1">
            <BiArrowBack size={15} /> Back Office
          </Link>
        </div>
      </header>

      {/* Main 4-Stage Distance-Readable Board */}
      <main className="flex-grow-1 p-3 p-md-4">
        <div className="row g-3 h-100">
          {STAGES.map(stage => {
            const stageOrders = readyBoardOrders.filter(o => o.stage === stage.key);
            const isReadyCol = stage.key === 'READY';

            return (
              <div key={stage.key} className="col-12 col-md-6 col-xl-3 d-flex flex-column">
                <div
                  className="rounded-4 overflow-hidden d-flex flex-column flex-grow-1 shadow-lg"
                  style={{
                    backgroundColor: '#1E293B',
                    border: isReadyCol ? '2px solid #16A36A' : '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  {/* Column Stage Header */}
                  <div
                    className="px-3 py-3 d-flex align-items-center justify-content-between"
                    style={{ backgroundColor: stage.headerBg }}
                  >
                    <div>
                      <div className="fw-bolder fs-6 tracking-wide text-white">
                        {language === 'en' ? stage.labelEn : stage.labelHi}
                      </div>
                      <div className="text-white text-opacity-75" style={{ fontSize: '11px' }}>
                        {stage.key === 'READY' ? 'Please collect at pickup counter' : `${stageOrders.length} active token(s)`}
                      </div>
                    </div>
                    <span
                      className="rounded-circle bg-black bg-opacity-25 text-white fw-bold d-flex align-items-center justify-content-center"
                      style={{ width: '36px', height: '36px', fontSize: '18px' }}
                    >
                      {stageOrders.length}
                    </span>
                  </div>

                  {/* Token Cards */}
                  <div className="p-3 d-flex flex-column gap-3 flex-grow-1">
                    {stageOrders.length === 0 ? (
                      <div className="text-center text-white-50 py-5 small">No orders in this stage</div>
                    ) : (
                      stageOrders.map(ord => {
                        const next = nextStageMap[ord.stage];
                        return (
                          <div
                            key={ord.id}
                            className="rounded-4 p-3"
                            style={{
                              backgroundColor: isReadyCol ? 'rgba(22, 163, 106, 0.16)' : '#0F172A',
                              border: isReadyCol
                                ? '2px solid #22C55E'
                                : ord.priority === 'Rush'
                                ? '2px solid #F47B35'
                                : '1px solid rgba(255,255,255,0.1)',
                            }}
                          >
                            <div className="d-flex align-items-start justify-content-between gap-2 mb-2">
                              <div>
                                <div
                                  className="fw-bolder lh-1"
                                  style={{
                                    fontSize: isReadyCol ? '42px' : '32px',
                                    color: isReadyCol ? '#4ADE80' : '#FFFFFF',
                                    letterSpacing: '-1px',
                                  }}
                                >
                                  #{ord.tokenNumber}
                                </div>
                                <div className="fw-bold text-white fs-6 mt-1">{ord.customerShortName}</div>
                              </div>
                              <div className="text-end">
                                <span
                                  className="badge rounded-pill mb-1 d-inline-block"
                                  style={{ backgroundColor: stage.accent, color: '#fff', fontSize: '11px' }}
                                >
                                  {ord.orderType}
                                </span>
                                <div className="text-white-50 small d-flex align-items-center justify-content-end gap-1">
                                  <BiTimeFive size={13} /> {ord.elapsedMinutes}m
                                </div>
                              </div>
                            </div>

                            <div className="d-flex align-items-center justify-content-between pt-2 border-top border-white border-opacity-10">
                              <span className="text-white-50 small">{ord.sourceLabel}</span>
                              {isReadyCol && (
                                <span className="badge bg-success text-white d-inline-flex align-items-center gap-1">
                                  <BiCheckCircle size={13} /> PICKUP NOW
                                </span>
                              )}
                              {ord.priority !== 'Normal' && !isReadyCol && (
                                <span className="badge bg-danger text-white">{ord.priority}</span>
                              )}
                            </div>

                            {!tvOnlyMode && next && (
                              <button
                                type="button"
                                onClick={() => handleAdvance(ord.id, ord.tokenNumber, next)}
                                className="btn btn-sm w-100 mt-3 fw-semibold d-flex align-items-center justify-content-center gap-1"
                                style={{
                                  backgroundColor: next === 'READY' ? '#16A36A' : '#F47B35',
                                  color: '#FFFFFF',
                                }}
                              >
                                <span>Move to {next}</span>
                                <BiRightArrowAlt size={17} />
                              </button>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
