'use client';

import React from 'react';
import { RestaurantFeature } from '@/types/restaurantWebsite';
import { BiLeaf, BiAward, BiCoffee, BiSmile } from 'react-icons/bi';

interface FeatureStripProps {
  features: RestaurantFeature[];
  primaryColor?: string;
}

export const FeatureStrip: React.FC<FeatureStripProps> = ({
  features,
  primaryColor = '#E63946',
}) => {
  const getIcon = (type: RestaurantFeature['iconType']) => {
    switch (type) {
      case 'fresh':
        return <BiLeaf size={24} style={{ color: primaryColor }} />;
      case 'quality':
        return <BiAward size={24} style={{ color: primaryColor }} />;
      case 'ambiance':
        return <BiCoffee size={24} style={{ color: primaryColor }} />;
      case 'service':
        return <BiSmile size={24} style={{ color: primaryColor }} />;
      default:
        return <BiAward size={24} style={{ color: primaryColor }} />;
    }
  };

  return (
    <div className="feature-strip-bar py-4">
      <div className="container">
        <div className="row g-4 align-items-center justify-content-between">
          {features.map((feature, idx) => (
            <div key={feature.id || idx} className="col-6 col-md-3">
              <div className="d-flex align-items-center gap-3">
                <div
                  className="p-2 rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  {getIcon(feature.iconType)}
                </div>
                <div>
                  <h6 className="fw-bold text-white mb-0" style={{ fontSize: '14.5px', letterSpacing: '-0.01em' }}>
                    {feature.title}
                  </h6>
                  <p className="text-white-50 small mb-0 mt-1 d-none d-sm-block" style={{ fontSize: '11.5px' }}>
                    {feature.subtitle}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
