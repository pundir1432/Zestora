export type RoomStatus =
  | 'Available'
  | 'Occupied'
  | 'Dirty'
  | 'Cleaning'
  | 'Clean'
  | 'Out of Order'
  | 'Reserved';

export interface HotelRoom {
  id: string;
  propertyId: string;
  roomNumber: string;
  floor: string;
  roomType: 'Ganga View Suite' | 'Deluxe Balcony Room' | 'Standard Mountain Room' | 'Luxury Swiss Tent' | 'Family Cottage';
  tariffPerNight: number; // Supports GST ₹7,500 slab threshold demo!
  maxGuests: number;
  status: RoomStatus;
  currentGuestName?: string;
  currentGuestNationality?: string;
  isForeignGuest?: boolean;
  reservationId?: string;
  checkInDate?: string;
  checkOutDate?: string;
  housekeeperAssigned?: string;
  maintenanceNote?: string;
  amenities: string[];
  lastCleanedAt: string;
}

export interface HousekeepingTask {
  id: string;
  propertyId: string;
  targetName: string; // Room 102 or Dorm B - Bed 3
  targetType: 'Room' | 'Dorm Bed' | 'Camp Tent';
  taskType: 'Checkout Deep Clean' | 'Stayover Refresh' | 'Linen Change' | 'Maintenance Repair' | 'Pre-Arrival Inspection';
  priority: 'Urgent' | 'High' | 'Normal';
  status: 'Pending' | 'In Progress' | 'Inspecting' | 'Completed';
  assignedTo: string;
  notes?: string;
  createdAt: string;
}

export const MOCK_ROOMS: HotelRoom[] = [
  {
    id: 'rm-101', propertyId: 'prop-tapovan-resort', roomNumber: '101', floor: 'Floor 1',
    roomType: 'Deluxe Balcony Room', tariffPerNight: 4800, maxGuests: 2, status: 'Occupied',
    currentGuestName: 'Lukas Weber', currentGuestNationality: 'Germany', isForeignGuest: true,
    reservationId: 'RES-8841', checkInDate: '2026-11-17', checkOutDate: '2026-11-20',
    housekeeperAssigned: 'Sunita Devi', amenities: ['River Balcony', 'AC', 'Wi-Fi', 'Kettle'], lastCleanedAt: 'Today, 10:15 AM',
  },
  {
    id: 'rm-102', propertyId: 'prop-tapovan-resort', roomNumber: '102', floor: 'Floor 1',
    roomType: 'Deluxe Balcony Room', tariffPerNight: 4800, maxGuests: 2, status: 'Dirty',
    housekeeperAssigned: 'Sunita Devi', amenities: ['River Balcony', 'AC', 'Wi-Fi', 'Kettle'], lastCleanedAt: 'Yesterday, 11:30 AM',
  },
  {
    id: 'rm-103', propertyId: 'prop-tapovan-resort', roomNumber: '103', floor: 'Floor 1',
    roomType: 'Standard Mountain Room', tariffPerNight: 3200, maxGuests: 2, status: 'Available',
    housekeeperAssigned: 'Ramesh Kumar', amenities: ['Hill View', 'AC', 'Wi-Fi'], lastCleanedAt: 'Today, 09:40 AM',
  },
  {
    id: 'rm-104', propertyId: 'prop-tapovan-resort', roomNumber: '104', floor: 'Floor 1',
    roomType: 'Standard Mountain Room', tariffPerNight: 3200, maxGuests: 2, status: 'Reserved',
    currentGuestName: 'Aarav Sharma (ETA 04:00 PM)', currentGuestNationality: 'India', isForeignGuest: false,
    reservationId: 'RES-8845', checkInDate: '2026-11-18', checkOutDate: '2026-11-20',
    housekeeperAssigned: 'Ramesh Kumar', amenities: ['Hill View', 'AC', 'Wi-Fi'], lastCleanedAt: 'Today, 11:00 AM',
  },
  {
    id: 'rm-201', propertyId: 'prop-tapovan-resort', roomNumber: '201', floor: 'Floor 2',
    roomType: 'Ganga View Suite', tariffPerNight: 8500, maxGuests: 3, status: 'Occupied',
    currentGuestName: 'Elena Rossi & Marco Conti', currentGuestNationality: 'Italy', isForeignGuest: true,
    reservationId: 'RES-8842', checkInDate: '2026-11-18', checkOutDate: '2026-11-22',
    housekeeperAssigned: 'Pooja Chauhan', amenities: ['Panoramic Ganga View', 'Bathtub', 'Mini Bar', 'Yoga Deck'], lastCleanedAt: 'Today, 01:00 PM',
  },
  {
    id: 'rm-202', propertyId: 'prop-tapovan-resort', roomNumber: '202', floor: 'Floor 2',
    roomType: 'Ganga View Suite', tariffPerNight: 8500, maxGuests: 3, status: 'Clean',
    housekeeperAssigned: 'Pooja Chauhan', amenities: ['Panoramic Ganga View', 'Bathtub', 'Mini Bar', 'Yoga Deck'], lastCleanedAt: 'Today, 12:20 PM',
  },
  {
    id: 'rm-203', propertyId: 'prop-tapovan-resort', roomNumber: '203', floor: 'Floor 2',
    roomType: 'Family Cottage', tariffPerNight: 7800, maxGuests: 4, status: 'Occupied',
    currentGuestName: 'Rajeshwar Malhotra Family', currentGuestNationality: 'India', isForeignGuest: false,
    reservationId: 'RES-8843', checkInDate: '2026-11-16', checkOutDate: '2026-11-19',
    housekeeperAssigned: 'Sunita Devi', amenities: ['2 Bedrooms', 'Private Lawn', 'AC', 'Smart TV'], lastCleanedAt: 'Today, 10:45 AM',
  },
  {
    id: 'rm-204', propertyId: 'prop-tapovan-resort', roomNumber: '204', floor: 'Floor 2',
    roomType: 'Deluxe Balcony Room', tariffPerNight: 4800, maxGuests: 2, status: 'Cleaning',
    housekeeperAssigned: 'Ramesh Kumar', amenities: ['River Balcony', 'AC', 'Wi-Fi'], lastCleanedAt: 'In progress',
  },
  {
    id: 'rm-205', propertyId: 'prop-tapovan-resort', roomNumber: '205', floor: 'Floor 2',
    roomType: 'Deluxe Balcony Room', tariffPerNight: 4800, maxGuests: 2, status: 'Out of Order',
    maintenanceNote: 'Geyser thermostat replacement scheduled with technician (ETA 6 PM)',
    housekeeperAssigned: 'Manoj (Maintenance)', amenities: ['River Balcony', 'AC', 'Wi-Fi'], lastCleanedAt: '2 days ago',
  },
  {
    id: 'rm-301', propertyId: 'prop-shivpuri-camp', roomNumber: 'T-01', floor: 'Riverbank Zone A',
    roomType: 'Luxury Swiss Tent', tariffPerNight: 5500, maxGuests: 3, status: 'Occupied',
    currentGuestName: 'Sophie Laurent', currentGuestNationality: 'France', isForeignGuest: true,
    reservationId: 'RES-8846', checkInDate: '2026-11-18', checkOutDate: '2026-11-20',
    housekeeperAssigned: 'Kiran Bisht', amenities: ['Attached Bath', 'Cooler/Heater', 'River Deck', 'Bonfire Access'], lastCleanedAt: 'Today, 11:10 AM',
  },
  {
    id: 'rm-302', propertyId: 'prop-shivpuri-camp', roomNumber: 'T-02', floor: 'Riverbank Zone A',
    roomType: 'Luxury Swiss Tent', tariffPerNight: 5500, maxGuests: 3, status: 'Available',
    housekeeperAssigned: 'Kiran Bisht', amenities: ['Attached Bath', 'Cooler/Heater', 'River Deck'], lastCleanedAt: 'Today, 10:00 AM',
  },
];

export const MOCK_HOUSEKEEPING_TASKS: HousekeepingTask[] = [
  {
    id: 'HK-501', propertyId: 'prop-tapovan-resort', targetName: 'Room 102 (Deluxe Balcony)',
    targetType: 'Room', taskType: 'Checkout Deep Clean', priority: 'Urgent', status: 'Pending',
    assignedTo: 'Sunita Devi', notes: 'Early check-in requested at 2:30 PM — replace all towels & sanitize kettle.',
    createdAt: '22 mins ago',
  },
  {
    id: 'HK-502', propertyId: 'prop-tapovan-resort', targetName: 'Room 204 (Deluxe Balcony)',
    targetType: 'Room', taskType: 'Checkout Deep Clean', priority: 'High', status: 'In Progress',
    assignedTo: 'Ramesh Kumar', notes: 'Fresh linen & balcony glass wipe.',
    createdAt: '40 mins ago',
  },
  {
    id: 'HK-503', propertyId: 'prop-tapovan-resort', targetName: 'Room 205 (Deluxe Balcony)',
    targetType: 'Room', taskType: 'Maintenance Repair', priority: 'Urgent', status: 'In Progress',
    assignedTo: 'Manoj (Maintenance)', notes: 'Geyser thermostat replacement — room locked Out of Order.',
    createdAt: '3 hrs ago',
  },
  {
    id: 'HK-504', propertyId: 'prop-tapovan-resort', targetName: 'Dorm D-01 • Bed B4',
    targetType: 'Dorm Bed', taskType: 'Linen Change', priority: 'High', status: 'Pending',
    assignedTo: 'Pooja Chauhan', notes: 'Hostel guest checked out at 11 AM; locker sanitized & new sheet needed.',
    createdAt: '55 mins ago',
  },
  {
    id: 'HK-505', propertyId: 'prop-tapovan-resort', targetName: 'Room 202 (Ganga View Suite)',
    targetType: 'Room', taskType: 'Pre-Arrival Inspection', priority: 'Normal', status: 'Completed',
    assignedTo: 'Pooja Chauhan', notes: 'Supervisor inspected — welcome tea tray placed.',
    createdAt: '2 hrs ago',
  },
];
