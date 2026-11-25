'use client';

import React from 'react';
import Link from 'next/link';
import { RestaurantThemeConfig } from '@/types/restaurantWebsite';
import { BiDish, BiPhone, BiEnvelope, BiMapPin, BiTime } from 'react-icons/bi';
import { FaInstagram, FaFacebookF, FaTwitter } from 'react-icons/fa';

interface FooterProps {
  theme: RestaurantThemeConfig;
}

export const Footer: React.FC<FooterProps> = ({ theme }) => {
  return (
    <footer id="contact" className="bg-food-dark text-white pt-5 pb-4 border-top border-secondary border-opacity-25">
      <div className="container pt-4">
        <div className="row g-4 g-lg-5 mb-5">
          {/* Col 1: Brand & Description */}
          <div className="col-12 col-md-6 col-lg-4">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div
                className="d-flex align-items-center justify-content-center rounded-3 shadow-sm flex-shrink-0"
                style={{
                  width: '38px',
                  height: '38px',
                  backgroundColor: theme.colors.primary,
                  color: '#ffffff',
                }}
              >
                <BiDish size={22} />
              </div>
              <span className="fw-bold fs-4 text-white lh-1">
                {theme.name}
              </span>
            </div>

            <p className="text-white-50 small pe-lg-3 mb-4" style={{ lineHeight: 1.6 }}>
              {theme.footer.aboutText}
            </p>

            {/* Social Icons */}
            <div className="d-flex align-items-center gap-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="btn-icon-luxury bg-white bg-opacity-10 text-white border-0"
                style={{ width: '38px', height: '38px' }}
                aria-label="Instagram"
              >
                <FaInstagram size={16} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="btn-icon-luxury bg-white bg-opacity-10 text-white border-0"
                style={{ width: '38px', height: '38px' }}
                aria-label="Facebook"
              >
                <FaFacebookF size={15} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="btn-icon-luxury bg-white bg-opacity-10 text-white border-0"
                style={{ width: '38px', height: '38px' }}
                aria-label="Twitter"
              >
                <FaTwitter size={15} />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="col-6 col-md-3 col-lg-2">
            <h6 className="fw-bold text-white text-uppercase tracking-wider mb-3" style={{ fontSize: '13px', letterSpacing: '0.08em' }}>
              Quick Links
            </h6>
            <ul className="list-unstyled d-flex flex-column gap-2 small text-white-50 mb-0">
              <li>
                <a href="#home" className="text-white-50 text-decoration-none hover-white">Home</a>
              </li>
              <li>
                <a href="#menu" className="text-white-50 text-decoration-none hover-white">Our Menu</a>
              </li>
              <li>
                <a href="#about" className="text-white-50 text-decoration-none hover-white">About Us</a>
              </li>
              <li>
                <a href="#gallery" className="text-white-50 text-decoration-none hover-white">Photo Gallery</a>
              </li>
              <li>
                <a href="#reviews" className="text-white-50 text-decoration-none hover-white">Guest Reviews</a>
              </li>
              <li>
                <Link href="/login" className="text-white-50 text-decoration-none hover-white">
                  Staff / Admin Portal &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Opening Hours */}
          <div className="col-6 col-md-3 col-lg-3">
            <h6 className="fw-bold text-white text-uppercase tracking-wider mb-3" style={{ fontSize: '13px', letterSpacing: '0.08em' }}>
              Opening Hours
            </h6>
            <ul className="list-unstyled d-flex flex-column gap-3 small text-white-50 mb-0">
              {theme.footer.openingHours.map((slot, idx) => (
                <li key={idx} className="d-flex align-items-start gap-2">
                  <BiTime size={16} className="mt-1 flex-shrink-0" style={{ color: theme.colors.primary }} />
                  <div>
                    <div className="text-white fw-semibold">{slot.days}</div>
                    <div className="text-white-50" style={{ fontSize: '12px' }}>{slot.time}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact Information */}
          <div className="col-12 col-md-6 col-lg-3">
            <h6 className="fw-bold text-white text-uppercase tracking-wider mb-3" style={{ fontSize: '13px', letterSpacing: '0.08em' }}>
              Contact Us
            </h6>
            <ul className="list-unstyled d-flex flex-column gap-3 small text-white-50 mb-0">
              <li className="d-flex align-items-start gap-2">
                <BiMapPin size={18} className="mt-1 flex-shrink-0" style={{ color: theme.colors.primary }} />
                <span>{theme.footer.address}</span>
              </li>
              <li className="d-flex align-items-center gap-2">
                <BiPhone size={16} className="flex-shrink-0" style={{ color: theme.colors.primary }} />
                <a href={`tel:${theme.footer.phone}`} className="text-white-50 text-decoration-none hover-white">
                  {theme.footer.phone}
                </a>
              </li>
              <li className="d-flex align-items-center gap-2">
                <BiEnvelope size={16} className="flex-shrink-0" style={{ color: theme.colors.primary }} />
                <a href={`mailto:${theme.footer.email}`} className="text-white-50 text-decoration-none hover-white">
                  {theme.footer.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-4 border-top border-secondary border-opacity-25 d-flex flex-column flex-sm-row align-items-center justify-content-between gap-2 text-white-50 small">
          <div>
            &copy; {new Date().getFullYear()} {theme.name}. All rights reserved.
          </div>
          <div className="d-flex align-items-center gap-3">
            <span>Powered by <strong className="text-white">Zestora</strong> Restaurant SaaS Platform</span>
            <span>&bull;</span>
            <Link href="/login" className="text-decoration-none fw-semibold" style={{ color: theme.colors.primary }}>
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
