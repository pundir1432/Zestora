'use client';

import React, { useState, useMemo } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { SAMPLE_PROFIT_LOSS_DATA } from '@/data/saasData';
import { ProfitLossMonth } from '@/types/saas';
import { formatCurrency, formatNumber } from '@/utils/formatters';
import {
  BiTrendingUp,
  BiDollarCircle,
  BiPieChartAlt2,
  BiCalculator,
  BiDownload,
  BiCheckCircle,
} from 'react-icons/bi';

export default function BusinessOwnerProfitLossPage() {
  const [pnlData] = useState<ProfitLossMonth[]>(SAMPLE_PROFIT_LOSS_DATA);

  // Break-even calculator interactive inputs
  const [monthlyFixedCost, setMonthlyFixedCost] = useState(450000); // Rent, salaries, license
  const [avgMarginPercent, setAvgMarginPercent] = useState(68); // 100 - food cost %

  const latestMonth = pnlData[pnlData.length - 1]; // Nov 2026 (MTD)
  const fullOctMonth = pnlData[pnlData.length - 2]; // Oct 2026

  const breakEvenMonthlySales = useMemo(() => {
    if (avgMarginPercent === 0) return 0;
    return Math.round(monthlyFixedCost / (avgMarginPercent / 100));
  }, [monthlyFixedCost, avgMarginPercent]);

  const breakEvenDailySales = useMemo(() => {
    return Math.round(breakEvenMonthlySales / 30);
  }, [breakEvenMonthlySales]);

  return (
    <DashboardLayout allowedRoles={['restaurant_owner', 'accountant']}>
      <div className="container-fluid p-0">
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div>
            <h1 className="h3 fw-bold text-dark mb-1">True Profit & Loss Statement (P&L)</h1>
            <p className="text-muted small mb-0">
              Complete restaurant financials incorporating POS revenues, supplier raw material COGS, operational overheads, and EBITDA margin.
            </p>
          </div>
          <div>
            <button
              className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2"
              onClick={() => alert('Downloading official CA Audit P&L Statement as PDF...')}
            >
              <BiDownload /> Export P&L (PDF/Excel)
            </button>
          </div>
        </div>

        {/* Current Month Stat Cards */}
        <div className="row g-3 mb-4">
          <div className="col-12 col-sm-6 col-xl-3">
            <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted small fw-medium">Net Revenue (MTD)</span>
                <span className="p-2 rounded bg-primary-subtle text-primary">
                  <BiDollarCircle size={20} />
                </span>
              </div>
              <h3 className="fw-bold mb-1" suppressHydrationWarning>₹{formatNumber(latestMonth.netRevenue)}</h3>
              <span className="text-muted small">After ₹{formatNumber(latestMonth.discounts)} discounts</span>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-xl-3">
            <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted small fw-medium">Cost of Ingredients (COGS)</span>
                <span className="p-2 rounded bg-danger-subtle text-danger">
                  <BiPieChartAlt2 size={20} />
                </span>
              </div>
              <h3 className="fw-bold mb-1" suppressHydrationWarning>₹{formatNumber(latestMonth.costOfIngredients)}</h3>
              <span className="text-success small fw-medium">{latestMonth.foodCostPercentage}% Food Cost (Safe &lt;32%)</span>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-xl-3">
            <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted small fw-medium">Gross Kitchen Margin</span>
                <span className="p-2 rounded bg-warning-subtle text-warning-emphasis">
                  <BiTrendingUp size={20} />
                </span>
              </div>
              <h3 className="fw-bold mb-1" suppressHydrationWarning>₹{formatNumber(latestMonth.grossProfit)}</h3>
              <span className="text-muted small">{(100 - latestMonth.foodCostPercentage).toFixed(1)}% Contribution Margin</span>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-xl-3">
            <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted small fw-medium">Net Operating Profit (EBITDA)</span>
                <span className="p-2 rounded bg-success-subtle text-success">
                  <BiCheckCircle size={20} />
                </span>
              </div>
              <h3 className="fw-bold text-success mb-1" suppressHydrationWarning>₹{formatNumber(latestMonth.netOperatingProfit)}</h3>
              <span className="text-success small fw-medium">{latestMonth.netMarginPercentage}% Net Profit Margin</span>
            </div>
          </div>
        </div>

        {/* 6-Month Historical P&L Table */}
        <div className="card border-0 shadow-sm rounded-3 bg-white mb-4">
          <div className="card-header bg-white border-bottom py-3">
            <h5 className="fw-bold mb-0 text-dark">6-Month Comparative P&L Statement</h5>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0 text-end">
                <thead className="table-light text-uppercase small text-muted">
                  <tr>
                    <th className="text-start ps-3 py-3">Financial Metric</th>
                    {pnlData.map((m) => (
                      <th key={m.month} className="py-3 px-3">{m.month}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="small">
                  <tr>
                    <td className="text-start ps-3 fw-semibold text-dark">Gross Billed Sales</td>
                    {pnlData.map((m) => (
                      <td key={m.month} suppressHydrationWarning>₹{formatNumber(m.grossSales)}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="text-start ps-3 text-muted">Less: Customer Discounts & Promos</td>
                    {pnlData.map((m) => (
                      <td key={m.month} className="text-danger" suppressHydrationWarning>-₹{formatNumber(m.discounts)}</td>
                    ))}
                  </tr>
                  <tr className="table-light fw-bold">
                    <td className="text-start ps-3 text-dark">Net Restaurant Revenue</td>
                    {pnlData.map((m) => (
                      <td key={m.month} className="text-dark" suppressHydrationWarning>₹{formatNumber(m.netRevenue)}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="text-start ps-3 text-danger">Less: Cost of Ingredients (COGS)</td>
                    {pnlData.map((m) => (
                      <td key={m.month} className="text-danger" suppressHydrationWarning>-₹{formatNumber(m.costOfIngredients)}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="text-start ps-3 text-muted">Food Cost %</td>
                    {pnlData.map((m) => (
                      <td key={m.month}>
                        <span className="badge bg-light text-dark border">{m.foodCostPercentage}%</span>
                      </td>
                    ))}
                  </tr>
                  <tr className="table-light fw-bold">
                    <td className="text-start ps-3 text-dark">Gross Kitchen Profit</td>
                    {pnlData.map((m) => (
                      <td key={m.month} className="text-primary" suppressHydrationWarning>₹{formatNumber(m.grossProfit)}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="text-start ps-3 text-danger">Less: Operating Expenses (Rent, Staff, Power, Ads)</td>
                    {pnlData.map((m) => (
                      <td key={m.month} className="text-danger" suppressHydrationWarning>-₹{formatNumber(m.operatingExpenses)}</td>
                    ))}
                  </tr>
                  <tr className="table-success fw-bold fs-6">
                    <td className="text-start ps-3 text-success">Net Operating Profit (EBITDA)</td>
                    {pnlData.map((m) => (
                      <td key={m.month} className="text-success" suppressHydrationWarning>₹{formatNumber(m.netOperatingProfit)}</td>
                    ))}
                  </tr>
                  <tr className="fw-semibold">
                    <td className="text-start ps-3 text-muted">Net Margin %</td>
                    {pnlData.map((m) => (
                      <td key={m.month} className="text-success">{m.netMarginPercentage}%</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Break-Even Calculator Card */}
        <div className="card border-0 shadow-sm rounded-3 bg-white">
          <div className="card-header bg-white border-bottom py-3 d-flex align-items-center gap-2">
            <span className="p-2 rounded bg-primary-subtle text-primary">
              <BiCalculator size={20} />
            </span>
            <h5 className="fw-bold mb-0 text-dark">Interactive Restaurant Break-Even Calculator</h5>
          </div>
          <div className="card-body p-4">
            <p className="text-muted small mb-4">
              Determine the exact daily and monthly revenue targets your dining outlets must generate to clear rent, staff salaries, and utility bills before turning net positive.
            </p>

            <div className="row g-4 align-items-center">
              <div className="col-12 col-md-4">
                <label className="form-label small fw-semibold">Monthly Fixed Overhead Expenses (₹)</label>
                <div className="input-group input-group-sm">
                  <span className="input-group-text bg-light">₹</span>
                  <input
                    type="number"
                    className="form-control"
                    value={monthlyFixedCost}
                    onChange={(e) => setMonthlyFixedCost(Number(e.target.value))}
                  />
                </div>
                <div className="text-muted small mt-1">Includes Rent ₹{formatNumber(220000)} + Salaries ₹{formatNumber(180000)} + Electricity ₹{formatNumber(50000)}</div>
              </div>

              <div className="col-12 col-md-4">
                <label className="form-label small fw-semibold">Average Gross Contribution Margin (%)</label>
                <div className="input-group input-group-sm">
                  <input
                    type="number"
                    className="form-control"
                    value={avgMarginPercent}
                    onChange={(e) => setAvgMarginPercent(Number(e.target.value))}
                  />
                  <span className="input-group-text bg-light">%</span>
                </div>
                <div className="text-muted small mt-1">100% minus current food cost of 32%</div>
              </div>

              <div className="col-12 col-md-4">
                <div className="p-3 bg-light rounded text-center">
                  <div className="text-muted small">Required Monthly Break-Even Sales</div>
                  <div className="h4 fw-bold text-primary mb-1" suppressHydrationWarning>₹{formatNumber(breakEvenMonthlySales)}</div>
                  <div className="text-muted small" suppressHydrationWarning>
                    Daily Target: <strong>₹{formatNumber(breakEvenDailySales)} / day</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
