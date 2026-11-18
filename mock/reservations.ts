export interface FolioCharge {
  id: string;
  date: string;
  category: 'Room' | 'Dorm Bed' | 'Restaurant' | 'Camp Activity' | 'Service' | 'Discount' | 'Credit Adjustment';
  description: string;
  referenceNo: string;
  amount: number; // positive for charge, negative for discount/credit
  gstRate: number;
  gstAmount: number;
  postedBy: string;
}

export interface FolioPayment {
  id: string;
  date: string;
  method: 'UPI' | 'Card' | 'Cash' | 'OTA Prepaid' | 'Bank Transfer';
  referenceNo: string;
  amount: number;
  receivedBy: string;
}

export interface GuestFolio {
  id: string;
  reservationId: string;
  guestName: string;
  guestPhone: string;
  guestEmail: string;
  nationality: string;
  isForeignGuest: boolean;
  unitLabel: string; // e.g., Room 201 (Ganga View Suite)
  checkInDate: string;
  checkOutDate: string;
  bookingSource: 'Direct' | 'Walk-in' | 'MakeMyTrip' | 'Booking.com' | 'Hostelworld' | 'Travel Agent';
  status: 'Open' | 'Settled' | 'Checkout Pending';
  charges: FolioCharge[];
  payments: FolioPayment[];
  invoiceNumber: string;
}

export interface StayReservation {
  id: string;
  bookingCode: string;
  propertyId: string;
  guestName: string;
  guestPhone: string;
  guestEmail: string;
  nationality: string;
  isForeignGuest: boolean;
  idType: 'Aadhaar' | 'Passport' | 'Driving License' | 'Voter ID';
  idNumber: string;
  idVerified: boolean;
  unitType: 'Room' | 'Dorm Bed' | 'Camp Tent';
  unitLabel: string;
  checkInDate: string;
  checkOutDate: string;
  nights: number;
  adults: number;
  children: number;
  source: 'Direct' | 'Walk-in' | 'MakeMyTrip' | 'Booking.com' | 'Goibibo' | 'Hostelworld' | 'Travel Agent';
  status: 'Confirmed' | 'Checked In' | 'Checked Out' | 'No Show' | 'Cancelled';
  totalEstimate: number;
  paidAmount: number;
  folioId: string;
  formIIIRequired: boolean;
  formIIIStatus?: 'Pending' | 'Due Soon' | 'Overdue' | 'Submitted';
  specialNotes?: string;
}

export const MOCK_RESERVATIONS: StayReservation[] = [
  {
    id: 'RES-8841', bookingCode: 'GH-2611-8841', propertyId: 'prop-tapovan-resort',
    guestName: 'Lukas Weber', guestPhone: '+49 170 442190', guestEmail: 'lukas.weber@mail.de',
    nationality: 'Germany', isForeignGuest: true, idType: 'Passport', idNumber: 'C01X89241', idVerified: true,
    unitType: 'Room', unitLabel: 'Room 101 • Deluxe Balcony', checkInDate: '2026-11-17', checkOutDate: '2026-11-20',
    nights: 3, adults: 1, children: 0, source: 'Booking.com', status: 'Checked In',
    totalEstimate: 19450, paidAmount: 10000, folioId: 'FOL-901', formIIIRequired: true, formIIIStatus: 'Overdue',
    specialNotes: 'Booked 16km Rafting slot tomorrow 09:00 AM; prefers herbal tea.',
  },
  {
    id: 'RES-8842', bookingCode: 'GH-2611-8842', propertyId: 'prop-tapovan-resort',
    guestName: 'Elena Rossi & Marco Conti', guestPhone: '+39 347 998120', guestEmail: 'elena.rossi@roma.it',
    nationality: 'Italy', isForeignGuest: true, idType: 'Passport', idNumber: 'YA7291048', idVerified: true,
    unitType: 'Room', unitLabel: 'Room 201 • Ganga View Suite', checkInDate: '2026-11-18', checkOutDate: '2026-11-22',
    nights: 4, adults: 2, children: 0, source: 'Direct', status: 'Checked In',
    totalEstimate: 44600, paidAmount: 20000, folioId: 'FOL-902', formIIIRequired: true, formIIIStatus: 'Due Soon',
    specialNotes: 'Tariff > ₹7,500 slab (18% GST). Honeymoon floral setup requested.',
  },
  {
    id: 'RES-8843', bookingCode: 'GH-2611-8843', propertyId: 'prop-tapovan-resort',
    guestName: 'Rajeshwar Malhotra Family', guestPhone: '+91 98110 22349', guestEmail: 'rajeshwar.m@delhi.in',
    nationality: 'India', isForeignGuest: false, idType: 'Aadhaar', idNumber: 'XXXX-XXXX-4821', idVerified: true,
    unitType: 'Room', unitLabel: 'Room 203 • Family Cottage', checkInDate: '2026-11-16', checkOutDate: '2026-11-19',
    nights: 3, adults: 3, children: 1, source: 'MakeMyTrip', status: 'Checked In',
    totalEstimate: 31800, paidAmount: 23400, folioId: 'FOL-903', formIIIRequired: false,
    specialNotes: 'Checkout tomorrow 11 AM; Ganga Aarti shuttle cab requested.',
  },
  {
    id: 'RES-8845', bookingCode: 'GH-2611-8845', propertyId: 'prop-tapovan-resort',
    guestName: 'Aarav Sharma', guestPhone: '+91 98991 55210', guestEmail: 'aarav.sharma@gmail.com',
    nationality: 'India', isForeignGuest: false, idType: 'Aadhaar', idNumber: 'Pending Scan', idVerified: false,
    unitType: 'Room', unitLabel: 'Room 104 • Standard Mountain', checkInDate: '2026-11-18', checkOutDate: '2026-11-20',
    nights: 2, adults: 2, children: 0, source: 'Goibibo', status: 'Confirmed',
    totalEstimate: 7168, paidAmount: 3500, folioId: 'FOL-906', formIIIRequired: false,
    specialNotes: 'Arriving today around 4:00 PM from Haridwar station.',
  },
  {
    id: 'RES-8846', bookingCode: 'GH-2611-8846', propertyId: 'prop-shivpuri-camp',
    guestName: 'Sophie Laurent', guestPhone: '+33 6 44 19 82 10', guestEmail: 'sophie.laurent@paris.fr',
    nationality: 'France', isForeignGuest: true, idType: 'Passport', idNumber: '19FR88412', idVerified: true,
    unitType: 'Camp Tent', unitLabel: 'Tent T-01 • Luxury Swiss Tent', checkInDate: '2026-11-18', checkOutDate: '2026-11-20',
    nights: 2, adults: 2, children: 0, source: 'Travel Agent', status: 'Checked In',
    totalEstimate: 16200, paidAmount: 8000, folioId: 'FOL-907', formIIIRequired: true, formIIIStatus: 'Pending',
    specialNotes: 'Includes Shivpuri Rafting + Bonfire Dinner package.',
  },
  {
    id: 'RES-8848', bookingCode: 'GH-2611-8848', propertyId: 'prop-tapovan-resort',
    guestName: 'Hannah Lindqvist', guestPhone: '+46 70 812 3341', guestEmail: 'hannah.l@stockholm.se',
    nationality: 'Sweden', isForeignGuest: true, idType: 'Passport', idNumber: 'SE9921045', idVerified: true,
    unitType: 'Dorm Bed', unitLabel: 'Dorm D-02 • Bed F1 (Female)', checkInDate: '2026-11-18', checkOutDate: '2026-11-23',
    nights: 5, adults: 1, children: 0, source: 'Hostelworld', status: 'Checked In',
    totalEstimate: 7250, paidAmount: 2000, folioId: 'FOL-905', formIIIRequired: true, formIIIStatus: 'Submitted',
    specialNotes: 'Yoga Teacher Training drop-in; vegan breakfast plan.',
  },
];

export const MOCK_FOLIOS: GuestFolio[] = [
  {
    id: 'FOL-901',
    reservationId: 'RES-8841',
    guestName: 'Lukas Weber',
    guestPhone: '+49 170 442190',
    guestEmail: 'lukas.weber@mail.de',
    nationality: 'Germany',
    isForeignGuest: true,
    unitLabel: 'Room 101 • Deluxe Balcony Room',
    checkInDate: '2026-11-17',
    checkOutDate: '2026-11-20',
    bookingSource: 'Booking.com',
    status: 'Open',
    invoiceNumber: 'INV/26-27/01421',
    charges: [
      { id: 'ch-1', date: '17 Nov, 02:00 PM', category: 'Room', description: 'Deluxe Balcony Room — Night 1 (Tariff ₹4,800)', referenceNo: 'RM-101-N1', amount: 4800, gstRate: 12, gstAmount: 576, postedBy: 'Night Audit' },
      { id: 'ch-2', date: '18 Nov, 12:00 AM', category: 'Room', description: 'Deluxe Balcony Room — Night 2 (Tariff ₹4,800)', referenceNo: 'RM-101-N2', amount: 4800, gstRate: 12, gstAmount: 576, postedBy: 'Night Audit' },
      { id: 'ch-3', date: '17 Nov, 08:45 PM', category: 'Restaurant', description: 'Ganga Terrace Kitchen • Bill #POS-4412 (Paneer Tikka, Dal Makhani, Lemon Ginger Tea)', referenceNo: 'POS-4412', amount: 1180, gstRate: 5, gstAmount: 59, postedBy: 'Suresh Negi (POS)' },
      { id: 'ch-4', date: '18 Nov, 09:00 AM', category: 'Camp Activity', description: '16km Shivpuri White Water Rafting + GoPro Video Add-on', referenceNo: 'CMP-772', amount: 2200, gstRate: 18, gstAmount: 396, postedBy: 'Deepak Bisht (Camp)' },
      { id: 'ch-5', date: '18 Nov, 11:30 AM', category: 'Service', description: 'Laundry Express & Yoga Mat Rental', referenceNo: 'SRV-209', amount: 450, gstRate: 12, gstAmount: 54, postedBy: 'Kavita Reddy (FD)' },
      { id: 'ch-6', date: '18 Nov, 12:15 PM', category: 'Discount', description: 'Long Stay Activity Combo Courtesy Discount', referenceNo: 'DSC-102', amount: -400, gstRate: 0, gstAmount: 0, postedBy: 'Vikram Singhania (Approved)' },
    ],
    payments: [
      { id: 'pay-1', date: '17 Nov, 01:45 PM', method: 'OTA Prepaid', referenceNo: 'BDC-889124', amount: 10000, receivedBy: 'Booking.com Virtual Card' },
      { id: 'pay-2', date: '18 Nov, 01:10 PM', method: 'Card', referenceNo: 'VISA-4821', amount: 2000, receivedBy: 'Kavita Reddy (FD)' },
    ],
  },
  {
    id: 'FOL-902',
    reservationId: 'RES-8842',
    guestName: 'Elena Rossi & Marco Conti',
    guestPhone: '+39 347 998120',
    guestEmail: 'elena.rossi@roma.it',
    nationality: 'Italy',
    isForeignGuest: true,
    unitLabel: 'Room 201 • Ganga View Suite',
    checkInDate: '2026-11-18',
    checkOutDate: '2026-11-22',
    bookingSource: 'Direct',
    status: 'Open',
    invoiceNumber: 'INV/26-27/01422',
    charges: [
      { id: 'ch-21', date: '18 Nov, 01:15 PM', category: 'Room', description: 'Ganga View Suite — Night 1 (Tariff ₹8,500 > ₹7,500 Slab)', referenceNo: 'RM-201-N1', amount: 8500, gstRate: 18, gstAmount: 1530, postedBy: 'Kavita Reddy (FD)' },
      { id: 'ch-22', date: '18 Nov, 02:30 PM', category: 'Restaurant', description: 'Rooftop Cafe • Bill #POS-4429 (Woodfired Pizza, Cold Brew x2, Tiramisu)', referenceNo: 'POS-4429', amount: 1640, gstRate: 5, gstAmount: 82, postedBy: 'Ankit Rawat (Captain)' },
      { id: 'ch-23', date: '18 Nov, 03:00 PM', category: 'Camp Activity', description: 'Neer Garh Guided Sunset Waterfall Trek (2 Pax)', referenceNo: 'CMP-778', amount: 2400, gstRate: 18, gstAmount: 432, postedBy: 'Camp Desk' },
    ],
    payments: [
      { id: 'pay-21', date: '15 Nov, 05:20 PM', method: 'Bank Transfer', referenceNo: 'SWIFT-IT9912', amount: 20000, receivedBy: 'Advance Deposit' },
    ],
  },
  {
    id: 'FOL-903',
    reservationId: 'RES-8843',
    guestName: 'Rajeshwar Malhotra Family',
    guestPhone: '+91 98110 22349',
    guestEmail: 'rajeshwar.m@delhi.in',
    nationality: 'India',
    isForeignGuest: false,
    unitLabel: 'Room 203 • Family Cottage',
    checkInDate: '2026-11-16',
    checkOutDate: '2026-11-19',
    bookingSource: 'MakeMyTrip',
    status: 'Checkout Pending',
    invoiceNumber: 'INV/26-27/01423',
    charges: [
      { id: 'ch-31', date: '16 Nov - 18 Nov', category: 'Room', description: 'Family Cottage — 3 Nights @ ₹7,800/night (> ₹7,500 Slab)', referenceNo: 'RM-203-3N', amount: 23400, gstRate: 18, gstAmount: 4212, postedBy: 'Night Audit' },
      { id: 'ch-32', date: '17 Nov, 09:00 PM', category: 'Restaurant', description: 'Family Garhwali Thali Dinner + Desserts (Bill #POS-4405)', referenceNo: 'POS-4405', amount: 3420, gstRate: 5, gstAmount: 171, postedBy: 'Suresh Negi (POS)' },
      { id: 'ch-33', date: '18 Nov, 10:00 AM', category: 'Service', description: 'Triveni Ghat Ganga Aarti Private Innova Shuttle', referenceNo: 'SRV-214', amount: 1200, gstRate: 5, gstAmount: 60, postedBy: 'Front Desk' },
    ],
    payments: [
      { id: 'pay-31', date: '16 Nov, 12:00 PM', method: 'OTA Prepaid', referenceNo: 'MMT-7741209', amount: 23400, receivedBy: 'MakeMyTrip' },
      { id: 'pay-32', date: '18 Nov, 02:00 PM', method: 'UPI', referenceNo: 'UPI-994128812', amount: 5000, receivedBy: 'Kavita Reddy (FD)' },
    ],
  },
];
