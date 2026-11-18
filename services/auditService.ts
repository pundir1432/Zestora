import {
  MOCK_AUDIT_LOGS,
  MOCK_EXCEPTIONS,
  MOCK_INVOICE_SERIES,
  MOCK_APPROVALS,
  MOCK_DAY_CLOSE,
  AuditLogEntry,
  ExceptionEvent,
  InvoiceSeriesCheck,
  ApprovalRequestItem,
  DayCloseRecord,
} from '@/mock/audit';

/**
 * Audit, Exceptions, Gap-Free Numbering, Day Close & Approvals Service (Mock)
 */
export const auditService = {
  getAuditLogs(): AuditLogEntry[] {
    return MOCK_AUDIT_LOGS;
  },
  getExceptions(): ExceptionEvent[] {
    return MOCK_EXCEPTIONS;
  },
  getInvoiceSeriesChecks(): InvoiceSeriesCheck[] {
    return MOCK_INVOICE_SERIES;
  },
  getApprovals(): ApprovalRequestItem[] {
    return MOCK_APPROVALS;
  },
  getDayClose(): DayCloseRecord {
    return MOCK_DAY_CLOSE;
  },
};
