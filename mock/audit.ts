export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  device: string;
  action: string;
  objectType: 'Bill' | 'Folio' | 'Room Rate' | 'Inventory' | 'Day Close' | 'Form III' | 'Role / User';
  objectRef: string;
  oldValue: string;
  newValue: string;
  reason: string;
  severity: 'Info' | 'Warning' | 'High';
}

export interface ExceptionEvent {
  id: string;
  category:
    | 'Void'
    | 'Discount'
    | 'Reprint'
    | 'Price Edit'
    | 'After-Hours Change'
    | 'Cash Difference'
    | 'Negative Stock'
    | 'Manual Stock Edit';
  timestamp: string;
  outlet: string;
  staffName: string;
  referenceNo: string;
  amountImpact: number;
  details: string;
  status: 'Needs Review' | 'Approved' | 'Flagged';
}

export interface InvoiceSeriesCheck {
  seriesCode: string;
  outlet: string;
  startNo: number;
  currentNo: number;
  totalIssued: number;
  voidedWithAudit: number[];
  missingGaps: number[];
  integrityStatus: 'Gap-Free Verified' | 'Voided (Audited)' | 'Gap Alert';
}

export interface ApprovalRequestItem {
  id: string;
  type: 'Discount Approval' | 'Void Approval' | 'Reopen Day' | 'Support Access' | 'Limit Exceeded';
  requestedBy: string;
  requesterRole: string;
  propertyOutlet: string;
  requestedAt: string;
  amountOrImpact: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  approver?: string;
  decidedAt?: string;
  decisionNote?: string;
}

export interface DayCloseRecord {
  businessDate: string;
  propertyName: string;
  status: 'Open' | 'Under Review' | 'Closed' | 'Reopen Requested';
  expectedCash: number;
  countedCash: number;
  cashVariance: number;
  upiTotal: number;
  cardTotal: number;
  otaPrepaidTotal: number;
  totalRevenue: number;
  openOrdersCount: number;
  pendingFormIIICount: number;
  closedBy?: string;
  closedAt?: string;
}

export const MOCK_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'AUD-9012', timestamp: '18 Nov 2026, 04:18 PM', user: 'Suresh Negi', role: 'POS Cashier',
    device: 'Tapovan Cafe Main POS #1', action: 'Applied Manual Discount', objectType: 'Bill', objectRef: 'POS-4431',
    oldValue: 'Discount: 0% (₹1,840)', newValue: 'Discount: 15% (₹1,564)',
    reason: 'Repeat yoga group guest — exceeded 10% cashier limit, routed to approval', severity: 'Warning',
  },
  {
    id: 'AUD-9011', timestamp: '18 Nov 2026, 03:42 PM', user: 'Kavita Reddy', role: 'Front Office Manager',
    device: 'Tapovan Reception Desk PC', action: 'Posted Restaurant Bill to Folio', objectType: 'Folio', objectRef: 'FOL-902',
    oldValue: 'Balance: ₹10,900', newValue: 'Balance: ₹12,540 (+₹1,640 POS-4429)',
    reason: 'Guest requested Rooftop Cafe bill consolidated to Suite 201 checkout folio', severity: 'Info',
  },
  {
    id: 'AUD-9010', timestamp: '18 Nov 2026, 02:15 PM', user: 'Ankit Rawat', role: 'Restaurant Captain',
    device: 'Terrace Steward Android #2', action: 'Voided KOT Item', objectType: 'Bill', objectRef: 'KOT-8892',
    oldValue: '2x Woodfired Pizza (₹960)', newValue: '1x Woodfired Pizza (₹480)',
    reason: 'Guest changed mind before oven firing; approved by Outlet Manager', severity: 'Warning',
  },
  {
    id: 'AUD-9009', timestamp: '18 Nov 2026, 12:08 PM', user: 'Chef Harpreet Singh', role: 'Head Chef',
    device: 'Main Kitchen Touch KDS', action: 'Manual Stock Adjustment', objectType: 'Inventory', objectRef: 'INV-PANEER-01',
    oldValue: 'Stock: 4.5 kg', newValue: 'Stock: 3.1 kg (-1.4 kg)',
    reason: 'Spoilage due to power outage in chiller overnight', severity: 'High',
  },
  {
    id: 'AUD-9008', timestamp: '17 Nov 2026, 11:52 PM', user: 'Vikram Singhania', role: 'Tenant Owner',
    device: 'Owner Pulse Mobile', action: 'After-Hours Price Override', objectType: 'Room Rate', objectRef: 'RES-8842',
    oldValue: 'Suite 201: ₹9,500/night', newValue: 'Suite 201: ₹8,500/night',
    reason: 'Direct booking honeymoon discount (4-night stay)', severity: 'Warning',
  },
  {
    id: 'AUD-9007', timestamp: '17 Nov 2026, 11:30 PM', user: 'Kavita Reddy', role: 'Property Manager',
    device: 'Tapovan Reception Desk PC', action: 'Closed Business Day', objectType: 'Day Close', objectRef: 'DAY-2026-11-17',
    oldValue: 'Status: Open', newValue: 'Status: Closed (Cash Variance ₹0)',
    reason: 'All tills balanced and night audit posted', severity: 'Info',
  },
];

export const MOCK_EXCEPTIONS: ExceptionEvent[] = [
  { id: 'EXC-01', category: 'Void', timestamp: 'Today, 02:15 PM', outlet: 'Ganga Terrace Kitchen', staffName: 'Ankit Rawat', referenceNo: 'KOT-8892', amountImpact: 480, details: 'Post-KOT void of 1x Woodfired Pizza', status: 'Approved' },
  { id: 'EXC-02', category: 'Discount', timestamp: 'Today, 04:18 PM', outlet: 'Ganga Terrace Kitchen', staffName: 'Suresh Negi', referenceNo: 'POS-4431', amountImpact: 276, details: '15% discount exceeded 10% cashier limit', status: 'Needs Review' },
  { id: 'EXC-03', category: 'Reprint', timestamp: 'Today, 01:40 PM', outlet: 'Tapovan Front Desk', staffName: 'Ritu Rawat', referenceNo: 'INV/26-27/01419', amountImpact: 0, details: 'Invoice reprinted 3 times (threshold: 1)', status: 'Flagged' },
  { id: 'EXC-04', category: 'Price Edit', timestamp: 'Yesterday, 11:52 PM', outlet: 'Tapovan Front Desk', staffName: 'Vikram Singhania', referenceNo: 'RES-8842', amountImpact: 1000, details: 'Suite tariff edited from ₹9,500 to ₹8,500', status: 'Approved' },
  { id: 'EXC-05', category: 'After-Hours Change', timestamp: 'Yesterday, 11:55 PM', outlet: 'Shivpuri Camp Desk', staffName: 'Deepak Bisht', referenceNo: 'CB-769', amountImpact: 1200, details: 'Activity slot booking modified after 11:00 PM cutoff', status: 'Needs Review' },
  { id: 'EXC-06', category: 'Cash Difference', timestamp: 'Yesterday, 10:45 PM', outlet: 'Rooftop Cafe', staffName: 'Amit Rawat', referenceNo: 'SHIFT-442', amountImpact: -180, details: 'Physical cash ₹180 short against POS drawer expected total', status: 'Flagged' },
  { id: 'EXC-07', category: 'Negative Stock', timestamp: 'Today, 11:10 AM', outlet: 'Ganga Terrace Kitchen', staffName: 'System Auto-Deduct', referenceNo: 'SKU-AVOCADO', amountImpact: 620, details: 'Avocado stock reached -0.8 kg after brunch orders', status: 'Needs Review' },
  { id: 'EXC-08', category: 'Manual Stock Edit', timestamp: 'Today, 12:08 PM', outlet: 'Ganga Terrace Kitchen', staffName: 'Chef Harpreet Singh', referenceNo: 'INV-PANEER-01', amountImpact: 540, details: 'Manual write-off of 1.4 kg Paneer (chiller power cut)', status: 'Needs Review' },
];

export const MOCK_INVOICE_SERIES: InvoiceSeriesCheck[] = [
  { seriesCode: 'INV/26-27/', outlet: 'Tapovan Hotel & Folio Tax Invoices', startNo: 1001, currentNo: 1423, totalIssued: 423, voidedWithAudit: [1108, 1294], missingGaps: [], integrityStatus: 'Gap-Free Verified' },
  { seriesCode: 'GTK/26-27/', outlet: 'Ganga Terrace Kitchen POS Bills', startNo: 4001, currentNo: 4435, totalIssued: 435, voidedWithAudit: [4122, 4390], missingGaps: [], integrityStatus: 'Voided (Audited)' },
  { seriesCode: 'CMP/26-27/', outlet: 'Shivpuri Camp & Rafting Receipts', startNo: 701, currentNo: 782, totalIssued: 82, voidedWithAudit: [], missingGaps: [], integrityStatus: 'Gap-Free Verified' },
  { seriesCode: 'CN/26-27/', outlet: 'GST Credit Notes Series', startNo: 1, currentNo: 19, totalIssued: 19, voidedWithAudit: [], missingGaps: [], integrityStatus: 'Gap-Free Verified' },
];

export const MOCK_APPROVALS: ApprovalRequestItem[] = [
  {
    id: 'APR-301', type: 'Discount Approval', requestedBy: 'Suresh Negi', requesterRole: 'POS Cashier',
    propertyOutlet: 'Ganga Terrace Kitchen', requestedAt: 'Today, 04:18 PM', amountOrImpact: '15% off (₹276 on POS-4431)',
    reason: 'Repeat Yoga Retreat group of 6 guests asked for 15% courtesy discount (exceeds 10% Cashier limit).',
    status: 'Pending',
  },
  {
    id: 'APR-302', type: 'Void Approval', requestedBy: 'Ankit Rawat', requesterRole: 'Restaurant Captain',
    propertyOutlet: 'Rooftop Cafe', requestedAt: 'Today, 03:50 PM', amountOrImpact: '₹640 (Bill #POS-4426)',
    reason: 'Duplicate KOT fired due to weak Wi-Fi retry before offline queue deduplicated.',
    status: 'Pending',
  },
  {
    id: 'APR-303', type: 'Reopen Day', requestedBy: 'Kavita Reddy', requesterRole: 'Property Manager',
    propertyOutlet: 'Tapovan Main Front Desk', requestedAt: 'Today, 01:20 PM', amountOrImpact: 'Business Date: 17 Nov 2026',
    reason: 'Corporate guest provided GSTIN after night audit closed — need to issue corrected B2B invoice.',
    status: 'Pending',
  },
  {
    id: 'APR-304', type: 'Support Access', requestedBy: 'Amit Joshi', requesterRole: 'Platform Support L2',
    propertyOutlet: 'Ganga Heritage (Tenant-Wide)', requestedAt: 'Today, 02:10 PM', amountOrImpact: '2-Hour Read-Only Diagnostic',
    reason: 'Troubleshoot thermal printer port & HSN tax code mapping.',
    status: 'Pending',
  },
  {
    id: 'APR-305', type: 'Limit Exceeded', requestedBy: 'Deepak Bisht', requesterRole: 'Camp Operations Manager',
    propertyOutlet: 'Shivpuri Rapids Camp', requestedAt: 'Yesterday, 06:15 PM', amountOrImpact: '₹4,200 Weather Refund',
    reason: 'Sudden evening thunderstorm forced cancellation of 3:30 PM rafting batch — full refund processed.',
    status: 'Approved', approver: 'Vikram Singhania (Owner)', decidedAt: 'Yesterday, 06:22 PM',
    decisionNote: 'Approved for guest safety — log under weather exception.',
  },
];

export const MOCK_DAY_CLOSE: DayCloseRecord = {
  businessDate: '2026-11-18',
  propertyName: 'Ganga View Resort, Cafe & Hostel — Tapovan',
  status: 'Open',
  expectedCash: 28450,
  countedCash: 28450,
  cashVariance: 0,
  upiTotal: 64200,
  cardTotal: 38900,
  otaPrepaidTotal: 42800,
  totalRevenue: 174350,
  openOrdersCount: 5,
  pendingFormIIICount: 3,
};
