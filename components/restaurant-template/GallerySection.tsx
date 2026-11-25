'use client';

import React, { useState } from 'react';
import { GalleryItem, RestaurantThemeConfig } from '@/types/restaurantWebsite';
import { BiSearchAlt, BiX } from 'react-icons/bi';

interface GallerySectionProps {
  theme: RestaurantThemeConfig;
}

export const GallerySection: React.FC<GallerySectionProps> = ({ theme }) => {
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  return (
    <section id="gallery" className="py-5" style={{ backgroundColor: theme.colors.background }}>
      <div className="container py-4">
        {/* Section Header */}
        <div className="text-center mb-5">
          <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-2" style={{ backgroundColor: theme.colors.softBackground }}>
            <span className="small fw-bold text-uppercase" style={{ color: theme.colors.primary, fontSize: '11px', letterSpacing: '0.08em' }}>
              Visual Journey
            </span>
          </div>
          <h2 className="fw-bolder text-food-dark mb-2" style={{ fontSize: 'clamp(28px, 4vw, 42px)', letterSpacing: '-0.02em' }}>
            Atmosphere &amp; Plating Gallery
          </h2>
          <p className="text-food-muted small mx-auto" style={{ maxWidth: '480px' }}>
            A glimpse into our artisanal kitchen, ambient dining spaces, and handcrafted presentations.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="row g-3">
          {theme.gallery.map((item, idx) => (
            <div
              key={item.id || idx}
              className={`col-12 col-sm-6 ${
                item.span === 'large'
                  ? 'col-lg-6'
                  : item.span === 'wide'
                  ? 'col-lg-6'
                  : 'col-lg-3'
              }`}
            >
              <div
                className="position-relative overflow-hidden rounded-4 cursor-pointer shadow-sm border border-food"
                style={{
                  height: item.span === 'large' ? '380px' : '260px',
                  cursor: 'pointer',
                  backgroundColor: '#17120F',
                }}
                onClick={() => setSelectedImage(item)}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-100 h-100 object-fit-cover transition-all"
                  style={{
                    transition: 'transform 350ms cubic-bezier(0.4, 0, 0.2, 1), filter 350ms ease',
                  }}
                  loading="lazy"
                />

                {/* Dark Hover Overlay */}
                <div
                  className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center p-3 text-white text-center opacity-0 hover-opacity-100 transition-all"
                  style={{
                    backgroundColor: 'rgba(23, 18, 15, 0.65)',
                    backdropFilter: 'blur(3px)',
                    transition: 'opacity 220ms ease',
                  }}
                >
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center mb-2 shadow"
                    style={{ width: '44px', height: '44px', backgroundColor: theme.colors.primary, color: '#ffffff' }}
                  >
                    <BiSearchAlt size={22} />
                  </div>
                  <h6 className="fw-bold mb-0 text-white">{item.title}</h6>
                  <span className="small text-white-50">{item.category}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
          style={{
            zIndex: 2500,
            backgroundColor: 'rgba(23, 18, 15, 0.92)',
            backdropFilter: 'blur(10px)',
          }}
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="position-relative text-center"
            style={{ maxWidth: '800px', width: '100%' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              className="position-absolute top-0 end-0 m-3 btn btn-sm btn-dark rounded-circle p-2 text-white border border-secondary"
              aria-label="Close image"
            >
              <BiX size={24} />
            </button>

            <img
              src={selectedImage.image}
              alt={selectedImage.title}
              className="rounded-4 img-fluid shadow-2xl mb-2"
              style={{ maxHeight: '80vh', objectFit: 'contain' }}
            />
            <div className="text-white fw-bold fs-5">{selectedImage.title}</div>
            <div className="text-white-50 small">{selectedImage.category}</div>
          </div>
        </div>
      )}
    </section>
  );
};
