export type NotificationCategory =
  | 'New Order'
  | 'Ready Order'
  | 'New Booking'
  | 'Check-in'
  | 'Check-out'
  | 'Form III Deadline'
  | 'Low Stock'
  | 'Payment Issue'
  | 'Approval Request'
  | 'OTA Booking'
  | 'Sync Failure'
  | 'Security Alert';

export interface HospitalityNotification {
  id: string;
  category: NotificationCategory;
  title: string;
  message: string;
  timestamp: string;
  severity: 'info' | 'success' | 'warning' | 'danger';
  read: boolean;
  actionHref?: string;
  actionLabel?: string;
}

export const MOCK_NOTIFICATIONS: HospitalityNotification[] = [
  {
    id: 'ntf-01', category: 'Form III Deadline', severity: 'danger', read: false, timestamp: '3 mins ago',
    title: 'Form III OVERDUE — Lukas Weber (Germany)',
    message: 'Room 101 foreign guest crossed 24-hour FRRO reporting window by 3h 30m. Visa PDF also exceeds 500KB limit.',
    actionHref: '/owner/form-iii', actionLabel: 'Open Form III',
  },
  {
    id: 'ntf-02', category: 'Approval Request', severity: 'warning', read: false, timestamp: '8 mins ago',
    title: 'Discount Approval Needed (15% on POS-4431)',
    message: 'Suresh Negi (Cashier) requested 15% discount (₹276) exceeding 10% role cap.',
    actionHref: '/owner/approvals', actionLabel: 'Review Request',
  },
  {
    id: 'ntf-03', category: 'Ready Order', severity: 'success', read: false, timestamp: '10 mins ago',
    title: 'Order #104 & #K-12 READY for Pickup',
    message: 'Room 101 Room Service & Kiosk #1 orders are blinking READY on the Order Ready Board.',
    actionHref: '/ready-board', actionLabel: 'Open Ready Board',
  },
  {
    id: 'ntf-04', category: 'Sync Failure', severity: 'danger', read: false, timestamp: '16 mins ago',
    title: 'Shivpuri Camp Tablet Sync Conflict',
    message: 'Deepak Bisht’s rugged tablet has 2 offline camp waiver records waiting for cloud merge.',
    actionHref: '/owner/sync-center', actionLabel: 'Open Sync Center',
  },
  {
    id: 'ntf-05', category: 'New Order', severity: 'info', read: false, timestamp: '19 mins ago',
    title: 'New Guest QR Order (#QR-08)',
    message: 'Daniel Cohen at Hostel Lounge T-09 ordered Shakshuka Bowl & Watermelon Cooler (₹490).',
    actionHref: '/owner/kot', actionLabel: 'View in KDS',
  },
  {
    id: 'ntf-06', category: 'OTA Booking', severity: 'info', read: false, timestamp: '28 mins ago',
    title: 'New Goibibo Reservation (GOI-552109)',
    message: 'Aarav Sharma booked Room 104 (2 nights, ETA 4:00 PM today).',
    actionHref: '/owner/front-desk', actionLabel: 'Open Front Desk',
  },
  {
    id: 'ntf-07', category: 'Payment Issue', severity: 'warning', read: true, timestamp: '45 mins ago',
    title: 'Booking.com Payout Mismatch (₹443)',
    message: 'Statement BDC-STMT-NOV-W3 shows ₹443 variance against expected net payout.',
    actionHref: '/owner/ota', actionLabel: 'Reconcile OTA',
  },
  {
    id: 'ntf-08', category: 'Low Stock', severity: 'warning', read: true, timestamp: '1 hr ago',
    title: 'Negative Stock Alert: Avocados (-0.8 kg)',
    message: 'Kitchen auto-deduction triggered negative stock for Avocados & low stock on Life Jackets (size M).',
    actionHref: '/owner/inventory', actionLabel: 'Inspect Stock',
  },
  {
    id: 'ntf-09', category: 'Check-in', severity: 'success', read: true, timestamp: '2 hrs ago',
    title: 'VIP Check-In Completed — Suite 201',
    message: 'Elena Rossi & Marco Conti checked into Ganga View Suite; Form III 24h countdown started.',
    actionHref: '/owner/folio', actionLabel: 'Open Folio',
  },
  {
    id: 'ntf-10', category: 'Check-out', severity: 'info', read: true, timestamp: '3 hrs ago',
    title: 'Tomorrow Checkout Reminder — Room 203',
    message: 'Rajeshwar Malhotra Family folio has ₹5,191 pending balance before 11 AM checkout.',
    actionHref: '/owner/folio', actionLabel: 'View Balance',
  },
  {
    id: 'ntf-11', category: 'New Booking', severity: 'success', read: true, timestamp: '3 hrs ago',
    title: 'Camp Rafting Slot #1 Filling Fast (14/16)',
    message: 'Only 2 seats remaining on 09:00 AM 16km Shivpuri White Water Rafting slot.',
    actionHref: '/owner/camps', actionLabel: 'Manage Slots',
  },
  {
    id: 'ntf-12', category: 'Security Alert', severity: 'danger', read: true, timestamp: '5 hrs ago',
    title: 'Support Access Request Pending Consent',
    message: 'Platform Support L2 requested 2-hour read-only diagnostic session for printer mapping.',
    actionHref: '/owner/approvals', actionLabel: 'Grant / Deny',
  },
];
