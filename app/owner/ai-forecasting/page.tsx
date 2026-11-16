'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { SAMPLE_DEMAND_FORECASTS } from '@/data/saasData';
import { DemandForecastRecord } from '@/types/saas';
import { formatCurrency, formatNumber } from '@/utils/formatters';
import {
  BiBrain,
  BiTrendingUp,
  BiCart,
  BiCheckCircle,
  BiError,
  BiCalendar,
  BiTimeFive,
  BiLayer,
  BiDownload,
} from 'react-icons/bi';

export default function BusinessOwnerAiForecastingPage() {
  const [forecasts] = useState<DemandForecastRecord[]>(SAMPLE_DEMAND_FORECASTS);
  const [selectedDay, setSelectedDay] = useState<DemandForecastRecord>(forecasts[3] || forecasts[0]); // Friday by default

  const totalWeeklyPredictedSales = forecasts.reduce((acc, f) => acc + f.predictedSales, 0);
  const totalWeeklyExpectedOrders = forecasts.reduce((acc, f) => acc + f.expectedOrders, 0);

  const getRiskBadge = (risk: 'Safe' | 'Low Stock Risk' | 'Critical Reorder') => {
    switch (risk) {
      case 'Safe':
        return <span className="badge bg-success-subtle text-success border border-success-subtle">Safe Buffer</span>;
      case 'Low Stock Risk':
        return <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle">Low Stock Risk</span>;
      case 'Critical Reorder':
        return <span className="badge bg-danger-subtle text-danger border border-danger-subtle">Critical Reorder</span>;
    }
  };

  return (
    <DashboardLayout allowedRoles={['restaurant_owner', 'branch_manager', 'kitchen_staff']}>
      <div className="container-fluid p-0">
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div>
            <div className="d-flex align-items-center gap-2">
              <span className="p-2 rounded bg-primary-subtle text-primary">
                <BiBrain size={24} />
              </span>
              <h1 className="h3 fw-bold text-dark mb-0">AI Demand & Ingredient Forecasting</h1>
            </div>
            <p className="text-muted small mb-0 mt-1">
              Machine learning models trained on 18 months of sales history, local holiday events, and weather forecasts to predict ingredient consumption.
            </p>
          </div>
          <div>
            <button
              className="btn btn-primary btn-sm d-flex align-items-center gap-2"
              onClick={() => alert('Automated draft Purchase Orders dispatched to dairy and poultry suppliers based on predicted weekend demand!')}
            >
              <BiCart size={18} /> Auto-Generate Weekend POs
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="row g-3 mb-4">
          <div className="col-12 col-sm-4">
            <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted small fw-medium">Predicted 7-Day Revenue</span>
                <span className="p-2 rounded bg-primary-subtle text-primary">
                  <BiTrendingUp size={20} />
                </span>
              </div>
              <h3 className="fw-bold mb-1" suppressHydrationWarning>₹{formatNumber(totalWeeklyPredictedSales)}</h3>
              <span className="text-success small fw-medium">+11.5% compared to prior 7 days</span>
            </div>
          </div>

          <div className="col-12 col-sm-4">
            <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted small fw-medium">Projected Customer Orders</span>
                <span className="p-2 rounded bg-success-subtle text-success">
                  <BiLayer size={20} />
                </span>
              </div>
              <h3 className="fw-bold mb-1" suppressHydrationWarning>{formatNumber(totalWeeklyExpectedOrders)} Orders</h3>
              <span className="text-muted small">Avg. order value ₹378</span>
            </div>
          </div>

          <div className="col-12 col-sm-4">
            <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted small fw-medium">Prediction Accuracy SLA</span>
                <span className="p-2 rounded bg-info-subtle text-info">
                  <BiCheckCircle size={20} />
                </span>
              </div>
              <h3 className="fw-bold mb-1">94.8%</h3>
              <span className="text-muted small">Mean absolute percentage error &lt; 5.2%</span>
            </div>
          </div>
        </div>

        {/* 7-Day Horizontal Timeline Cards */}
        <h5 className="fw-bold text-dark mb-3">7-Day Rolling Horizon</h5>
        <div className="row g-3 mb-4">
          {forecasts.map((fc) => {
            const isSelected = selectedDay.date === fc.date;
            const isWeekend = fc.dayOfWeek === 'Friday' || fc.dayOfWeek === 'Saturday' || fc.dayOfWeek === 'Sunday';
            return (
              <div key={fc.date} className="col-12 col-md-6 col-xl-3">
                <div
                  className={`card border-0 shadow-sm rounded-3 h-100 cursor-pointer ${
                    isSelected ? 'border border-2 border-primary bg-light' : 'bg-white'
                  }`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSelectedDay(fc)}
                >
                  <div className="card-body p-3">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <div className="fw-bold text-dark fs-6">{fc.dayOfWeek}</div>
                        <div className="text-muted small">{fc.date}</div>
                      </div>
                      {isWeekend ? (
                        <span className="badge bg-warning text-dark">Weekend Rush</span>
                      ) : (
                        <span className="badge bg-light text-dark border">Regular</span>
                      )}
                    </div>

                    <div className="my-2">
                      <div className="text-muted small">Expected Sales</div>
                      <div className="fw-bold text-primary fs-5" suppressHydrationWarning>
                        ₹{formatNumber(fc.predictedSales)}
                      </div>
                    </div>

                    <div className="d-flex justify-content-between text-muted small border-top pt-2">
                      <span>{fc.expectedOrders} orders</span>
                      <span>Confidence: {fc.confidenceScore}%</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Deep Dive for Selected Day */}
        <div className="card border-0 shadow-sm rounded-3 bg-white">
          <div className="card-header bg-white border-bottom p-4 d-flex justify-content-between align-items-center">
            <div>
              <span className="badge bg-primary-subtle text-primary border border-primary-subtle me-2">
                Detailed Forecast
              </span>
              <h5 className="fw-bold mb-0 text-dark d-inline">
                {selectedDay.dayOfWeek}, {selectedDay.date}
              </h5>
            </div>
            <div className="text-muted small d-flex align-items-center gap-1">
              <BiTimeFive className="text-primary" /> Peak Rush: <strong>{selectedDay.peakHour}</strong>
            </div>
          </div>
          <div className="card-body p-4">
            <h6 className="fw-bold text-dark small text-uppercase mb-3">
              Predicted Raw Material Requirements & Stock-out Risks
            </h6>
            <div className="table-responsive border rounded mb-3">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light small">
                  <tr>
                    <th className="ps-3 py-3">Ingredient Raw Material</th>
                    <th className="text-center">Predicted Needed Qty</th>
                    <th>Stock Risk Status</th>
                    <th className="text-end pe-3">Recommended Action</th>
                  </tr>
                </thead>
                <tbody className="small">
                  {selectedDay.topStockRequirements.map((stock, sIdx) => (
                    <tr key={sIdx}>
                      <td className="ps-3 fw-bold text-dark">{stock.ingredient}</td>
                      <td className="text-center fw-semibold text-primary">{stock.neededQty}</td>
                      <td>{getRiskBadge(stock.stockRisk)}</td>
                      <td className="text-end pe-3">
                        {stock.stockRisk === 'Critical Reorder' ? (
                          <button
                            className="btn btn-danger btn-sm py-0 px-2"
                            onClick={() => alert(`Purchase Order created for ${stock.ingredient} (${stock.neededQty})`)}
                          >
                            Immediate Reorder
                          </button>
                        ) : stock.stockRisk === 'Low Stock Risk' ? (
                          <button
                            className="btn btn-outline-warning text-dark btn-sm py-0 px-2"
                            onClick={() => alert(`Added ${stock.ingredient} to vendor draft list`)}
                          >
                            Draft PO
                          </button>
                        ) : (
                          <span className="text-muted">Stock sufficient</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="alert alert-light border small text-muted mb-0">
              💡 <strong>Model Note:</strong> This prediction factors in Saturday evening dinner rush at Indiranagar, taking into account the 35% higher preference for Biryani & Tandoori platters on weekends.
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
