'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BiMenu, BiX, BiDish, BiPhone, BiShoppingBag } from 'react-icons/bi';
import { BookTableButton, IconButton } from './ButtonSystem';
import { RestaurantThemeConfig } from '@/types/restaurantWebsite';

interface NavbarProps {
  theme: RestaurantThemeConfig;
  onOpenBookTable: () => void;
  cartCount?: number;
  onOpenCart?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  theme,
  onOpenBookTable,
  cartCount = 0,
  onOpenCart,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Menu', href: '#menu' },
    { label: 'About', href: '#about' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Reviews', href: '#reviews' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <>
      <header
        className={`fixed-top transition-all ${
          isScrolled ? 'restaurant-navbar-glass py-2' : 'restaurant-navbar-transparent py-3'
        }`}
        style={{ zIndex: 1040 }}
      >
        <div className="container d-flex align-items-center justify-content-between">
          {/* Brand Logo */}
          <Link href="#home" className="d-flex align-items-center gap-2 text-decoration-none">
            <div
              className="d-flex align-items-center justify-content-center rounded-3 shadow-sm flex-shrink-0"
              style={{
                width: '42px',
                height: '42px',
                backgroundColor: theme.colors.primary,
                color: '#ffffff',
              }}
            >
              <BiDish size={24} />
            </div>
            <div className="d-flex flex-column">
              <span className="fw-bold fs-4 text-white lh-1 tracking-tight" style={{ letterSpacing: '-0.02em' }}>
                {theme.name}
              </span>
              <span className="text-white-50 small mt-1" style={{ fontSize: '11px', letterSpacing: '0.04em' }}>
                {theme.tagline}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="d-none d-lg-flex align-items-center gap-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-white text-opacity-75 text-decoration-none fw-semibold transition-all hover-white small"
                style={{
                  fontSize: '14.5px',
                  letterSpacing: '-0.01em',
                  transition: 'color 180ms ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = theme.colors.primary)}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.85)')}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Section: Cart, Book Table CTA & Mobile Hamburger */}
          <div className="d-flex align-items-center gap-2 gap-sm-3">
            {/* Cart Icon Button with Count */}
            {onOpenCart && (
              <button
                type="button"
                onClick={onOpenCart}
                className="btn-icon-luxury position-relative bg-transparent text-white border-white border-opacity-25"
                style={{ width: '42px', height: '42px' }}
                title="Your Order"
              >
                <BiShoppingBag size={20} />
                {cartCount > 0 && (
                  <span
                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill"
                    style={{ backgroundColor: theme.colors.primary, fontSize: '10px' }}
                  >
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            {/* Book Table Button (Desktop) */}
            <div className="d-none d-sm-block">
              <BookTableButton onClick={onOpenBookTable}>
                Book a Table
              </BookTableButton>
            </div>

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              className="btn btn-outline-light d-lg-none p-2 border-opacity-25 rounded-3 text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <BiX size={24} /> : <BiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div
            className="d-lg-none px-4 py-3 border-top border-secondary border-opacity-25 animate-fadeIn"
            style={{
              backgroundColor: '#17120F',
              backdropFilter: 'blur(16px)',
            }}
          >
            <div className="d-flex flex-column gap-2 mb-3">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-white text-decoration-none py-2 fw-semibold border-bottom border-secondary border-opacity-25"
                  style={{ fontSize: '15px' }}
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="pt-2">
              <BookTableButton
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBookTable();
                }}
                className="w-100 justify-content-center"
              >
                Book a Table
              </BookTableButton>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
