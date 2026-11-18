export type SyncItemStatus = 'Pending' | 'Synced' | 'Failed' | 'Needs Review' | 'Conflict';

export interface SyncQueueItem {
  id: string;
  deviceName: string;
  outletName: string;
  module: 'POS Order' | 'KOT' | 'Room Check-in' | 'Camp Waiver' | 'Folio Charge' | 'Form III Draft';
  entityRef: string;
  summary: string;
  createdAt: string;
  status: SyncItemStatus;
  retryCount: number;
  errorOrConflictDetail?: string;
  localSnapshot?: string;
  serverSnapshot?: string;
}

export const MOCK_SYNC_QUEUE: SyncQueueItem[] = [
  {
    id: 'SYNC-801',
    deviceName: 'Shivpuri River Base Rugged Tablet',
    outletName: 'Shivpuri Rafting & Camp Desk',
    module: 'Camp Waiver',
    entityRef: 'CB-775 (Sophie Laurent)',
    summary: 'Signed digital liability waiver + 2 Pax rafting check-in captured offline at river deck',
    createdAt: '14 mins ago',
    status: 'Pending',
    retryCount: 1,
  },
  {
    id: 'SYNC-802',
    deviceName: 'Shivpuri River Base Rugged Tablet',
    outletName: 'Shivpuri Rafting & Camp Desk',
    module: 'Folio Charge',
    entityRef: 'FOL-901 (+₹2,200 Rafting)',
    summary: 'Post 16km Rafting + GoPro video to Room 101 guest folio',
    createdAt: '22 mins ago',
    status: 'Conflict',
    retryCount: 2,
    errorOrConflictDetail: 'Duplicate charge reference CMP-772 detected between Camp Tablet and Tapovan Front Desk.',
    localSnapshot: 'CMP-772 • ₹2,200 (incl. GoPro Add-on) @ 09:05 AM',
    serverSnapshot: 'CMP-772 • ₹2,200 (Posted manually by Reception) @ 09:08 AM',
  },
  {
    id: 'SYNC-803',
    deviceName: 'Tapovan Cafe Main POS #1',
    outletName: 'Ganga Terrace Kitchen & Cafe',
    module: 'POS Order',
    entityRef: 'POS-4434 (₹1,180 UPI)',
    summary: 'Bill settled during 3-minute broadband drop — queued locally with offline invoice number',
    createdAt: '31 mins ago',
    status: 'Failed',
    retryCount: 3,
    errorOrConflictDetail: 'Temporary gateway timeout while verifying mock UPI ref #UPI-88124.',
  },
  {
    id: 'SYNC-804',
    deviceName: 'Tapovan Reception Desk PC',
    outletName: 'Tapovan Main Front Desk',
    module: 'Form III Draft',
    entityRef: 'F3-2611-02 (Elena Rossi)',
    summary: 'Passport & Visa document metadata cached locally for FRRO pack',
    createdAt: '40 mins ago',
    status: 'Needs Review',
    retryCount: 0,
    errorOrConflictDetail: 'Awaiting Compliance Officer final check before marking Submitted.',
  },
  {
    id: 'SYNC-805',
    deviceName: 'Lobby Self-Order Kiosk #1',
    outletName: 'Ganga Terrace Kitchen & Cafe',
    module: 'KOT',
    entityRef: 'Token #K-12 (Ananya V.)',
    summary: 'Kiosk order dispatched over LAN bridge directly to Main Kitchen KDS',
    createdAt: '9 mins ago',
    status: 'Synced',
    retryCount: 0,
  },
  {
    id: 'SYNC-806',
    deviceName: 'Terrace Steward Android #2',
    outletName: 'Himalayan Sunrise Rooftop Cafe',
    module: 'KOT',
    entityRef: 'Token #105 (Table T-03)',
    summary: 'Captain App table order synced cleanly to Kitchen KDS',
    createdAt: '18 mins ago',
    status: 'Synced',
    retryCount: 0,
  },
];
