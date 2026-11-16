'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { SAMPLE_AI_PRESET_QUESTIONS, SAMPLE_AI_CHAT_HISTORY } from '@/data/saasData';
import { AiChatMessage } from '@/types/saas';
import {
  BiBrain,
  BiSend,
  BiStar,
  BiTrendingUp,
  BiDish,
  BiDollarCircle,
  BiCheckCircle,
  BiUser,
} from 'react-icons/bi';

export default function BusinessOwnerAiAssistantPage() {
  const [messages, setMessages] = useState<AiChatMessage[]>(SAMPLE_AI_CHAT_HISTORY);
  const [inputQuestion, setInputQuestion] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  const handleAsk = (questionText: string) => {
    if (!questionText.trim()) return;

    const userMsg: AiChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      message: questionText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuestion('');
    setIsThinking(true);

    setTimeout(() => {
      let reply = '';
      let metricsCard: AiChatMessage['metricsCard'] | undefined = undefined;
      let suggestions: string[] = [];

      const q = questionText.toLowerCase();

      if (q.includes('weekend') || q.includes('forecast') || q.includes('demand')) {
        reply =
          'Based on historical weekend sales, current table reservations (18 parties booked), and upcoming local events, here is your Friday - Sunday demand forecast:\n\n' +
          '• **Projected Weekend Revenue:** ₹3,31,500 (+14% vs last weekend)\n' +
          '• **Expected Covers / Footfall:** 780 diners\n' +
          '• **Key Raw Material Alert:** Fresh Chicken requirement is estimated at 145 kg, but current commissary stock is only 42 kg. **Reorder 105 kg before Friday noon.**\n' +
          '• **Peak Kitchen Rush Hours:** Saturday 08:30 PM - 10:30 PM & Sunday 01:00 PM - 03:00 PM.';
        metricsCard = {
          label: 'Estimated Weekend Revenue',
          value: '₹3,31,500',
          sublabel: '780 Projected Covers | 96% Model Confidence',
          sentiment: 'positive',
        };
        suggestions = ['Generate Chicken reorder PO', 'Review staff shift allocations', 'Check table reservations'];
      } else if (q.includes('profit') || q.includes('dip') || q.includes('loss')) {
        reply =
          'Analysis of Tuesday’s ledger shows a temporary dip in net operating profit from your typical 32% margin down to 24.8%. Here were the key drivers:\n\n' +
          '1. **Higher Food Wastage:** ₹1,420 worth of gravy and dairy spoilage was logged at Indiranagar.\n' +
          '2. **Promotion Redemptions:** Heavy redemption of WELCOME50 codes (₹4,200 discount given).\n' +
          '3. **Low Dine-In Table Turnover:** Average table occupancy was 78 minutes compared to target 45 minutes.\n\n' +
          '**Actionable Next Step:** Tighten afternoon gravy batch sizes and limit WELCOME50 to delivery channels only.';
        metricsCard = {
          label: 'Tuesday Margin Impact',
          value: '24.8% vs 32% Avg',
          sublabel: '₹5,620 discount & wastage drag',
          sentiment: 'warning',
        };
        suggestions = ['View Food Waste log', 'Optimize coupon rules', 'Check hourly table turns'];
      } else if (q.includes('dessert') || q.includes('beverage') || q.includes('boost')) {
        reply =
          'Here are 3 high-impact upsell strategies recommended for your POS and Waiter tablets:\n\n' +
          '1. **POS Prompt Automation:** Enable automatic prompt on POS: when a customer orders Hyderabadi Biryani, prompt the cashier to ask: "Would you like our signature Masala Chaas or Gulab Jamun for ₹49?"\n' +
          '2. **Combo Meal Bundles:** Create a "Family Feast" combo that bundles a 1-litre beverage and 4 pastries at 15% bundled savings. High beverage margin (82%) subsidizes the discount.\n' +
          '3. **Table QR Dessert Showcase:** Move photo-rich dessert cards to the top of your digital menu after 8:30 PM.';
        metricsCard = {
          label: 'Upsell Revenue Potential',
          value: '+₹42,000 / month',
          sublabel: '82% gross margin on cold brew & desserts',
          sentiment: 'positive',
        };
        suggestions = ['Create Biryani + Beverage Combo', 'Configure POS upsell prompt', 'Update digital menu layout'];
      } else {
        reply =
          `I analyzed your live restaurant POS data regarding "${questionText}". Operations across Indiranagar and Koramangala branches are performing strongly with an average food cost of 29.8% and customer satisfaction rating of 4.8 / 5.0. All inventory stock thresholds are currently within safe operational buffers.`;
        suggestions = ['Show high food cost dishes', 'Weekend demand forecast', 'Review guest reviews'];
      }

      const assistantMsg: AiChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        message: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        metricsCard,
        suggestions,
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setIsThinking(false);
    }, 800);
  };

  return (
    <DashboardLayout allowedRoles={['restaurant_owner', 'branch_manager']}>
      <div className="container-fluid p-0">
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div>
            <div className="d-flex align-items-center gap-2">
              <span className="p-2 rounded bg-primary-subtle text-primary">
                <BiBrain size={24} />
              </span>
              <h1 className="h3 fw-bold text-dark mb-0">AI Restaurant Intelligence Copilot</h1>
              <span className="badge bg-primary-subtle text-primary border border-primary-subtle">
                GPT-4o Deep Copilot
              </span>
            </div>
            <p className="text-muted small mb-0 mt-1">
              Ask natural language questions about your menus, supplier purchase inflation, food cost leaks, and sales forecasting.
            </p>
          </div>
        </div>

        {/* Preset Prompt Pills */}
        <div className="mb-4">
          <div className="text-muted small fw-semibold mb-2">Suggested Business Inquiries:</div>
          <div className="d-flex flex-wrap gap-2">
            {SAMPLE_AI_PRESET_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                className="btn btn-outline-secondary btn-sm bg-white rounded-pill px-3 py-1 text-start"
                onClick={() => handleAsk(q)}
              >
                <BiStar className="text-primary me-1" /> {q}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Feed Card */}
        <div className="card border-0 shadow-sm rounded-3 bg-white mb-4 d-flex flex-column" style={{ minHeight: '520px' }}>
          <div className="card-body p-4 flex-grow-1 overflow-auto" style={{ maxHeight: '520px' }}>
            {messages.map((m) => {
              const isUser = m.sender === 'user';
              return (
                <div
                  key={m.id}
                  className={`d-flex mb-4 ${isUser ? 'justify-content-end' : 'justify-content-start'}`}
                >
                  <div
                    className={`d-flex gap-3 max-w-75 ${
                      isUser ? 'flex-row-reverse' : 'flex-row'
                    }`}
                    style={{ maxWidth: '85%' }}
                  >
                    <div
                      className={`p-2 rounded-circle flex-shrink-0 d-flex align-items-center justify-content-center ${
                        isUser ? 'bg-primary text-white' : 'bg-dark text-white'
                      }`}
                      style={{ width: '38px', height: '38px' }}
                    >
                      {isUser ? <BiUser size={20} /> : <BiBrain size={20} />}
                    </div>

                    <div>
                      <div
                        className={`p-3 rounded-3 shadow-sm ${
                          isUser
                            ? 'bg-primary text-white'
                            : 'bg-light text-dark border'
                        }`}
                      >
                        <div
                          className="small"
                          style={{ whiteSpace: 'pre-line', lineHeight: '1.6' }}
                        >
                          {m.message}
                        </div>

                        {/* Metric card preview if present */}
                        {m.metricsCard && (
                          <div className="mt-3 p-3 bg-white rounded-2 border text-dark">
                            <div className="d-flex justify-content-between align-items-center">
                              <div>
                                <div className="text-muted" style={{ fontSize: '11px' }}>
                                  {m.metricsCard.label}
                                </div>
                                <div className="fw-bold fs-5 text-primary">
                                  {m.metricsCard.value}
                                </div>
                              </div>
                              <span
                                className={`badge ${
                                  m.metricsCard.sentiment === 'positive'
                                    ? 'bg-success-subtle text-success'
                                    : 'bg-warning-subtle text-warning-emphasis'
                                } border`}
                              >
                                {m.metricsCard.sublabel}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div
                        className={`text-muted small mt-1 ${
                          isUser ? 'text-end' : 'text-start'
                        }`}
                        style={{ fontSize: '11px' }}
                      >
                        {m.timestamp}
                      </div>

                      {/* Suggestions pills if present */}
                      {!isUser && m.suggestions && m.suggestions.length > 0 && (
                        <div className="d-flex flex-wrap gap-1 mt-2">
                          {m.suggestions.map((sug, sIdx) => (
                            <button
                              key={sIdx}
                              className="btn btn-xs btn-outline-primary py-0 px-2 rounded-pill"
                              style={{ fontSize: '11px' }}
                              onClick={() => handleAsk(sug)}
                            >
                              + {sug}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {isThinking && (
              <div className="d-flex align-items-center gap-2 text-muted small p-2">
                <div className="spinner-grow spinner-grow-sm text-primary" role="status"></div>
                <span>AI Copilot is analyzing recipe margins, POS records and inventory...</span>
              </div>
            )}
          </div>

          {/* Chat Input Bar */}
          <div className="card-footer bg-white border-top p-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAsk(inputQuestion);
              }}
            >
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ask anything (e.g. Which dishes have highest profit margin? Forecast raw materials for tomorrow...)"
                  value={inputQuestion}
                  onChange={(e) => setInputQuestion(e.target.value)}
                />
                <button
                  type="submit"
                  className="btn btn-primary px-4 d-flex align-items-center gap-2"
                  disabled={!inputQuestion.trim() || isThinking}
                >
                  <BiSend size={18} /> Ask AI
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
