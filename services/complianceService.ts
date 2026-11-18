import { MOCK_FORM_III_RECORDS, FormIIIRecord } from '@/mock/compliance';
import { MOCK_GST_SLAB_RULES, GstSlabRule } from '@/mock/gst';

/**
 * Compliance Service Interface (Form III / FRRO & GST Rules - Mock Only)
 */
export const complianceService = {
  getFormIIIRecords(propertyId?: string): FormIIIRecord[] {
    return propertyId ? MOCK_FORM_III_RECORDS.filter(r => r.propertyId === propertyId) : MOCK_FORM_III_RECORDS;
  },
  getGstRules(): GstSlabRule[] {
    return MOCK_GST_SLAB_RULES;
  },
};
