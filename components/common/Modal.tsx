'use client';

import React, { useEffect } from 'react';
import { BiX } from 'react-icons/bi';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  size = 'md',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidths = {
    sm: '400px',
    md: '550px',
    lg: '800px',
    xl: '1100px',
  };

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
      style={{
        backgroundColor: 'rgba(24, 38, 59, 0.65)',
        backdropFilter: 'blur(3px)',
        zIndex: 1060,
      }}
      onClick={onClose}
    >
      <div
        className="app-card bg-white w-100 shadow-lg d-flex flex-column overflow-hidden"
        style={{
          maxWidth: maxWidths[size],
          maxHeight: '90vh',
          animation: 'fadeInUp 0.2s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="d-flex align-items-center justify-content-between p-3 border-bottom border-subtle bg-surface">
          <div>
            <h5 className="modal-title fw-bold text-navy mb-0">{title}</h5>
            {subtitle && <p className="text-muted-custom small mb-0 mt-1">{subtitle}</p>}
          </div>
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary p-1 border-0 rounded-circle text-navy"
            onClick={onClose}
            aria-label="Close"
          >
            <BiX size={24} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-3 p-md-4 overflow-y-auto flex-grow-1">
          {children}
        </div>

        {/* Modal Footer */}
        {footer && (
          <div className="p-3 border-top border-subtle bg-surface d-flex justify-content-end gap-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

