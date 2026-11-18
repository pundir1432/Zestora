export interface CampPackage {
  id: string;
  propertyId: string;
  name: string;
  category: 'Rafting' | 'Trekking' | 'Riverside Camping' | 'Adventure Combo' | 'Meal Package';
  duration: string;
  basePrice: number;
  gstRate: number;
  inclusions: string[];
  addOns: { id: string; name: string; price: number }[];
  difficulty: 'Beginner' | 'Moderate' | 'Thrill Seeker';
  minAge: number;
  status: 'Active' | 'Seasonal Hold';
}

export interface ActivitySlot {
  id: string;
  packageId: string;
  packageName: string;
  category: 'Rafting' | 'Trekking' | 'Camping' | 'Bungee / Zipline';
  date: string;
  startTime: string;
  endTime: string;
  meetingPoint: string;
  guideName: string;
  guidePhone: string;
  capacity: number;
  bookedCount: number;
  riverGrade?: string;
  weatherStatus: 'Clear & Safe' | 'Wind Advisory' | 'River High Alert';
  status: 'Open' | 'Filling Fast' | 'Full' | 'In Progress' | 'Completed';
}

export interface CampBookingWaiver {
  id: string;
  slotId: string;
  slotLabel: string;
  guestName: string;
  guestPhone: string;
  nationality: string;
  roomOrUnit?: string;
  pax: number;
  addOnsSelected: string[];
  totalAmount: number;
  paymentStatus: 'Paid' | 'Posted to Folio' | 'Pending';
  waiverStatus: 'Signed' | 'Pending Signature';
  waiverSignedAt?: string;
  emergencyContact: string;
  medicalFitDeclared: boolean;
  checkedInByGuide: boolean;
}

export const MOCK_CAMP_PACKAGES: CampPackage[] = [
  {
    id: 'pkg-raft-16', propertyId: 'prop-shivpuri-camp',
    name: 'Shivpuri to NIM Beach 16km Ganga Rafting',
    category: 'Rafting', duration: '3.5 Hours (Grade III+ Rapids)', basePrice: 1200, gstRate: 18,
    inclusions: ['Certified River Guide', 'Imported Life Jacket & Helmet', 'Dry Bag', 'Body Surfing & Cliff Jump', 'Return Gypsy Shuttle'],
    addOns: [{ id: 'ao-gopro', name: 'GoPro 4K Rafting Video', price: 1000 }, { id: 'ao-maggi', name: 'Hot Maggi & Chai at Landing', price: 250 }],
    difficulty: 'Moderate', minAge: 14, status: 'Active',
  },
  {
    id: 'pkg-camp-overnight', propertyId: 'prop-shivpuri-camp',
    name: 'Riverside Swiss Camp + Bonfire + 16km Rafting Combo',
    category: 'Adventure Combo', duration: '1 Night / 2 Days', basePrice: 3800, gstRate: 18,
    inclusions: ['Luxury Swiss Tent Stay', '3 Buffet Meals + Evening Snacks', 'Guided 16km Rafting', 'Live Acoustic Bonfire', 'Morning River Yoga'],
    addOns: [{ id: 'ao-kayak', name: '1-Hr Flatwater Kayaking', price: 800 }, { id: 'ao-bbq', name: 'Private Pahadi BBQ Platter', price: 1200 }],
    difficulty: 'Beginner', minAge: 10, status: 'Active',
  },
  {
    id: 'pkg-trek-neergarh', propertyId: 'prop-tapovan-resort',
    name: 'Neer Garh & Kunjapuri Sunrise Himalayan Trek',
    category: 'Trekking', duration: '4.5 Hours (Guided Trail)', basePrice: 1200, gstRate: 18,
    inclusions: ['Local Pahadi Trek Guide', 'Trekking Poles', 'Organic Trail Mix & Fruit', 'Sunrise Herbal Tea'],
    addOns: [{ id: 'ao-cab', name: 'Private Cab Pickup from Tapovan', price: 700 }],
    difficulty: 'Beginner', minAge: 8, status: 'Active',
  },
  {
    id: 'pkg-bungee', propertyId: 'prop-shivpuri-camp',
    name: 'Mohan Chatti 83m Bungee + Giant Swing',
    category: 'Adventure Combo', duration: '3 Hours', basePrice: 4200, gstRate: 18,
    inclusions: ['Jump Master Safety Briefing', 'Harness & Jump Certificate', 'Transfer from Shivpuri Base'],
    addOns: [{ id: 'ao-drone', name: 'DSLR + GoPro Jump Video', price: 1100 }],
    difficulty: 'Thrill Seeker', minAge: 16, status: 'Active',
  },
  {
    id: 'pkg-meal-camp', propertyId: 'prop-shivpuri-camp',
    name: 'All-Day Garhwali Camp Meal Pass (B+L+D+Snacks)',
    category: 'Meal Package', duration: 'Full Day', basePrice: 1150, gstRate: 5,
    inclusions: ['Pahadi Breakfast Buffet', 'Riverside Lunch', 'Evening Pakora & Chai', 'Bonfire Dinner'],
    addOns: [{ id: 'ao-jain', name: 'Custom Sattvik / Jain Prep', price: 0 }],
    difficulty: 'Beginner', minAge: 5, status: 'Active',
  },
];

export const MOCK_ACTIVITY_SLOTS: ActivitySlot[] = [
  {
    id: 'slot-01', packageId: 'pkg-raft-16', packageName: '16km Ganga White Water Rafting',
    category: 'Rafting', date: '2026-11-18', startTime: '09:00 AM', endTime: '12:30 PM',
    meetingPoint: 'Shivpuri Base Deck #1', guideName: 'Deepak Bisht (IRF Certified)', guidePhone: '+91 98371 22410',
    capacity: 16, bookedCount: 14, riverGrade: 'Grade III+ (Roller Coaster, Golf Course)',
    weatherStatus: 'Clear & Safe', status: 'Filling Fast',
  },
  {
    id: 'slot-02', packageId: 'pkg-raft-16', packageName: '16km Ganga White Water Rafting',
    category: 'Rafting', date: '2026-11-18', startTime: '01:30 PM', endTime: '05:00 PM',
    meetingPoint: 'Shivpuri Base Deck #1', guideName: 'Suraj Bhandari (IRF Certified)', guidePhone: '+91 98371 66102',
    capacity: 16, bookedCount: 9, riverGrade: 'Grade III+ (Moderate Flow)',
    weatherStatus: 'Clear & Safe', status: 'Open',
  },
  {
    id: 'slot-03', packageId: 'pkg-trek-neergarh', packageName: 'Neer Garh Sunset Waterfall Trek',
    category: 'Trekking', date: '2026-11-18', startTime: '03:30 PM', endTime: '06:45 PM',
    meetingPoint: 'Tapovan Resort Main Gate', guideName: 'Mohan Nautiyal', guidePhone: '+91 94111 33409',
    capacity: 12, bookedCount: 8, weatherStatus: 'Clear & Safe', status: 'Open',
  },
  {
    id: 'slot-04', packageId: 'pkg-camp-overnight', packageName: 'Riverside Bonfire & Acoustic Evening',
    category: 'Camping', date: '2026-11-18', startTime: '07:00 PM', endTime: '10:30 PM',
    meetingPoint: 'Shivpuri Riverbank Meadow', guideName: 'Deepak Bisht', guidePhone: '+91 98371 22410',
    capacity: 40, bookedCount: 28, weatherStatus: 'Clear & Safe', status: 'Open',
  },
];

export const MOCK_CAMP_BOOKINGS: CampBookingWaiver[] = [
  {
    id: 'CB-772', slotId: 'slot-01', slotLabel: '09:00 AM • 16km Rafting',
    guestName: 'Lukas Weber', guestPhone: '+49 170 442190', nationality: 'Germany', roomOrUnit: 'Room 101',
    pax: 1, addOnsSelected: ['GoPro 4K Rafting Video'], totalAmount: 2200,
    paymentStatus: 'Posted to Folio', waiverStatus: 'Signed', waiverSignedAt: '18 Nov, 08:25 AM',
    emergencyContact: 'Klaus Weber (+49 170 112004)', medicalFitDeclared: true, checkedInByGuide: true,
  },
  {
    id: 'CB-775', slotId: 'slot-01', slotLabel: '09:00 AM • 16km Rafting',
    guestName: 'Sophie Laurent (Group of 2)', guestPhone: '+33 6 44 19 82 10', nationality: 'France', roomOrUnit: 'Tent T-01',
    pax: 2, addOnsSelected: ['Hot Maggi & Chai at Landing'], totalAmount: 2900,
    paymentStatus: 'Paid', waiverStatus: 'Signed', waiverSignedAt: '18 Nov, 08:30 AM',
    emergencyContact: 'Marc Laurent (+33 6 11 90 22 44)', medicalFitDeclared: true, checkedInByGuide: true,
  },
  {
    id: 'CB-778', slotId: 'slot-03', slotLabel: '03:30 PM • Neer Garh Sunset Trek',
    guestName: 'Elena Rossi & Marco Conti', guestPhone: '+39 347 998120', nationality: 'Italy', roomOrUnit: 'Room 201',
    pax: 2, addOnsSelected: [], totalAmount: 2400,
    paymentStatus: 'Posted to Folio', waiverStatus: 'Pending Signature',
    emergencyContact: 'Giulia Rossi (+39 340 551109)', medicalFitDeclared: true, checkedInByGuide: false,
  },
  {
    id: 'CB-781', slotId: 'slot-02', slotLabel: '01:30 PM • 16km Rafting',
    guestName: 'Karan Mehta & Friends', guestPhone: '+91 98201 77412', nationality: 'India', roomOrUnit: 'Dorm D-01 • B2',
    pax: 4, addOnsSelected: ['GoPro 4K Rafting Video'], totalAmount: 5800,
    paymentStatus: 'Paid', waiverStatus: 'Pending Signature',
    emergencyContact: 'Ramesh Mehta (+91 98201 11002)', medicalFitDeclared: true, checkedInByGuide: false,
  },
];
