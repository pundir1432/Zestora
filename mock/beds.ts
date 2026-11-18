export type DormGenderCategory = 'Mixed Dorm' | 'Female-Only Dorm' | 'Male-Only Dorm';
export type BedStatus = 'Available' | 'Occupied' | 'Dirty' | 'Reserved' | 'Out of Order';

export interface DormBed {
  id: string;
  dormId: string;
  bedCode: string; // e.g., B1 (Lower), B2 (Upper)
  position: 'Lower Bunk' | 'Upper Bunk';
  pricePerNight: number;
  status: BedStatus;
  guestName?: string;
  guestNationality?: string;
  isForeignGuest?: boolean;
  checkInDate?: string;
  checkOutDate?: string;
  lockerNumber: string;
  folioId?: string;
}

export interface DormRoom {
  id: string;
  propertyId: string;
  name: string;
  code: string;
  floor: string;
  genderCategory: DormGenderCategory;
  totalBeds: number;
  baseBedTariff: number;
  amenities: string[];
  beds: DormBed[];
}

export const MOCK_DORMS: DormRoom[] = [
  {
    id: 'dorm-01',
    propertyId: 'prop-tapovan-resort',
    name: 'Himalaya 6-Bed Mixed Dorm',
    code: 'D-01',
    floor: 'Hostel Wing — Floor 1',
    genderCategory: 'Mixed Dorm',
    totalBeds: 6,
    baseBedTariff: 899,
    amenities: ['Privacy Curtains', 'Reading Light', 'Locker', 'AC', 'Attached Bath'],
    beds: [
      { id: 'b-101', dormId: 'dorm-01', bedCode: 'B1', position: 'Lower Bunk', pricePerNight: 949, status: 'Occupied', guestName: 'Daniel Cohen', guestNationality: 'Israel', isForeignGuest: true, checkInDate: '2026-11-17', checkOutDate: '2026-11-21', lockerNumber: 'L-01', folioId: 'FOL-904' },
      { id: 'b-102', dormId: 'dorm-01', bedCode: 'B2', position: 'Upper Bunk', pricePerNight: 849, status: 'Occupied', guestName: 'Karan Mehta', guestNationality: 'India', isForeignGuest: false, checkInDate: '2026-11-18', checkOutDate: '2026-11-20', lockerNumber: 'L-02' },
      { id: 'b-103', dormId: 'dorm-01', bedCode: 'B3', position: 'Lower Bunk', pricePerNight: 949, status: 'Available', lockerNumber: 'L-03' },
      { id: 'b-104', dormId: 'dorm-01', bedCode: 'B4', position: 'Upper Bunk', pricePerNight: 849, status: 'Dirty', lockerNumber: 'L-04' },
      { id: 'b-105', dormId: 'dorm-01', bedCode: 'B5', position: 'Lower Bunk', pricePerNight: 949, status: 'Reserved', guestName: 'Liam O’Connor (ETA 6 PM)', guestNationality: 'Ireland', isForeignGuest: true, checkInDate: '2026-11-18', checkOutDate: '2026-11-22', lockerNumber: 'L-05' },
      { id: 'b-106', dormId: 'dorm-01', bedCode: 'B6', position: 'Upper Bunk', pricePerNight: 849, status: 'Available', lockerNumber: 'L-06' },
    ],
  },
  {
    id: 'dorm-02',
    propertyId: 'prop-tapovan-resort',
    name: 'Ganga 4-Bed Female-Only Dorm',
    code: 'D-02',
    floor: 'Hostel Wing — Floor 2',
    genderCategory: 'Female-Only Dorm',
    totalBeds: 4,
    baseBedTariff: 1099,
    amenities: ['Keycard Access', 'River Window', 'Vanity Mirror', 'Personal Locker', 'AC'],
    beds: [
      { id: 'b-201', dormId: 'dorm-02', bedCode: 'F1', position: 'Lower Bunk', pricePerNight: 1149, status: 'Occupied', guestName: 'Hannah Lindqvist', guestNationality: 'Sweden', isForeignGuest: true, checkInDate: '2026-11-18', checkOutDate: '2026-11-23', lockerNumber: 'FL-01', folioId: 'FOL-905' },
      { id: 'b-202', dormId: 'dorm-02', bedCode: 'F2', position: 'Upper Bunk', pricePerNight: 1049, status: 'Occupied', guestName: 'Ananya Verma', guestNationality: 'India', isForeignGuest: false, checkInDate: '2026-11-17', checkOutDate: '2026-11-19', lockerNumber: 'FL-02' },
      { id: 'b-203', dormId: 'dorm-02', bedCode: 'F3', position: 'Lower Bunk', pricePerNight: 1149, status: 'Available', lockerNumber: 'FL-03' },
      { id: 'b-204', dormId: 'dorm-02', bedCode: 'F4', position: 'Upper Bunk', pricePerNight: 1049, status: 'Reserved', guestName: 'Neha Kulkarni', guestNationality: 'India', isForeignGuest: false, checkInDate: '2026-11-18', checkOutDate: '2026-11-20', lockerNumber: 'FL-04' },
    ],
  },
  {
    id: 'dorm-03',
    propertyId: 'prop-tapovan-resort',
    name: 'Yoga & Trek 6-Bed Male-Only Dorm',
    code: 'D-03',
    floor: 'Hostel Wing — Floor 1',
    genderCategory: 'Male-Only Dorm',
    totalBeds: 6,
    baseBedTariff: 799,
    amenities: ['Heavy Backpack Lockers', 'Drying Rack', 'Power Socket', 'Wi-Fi'],
    beds: [
      { id: 'b-301', dormId: 'dorm-03', bedCode: 'M1', position: 'Lower Bunk', pricePerNight: 849, status: 'Occupied', guestName: 'Siddharth Rao', guestNationality: 'India', isForeignGuest: false, checkInDate: '2026-11-17', checkOutDate: '2026-11-19', lockerNumber: 'ML-01' },
      { id: 'b-302', dormId: 'dorm-03', bedCode: 'M2', position: 'Upper Bunk', pricePerNight: 749, status: 'Available', lockerNumber: 'ML-02' },
      { id: 'b-303', dormId: 'dorm-03', bedCode: 'M3', position: 'Lower Bunk', pricePerNight: 849, status: 'Occupied', guestName: 'Yuki Tanaka', guestNationality: 'Japan', isForeignGuest: true, checkInDate: '2026-11-18', checkOutDate: '2026-11-21', lockerNumber: 'ML-03' },
      { id: 'b-304', dormId: 'dorm-03', bedCode: 'M4', position: 'Upper Bunk', pricePerNight: 749, status: 'Out of Order', lockerNumber: 'ML-04' },
      { id: 'b-305', dormId: 'dorm-03', bedCode: 'M5', position: 'Lower Bunk', pricePerNight: 849, status: 'Available', lockerNumber: 'ML-05' },
      { id: 'b-306', dormId: 'dorm-03', bedCode: 'M6', position: 'Upper Bunk', pricePerNight: 749, status: 'Available', lockerNumber: 'ML-06' },
    ],
  },
];
