'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { userService } from '@/services';
import { RegisteredDevice } from '@/mock/users';
import { BiDevices, BiShieldX, BiRefresh, BiCheckCircle, BiWifiOff } from 'react-icons/bi';

export default function DeviceManagementPage() {
  const [devices, setDevices] = useState<RegisteredDevice[]>(() => userService.getDevices());

  const toggleRevoke = (id: string) => {
    setDevices(prev =>
      prev.map(d =>
        d.id === id
          ? {
              ...d,
              status: d.status === 'Revoked' ? 'Active' : 'Revoked',
              offlineSnapshotStatus: d.status === 'Revoked' ? 'Current (Synced 2m ago)' : 'Revoked',
            }
          : d
      )
    );
  };

  return (
    <DashboardLayout allowedRoles={['restaurant_owner', 'branch_manager']}>
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-2 mb-4">
        <div>
          <h3 className="fw-bold text-navy mb-1 d-flex align-items-center gap-2">
            <BiDevices className="text-brand" /> Registered Devices &amp; Active Sessions
          </h3>
          <p className="text-muted-custom small mb-0">
            POS Terminals, KDS Screens, Self-Order Kiosks, Ready Board TVs, Front Desk PCs &amp; Rugged Camp Tablets — with Offline Permission Snapshot Tracking
          </p>
        </div>
        <span className="badge badge-soft-success px-3 py-2">
          {devices.filter(d => d.status === 'Active').length} Active / {devices.length} Registered
        </span>
      </div>

      <div className="app-card overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0 small">
            <thead className="table-light">
              <tr className="text-muted-custom">
                <th>Device &amp; Type</th>
                <th>Property &amp; Outlet</th>
                <th>Assigned User &amp; Session</th>
                <th>Offline Permission Snapshot</th>
                <th>Status &amp; Last Active</th>
                <th className="text-end">Action</th>
              </tr>
            </thead>
            <tbody>
              {devices.map(dev => (
                <tr key={dev.id}>
                  <td>
                    <div className="fw-bold text-navy">{dev.name}</div>
                    <span className="badge bg-light text-navy border" style={{ fontSize: '10px' }}>{dev.deviceType}</span>
                    <span className="text-muted-custom ms-2" style={{ fontSize: '10px' }}>{dev.ipAddress} &bull; {dev.appVersion}</span>
                  </td>
                  <td>
                    <div className="text-navy fw-semibold">{dev.outletName}</div>
                    <div className="text-muted-custom" style={{ fontSize: '10px' }}>{dev.propertyName}</div>
                  </td>
                  <td>
                    <div className="text-navy">{dev.assignedUser}</div>
                    <div className="font-monospace text-muted-custom" style={{ fontSize: '10px' }}>{dev.sessionId}</div>
                  </td>
                  <td>
                    <span
                      className={`badge rounded-pill ${
                        dev.offlineSnapshotStatus.startsWith('Current')
                          ? 'badge-soft-success'
                          : dev.offlineSnapshotStatus === 'Revoked'
                          ? 'badge-soft-danger'
                          : 'badge-soft-warning'
                      }`}
                    >
                      {dev.offlineSnapshotStatus}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`badge rounded-pill d-inline-flex align-items-center gap-1 ${
                        dev.status === 'Active'
                          ? 'badge-soft-success'
                          : dev.status === 'Offline'
                          ? 'badge-soft-warning'
                          : 'badge-soft-danger'
                      }`}
                    >
                      {dev.status === 'Active' ? <BiCheckCircle /> : dev.status === 'Offline' ? <BiWifiOff /> : <BiShieldX />}
                      {dev.status}
                    </span>
                    <div className="text-muted-custom mt-1" style={{ fontSize: '10px' }}>{dev.lastActive}</div>
                  </td>
                  <td className="text-end">
                    <button
                      type="button"
                      onClick={() => toggleRevoke(dev.id)}
                      className={`btn btn-sm fw-semibold ${dev.status === 'Revoked' ? 'btn-outline-success' : 'btn-outline-danger'}`}
                    >
                      {dev.status === 'Revoked' ? (
                        <><BiRefresh /> Restore</>
                      ) : (
                        <><BiShieldX /> Revoke</>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
