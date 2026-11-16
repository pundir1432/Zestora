'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { SAMPLE_ROLE_PERMISSIONS } from '@/data/saasData';
import { RolePermissionDefinition } from '@/types/saas';
import {
  BiShieldQuarter,
  BiCheck,
  BiX,
  BiLockAlt,
  BiSave,
  BiCheckCircle,
  BiUserCheck,
} from 'react-icons/bi';

export default function BusinessOwnerRolesPage() {
  const [permissions, setPermissions] = useState<RolePermissionDefinition[]>(SAMPLE_ROLE_PERMISSIONS);
  const [isSaved, setIsSaved] = useState(false);

  const handleToggle = (roleName: string, field: keyof RolePermissionDefinition) => {
    // Prevent disabling owner or super admin permissions
    if (roleName === 'Super Admin' || roleName === 'Business Owner') return;

    setPermissions((prev) =>
      prev.map((r) =>
        r.roleName === roleName ? { ...r, [field]: !r[field] } : r
      )
    );
  };

  const handleSaveMatrix = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const permissionColumns: { key: keyof RolePermissionDefinition; label: string; desc: string }[] = [
    { key: 'allowDiscount', label: 'Apply Discounts', desc: 'Can apply manual % or flat discounts on POS' },
    { key: 'allowVoidBill', label: 'Void / Cancel Bills', desc: 'Authorize voiding a settled or active invoice' },
    { key: 'allowRefund', label: 'Issue Refunds', desc: 'Can process cash or UPI customer refunds' },
    { key: 'allowReportsView', label: 'View P&L & Reports', desc: 'Access revenue metrics, margins, and sales history' },
    { key: 'allowMenuEdit', label: 'Edit Menu Pricing', desc: 'Add or modify dishes and category prices' },
    { key: 'allowInventoryAdjust', label: 'Adjust Inventory', desc: 'Log wastage, stock inward GRN, and counts' },
    { key: 'allowStaffManage', label: 'Staff Management', desc: 'Create employee accounts, shifts, and overrides' },
  ];

  return (
    <DashboardLayout allowedRoles={['restaurant_owner', 'branch_manager']}>
      <div className="container-fluid p-0">
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div>
            <h1 className="h3 fw-bold text-dark mb-1">Role-Based Access Control (RBAC) & Permissions</h1>
            <p className="text-muted small mb-0">
              Configure granular security boundaries, cashier authorization thresholds, and sensitive action safeguards across your restaurant hierarchy.
            </p>
          </div>
          <div>
            <button
              className="btn btn-primary btn-sm d-flex align-items-center gap-2"
              onClick={handleSaveMatrix}
            >
              <BiSave size={18} /> Save Permission Matrix
            </button>
          </div>
        </div>

        {isSaved && (
          <div className="alert alert-success alert-dismissible fade show shadow-sm border-0 d-flex align-items-center gap-2 mb-4">
            <BiCheckCircle size={20} />
            <div>Security permissions updated! Applied across all active cashier POS terminals and tablet sessions.</div>
          </div>
        )}

        {/* Roles Quick Overview */}
        <div className="row g-3 mb-4">
          <div className="col-12 col-md-4">
            <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted small fw-medium">Configured Security Roles</span>
                <span className="p-2 rounded bg-primary-subtle text-primary">
                  <BiShieldQuarter size={20} />
                </span>
              </div>
              <h3 className="fw-bold mb-1">7 Standard Roles</h3>
              <span className="text-muted small">From Waiter to Enterprise Super Admin</span>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted small fw-medium">Manager PIN Guard</span>
                <span className="p-2 rounded bg-warning-subtle text-warning-emphasis">
                  <BiLockAlt size={20} />
                </span>
              </div>
              <h3 className="fw-bold mb-1">Active Protection</h3>
              <span className="text-muted small">Prompts 4-digit manager PIN for voids &gt;₹500</span>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted small fw-medium">Active Staff Logins</span>
                <span className="p-2 rounded bg-success-subtle text-success">
                  <BiUserCheck size={20} />
                </span>
              </div>
              <h3 className="fw-bold mb-1">24 Active Accounts</h3>
              <span className="text-success small fw-medium">Separation of financial duties enabled</span>
            </div>
          </div>
        </div>

        {/* Permissions Matrix Table */}
        <div className="card border-0 shadow-sm rounded-3 bg-white">
          <div className="card-header bg-white border-bottom py-3">
            <h5 className="fw-bold mb-0 text-dark">Security Privileges Matrix</h5>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0 text-center">
                <thead className="table-light small">
                  <tr>
                    <th className="text-start ps-4 py-3" style={{ minWidth: '220px' }}>
                      Role & Description
                    </th>
                    {permissionColumns.map((col) => (
                      <th key={col.key} style={{ minWidth: '130px' }} className="py-3 px-2">
                        <div className="fw-bold text-dark">{col.label}</div>
                        <div className="text-muted fw-normal" style={{ fontSize: '10px' }}>
                          {col.desc}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="small">
                  {permissions.map((role) => (
                    <tr key={role.roleName}>
                      <td className="text-start ps-4 py-3">
                        <div className="fw-bold text-dark fs-6">{role.roleName}</div>
                        <div className="text-muted" style={{ fontSize: '11px', maxWidth: '280px' }}>
                          {role.description}
                        </div>
                      </td>
                      {permissionColumns.map((col) => {
                        const isGranted = Boolean(role[col.key]);
                        const isLocked = role.roleName === 'Super Admin' || role.roleName === 'Business Owner';
                        return (
                          <td key={col.key} className="py-3">
                            <button
                              type="button"
                              className={`btn btn-sm ${
                                isGranted ? 'btn-success text-white' : 'btn-outline-danger'
                              } px-3 py-1`}
                              style={{
                                cursor: isLocked ? 'not-allowed' : 'pointer',
                                opacity: isLocked ? 0.8 : 1,
                              }}
                              disabled={isLocked}
                              onClick={() => handleToggle(role.roleName, col.key)}
                              title={isLocked ? 'Master Role cannot be restricted' : 'Click to Toggle'}
                            >
                              {isGranted ? (
                                <BiCheck size={18} />
                              ) : (
                                <BiX size={18} />
                              )}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
