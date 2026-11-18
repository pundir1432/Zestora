'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PlanGate } from '@/components/common/PlanBadge';
import { useHospitality } from '@/context/HospitalityContext';
import { reportService, auditService } from '@/services';
import { formatNumber } from '@/utils/formatters';
import { BiBrain, BiSend, BiCheckCircle, BiData, BiHistory, BiLogoWhatsapp, BiInfoCircle } from 'react-icons/bi';

interface AiChatMessage {
  id: string;
  sender: 'user' | 'ai';
  channel: 'Web AI' | 'WhatsApp Bot';
  text: string;
  dataSource?: string;
  suggestedAction?: { label: string; description: string };
  timestamp: string;
}

const EXAMPLE_QUESTIONS = [
  'How much did we sell today?',
  'Which room is vacant?',
  'Show pending Form III.',
  'How many orders are ready?',
  'Which staff member gave the most discounts?',
  "Show yesterday's revenue.",
];

export default function WhatsAppAiAssistantPage() {
  const { rooms, dorms, formIIIRecords, readyBoardOrders, pushNotification } = useHospitality();
  const [channel, setChannel] = useState<'Web AI' | 'WhatsApp Bot'>('WhatsApp Bot');
  const [input, setInput] = useState('');
  const [pendingAction, setPendingAction] = useState<{ label: string; description: string } | null>(null);
  const [actionHistory, setActionHistory] = useState<{ id: string; time: string; action: string; status: string }[]>([
    { id: 'ACT-101', time: '09:15 AM', action: 'Sent Morning Revenue & Occupancy Digest to Owner WhatsApp', status: 'Confirmed (Mock)' },
  ]);

  const [messages, setMessages] = useState<AiChatMessage[]>([
    {
      id: 'init-1',
      sender: 'ai',
      channel: 'WhatsApp Bot',
      text: 'Namaste! I am your Zestora Hospitality AI & WhatsApp Assistant. Ask me about today’s Restaurant + Room + Camp sales, vacant rooms/dorms, pending Form III deadlines, ready orders, or staff discounts.',
      dataSource: 'Demo Mock Context (Live Local State)',
      timestamp: 'Now',
    },
  ]);

  const buildMockAnswer = (q: string): { text: string; dataSource: string; suggestedAction?: { label: string; description: string } } => {
    const low = q.toLowerCase();
    const kpi = reportService.getDashboardSummary();
    const exceptions = auditService.getExceptions();

    if (low.includes('sell today') || low.includes('sales today') || low.includes('today')) {
      return {
        text: `Today's Total Hospitality Revenue is ₹${formatNumber(kpi.todayTotalRevenue)} (Demo Data):\n• Restaurant & Cafe: ₹${formatNumber(kpi.restaurantSales)} (${kpi.totalOrders} orders)\n• Rooms & Hostel Dorms: ₹${formatNumber(kpi.roomRevenue)}\n• Camp & Rafting Activities: ₹${formatNumber(kpi.campRevenue)}\n• GST Collected: ₹${formatNumber(kpi.gstCollectedToday)}`,
        dataSource: 'reportService.getDashboardSummary() • Demo Mock Data',
        suggestedAction: {
          label: 'Send Daily Sales Digest on WhatsApp',
          description: 'Send a formatted summary of today’s ₹1,74,350 revenue to Owner & Group GM on WhatsApp (Mock).',
        },
      };
    }

    if (low.includes('vacant') || low.includes('room')) {
      const availRooms = rooms.filter(r => r.status === 'Available' || r.status === 'Clean');
      const availBeds = dorms.reduce((s, d) => s + d.beds.filter(b => b.status === 'Available').length, 0);
      return {
        text: `Currently Available Units (${availRooms.length} Rooms/Tents & ${availBeds} Hostel Dorm Beds):\n${availRooms
          .map(r => `• Room/Tent ${r.roomNumber} (${r.roomType}) — ₹${formatNumber(r.tariffPerNight)}/night [${r.status}]`)
          .join('\n')}\n• Plus ${availBeds} vacant bunk beds across Mixed, Female-Only & Male-Only Dorms.`,
        dataSource: 'propertyService.getRooms() + getDorms() • Live Local State',
      };
    }

    if (low.includes('form iii') || low.includes('foreign') || low.includes('frro')) {
      const pending = formIIIRecords.filter(r => r.status !== 'Submitted');
      return {
        text: `There are ${pending.length} pending Form III foreign guest filings:\n${pending
          .map(r => `• ${r.guestName} (${r.nationality}, ${r.unitLabel}) — Status: ${r.status} (${r.deadlineLabel})`)
          .join('\n')}`,
        dataSource: 'complianceService.getFormIIIRecords() • Live Local State',
        suggestedAction: {
          label: 'Send Urgent WhatsApp Reminder to Front Desk',
          description: 'Alert Tapovan Front Desk & Compliance Officer to immediately clear Lukas Weber’s overdue Form III.',
        },
      };
    }

    if (low.includes('ready') || low.includes('order')) {
      const ready = readyBoardOrders.filter(o => o.stage === 'READY');
      const prep = readyBoardOrders.filter(o => o.stage === 'PREPARING');
      return {
        text: `Kitchen & Order Ready Board Status:\n• READY for Pickup (${ready.length}): ${ready.map(o => `#${o.tokenNumber} (${o.customerShortName})`).join(', ') || 'None'}\n• Currently Preparing: ${prep.length} orders`,
        dataSource: 'orderService.getReadyBoardOrders() • Live Local State',
      };
    }

    if (low.includes('discount') || low.includes('staff')) {
      const disc = exceptions.filter(e => e.category === 'Discount' || e.category === 'Price Edit');
      return {
        text: `Top Staff Discount & Price Override Activity (Demo Exceptions):\n${disc
          .map(e => `• ${e.staffName} (${e.outlet}): ₹${formatNumber(e.amountImpact)} — ${e.details} [${e.status}]`)
          .join('\n')}`,
        dataSource: 'auditService.getExceptions() • Demo Mock Data',
        suggestedAction: {
          label: 'Flag Cashier Discount Audit Task',
          description: 'Create an audit reminder to review discounts > 10% during Day Close.',
        },
      };
    }

    if (low.includes('yesterday')) {
      return {
        text: `Yesterday's Total Revenue (17 Nov 2026 — Demo Data): ₹1,59,500\n• Rooms & Dorms: ₹69,000\n• Restaurant & Cafe: ₹62,100\n• Camp & Adventure: ₹28,400\n• Day Close Status: Closed cleanly with ₹0 cash variance.`,
        dataSource: 'reportService Historical Snapshot • Demo Mock Data',
      };
    }

    return {
      text: `Mock Assistant Reply for "${q}":\nI checked your active Rishikesh property context. Try asking one of the hospitality quick prompts above (Today's sales, Vacant rooms, Pending Form III, Ready orders, Staff discounts, or Yesterday's revenue).`,
      dataSource: 'Mock Hospitality Assistant Router',
    };
  };

  const askQuestion = (questionText: string) => {
    const trimmed = questionText.trim();
    if (!trimmed) return;
    const ans = buildMockAnswer(trimmed);
    const nowTime = new Date().toTimeString().slice(0, 5);

    setMessages(prev => [
      ...prev,
      { id: `u-${Date.now()}`, sender: 'user', channel, text: trimmed, timestamp: nowTime },
      {
        id: `a-${Date.now() + 1}`,
        sender: 'ai',
        channel,
        text: ans.text,
        dataSource: ans.dataSource,
        suggestedAction: ans.suggestedAction,
        timestamp: nowTime,
      },
    ]);
    setInput('');
  };

  const confirmAction = () => {
    if (!pendingAction) return;
    const nowTime = new Date().toTimeString().slice(0, 5);
    setActionHistory(prev => [
      { id: `ACT-${Math.floor(110 + Math.random() * 880)}`, time: nowTime, action: pendingAction.label, status: 'Executed (Mock)' },
      ...prev,
    ]);
    pushNotification({
      category: 'New Order',
      title: `AI Action Executed: ${pendingAction.label}`,
      message: pendingAction.description,
      severity: 'success',
    });
    setPendingAction(null);
  };

  return (
    <DashboardLayout allowedRoles={['restaurant_owner', 'branch_manager']}>
      <PlanGate featureKey="aiWhatsappAssistant" requiredTier="G" featureTitle="WhatsApp & Hospitality AI Assistant">
        <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-2 mb-3">
          <div>
            <h3 className="fw-bold text-navy mb-1 d-flex align-items-center gap-2">
              <BiBrain className="text-brand" /> WhatsApp &amp; Hospitality AI Assistant
            </h3>
            <p className="text-muted-custom small mb-0">
              Ask natural questions across Restaurant POS, Hotel/Hostel Occupancy, Form III FRRO &amp; Staff Exceptions — with explicit action confirmation
            </p>
          </div>
          <div className="btn-group btn-group-sm">
            <button type="button" onClick={() => setChannel('WhatsApp Bot')} className={`btn fw-semibold d-flex align-items-center gap-1 ${channel === 'WhatsApp Bot' ? 'btn-success text-white' : 'btn-outline-secondary bg-white text-navy'}`}>
              <BiLogoWhatsapp size={16} /> WhatsApp UI
            </button>
            <button type="button" onClick={() => setChannel('Web AI')} className={`btn fw-semibold ${channel === 'Web AI' ? 'btn-brand text-white' : 'btn-outline-secondary bg-white text-navy'}`}>
              Web Copilot
            </button>
          </div>
        </div>

        <div className="alert alert-info border-0 bg-info bg-opacity-10 rounded-3 py-2 px-3 small mb-3 d-flex align-items-center gap-2">
          <BiInfoCircle className="text-primary flex-shrink-0" size={18} />
          <span><strong>Transparent Mock Mode:</strong> Responses read live local frontend mock state &amp; services. No external LLM or WhatsApp Business API is called yet.</span>
        </div>

        {/* Example Quick Prompts */}
        <div className="d-flex gap-2 flex-wrap mb-3">
          {EXAMPLE_QUESTIONS.map(q => (
            <button
              key={q}
              type="button"
              onClick={() => askQuestion(q)}
              className="btn btn-sm rounded-pill bg-white border border-subtle text-navy fw-medium"
              style={{ fontSize: '12px' }}
            >
              &ldquo;{q}&rdquo;
            </button>
          ))}
        </div>

        <div className="row g-3">
          {/* Chat Area */}
          <div className="col-12 col-lg-8">
            <div className="app-card d-flex flex-column overflow-hidden" style={{ height: '520px' }}>
              <div className={`px-3 py-2.5 d-flex justify-content-between align-items-center text-white ${channel === 'WhatsApp Bot' ? 'bg-success' : 'bg-navy'}`}>
                <span className="fw-bold small d-flex align-items-center gap-2">
                  {channel === 'WhatsApp Bot' ? <BiLogoWhatsapp size={18} /> : <BiBrain size={18} />}
                  Zestora {channel} • Connected to Mock Services
                </span>
                <span className="badge bg-white bg-opacity-25">EN / हिंदी Ready</span>
              </div>

              <div className="flex-grow-1 p-3 overflow-y-auto d-flex flex-column gap-3" style={{ backgroundColor: channel === 'WhatsApp Bot' ? '#EFEAE2' : '#F8FAFC' }}>
                {messages.map(m => (
                  <div key={m.id} className={`d-flex flex-column ${m.sender === 'user' ? 'align-items-end' : 'align-items-start'}`}>
                    <div
                      className={`p-3 rounded-4 shadow-2xs ${
                        m.sender === 'user' ? 'bg-navy text-white' : 'bg-white text-navy border border-subtle'
                      }`}
                      style={{ maxWidth: '85%', whiteSpace: 'pre-line', fontSize: '13px' }}
                    >
                      {m.text}
                      {m.dataSource && (
                        <div className="mt-2 pt-2 border-top d-flex align-items-center gap-1 text-muted-custom" style={{ fontSize: '10px' }}>
                          <BiData className="text-brand" /> Context Source: <strong>{m.dataSource}</strong>
                        </div>
                      )}
                      {m.suggestedAction && (
                        <div className="mt-2">
                          <button
                            type="button"
                            onClick={() => setPendingAction(m.suggestedAction!)}
                            className="btn btn-sm btn-brand text-white fw-semibold"
                            style={{ fontSize: '11px' }}
                          >
                            {m.suggestedAction.label} &rarr;
                          </button>
                        </div>
                      )}
                    </div>
                    <span className="text-muted-custom mt-1 px-1" style={{ fontSize: '10px' }}>{m.timestamp}</span>
                  </div>
                ))}
              </div>

              <form
                onSubmit={e => {
                  e.preventDefault();
                  askQuestion(input);
                }}
                className="p-2.5 bg-white border-top d-flex gap-2"
              >
                <input
                  className="form-control form-control-sm"
                  placeholder="Ask about sales, vacant rooms, Form III, ready orders, discounts..."
                  value={input}
                  onChange={e => setInput(e.target.value)}
                />
                <button type="submit" className="btn btn-brand btn-sm text-white fw-semibold px-3 d-flex align-items-center gap-1">
                  <BiSend /> Send
                </button>
              </form>
            </div>
          </div>

          {/* Right: Action History & Safety Guardrails */}
          <div className="col-12 col-lg-4">
            <div className="app-card p-3 h-100">
              <h6 className="fw-bold text-navy small mb-3 d-flex align-items-center gap-1">
                <BiHistory className="text-brand" /> Confirmed Action History
              </h6>
              <div className="d-flex flex-column gap-2">
                {actionHistory.map(act => (
                  <div key={act.id} className="p-2.5 rounded-3 bg-surface border border-subtle small">
                    <div className="fw-semibold text-navy">{act.action}</div>
                    <div className="d-flex justify-content-between align-items-center mt-1" style={{ fontSize: '10px' }}>
                      <span className="text-muted-custom">{act.time}</span>
                      <span className="badge badge-soft-success d-inline-flex align-items-center gap-1"><BiCheckCircle /> {act.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Confirmation Dialog */}
        {pendingAction && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content rounded-4 overflow-hidden">
                <div className="modal-header bg-navy text-white">
                  <h6 className="modal-title fw-bold">Confirm AI-Assisted Action</h6>
                  <button type="button" className="btn-close btn-close-white" onClick={() => setPendingAction(null)} />
                </div>
                <div className="modal-body p-4">
                  <div className="fw-bold text-navy mb-2">{pendingAction.label}</div>
                  <p className="text-muted-custom small mb-0">{pendingAction.description}</p>
                </div>
                <div className="modal-footer">
                  <button type="button" onClick={() => setPendingAction(null)} className="btn btn-outline-secondary btn-sm">Cancel</button>
                  <button type="button" onClick={confirmAction} className="btn btn-brand btn-sm text-white fw-semibold px-4">
                    Confirm &amp; Execute (Mock)
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </PlanGate>
    </DashboardLayout>
  );
}
