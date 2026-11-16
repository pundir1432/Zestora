import React from 'react';
import { IconType } from 'react-icons';
import { BiTrendingUp, BiTrendingDown } from 'react-icons/bi';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  subtitle?: string;
  icon: IconType;
  iconColor?: string;
  iconBg?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  isPositive = true,
  subtitle,
  icon: Icon,
  iconColor = '#F47B35',
  iconBg = 'rgba(244, 123, 53, 0.1)',
}) => {
  return (
    <div className="app-card p-3 h-100 d-flex flex-column justify-content-between">
      <div className="d-flex align-items-center justify-content-between mb-2">
        <span className="text-muted-custom small fw-semibold text-uppercase" style={{ letterSpacing: '0.5px', fontSize: '11px' }}>
          {title}
        </span>
        <div
          className="d-flex align-items-center justify-content-center rounded-3 p-2"
          style={{ backgroundColor: iconBg, color: iconColor }}
        >
          <Icon size={20} />
        </div>
      </div>

      <div className="d-flex align-items-baseline gap-2 mb-1">
        <h3 className="fw-bold text-navy mb-0" suppressHydrationWarning>{value}</h3>
      </div>

      {(change || subtitle) && (
        <div className="d-flex align-items-center gap-1 mt-2 pt-2 border-top border-subtle">
          {change && (
            <span
              className={`badge rounded-pill d-inline-flex align-items-center gap-1 ${
                isPositive ? 'badge-soft-success' : 'badge-soft-danger'
              }`}
              style={{ fontSize: '11px' }}
            >
              {isPositive ? <BiTrendingUp size={12} /> : <BiTrendingDown size={12} />}
              {change}
            </span>
          )}
          {subtitle && (
            <span className="text-muted-custom small" style={{ fontSize: '11px' }}>
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

