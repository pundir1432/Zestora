'use client';

import React from 'react';
import Link from 'next/link';
import { BiSliderAlt, BiStore, BiRightArrowAlt } from 'react-icons/bi';

interface SaaSTenantSwitcherProps {
  currentThemeId: string;
  onSelectTheme: (id: string) => void;
}

export const SaaSTenantSwitcher: React.FC<SaaSTenantSwitcherProps> = ({
  currentThemeId,
  onSelectTheme,
}) => {
  const tenants = [
    {
      id: 'foodvista',
      name: 'FoodVista',
      style: 'Dark Food Luxury • Red Accent',
      color: '#E63946',
    },
    {
      id: 'spice_symphony',
      name: 'Spice Symphony',
      style: 'Royal Heritage • Amber Gold',
      color: '#D97706',
    },
    {
      id: 'verde_bistro',
      name: 'Verde Bistro',
      style: 'Farm to Table • Organic Green',
      color: '#15803D',
    },
  ];

  return (
    <div
      className="position-relative py-2 px-3 border-bottom d-flex align-items-center justify-content-between flex-wrap gap-2 text-white"
      style={{
        backgroundColor: '#100D0B',
        fontSize: '12px',
        zIndex: 1050,
      }}
    >
      <div className="container d-flex align-items-center justify-content-between flex-wrap gap-2">
        {/* Left: SaaS Notice */}
        <div className="d-flex align-items-center gap-2">
          <span className="badge rounded-pill bg-white bg-opacity-10 text-white border border-white border-opacity-20 px-2 py-1">
            <BiSliderAlt className="me-1" /> Multi-Tenant SaaS Demo
          </span>
          <span className="text-white-50 d-none d-md-inline">
            Switch Restaurant Brand:
          </span>
        </div>

        {/* Center: Tenant Buttons */}
        <div className="d-flex align-items-center gap-1 overflow-x-auto">
          {tenants.map((t) => {
            const isActive = currentThemeId === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => onSelectTheme(t.id)}
                className="btn btn-sm d-flex align-items-center gap-1 px-2 py-1 rounded-pill transition-all"
                style={{
                  fontSize: '11.5px',
                  backgroundColor: isActive ? t.color : 'rgba(255, 255, 255, 0.08)',
                  color: '#ffffff',
                  fontWeight: isActive ? 700 : 500,
                  border: isActive ? `1px solid ${t.color}` : '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <span
                  className="rounded-circle d-inline-block"
                  style={{ width: '6px', height: '6px', backgroundColor: t.color }}
                />
                <span>{t.name}</span>
              </button>
            );
          })}
        </div>

        {/* Right: Quick POS / Admin link */}
        <div className="d-flex align-items-center gap-2">
          <Link
            href="/login"
            className="btn btn-sm px-3 py-1 rounded-pill text-white fw-semibold d-flex align-items-center gap-1"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              fontSize: '11.5px',
            }}
          >
            <BiStore size={14} />
            <span>Admin &amp; POS Portal</span>
            <BiRightArrowAlt size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};
