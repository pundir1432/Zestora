'use client';

import React from 'react';
import { BiCalendar } from 'react-icons/bi';

export type DateFilterOption = 'Today' | 'Yesterday' | 'Last 7 Days' | 'This Month' | 'Custom';

interface DateRangeFilterProps {
  selected: DateFilterOption;
  onChange: (value: DateFilterOption) => void;
}

export const DateRangeFilter: React.FC<DateRangeFilterProps> = ({ selected, onChange }) => {
  const options: DateFilterOption[] = ['Today', 'Yesterday', 'Last 7 Days', 'This Month', 'Custom'];

  return (
    <div className="d-flex align-items-center bg-white p-1 rounded-3 border border-subtle flex-wrap gap-1">
      <div className="d-flex align-items-center text-muted-custom px-2 d-none d-sm-flex">
        <BiCalendar size={16} className="me-1 text-brand" />
        <span className="small fw-semibold">Period:</span>
      </div>

      <div className="btn-group btn-group-sm" role="group">
        {options.map((opt) => {
          const isActive = selected === opt;
          return (
            <button
              key={opt}
              type="button"
              className={`btn btn-sm rounded-2 px-2 px-md-3 ${
                isActive
                  ? 'btn-brand fw-semibold shadow-sm'
                  : 'btn-light bg-transparent text-navy hover-bg-light'
              }`}
              onClick={() => onChange(opt)}
              style={{ fontSize: '12px' }}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
};

