'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { BiWrench, BiPrinter, BiBell, BiWifi, BiCheckCircle, BiData } from 'react-icons/bi';

export default function LocalHelperToolsPage() {
  const [testLog, setTestLog] = useState<string[]>([
    '[17:42:10] Local Helper Bridge v2.8.4 listening on LAN 192.168.1.21:9100',
    '[17:42:12] Thermal Printer EPSON TM-T82III (80mm) — Ready',
    '[17:42:14] Kitchen KOT Printer (Tandoor Station) — Ready',
    '[17:42:15] LAN Peer Relay connected to Ready Board TV (192.168.1.40)',
  ]);

  const runDiagnostic = (msg: string) => {
    const time = new Date().toTimeString().slice(0, 8);
    setTestLog(prev => [`[${time}] ${msg}`, ...prev]);
  };

  return (
    <DashboardLayout allowedRoles={['restaurant_owner', 'branch_manager', 'cashier']}>
      <div className="mb-4">
        <h3 className="fw-bold text-navy mb-1 d-flex align-items-center gap-2">
          <BiWrench className="text-brand" /> Local Helper Tools &amp; Hardware Bridge (Mock)
        </h3>
        <p className="text-muted-custom small mb-0">
          Desktop/LAN utility UI for thermal ESC/POS printing, cash drawer kick, kitchen bell &amp; local offline peer relay
        </p>
      </div>

      <div className="row g-3 mb-4">
        {[
          { title: '80mm Thermal Bill Printer', sub: 'USB / LAN 192.168.1.50:9100 • EPSON TM-T82III', btn: 'Test Print Receipt', icon: BiPrinter, msg: 'Sent ESC/POS test receipt to 80mm Thermal Bill Printer — OK' },
          { title: 'Kitchen KOT Printer & Buzzer', sub: 'Main Kitchen + Rooftop Bar • Auto-cut enabled', btn: 'Ring Kitchen Bell', icon: BiBell, msg: 'Triggered KOT print & buzzer chime on Main Kitchen printer — OK' },
          { title: 'LAN Peer Relay (Offline KDS)', sub: 'Zero-internet POS → KDS → Ready Board TV bridge', btn: 'Ping LAN Peers', icon: BiWifi, msg: 'LAN Relay Ping: KDS (4ms), Ready Board TV (6ms), Kiosk #1 (5ms) — Healthy' },
          { title: 'Local IndexedDB / Cache Snapshot', sub: 'Menu, 33 Roles Snapshot & Offline Invoice Series', btn: 'Verify Local Cache', icon: BiData, msg: 'Local offline cache verified: 142 menu items, 33 roles, 4 gap-free series locked' },
        ].map(tool => {
          const Icon = tool.icon;
          return (
            <div key={tool.title} className="col-12 col-md-6">
              <div className="app-card p-3.5 h-100 d-flex flex-column justify-content-between">
                <div className="d-flex align-items-start gap-3 mb-3">
                  <div className="rounded-3 bg-surface p-2.5 text-brand"><Icon size={24} /></div>
                  <div>
                    <div className="fw-bold text-navy">{tool.title}</div>
                    <div className="text-muted-custom small">{tool.sub}</div>
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                  <span className="badge badge-soft-success d-inline-flex align-items-center gap-1"><BiCheckCircle /> Simulated Ready</span>
                  <button type="button" onClick={() => runDiagnostic(tool.msg)} className="btn btn-sm btn-brand text-white fw-semibold">
                    {tool.btn}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="app-card p-3 p-md-4 bg-navy text-white">
        <div className="fw-bold small mb-2 text-brand">Local Helper Diagnostic Console (Mock)</div>
        <div className="font-monospace small" style={{ maxHeight: '220px', overflowY: 'auto' }}>
          {testLog.map((line, i) => (
            <div key={i} className="mb-1 text-white-50">{line}</div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
