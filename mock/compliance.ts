export type FormIIIStatus = 'Pending' | 'Due Soon' | 'Overdue' | 'Submitted';

export interface FormIIIDocument {
  type: 'Guest Photo' | 'Passport Bio Page' | 'Indian Visa / e-Visa';
  fileName: string;
  fileSizeKb: number;
  maxAllowedKb: number;
  valid: boolean;
  validationNote: string;
  previewUrl: string;
}

export interface FormIIIRecord {
  id: string;
  reservationId: string;
  propertyId: string;
  propertyName: string;
  frroPropertyCode: string;
  guestName: string;
  gender: 'Male' | 'Female' | 'Other';
  dateOfBirth: string;
  nationality: string;
  passportNumber: string;
  passportIssueDate: string;
  passportExpiryDate: string;
  passportPlaceOfIssue: string;
  visaNumber: string;
  visaType: 'Tourist (e-TV)' | 'Yoga / Student' | 'Business' | 'OCI / PIO';
  visaIssueDate: string;
  visaExpiryDate: string;
  arrivalDateTime: string; // display
  hoursRemaining: number; // negative means overdue!
  deadlineLabel: string;
  addressInIndia: string;
  arrivedFrom: string;
  purposeOfVisit: 'Tourism & Yoga' | 'Adventure & Rafting' | 'Spiritual Retreat' | 'Business';
  nextDestination: string;
  unitLabel: string;
  status: FormIIIStatus;
  acknowledgementNumber?: string;
  acknowledgementUploadedAt?: string;
  departureDate?: string;
  departureReported: boolean;
  documents: FormIIIDocument[];
}

export const MOCK_FORM_III_RECORDS: FormIIIRecord[] = [
  {
    id: 'F3-2611-01',
    reservationId: 'RES-8841',
    propertyId: 'prop-tapovan-resort',
    propertyName: 'Ganga View Resort, Cafe & Hostel — Tapovan',
    frroPropertyCode: 'UK-TEH-RSH-04821',
    guestName: 'Lukas Weber',
    gender: 'Male',
    dateOfBirth: '1991-06-14',
    nationality: 'Germany',
    passportNumber: 'C01X89241',
    passportIssueDate: '2021-03-10',
    passportExpiryDate: '2031-03-09',
    passportPlaceOfIssue: 'Berlin, Germany',
    visaNumber: 'IN8829104DE',
    visaType: 'Tourist (e-TV)',
    visaIssueDate: '2026-10-20',
    visaExpiryDate: '2027-10-19',
    arrivalDateTime: '17 Nov 2026, 02:00 PM',
    hoursRemaining: -3.5,
    deadlineLabel: 'Overdue by 3h 30m (24h window crossed)',
    addressInIndia: 'Ganga View Resort, Badrinath Rd, Tapovan, Rishikesh, Uttarakhand',
    arrivedFrom: 'New Delhi (IGI Airport)',
    purposeOfVisit: 'Adventure & Rafting',
    nextDestination: 'Dharamshala, Himachal Pradesh',
    unitLabel: 'Room 101',
    status: 'Overdue',
    departureDate: '2026-11-20',
    departureReported: false,
    documents: [
      {
        type: 'Guest Photo',
        fileName: 'lukas_weber_face.jpg',
        fileSizeKb: 42,
        maxAllowedKb: 50,
        valid: true,
        validationNote: 'JPEG format, <= 50KB FRRO spec OK',
        previewUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80',
      },
      {
        type: 'Passport Bio Page',
        fileName: 'lukas_passport_c01x.pdf',
        fileSizeKb: 280,
        maxAllowedKb: 500,
        valid: true,
        validationNote: 'Readable MRZ & <= 500KB OK',
        previewUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=160&h=100&q=80',
      },
      {
        type: 'Indian Visa / e-Visa',
        fileName: 'lukas_evisa_scan.pdf',
        fileSizeKb: 640,
        maxAllowedKb: 500,
        valid: false,
        validationNote: 'File exceeds 500KB — compress before upload',
        previewUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=160&h=100&q=80',
      },
    ],
  },
  {
    id: 'F3-2611-02',
    reservationId: 'RES-8842',
    propertyId: 'prop-tapovan-resort',
    propertyName: 'Ganga View Resort, Cafe & Hostel — Tapovan',
    frroPropertyCode: 'UK-TEH-RSH-04821',
    guestName: 'Elena Rossi',
    gender: 'Female',
    dateOfBirth: '1993-09-22',
    nationality: 'Italy',
    passportNumber: 'YA7291048',
    passportIssueDate: '2022-05-12',
    passportExpiryDate: '2032-05-11',
    passportPlaceOfIssue: 'Rome, Italy',
    visaNumber: 'IN9102348IT',
    visaType: 'Tourist (e-TV)',
    visaIssueDate: '2026-11-01',
    visaExpiryDate: '2027-10-31',
    arrivalDateTime: '18 Nov 2026, 01:15 PM',
    hoursRemaining: 4.2,
    deadlineLabel: 'Due in 4h 12m (Urgent Warning)',
    addressInIndia: 'Ganga View Resort, Badrinath Rd, Tapovan, Rishikesh, Uttarakhand',
    arrivedFrom: 'Jaipur, Rajasthan',
    purposeOfVisit: 'Tourism & Yoga',
    nextDestination: 'Varanasi, Uttar Pradesh',
    unitLabel: 'Room 201',
    status: 'Due Soon',
    departureDate: '2026-11-22',
    departureReported: false,
    documents: [
      {
        type: 'Guest Photo',
        fileName: 'elena_photo.jpg',
        fileSizeKb: 38,
        maxAllowedKb: 50,
        valid: true,
        validationNote: 'JPEG format, <= 50KB OK',
        previewUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
      },
      {
        type: 'Passport Bio Page',
        fileName: 'elena_passport.pdf',
        fileSizeKb: 210,
        maxAllowedKb: 500,
        valid: true,
        validationNote: 'Clear scan, <= 500KB OK',
        previewUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=160&h=100&q=80',
      },
      {
        type: 'Indian Visa / e-Visa',
        fileName: 'elena_evisa.pdf',
        fileSizeKb: 195,
        maxAllowedKb: 500,
        valid: true,
        validationNote: 'Valid e-TV stamp visible',
        previewUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=160&h=100&q=80',
      },
    ],
  },
  {
    id: 'F3-2611-03',
    reservationId: 'RES-8846',
    propertyId: 'prop-shivpuri-camp',
    propertyName: 'Shivpuri Rapids Eco Camp & Adventure Base',
    frroPropertyCode: 'UK-TEH-SHV-09134',
    guestName: 'Sophie Laurent',
    gender: 'Female',
    dateOfBirth: '1995-02-18',
    nationality: 'France',
    passportNumber: '19FR88412',
    passportIssueDate: '2019-07-01',
    passportExpiryDate: '2029-06-30',
    passportPlaceOfIssue: 'Paris, France',
    visaNumber: 'IN7741023FR',
    visaType: 'Tourist (e-TV)',
    visaIssueDate: '2026-10-28',
    visaExpiryDate: '2027-04-28',
    arrivalDateTime: '18 Nov 2026, 04:00 PM',
    hoursRemaining: 19.5,
    deadlineLabel: '19h 30m remaining within 24h deadline',
    addressInIndia: 'Shivpuri Rapids Eco Camp, NH-58, Shivpuri, Uttarakhand',
    arrivedFrom: 'Dehradun (Jolly Grant Airport)',
    purposeOfVisit: 'Adventure & Rafting',
    nextDestination: 'Agra, Uttar Pradesh',
    unitLabel: 'Tent T-01',
    status: 'Pending',
    departureDate: '2026-11-20',
    departureReported: false,
    documents: [
      {
        type: 'Guest Photo',
        fileName: 'sophie_face.jpg',
        fileSizeKb: 31,
        maxAllowedKb: 50,
        valid: true,
        validationNote: 'Verified <= 50KB',
        previewUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&h=120&q=80',
      },
      {
        type: 'Passport Bio Page',
        fileName: 'sophie_passport.pdf',
        fileSizeKb: 245,
        maxAllowedKb: 500,
        valid: true,
        validationNote: 'Verified <= 500KB',
        previewUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=160&h=100&q=80',
      },
    ],
  },
  {
    id: 'F3-2611-04',
    reservationId: 'RES-8848',
    propertyId: 'prop-tapovan-resort',
    propertyName: 'Ganga View Resort, Cafe & Hostel — Tapovan',
    frroPropertyCode: 'UK-TEH-RSH-04821',
    guestName: 'Hannah Lindqvist',
    gender: 'Female',
    dateOfBirth: '1997-11-03',
    nationality: 'Sweden',
    passportNumber: 'SE9921045',
    passportIssueDate: '2023-01-19',
    passportExpiryDate: '2028-01-18',
    passportPlaceOfIssue: 'Stockholm, Sweden',
    visaNumber: 'IN5512903SE',
    visaType: 'Yoga / Student',
    visaIssueDate: '2026-09-10',
    visaExpiryDate: '2027-03-10',
    arrivalDateTime: '18 Nov 2026, 09:30 AM',
    hoursRemaining: 14.0,
    deadlineLabel: 'Submitted on time',
    addressInIndia: 'Ganga View Hostel Wing, Tapovan, Rishikesh, Uttarakhand',
    arrivedFrom: 'New Delhi',
    purposeOfVisit: 'Spiritual Retreat',
    nextDestination: 'Goa',
    unitLabel: 'Dorm D-02 • Bed F1',
    status: 'Submitted',
    acknowledgementNumber: 'FRRO-UK-2026-8849201',
    acknowledgementUploadedAt: '18 Nov 2026, 11:05 AM',
    departureDate: '2026-11-23',
    departureReported: false,
    documents: [
      {
        type: 'Guest Photo',
        fileName: 'hannah_id.jpg',
        fileSizeKb: 36,
        maxAllowedKb: 50,
        valid: true,
        validationNote: 'OK',
        previewUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&h=120&q=80',
      },
      {
        type: 'Passport Bio Page',
        fileName: 'hannah_passport.pdf',
        fileSizeKb: 198,
        maxAllowedKb: 500,
        valid: true,
        validationNote: 'OK',
        previewUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=160&h=100&q=80',
      },
    ],
  },
];
