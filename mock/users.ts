import { PlanTier } from './tenants';

export type RoleScope = 'Platform' | 'Tenant' | 'Property' | 'Outlet' | 'External / Device';

export interface HospitalityRole {
  id: string;
  code: string;
  name: string;
  category:
    | 'Platform Governance'
    | 'Tenant & Ownership'
    | 'Restaurant & Kitchen'
    | 'Hotel, Hostel & Front Desk'
    | 'Camp & Adventure'
    | 'Finance, GST & Audit'
    | 'External & Device Accounts';
  scope: RoleScope;
  planAvailability: PlanTier[];
  assignedUsers: number;
  maxDiscountPercent: number;
  canVoidWithoutApproval: boolean;
  canReopenDay: boolean;
  approvalRequiredFor: string[];
  permissionsSummary: string[];
}

export interface RegisteredDevice {
  id: string;
  name: string;
  deviceType: 'POS Terminal' | 'KDS Screen' | 'Self-Order Kiosk' | 'Ready Board TV' | 'Captain Tablet' | 'Front Desk PC' | 'Camp Guide Phone' | 'Rider Phone';
  propertyName: string;
  outletName: string;
  assignedUser: string;
  status: 'Active' | 'Offline' | 'Revoked' | 'Pending Approval';
  lastActive: string;
  ipAddress: string;
  appVersion: string;
  offlineSnapshotStatus: 'Current (Synced 2m ago)' | 'Stale (4h ago)' | 'Pending Sync' | 'Revoked';
  sessionId: string;
}

export interface SupportAccessSession {
  id: string;
  tenantName: string;
  requestedBy: string;
  reason: string;
  scope: string;
  expiresAt: string;
  status: 'Active' | 'Pending Consent' | 'Expired' | 'Revoked';
  consentGivenBy?: string;
}

// Complete 33-Role Hospitality SaaS Role Architecture
export const HOSPITALITY_33_ROLES: HospitalityRole[] = [
  // 1-5: Platform Governance
  {
    id: 'role-01', code: 'PLT_SUPER_ADMIN', name: 'Platform Super Admin', category: 'Platform Governance',
    scope: 'Platform', planAvailability: ['S', 'G', 'E'], assignedUsers: 2, maxDiscountPercent: 100,
    canVoidWithoutApproval: true, canReopenDay: true, approvalRequiredFor: ['Tenant Suspension Audit'],
    permissionsSummary: ['All Platform Controls', 'Tenant Lifecycle', 'Plan Tiers', 'Global Compliance Templates'],
  },
  {
    id: 'role-02', code: 'PLT_SUPPORT_L2', name: 'Platform Support Engineer', category: 'Platform Governance',
    scope: 'Platform', planAvailability: ['S', 'G', 'E'], assignedUsers: 4, maxDiscountPercent: 0,
    canVoidWithoutApproval: false, canReopenDay: false, approvalRequiredFor: ['Tenant Support Access Consent'],
    permissionsSummary: ['Time-boxed Tenant Diagnostics', 'Read-only Logs', 'Hardware Bridge Support'],
  },
  {
    id: 'role-03', code: 'PLT_BILLING_OPS', name: 'Platform Billing & Subscriptions Ops', category: 'Platform Governance',
    scope: 'Platform', planAvailability: ['S', 'G', 'E'], assignedUsers: 2, maxDiscountPercent: 0,
    canVoidWithoutApproval: false, canReopenDay: false, approvalRequiredFor: ['Plan Override'],
    permissionsSummary: ['Tenant Invoicing', 'Trial Extensions', 'Grace Period Management'],
  },
  {
    id: 'role-04', code: 'PLT_ONBOARDING', name: 'Platform Onboarding Specialist', category: 'Platform Governance',
    scope: 'Platform', planAvailability: ['S', 'G', 'E'], assignedUsers: 3, maxDiscountPercent: 0,
    canVoidWithoutApproval: false, canReopenDay: false, approvalRequiredFor: [],
    permissionsSummary: ['Menu Import', 'Room/Dorm Setup', 'Device Provisioning'],
  },
  {
    id: 'role-05', code: 'PLT_SECURITY_AUDIT', name: 'Platform Security & Compliance Auditor', category: 'Platform Governance',
    scope: 'Platform', planAvailability: ['E'], assignedUsers: 1, maxDiscountPercent: 0,
    canVoidWithoutApproval: false, canReopenDay: false, approvalRequiredFor: [],
    permissionsSummary: ['Immutable Audit Inspection', 'Consent Verification', 'Session Revocation'],
  },

  // 6-9: Tenant & Ownership
  {
    id: 'role-06', code: 'TNT_OWNER', name: 'Tenant Owner / Promoter', category: 'Tenant & Ownership',
    scope: 'Tenant', planAvailability: ['S', 'G', 'E'], assignedUsers: 2, maxDiscountPercent: 100,
    canVoidWithoutApproval: true, canReopenDay: true, approvalRequiredFor: [],
    permissionsSummary: ['Full Tenant Authority', 'Owner Pulse App', 'Approve Reopen Day', 'Approve Voids & Discounts'],
  },
  {
    id: 'role-07', code: 'TNT_GROUP_GM', name: 'Group General Manager', category: 'Tenant & Ownership',
    scope: 'Tenant', planAvailability: ['G', 'E'], assignedUsers: 1, maxDiscountPercent: 50,
    canVoidWithoutApproval: true, canReopenDay: true, approvalRequiredFor: ['Discount > 50%'],
    permissionsSummary: ['Multi-Property KPIs', 'Pricing & Offers', 'Staff Approvals', 'OTA Contracts'],
  },
  {
    id: 'role-08', code: 'PROP_MANAGER', name: 'Property Manager', category: 'Tenant & Ownership',
    scope: 'Property', planAvailability: ['S', 'G', 'E'], assignedUsers: 3, maxDiscountPercent: 25,
    canVoidWithoutApproval: true, canReopenDay: false, approvalRequiredFor: ['Reopen Closed Day', 'Discount > 25%'],
    permissionsSummary: ['Full Property Ops', 'Front Desk + POS + Camp Oversight', 'Day Close Signoff'],
  },
  {
    id: 'role-09', code: 'OUTLET_MANAGER', name: 'Outlet Manager', category: 'Tenant & Ownership',
    scope: 'Outlet', planAvailability: ['S', 'G', 'E'], assignedUsers: 4, maxDiscountPercent: 20,
    canVoidWithoutApproval: true, canReopenDay: false, approvalRequiredFor: ['Discount > 20%', 'Bill Void > ₹2,500'],
    permissionsSummary: ['Outlet Shift Ops', 'Void/Discount Approval up to Limit', 'Cash Drawer Reconciliation'],
  },

  // 10-16: Restaurant & Kitchen
  {
    id: 'role-10', code: 'POS_CASHIER', name: 'POS Cashier', category: 'Restaurant & Kitchen',
    scope: 'Outlet', planAvailability: ['S', 'G', 'E'], assignedUsers: 6, maxDiscountPercent: 10,
    canVoidWithoutApproval: false, canReopenDay: false, approvalRequiredFor: ['Any Void', 'Discount > 10%', 'Bill Reprint > 1'],
    permissionsSummary: ['Create Orders & Bills', 'Accept Cash/UPI/Card', 'Post to Room Folio', 'Shift Handover'],
  },
  {
    id: 'role-11', code: 'REST_CAPTAIN', name: 'Restaurant Captain / Steward', category: 'Restaurant & Kitchen',
    scope: 'Outlet', planAvailability: ['S', 'G', 'E'], assignedUsers: 8, maxDiscountPercent: 5,
    canVoidWithoutApproval: false, canReopenDay: false, approvalRequiredFor: ['KOT Cancel After Prep'],
    permissionsSummary: ['Captain App Table Ordering', 'Fire KOT', 'Table Transfer/Merge', 'Bill Request'],
  },
  {
    id: 'role-12', code: 'REST_WAITER', name: 'Server / Runner', category: 'Restaurant & Kitchen',
    scope: 'Outlet', planAvailability: ['S', 'G', 'E'], assignedUsers: 10, maxDiscountPercent: 0,
    canVoidWithoutApproval: false, canReopenDay: false, approvalRequiredFor: ['Item Removal'],
    permissionsSummary: ['Mark Served', 'View Ready Board', 'Table Status Updates'],
  },
  {
    id: 'role-13', code: 'KITCHEN_HEAD_CHEF', name: 'Head Chef / Kitchen Manager', category: 'Restaurant & Kitchen',
    scope: 'Outlet', planAvailability: ['S', 'G', 'E'], assignedUsers: 2, maxDiscountPercent: 0,
    canVoidWithoutApproval: false, canReopenDay: false, approvalRequiredFor: ['Manual Stock Write-off > ₹1,000'],
    permissionsSummary: ['All KDS Stations', '86/Out-of-Stock Menu Toggle', 'Recipes & Wastage', 'Prep Priority'],
  },
  {
    id: 'role-14', code: 'KITCHEN_LINE_COOK', name: 'Kitchen Line Staff (KDS)', category: 'Restaurant & Kitchen',
    scope: 'Outlet', planAvailability: ['S', 'G', 'E'], assignedUsers: 9, maxDiscountPercent: 0,
    canVoidWithoutApproval: false, canReopenDay: false, approvalRequiredFor: [],
    permissionsSummary: ['Station KDS View', 'Accept / Preparing / Ready Controls'],
  },
  {
    id: 'role-15', code: 'BARISTA_BARTENDER', name: 'Barista / Beverage Counter', category: 'Restaurant & Kitchen',
    scope: 'Outlet', planAvailability: ['S', 'G', 'E'], assignedUsers: 4, maxDiscountPercent: 5,
    canVoidWithoutApproval: false, canReopenDay: false, approvalRequiredFor: ['Wastage Entry'],
    permissionsSummary: ['Beverage KDS', 'Quick Counter POS', 'Modifier Customization'],
  },
  {
    id: 'role-16', code: 'DELIVERY_RIDER', name: 'Delivery Rider', category: 'Restaurant & Kitchen',
    scope: 'Outlet', planAvailability: ['G', 'E'], assignedUsers: 5, maxDiscountPercent: 0,
    canVoidWithoutApproval: false, canReopenDay: false, approvalRequiredFor: ['COD Variance'],
    permissionsSummary: ['Rider App', 'Pickup Confirmation', 'Delivery OTP & COD Settlement'],
  },

  // 17-22: Hotel, Hostel & Front Desk
  {
    id: 'role-17', code: 'FD_MANAGER', name: 'Front Office Manager', category: 'Hotel, Hostel & Front Desk',
    scope: 'Property', planAvailability: ['S', 'G', 'E'], assignedUsers: 2, maxDiscountPercent: 25,
    canVoidWithoutApproval: true, canReopenDay: false, approvalRequiredFor: ['Folio Write-off', 'Rate Override > 25%'],
    permissionsSummary: ['Reservations', 'Room/Dorm Rate Rules', 'Form III Compliance Oversight', 'Folio Adjustments'],
  },
  {
    id: 'role-18', code: 'FD_RECEPTIONIST', name: 'Front Desk Executive / Receptionist', category: 'Hotel, Hostel & Front Desk',
    scope: 'Property', planAvailability: ['S', 'G', 'E'], assignedUsers: 6, maxDiscountPercent: 10,
    canVoidWithoutApproval: false, canReopenDay: false, approvalRequiredFor: ['Rate Override > 10%', 'Folio Credit Note'],
    permissionsSummary: ['Walk-in & Reservations', 'Check-in / Check-out', 'ID Capture & Form III Prep', 'Folio Payments'],
  },
  {
    id: 'role-19', code: 'HOSTEL_WARDEN', name: 'Hostel Manager / Dorm Coordinator', category: 'Hotel, Hostel & Front Desk',
    scope: 'Property', planAvailability: ['S', 'G', 'E'], assignedUsers: 3, maxDiscountPercent: 10,
    canVoidWithoutApproval: false, canReopenDay: false, approvalRequiredFor: ['Comp Bed Night'],
    permissionsSummary: ['Dorm Bed Assignment', 'Bed Transfers', 'Gender-Specific Dorm Enforcement', 'Community Events'],
  },
  {
    id: 'role-20', code: 'HK_SUPERVISOR', name: 'Housekeeping Supervisor', category: 'Hotel, Hostel & Front Desk',
    scope: 'Property', planAvailability: ['S', 'G', 'E'], assignedUsers: 2, maxDiscountPercent: 0,
    canVoidWithoutApproval: false, canReopenDay: false, approvalRequiredFor: ['Mark Room Out-of-Order'],
    permissionsSummary: ['Assign Cleaning Tasks', 'Inspect Clean Rooms', 'Linen Inventory', 'Maintenance Escalation'],
  },
  {
    id: 'role-21', code: 'HK_ATTENDANT', name: 'Housekeeping Attendant', category: 'Hotel, Hostel & Front Desk',
    scope: 'Property', planAvailability: ['S', 'G', 'E'], assignedUsers: 8, maxDiscountPercent: 0,
    canVoidWithoutApproval: false, canReopenDay: false, approvalRequiredFor: [],
    permissionsSummary: ['Update Dirty -> Cleaning -> Clean', 'Report Room Damage / Lost & Found'],
  },
  {
    id: 'role-22', code: 'MAINTENANCE_TECH', name: 'Maintenance & Engineering Staff', category: 'Hotel, Hostel & Front Desk',
    scope: 'Property', planAvailability: ['G', 'E'], assignedUsers: 3, maxDiscountPercent: 0,
    canVoidWithoutApproval: false, canReopenDay: false, approvalRequiredFor: ['Spare Parts PO'],
    permissionsSummary: ['Out-of-Order Tickets', 'AC/Geyser/Tent Repair Logs', 'Release Room to Clean'],
  },

  // 23-25: Camp & Adventure
  {
    id: 'role-23', code: 'CAMP_MANAGER', name: 'Camp Operations Manager', category: 'Camp & Adventure',
    scope: 'Property', planAvailability: ['S', 'G', 'E'], assignedUsers: 2, maxDiscountPercent: 20,
    canVoidWithoutApproval: true, canReopenDay: false, approvalRequiredFor: ['Weather Cancellation Refund'],
    permissionsSummary: ['Camp Packages', 'Activity Slot Capacity', 'Guide Scheduling', 'Safety & Waiver Audit'],
  },
  {
    id: 'role-24', code: 'CAMP_GUIDE', name: 'Rafting / Trekking Camp Guide', category: 'Camp & Adventure',
    scope: 'Property', planAvailability: ['S', 'G', 'E'], assignedUsers: 7, maxDiscountPercent: 0,
    canVoidWithoutApproval: false, canReopenDay: false, approvalRequiredFor: [],
    permissionsSummary: ['Camp Guide App', 'Guest Attendance', 'Verify Signed Waivers', 'Safety & River Alerts'],
  },
  {
    id: 'role-25', code: 'GEAR_STOREKEEPER', name: 'Camp Gear & Inventory Keeper', category: 'Camp & Adventure',
    scope: 'Property', planAvailability: ['G', 'E'], assignedUsers: 2, maxDiscountPercent: 0,
    canVoidWithoutApproval: false, canReopenDay: false, approvalRequiredFor: ['Gear Write-off'],
    permissionsSummary: ['Life Jackets / Rafts / Tents Stock', 'Kitchen & Camp Store GRN', 'Low Stock Alerts'],
  },

  // 26-28: Finance, GST & Audit
  {
    id: 'role-26', code: 'FIN_ACCOUNTANT', name: 'Accountant / GST Officer', category: 'Finance, GST & Audit',
    scope: 'Tenant', planAvailability: ['S', 'G', 'E'], assignedUsers: 2, maxDiscountPercent: 0,
    canVoidWithoutApproval: false, canReopenDay: false, approvalRequiredFor: ['Credit Note Issuance'],
    permissionsSummary: ['GST Config & Reports', 'OTA Payout Reconciliation', 'Tally Export', 'Day Close Verification'],
  },
  {
    id: 'role-27', code: 'COMPLIANCE_OFFICER', name: 'Compliance & FRRO Officer', category: 'Finance, GST & Audit',
    scope: 'Property', planAvailability: ['S', 'G', 'E'], assignedUsers: 2, maxDiscountPercent: 0,
    canVoidWithoutApproval: false, canReopenDay: false, approvalRequiredFor: [],
    permissionsSummary: ['Form III Builder', '24-Hour Deadline Tracking', 'Passport/Visa Verification', 'Departure Logs'],
  },
  {
    id: 'role-28', code: 'INTERNAL_AUDITOR', name: 'Internal Auditor / CA (Read-Only)', category: 'Finance, GST & Audit',
    scope: 'Tenant', planAvailability: ['G', 'E'], assignedUsers: 1, maxDiscountPercent: 0,
    canVoidWithoutApproval: false, canReopenDay: false, approvalRequiredFor: [],
    permissionsSummary: ['Full Audit Trail', 'Exception Reports', 'Gap-Free Numbering Audit', 'GST Slabs Review'],
  },

  // 29-33: External & Device Accounts
  {
    id: 'role-29', code: 'EXT_GUEST', name: 'Guest Account (QR / Booking)', category: 'External & Device Accounts',
    scope: 'External / Device', planAvailability: ['S', 'G', 'E'], assignedUsers: 142, maxDiscountPercent: 0,
    canVoidWithoutApproval: false, canReopenDay: false, approvalRequiredFor: [],
    permissionsSummary: ['QR Self-Ordering', 'Direct Room/Camp Booking', 'Live Order Status', 'Digital Waiver Sign'],
  },
  {
    id: 'role-30', code: 'EXT_AGENT', name: 'Travel / Rafting Partner Agent', category: 'External & Device Accounts',
    scope: 'External / Device', planAvailability: ['G', 'E'], assignedUsers: 14, maxDiscountPercent: 15,
    canVoidWithoutApproval: false, canReopenDay: false, approvalRequiredFor: ['Credit Limit Breach'],
    permissionsSummary: ['Partner Portal', 'Referral Bookings', 'Commission Ledger', 'Slot Availability Check'],
  },
  {
    id: 'role-31', code: 'EXT_API_CLIENT', name: 'API Integration Client (OTA / ERP)', category: 'External & Device Accounts',
    scope: 'External / Device', planAvailability: ['G', 'E'], assignedUsers: 4, maxDiscountPercent: 0,
    canVoidWithoutApproval: false, canReopenDay: false, approvalRequiredFor: ['Webhook Key Rotation'],
    permissionsSummary: ['Scoped Channel Sync', 'Tally / ERP Connector', 'WhatsApp Webhook Token'],
  },
  {
    id: 'role-32', code: 'DEV_KIOSK', name: 'Self-Order Kiosk Account', category: 'External & Device Accounts',
    scope: 'External / Device', planAvailability: ['S', 'G', 'E'], assignedUsers: 2, maxDiscountPercent: 0,
    canVoidWithoutApproval: false, canReopenDay: false, approvalRequiredFor: ['Exit Kiosk Mode PIN'],
    permissionsSummary: ['Locked Kiosk Ordering Flow', 'Bilingual EN/HI Menu', 'Token Generation'],
  },
  {
    id: 'role-33', code: 'DEV_READY_TV', name: 'Order Ready Board TV Account', category: 'External & Device Accounts',
    scope: 'External / Device', planAvailability: ['S', 'G', 'E'], assignedUsers: 2, maxDiscountPercent: 0,
    canVoidWithoutApproval: false, canReopenDay: false, approvalRequiredFor: [],
    permissionsSummary: ['Read-Only Ready Board Stream', 'Token Display & Audio Chime'],
  },
];

export const MOCK_DEVICES: RegisteredDevice[] = [
  {
    id: 'dev-pos-01',
    name: 'Tapovan Cafe Main POS #1',
    deviceType: 'POS Terminal',
    propertyName: 'Ganga View Resort, Cafe & Hostel — Tapovan',
    outletName: 'Ganga Terrace Kitchen & Cafe',
    assignedUser: 'Suresh Negi (Cashier)',
    status: 'Active',
    lastActive: 'Just now',
    ipAddress: '192.168.1.21',
    appVersion: 'v2.8.4 (Offline Ready)',
    offlineSnapshotStatus: 'Current (Synced 2m ago)',
    sessionId: 'SES-99241-POS',
  },
  {
    id: 'dev-kds-01',
    name: 'Main Kitchen Touch KDS (24")',
    deviceType: 'KDS Screen',
    propertyName: 'Ganga View Resort, Cafe & Hostel — Tapovan',
    outletName: 'Ganga Terrace Kitchen & Cafe',
    assignedUser: 'Chef Harpreet Singh',
    status: 'Active',
    lastActive: '1 min ago',
    ipAddress: '192.168.1.35',
    appVersion: 'v2.8.4',
    offlineSnapshotStatus: 'Current (Synced 2m ago)',
    sessionId: 'SES-99248-KDS',
  },
  {
    id: 'dev-tv-01',
    name: 'Pickup Counter Ready Board TV (50")',
    deviceType: 'Ready Board TV',
    propertyName: 'Ganga View Resort, Cafe & Hostel — Tapovan',
    outletName: 'Ganga Terrace Kitchen & Cafe',
    assignedUser: 'TV Account (DEV_READY_TV)',
    status: 'Active',
    lastActive: 'Live Stream',
    ipAddress: '192.168.1.40',
    appVersion: 'v2.8.4-TV',
    offlineSnapshotStatus: 'Current (Synced 2m ago)',
    sessionId: 'SES-99250-TV',
  },
  {
    id: 'dev-kiosk-01',
    name: 'Lobby Self-Order Kiosk #1',
    deviceType: 'Self-Order Kiosk',
    propertyName: 'Ganga View Resort, Cafe & Hostel — Tapovan',
    outletName: 'Ganga Terrace Kitchen & Cafe',
    assignedUser: 'Kiosk Account (DEV_KIOSK)',
    status: 'Active',
    lastActive: '4 mins ago',
    ipAddress: '192.168.1.42',
    appVersion: 'v2.8.4-KSK',
    offlineSnapshotStatus: 'Current (Synced 2m ago)',
    sessionId: 'SES-99252-KSK',
  },
  {
    id: 'dev-fd-01',
    name: 'Tapovan Reception Desk PC',
    deviceType: 'Front Desk PC',
    propertyName: 'Ganga View Resort, Cafe & Hostel — Tapovan',
    outletName: 'Tapovan Main Front Desk',
    assignedUser: 'Kavita Reddy (Front Office)',
    status: 'Active',
    lastActive: 'Just now',
    ipAddress: '192.168.1.12',
    appVersion: 'v2.8.4',
    offlineSnapshotStatus: 'Current (Synced 2m ago)',
    sessionId: 'SES-99210-FD',
  },
  {
    id: 'dev-camp-01',
    name: 'Shivpuri River Base Rugged Tablet',
    deviceType: 'Camp Guide Phone',
    propertyName: 'Shivpuri Rapids Eco Camp & Adventure Base',
    outletName: 'Shivpuri Rafting & Camp Desk',
    assignedUser: 'Deepak Bisht (Lead Guide)',
    status: 'Offline',
    lastActive: '38 mins ago (Weak Signal)',
    ipAddress: '10.22.4.18',
    appVersion: 'v2.8.3',
    offlineSnapshotStatus: 'Pending Sync',
    sessionId: 'SES-99104-CMP',
  },
  {
    id: 'dev-cap-02',
    name: 'Terrace Steward Android #2',
    deviceType: 'Captain Tablet',
    propertyName: 'Ganga View Resort, Cafe & Hostel — Tapovan',
    outletName: 'Himalayan Sunrise Rooftop Cafe',
    assignedUser: 'Ankit Rawat (Captain)',
    status: 'Active',
    lastActive: '3 mins ago',
    ipAddress: '192.168.1.68',
    appVersion: 'v2.8.4',
    offlineSnapshotStatus: 'Current (Synced 2m ago)',
    sessionId: 'SES-99271-CAP',
  },
  {
    id: 'dev-old-09',
    name: 'Old Reception Laptop (Decommissioned)',
    deviceType: 'Front Desk PC',
    propertyName: 'Ganga View Resort, Cafe & Hostel — Tapovan',
    outletName: 'Tapovan Main Front Desk',
    assignedUser: 'Former Staff',
    status: 'Revoked',
    lastActive: '14 days ago',
    ipAddress: '192.168.1.99',
    appVersion: 'v2.6.0',
    offlineSnapshotStatus: 'Revoked',
    sessionId: 'SES-81002-REV',
  },
];

export const MOCK_SUPPORT_ACCESS: SupportAccessSession[] = [
  {
    id: 'SUP-401',
    tenantName: 'Ganga Heritage Hospitality',
    requestedBy: 'Amit Joshi (Platform Support L2)',
    reason: 'Assist with ESC/POS thermal printer port mapping & GST HSN code import',
    scope: 'Read-only Config + Printer Diagnostics (2 Hours)',
    expiresAt: 'Today, 07:30 PM',
    status: 'Pending Consent',
  },
  {
    id: 'SUP-398',
    tenantName: 'Devbhoomi Boutique Homestays',
    requestedBy: 'Priya Verma (Onboarding Specialist)',
    reason: 'Verify Form III document upload size rules for Tapovan property',
    scope: 'Compliance Settings (1 Hour)',
    expiresAt: 'Yesterday, 04:00 PM',
    status: 'Expired',
    consentGivenBy: 'Meera Rawat (Tenant Owner)',
  },
];
