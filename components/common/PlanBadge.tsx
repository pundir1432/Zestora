'use client';

import React from 'react';
import Link from 'next/link';
import { BiLockAlt, BiCrown } from 'react-icons/bi';
import { PlanTier, PLAN_TIERS, PlanTierConfig } from '@/mock/tenants';
import { useHospitality } from '@/context/HospitalityContext';

export const PlanTierBadge: React.FC<{ tier: PlanTier; compact?: boolean }> = ({ tier, compact = false }) => {
  const styles: Record<PlanTier, string> = {
    S: 'bg-secondary bg-opacity-15 text-navy border border-secondary border-opacity-25',
    G: 'bg-primary bg-opacity-15 text-primary border border-primary border-opacity-25',
    E: 'bg-warning bg-opacity-20 text-dark border border-warning border-opacity-50',
  };
  return (
    <span className={`badge rounded-pill fw-semibold d-inline-flex align-items-center gap-1 ${styles[tier]}`} style={{ fontSize: '11px' }}>
      <BiCrown size={12} />
      {compact ? tier : PLAN_TIERS[tier].label}
    </span>
  );
};

interface PlanGateBannerProps {
  featureKey: keyof PlanTierConfig['features'];
  requiredTier: PlanTier;
  featureTitle: string;
  children: React.ReactNode;
}

/**
 * Displays a realistic locked/upgrade banner when the active tenant Plan Tier (S/G/E)
 * does not include this module — while letting demo reviewers unlock with 1 click!
 */
export const PlanGate: React.FC<PlanGateBannerProps> = ({
  featureKey,
  requiredTier,
  featureTitle,
  children,
}) => {
  const { hasPlanFeature, activePlanTier, setPlanTierOverride } = useHospitality();
  if (hasPlanFeature(featureKey)) {
    return <>{children}</>;
  }

  return (
    <div>
      <div className="alert alert-warning border border-warning border-opacity-50 rounded-4 p-4 mb-4 bg-white shadow-sm">
        <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3">
          <div className="d-flex align-items-start gap-3">
            <div className="rounded-3 bg-warning bg-opacity-20 text-warning p-3 flex-shrink-0">
              <BiLockAlt size={26} />
            </div>
            <div>
              <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
                <h6 className="fw-bold text-navy mb-0">{featureTitle} — Available on {PLAN_TIERS[requiredTier].label}</h6>
                <PlanTierBadge tier={requiredTier} />
              </div>
              <p className="text-muted-custom small mb-0">
                Your current preview tier is <strong>{PLAN_TIERS[activePlanTier].label}</strong>. Upgrade to{' '}
                <strong>{PLAN_TIERS[requiredTier].name}</strong> to unlock this module across your properties, or click below to preview it immediately in this demo.
              </p>
            </div>
          </div>
          <div className="d-flex align-items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={() => setPlanTierOverride(requiredTier)}
              className="btn btn-brand btn-sm text-white fw-semibold px-3"
            >
              Preview {PLAN_TIERS[requiredTier].label}
            </button>
            <Link href="/owner/subscription" className="btn btn-outline-secondary btn-sm px-3">
              Compare Plans
            </Link>
          </div>
        </div>
      </div>
      <div style={{ opacity: 0.45, pointerEvents: 'none', filter: 'grayscale(35%)' }}>
        {children}
      </div>
    </div>
  );
};
