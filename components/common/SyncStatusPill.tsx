'use client';

import React from 'react';
import Link from 'next/link';
import { BiWifi, BiWifiOff, BiSync, BiErrorCircle, BiCheckCircle } from 'react-icons/bi';
import { useHospitality } from '@/context/HospitalityContext';

export const SyncStatusPill: React.FC = () => {
  const { networkStatus, syncQueue, toggleOfflineMode } = useHospitality();
  const pendingCount = syncQueue.filter(i => i.status === 'Pending' || i.status === 'Failed' || i.status === 'Conflict').length;

  const badgeConfig = {
    online: { cls: 'badge-soft-success', icon: <BiWifi size={14} />, label: 'Online' },
    offline: { cls: 'badge-soft-danger', icon: <BiWifiOff size={14} />, label: 'Offline' },
    syncing: { cls: 'badge-soft-info', icon: <BiSync size={14} className="spin" />, label: 'Syncing' },
    sync_complete: { cls: 'badge-soft-success', icon: <BiCheckCircle size={14} />, label: 'Synced' },
    sync_failed: { cls: 'badge-soft-warning', icon: <BiErrorCircle size={14} />, label: 'Sync Retry' },
  }[networkStatus];

  return (
    <div className="d-flex align-items-center gap-1">
      <button
        type="button"
        onClick={toggleOfflineMode}
        className={`btn btn-sm border-0 rounded-pill px-2.5 py-1 d-inline-flex align-items-center gap-1 fw-semibold ${badgeConfig.cls}`}
        style={{ fontSize: '11px' }}
        title="Click to simulate Weak Internet / Offline Mode"
      >
        {badgeConfig.icon}
        <span className="d-none d-xl-inline">{badgeConfig.label}</span>
      </button>
      {pendingCount > 0 && (
        <Link
          href="/owner/sync-center"
          className="badge rounded-pill bg-warning text-dark text-decoration-none fw-bold"
          style={{ fontSize: '10px' }}
          title="Open Offline Sync Center"
        >
          {pendingCount}
        </Link>
      )}
    </div>
  );
};
