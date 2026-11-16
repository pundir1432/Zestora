import React from 'react';

interface StatusBadgeProps {
  status: string;
  type?: 'order' | 'payment' | 'inventory' | 'generic';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type = 'generic' }) => {
  const s = status.toLowerCase();

  let badgeClass = 'badge-soft-secondary';

  if (['active', 'paid', 'completed', 'in stock', 'ready'].includes(s)) {
    badgeClass = 'badge-soft-success';
  } else if (['preparing', 'pending', 'low stock', 'expiring soon', 'review'].includes(s)) {
    badgeClass = 'badge-soft-warning';
  } else if (['cancelled', 'out of stock', 'suspended', 'past due', 'danger'].includes(s)) {
    badgeClass = 'badge-soft-danger';
  } else if (['new', 'accepted', 'info', 'dine in'].includes(s)) {
    badgeClass = 'badge-soft-info';
  } else if (['vip', 'takeaway', 'enterprise', 'popular'].includes(s)) {
    badgeClass = 'badge-soft-brand';
  }

  return (
    <span className={`badge rounded-pill ${badgeClass} px-2 py-1 fw-semibold`} style={{ fontSize: '11px' }}>
      {status}
    </span>
  );
};

