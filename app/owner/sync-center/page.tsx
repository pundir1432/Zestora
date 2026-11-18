'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useHospitality } from '@/context/HospitalityContext';
import { SyncItemStatus } from '@/mock/sync';
import {
  BiWifi,
  BiWifiOff,
  BiSync,
  BiCheckCircle,
  BiErrorCircle,
  BiTimeFive,
  BiGitCompare,
  BiRefresh,
} from 'react-icons/bi';

export default function OfflineSyncCenterPage() {
  const {
    networkStatus,
    syncQueue,
    toggleOfflineMode,
    triggerSyncAll,
    retrySyncItem,
    resolveSyncConflict,
    enqueueSyncEvent,
  } = useHospitality();

  const [filter, setFilter] = useState<'All' | SyncItemStatus>('All');

  const counts = {
    Pending: syncQueue.filter(i => i.status === 'Pending').length,
    Synced: syncQueue.filter(i => i.status === 'Synced').length,
    Failed: syncQueue.filter(i => i.status === 'Failed').length,
    'Needs Review': syncQueue.filter(i => i.status === 'Needs Review').length,
    Conflict: syncQueue.filter(i => i.status === 'Conflict').length,
  };

  const filtered = filter === 'All' ? syncQueue : syncQueue.filter(i => i.status === filter);

  return (
    <DashboardLayout allowedRoles={['restaurant_owner', 'branch_manager', 'cashier']}>
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 mb-4">
        <div>
          <h3 className="fw-bold text-navy mb-1">Offline-First Sync Center</h3>
          <p className="text-muted-custom small mb-0">
            Designed for hill-station &amp; riverside weak-internet zones (Rishikesh / Shivpuri / Uttarakhand) — local state simulation
          </p>
        </div>
        <div className="d-flex align-items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={toggleOfflineMode}
            className={`btn btn-sm fw-semibold d-flex align-items-center gap-1 px-3 py-2 ${
              networkStatus === 'offline' ? 'btn-success text-white' : 'btn-outline-danger'
            }`}
          >
            {networkStatus === 'offline' ? <BiWifi size={16} /> : <BiWifiOff size={16} />}
            {networkStatus === 'offline' ? 'Reconnect Network' : 'Simulate Offline Outage'}
          </button>
          <button
            type="button"
            onClick={() =>
              enqueueSyncEvent(
                'POS Order',
                `OFF-${Math.floor(100 + Math.random() * 899)}`,
                'Simulated offline POS takeaway bill queued locally (₹640 Cash)'
              )
            }
            className="btn btn-outline-secondary btn-sm bg-white text-navy fw-semibold px-3 py-2"
          >
            + Queue Mock Event
          </button>
          <button
            type="button"
            onClick={triggerSyncAll}
            className="btn btn-brand btn-sm text-white fw-semibold d-flex align-items-center gap-1 px-3 py-2"
          >
            <BiSync size={16} /> Force Sync All
          </button>
        </div>
      </div>

      {/* Network Status Banner */}
      <div
        className={`alert border-0 rounded-4 p-3 mb-4 d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between gap-2 ${
          networkStatus === 'offline'
            ? 'bg-danger bg-opacity-10 text-danger'
            : networkStatus === 'syncing'
            ? 'bg-info bg-opacity-10 text-primary'
            : networkStatus === 'sync_failed'
            ? 'bg-warning bg-opacity-15 text-dark'
            : 'bg-success bg-opacity-10 text-success'
        }`}
      >
        <div className="d-flex align-items-center gap-2">
          {networkStatus === 'offline' ? <BiWifiOff size={22} /> : <BiWifi size={22} />}
          <div>
            <div className="fw-bold small text-uppercase">
              Connection State: {networkStatus.replace('_', ' ')}
            </div>
            <div className="small">
              {networkStatus === 'offline'
                ? 'POS, KDS, Camp Waivers & Check-ins continue uninterrupted using local offline permission snapshots.'
                : 'Connected to Cloud Relay — local device snapshots & offline bills synchronize automatically.'}
            </div>
          </div>
        </div>
        <span className="badge bg-white text-navy border shadow-2xs px-3 py-2">
          Mock Frontend Sync Engine
        </span>
      </div>

      {/* KPI Summary Cards */}
      <div className="row g-3 mb-4">
        {[
          { label: 'Pending Sync', value: counts.Pending, cls: 'text-warning', icon: BiTimeFive, filterKey: 'Pending' as const },
          { label: 'Synced Cleanly', value: counts.Synced, cls: 'text-success', icon: BiCheckCircle, filterKey: 'Synced' as const },
          { label: 'Sync Failed', value: counts.Failed, cls: 'text-danger', icon: BiErrorCircle, filterKey: 'Failed' as const },
          { label: 'Conflicts / Review', value: counts.Conflict + counts['Needs Review'], cls: 'text-primary', icon: BiGitCompare, filterKey: 'Conflict' as const },
        ].map(card => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="col-6 col-lg-3">
              <div
                className="app-card p-3 h-100"
                style={{ cursor: 'pointer' }}
                onClick={() => setFilter(card.filterKey)}
              >
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span className="text-muted-custom small fw-semibold">{card.label}</span>
                  <Icon size={20} className={card.cls} />
                </div>
                <div className={`fs-3 fw-bold ${card.cls}`}>{card.value}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter Pills */}
      <div className="d-flex align-items-center gap-2 flex-wrap mb-3">
        {(['All', 'Pending', 'Conflict', 'Failed', 'Needs Review', 'Synced'] as const).map(tab => (
          <button
            key={tab}
            type="button"
            onClick={() => setFilter(tab)}
            className={`btn btn-sm rounded-pill px-3 ${
              filter === tab ? 'btn-brand text-white fw-semibold' : 'btn-outline-secondary bg-white text-navy'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Queue List */}
      <div className="d-flex flex-column gap-3">
        {filtered.map(item => (
          <div key={item.id} className="app-card p-3 p-md-4">
            <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-2 mb-2">
              <div className="d-flex align-items-center gap-2 flex-wrap">
                <span className="badge bg-navy text-white">{item.module}</span>
                <span className="fw-bold text-navy">{item.entityRef}</span>
                <span
                  className={`badge rounded-pill ${
                    item.status === 'Synced'
                      ? 'badge-soft-success'
                      : item.status === 'Pending'
                      ? 'badge-soft-warning'
                      : item.status === 'Conflict' || item.status === 'Failed'
                      ? 'badge-soft-danger'
                      : 'badge-soft-info'
                  }`}
                >
                  {item.status}
                </span>
              </div>
              <span className="text-muted-custom small">
                {item.deviceName} &bull; {item.createdAt}
              </span>
            </div>

            <p className="text-navy small mb-2">{item.summary}</p>

            {item.errorOrConflictDetail && (
              <div className="alert alert-warning py-2 px-3 small mb-3 border-0 bg-warning bg-opacity-15">
                <strong>Detail:</strong> {item.errorOrConflictDetail}
              </div>
            )}

            {item.status === 'Conflict' && item.localSnapshot && item.serverSnapshot && (
              <div className="row g-2 mb-3">
                <div className="col-12 col-md-6">
                  <div className="p-2.5 rounded-3 bg-surface border border-brand border-opacity-50">
                    <div className="fw-bold text-brand small mb-1">Local Device Snapshot</div>
                    <div className="small text-navy">{item.localSnapshot}</div>
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="p-2.5 rounded-3 bg-surface border border-primary border-opacity-50">
                    <div className="fw-bold text-primary small mb-1">Cloud / Front Desk Snapshot</div>
                    <div className="small text-navy">{item.serverSnapshot}</div>
                  </div>
                </div>
              </div>
            )}

            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
              <span className="text-muted-custom" style={{ fontSize: '11px' }}>
                Outlet: {item.outletName} &bull; Retries: {item.retryCount}
              </span>

              <div className="d-flex gap-2">
                {item.status === 'Conflict' && (
                  <>
                    <button
                      type="button"
                      onClick={() => resolveSyncConflict(item.id, 'keep_local')}
                      className="btn btn-brand btn-sm text-white fw-semibold"
                    >
                      Keep Local Snapshot
                    </button>
                    <button
                      type="button"
                      onClick={() => resolveSyncConflict(item.id, 'keep_server')}
                      className="btn btn-outline-primary btn-sm fw-semibold"
                    >
                      Accept Cloud Record
                    </button>
                  </>
                )}
                {(item.status === 'Failed' || item.status === 'Pending' || item.status === 'Needs Review') && (
                  <button
                    type="button"
                    onClick={() => retrySyncItem(item.id)}
                    className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1 fw-semibold"
                  >
                    <BiRefresh size={16} /> Retry Sync Now
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
