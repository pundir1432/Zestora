export interface OtaTransaction {
  id: string;
  channel: 'MakeMyTrip' | 'Booking.com' | 'Goibibo' | 'Agoda' | 'Hostelworld' | 'Zomato' | 'Swiggy';
  channelType: 'Stay OTA' | 'Food Aggregator';
  bookingOrOrderRef: string;
  date: string;
  guestOrCustomer: string;
  grossAmount: number;
  commissionPercent: number;
  commissionAmount: number;
  gstOnCommission: number; // 18% GST on OTA commission
  tcsAmount: number; // 0.5% - 1% TCS under GST
  tdsAmount: number; // 0.1% - 1% TDS u/s 194-O
  expectedNetPayout: number;
  receivedPayout: number;
  reconciliationStatus: 'Reconciled' | 'Pending Payout' | 'Mismatch Alert';
  statementRef: string;
  notes?: string;
}

export const MOCK_OTA_TRANSACTIONS: OtaTransaction[] = [
  {
    id: 'ota-1', channel: 'MakeMyTrip', channelType: 'Stay OTA', bookingOrOrderRef: 'MMT-7741209',
    date: '16 Nov 2026', guestOrCustomer: 'Rajeshwar Malhotra Family (Room 203)',
    grossAmount: 23400, commissionPercent: 18, commissionAmount: 4212, gstOnCommission: 758,
    tcsAmount: 234, tdsAmount: 234, expectedNetPayout: 17962, receivedPayout: 17962,
    reconciliationStatus: 'Reconciled', statementRef: 'MMT-STMT-NOV-W2',
  },
  {
    id: 'ota-2', channel: 'Booking.com', channelType: 'Stay OTA', bookingOrOrderRef: 'BDC-889124',
    date: '17 Nov 2026', guestOrCustomer: 'Lukas Weber (Room 101)',
    grossAmount: 14400, commissionPercent: 15, commissionAmount: 2160, gstOnCommission: 389,
    tcsAmount: 144, tdsAmount: 144, expectedNetPayout: 11563, receivedPayout: 11120,
    reconciliationStatus: 'Mismatch Alert', statementRef: 'BDC-STMT-NOV-W3',
    notes: '₹443 short payout — virtual card FX fee deducted unexpectedly.',
  },
  {
    id: 'ota-3', channel: 'Goibibo', channelType: 'Stay OTA', bookingOrOrderRef: 'GOI-552109',
    date: '18 Nov 2026', guestOrCustomer: 'Aarav Sharma (Room 104)',
    grossAmount: 6400, commissionPercent: 18, commissionAmount: 1152, gstOnCommission: 207,
    tcsAmount: 64, tdsAmount: 64, expectedNetPayout: 4913, receivedPayout: 0,
    reconciliationStatus: 'Pending Payout', statementRef: 'GOI-SETTLE-22NOV',
  },
  {
    id: 'ota-4', channel: 'Hostelworld', channelType: 'Stay OTA', bookingOrOrderRef: 'HW-990218',
    date: '18 Nov 2026', guestOrCustomer: 'Hannah Lindqvist (Dorm D-02 • F1)',
    grossAmount: 5745, commissionPercent: 15, commissionAmount: 862, gstOnCommission: 155,
    tcsAmount: 57, tdsAmount: 57, expectedNetPayout: 4614, receivedPayout: 4614,
    reconciliationStatus: 'Reconciled', statementRef: 'HW-NOV-2026-18',
  },
  {
    id: 'ota-5', channel: 'Zomato', channelType: 'Food Aggregator', bookingOrOrderRef: 'ZMT-BATCH-18NOV (14 Orders)',
    date: '18 Nov 2026', guestOrCustomer: 'Tapovan & Laxman Jhula Deliveries',
    grossAmount: 8640, commissionPercent: 22, commissionAmount: 1901, gstOnCommission: 342,
    tcsAmount: 86, tdsAmount: 86, expectedNetPayout: 6225, receivedPayout: 6225,
    reconciliationStatus: 'Reconciled', statementRef: 'ZMT-WK46-2026',
  },
  {
    id: 'ota-6', channel: 'Swiggy', channelType: 'Food Aggregator', bookingOrOrderRef: 'SWG-BATCH-17NOV (9 Orders)',
    date: '17 Nov 2026', guestOrCustomer: 'Rishikesh Delivery Zone',
    grossAmount: 5420, commissionPercent: 23, commissionAmount: 1247, gstOnCommission: 224,
    tcsAmount: 54, tdsAmount: 54, expectedNetPayout: 3841, receivedPayout: 3610,
    reconciliationStatus: 'Mismatch Alert', statementRef: 'SWG-WK46-2026',
    notes: '₹231 promo ad-spend charged without outlet campaign opt-in.',
  },
  {
    id: 'ota-7', channel: 'Agoda', channelType: 'Stay OTA', bookingOrOrderRef: 'AGD-331048',
    date: '18 Nov 2026', guestOrCustomer: 'Yuki Tanaka (Dorm D-03 • M3)',
    grossAmount: 2547, commissionPercent: 16, commissionAmount: 408, gstOnCommission: 73,
    tcsAmount: 25, tdsAmount: 25, expectedNetPayout: 2016, receivedPayout: 0,
    reconciliationStatus: 'Pending Payout', statementRef: 'AGD-SETTLE-25NOV',
  },
];
