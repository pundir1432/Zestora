'use client';

import React from 'react';
import { BiFolderOpen } from 'react-icons/bi';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  icon,
}) => {
  return (
    <div className="app-card p-5 text-center my-3 bg-white">
      <div
        className="d-inline-flex align-items-center justify-content-center rounded-circle bg-surface text-muted-custom mb-3"
        style={{ width: '58px', height: '58px' }}
      >
        {icon || <BiFolderOpen size={28} />}
      </div>
      <h6 className="fw-bold text-navy mb-1">{title}</h6>
      <p className="text-muted-custom small mx-auto mb-3" style={{ maxWidth: '420px' }}>
        {description}
      </p>
      {actionLabel && onAction && (
        <button type="button" onClick={onAction} className="btn btn-brand btn-sm text-white px-3 fw-semibold">
          {actionLabel}
        </button>
      )}
    </div>
  );
};
