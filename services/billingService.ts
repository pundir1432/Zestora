import { MOCK_GST_SLAB_RULES, MOCK_GST_DOCUMENTS, GstSlabRule, GstDocumentRecord } from '@/mock/gst';
import { MOCK_FOLIOS, GuestFolio } from '@/mock/reservations';

/**
 * Billing, Guest Folio & GST Configuration Service Interface (Mock)
 */
export const billingService = {
  getGstSlabRules(): GstSlabRule[] {
    return MOCK_GST_SLAB_RULES;
  },
  getGstDocuments(): GstDocumentRecord[] {
    return MOCK_GST_DOCUMENTS;
  },
  getGuestFolios(): GuestFolio[] {
    return MOCK_FOLIOS;
  },
  calculateFolioTotals(folio: GuestFolio) {
    const subtotal = folio.charges.reduce((sum, c) => sum + c.amount, 0);
    const totalTax = folio.charges.reduce((sum, c) => sum + c.gstAmount, 0);
    const grandTotal = subtotal + totalTax;
    const totalPaid = folio.payments.reduce((sum, p) => sum + p.amount, 0);
    const balance = grandTotal - totalPaid;
    return { subtotal, totalTax, grandTotal, totalPaid, balance };
  },
};
