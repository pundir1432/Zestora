'use client';

import React from 'react';
import Link from 'next/link';
import { 
  BiStore, 
  BiShieldQuarter, 
  BiReceipt, 
  BiFoodMenu, 
  BiBarChartAlt2, 
  BiRightArrowAlt,
  BiCheckCircle,
  BiGroup
} from 'react-icons/bi';
import { MdOutlinePointOfSale } from 'react-icons/md';
import { TbToolsKitchen2 } from 'react-icons/tb';

export default function HomePage() {
  const portals = [
    {
      title: 'Restaurant Owner Dashboard',
      description: 'Manage sales KPIs, live orders, multi-branch operations, staff, raw inventory and menu catalogs.',
      href: '/owner/dashboard',
      icon: BiStore,
      badge: 'Most Popular',
      color: '#F47B35',
      features: ['Daily Sales & Trend Charts', 'Multi-Branch Filtering', 'Top Selling Menu Items', 'Payment Breakdown'],
    },
    {
      title: 'Point of Sale (POS) Billing',
      description: 'Fast dual-pane cashier terminal with item cards, size variants, GST calculation, discounts and bill generation.',
      href: '/owner/pos',
      icon: MdOutlinePointOfSale,
      badge: 'Core Feature',
      color: '#16A36A',
      features: ['Veg/Non-Veg Filtering', 'Portion Customization', 'Thermal Receipt Printing', 'UPI/Cash/Card Modes'],
    },
    {
      title: 'Kitchen Display System (KOT)',
      description: 'Paperless kitchen order ticketing with elapsed timers, urgent color alerts, and prep status transitions.',
      href: '/owner/kot',
      icon: TbToolsKitchen2,
      badge: 'Live Kitchen',
      color: '#EAA12D',
      features: ['Real-time Timer Tracking', 'Prep Stage Advancement', 'Cooking Instructions Note', 'Audio Simulation'],
    },
    {
      title: 'Super Admin Portal',
      description: 'Platform headquarters for managing all registered restaurant owners, subscription plans, and platform revenue.',
      href: '/super-admin/dashboard',
      icon: BiShieldQuarter,
      badge: 'Platform HQ',
      color: '#3478D4',
      features: ['1,248 Restaurant Owners', 'Subscription Tiers & Plans', 'Platform MRR & Revenue', 'Chain Approvals'],
    },
  ];

  return (
    <div className="min-vh-100 bg-surface d-flex flex-column justify-content-between">
      {/* Top Navbar */}
      <nav className="bg-navy py-3 px-4 border-bottom border-secondary border-opacity-25 sticky-top">
        <div className="container d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-2">
            <div 
              className="d-flex align-items-center justify-content-center rounded-3 bg-brand text-white fw-bold"
              style={{ width: '38px', height: '38px', fontSize: '20px' }}
            >
              Z
            </div>
            <span className="fw-bold fs-4 text-white">
              ZEST<span className="text-brand">ORA</span>
            </span>
          </div>

          <div className="d-flex align-items-center gap-2">
            <Link href="/login" className="btn btn-outline-light btn-sm px-3 rounded-pill">
              Switch Persona / Login
            </Link>
            <Link href="/owner/dashboard" className="btn btn-brand btn-sm px-3 rounded-pill fw-semibold">
              Enter Owner App
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="py-5 text-center bg-white border-bottom border-subtle">
        <div className="container">
          <span className="badge badge-soft-brand px-3 py-2 rounded-pill fw-semibold mb-3">
            Enterprise Restaurant Management SaaS Platform
          </span>
          <h1 className="fw-bolder text-navy display-5 mb-3">
            Modern Cloud POS & Restaurant Operations
          </h1>
          <p className="text-muted-custom mx-auto fs-6" style={{ maxWidth: '680px' }}>
            Built with modern Next.js App Router, Bootstrap 5, React Icons, and Recharts with complete realistic dummy data,
            omnichannel ordering, multi-tenant data isolation, and interactive role switching.
          </p>

          <div className="d-flex justify-content-center gap-3 mt-4 flex-wrap">
            <Link href="/owner/dashboard" className="btn btn-brand px-4 py-2 fw-semibold d-flex align-items-center gap-2 shadow-sm">
              <span>Go to Owner Dashboard</span>
              <BiRightArrowAlt size={20} />
            </Link>
            <Link href="/super-admin/dashboard" className="btn btn-outline-secondary px-4 py-2 fw-semibold d-flex align-items-center gap-2">
              <BiShieldQuarter size={18} />
              <span>Super Admin Platform</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Portal Cards Grid */}
      <section className="container py-5">
        <h4 className="fw-bold text-navy text-center mb-4">Choose a Workspace to Explore</h4>
        <div className="row g-4">
          {portals.map((portal, idx) => {
            const Icon = portal.icon;
            return (
              <div key={idx} className="col-12 col-md-6">
                <div className="app-card p-4 h-100 bg-white border-subtle d-flex flex-column justify-content-between shadow-sm">
                  <div>
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div 
                        className="rounded-3 p-3 d-flex align-items-center justify-content-center"
                        style={{ backgroundColor: `${portal.color}15`, color: portal.color }}
                      >
                        <Icon size={28} />
                      </div>
                      <span className="badge rounded-pill bg-light text-navy border border-subtle">
                        {portal.badge}
                      </span>
                    </div>

                    <h5 className="fw-bold text-navy mb-2">{portal.title}</h5>
                    <p className="text-muted-custom small mb-3">{portal.description}</p>

                    <div className="mb-4">
                      {portal.features.map((feat, fIdx) => (
                        <div key={fIdx} className="d-flex align-items-center gap-2 text-navy small mb-1">
                          <BiCheckCircle className="text-success flex-shrink-0" size={15} />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Link 
                    href={portal.href} 
                    className="btn btn-outline-brand w-100 fw-semibold d-flex align-items-center justify-content-center gap-2 mt-auto"
                  >
                    <span>Launch {portal.title}</span>
                    <BiRightArrowAlt size={18} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-4 bg-navy text-white text-center border-top border-secondary border-opacity-25 mt-auto">
        <div className="container">
          <p className="mb-1 fw-semibold">Zestora Restaurant SaaS Suite</p>
          <p className="text-white-50 small mb-0">
            Next.js App Router • Bootstrap 5 Utilities • Recharts • Full Frontend Functional Interactivity
          </p>
        </div>
      </footer>
    </div>
  );
}
