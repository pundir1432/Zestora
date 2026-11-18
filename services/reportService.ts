import { MOCK_OTA_TRANSACTIONS } from '@/mock/ota';
import { MOCK_GST_DOCUMENTS } from '@/mock/gst';
import { MOCK_EXCEPTIONS } from '@/mock/audit';

export interface HospitalityKpiSummary {
  todayTotalRevenue: number;
  restaurantSales: number;
  roomRevenue: number;
  campRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  readyOrders: number;
  occupancyPercent: number;
  checkInsToday: number;
  checkOutsToday: number;
  pendingFormIII: number;
  gstCollectedToday: number;
  cashPayments: number;
  onlinePayments: number;
  otaBookingsCount: number;
  pendingTasksCount: number;
}

/**
 * Hospitality Reporting & Analytics Service Interface (Mock)
 */
export const reportService = {
  getDashboardSummary(): HospitalityKpiSummary {
    return {
      todayTotalRevenue: 174350,
      restaurantSales: 68450,
      roomRevenue: 74200,
      campRevenue: 31700,
      totalOrders: 184,
      pendingOrders: 8,
      readyOrders: 3,
      occupancyPercent: 78,
      checkInsToday: 9,
      checkOutsToday: 5,
      pendingFormIII: 3,
      gstCollectedToday: 18940,
      cashPayments: 28450,
      onlinePayments: 103100,
      otaBookingsCount: 11,
      pendingTasksCount: 7,
    };
  },
  getOtaSummary() {
    const gross = MOCK_OTA_TRANSACTIONS.reduce((s, t) => s + t.grossAmount, 0);
    const netExpected = MOCK_OTA_TRANSACTIONS.reduce((s, t) => s + t.expectedNetPayout, 0);
    const mismatches = MOCK_OTA_TRANSACTIONS.filter(t => t.reconciliationStatus === 'Mismatch Alert').length;
    return { gross, netExpected, mismatches };
  },
  getGstSummary() {
    const taxable = MOCK_GST_DOCUMENTS.reduce((s, d) => s + d.taxableValue, 0);
    const tax = MOCK_GST_DOCUMENTS.reduce((s, d) => s + d.cgst + d.sgst + d.igst, 0);
    return { taxable, tax, count: MOCK_GST_DOCUMENTS.length };
  },
  getExceptionSummary() {
    return {
      total: MOCK_EXCEPTIONS.length,
      needsReview: MOCK_EXCEPTIONS.filter(e => e.status !== 'Approved').length,
    };
  },
};
