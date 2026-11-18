export type PlanTier = 'S' | 'G' | 'E';

export interface PlanTierConfig {
  code: PlanTier;
  name: string;
  label: string;
  tagline: string;
  monthlyPriceInr: number;
  targetSegment: string[];
  maxProperties: number;
  maxOutlets: number;
  maxUsers: number;
  features: {
    posAndKds: boolean;
    orderReadyBoard: boolean;
    qrAndKiosk: boolean;
    hotelAndFrontDesk: boolean;
    hostelDorms: boolean;
    campAdventure: boolean;
    formIIIWorkflow: boolean;
    gstAdvanced: boolean;
    otaReconciliation: boolean;
    auditAndDayClose: boolean;
    aiWhatsappAssistant: boolean;
    multiPropertyEnterprise: boolean;
    partnerPortal: boolean;
  };
}

export interface HospitalityOutlet {
  id: string;
  propertyId: string;
  tenantId: string;
  name: string;
  type: 'Restaurant' | 'Cafe' | 'Front Desk' | 'Camp Desk' | 'Bar' | 'Cloud Kitchen';
  code: string;
  gstin: string;
  isOnline: boolean;
  activeDevices: number;
}

export interface HospitalityProperty {
  id: string;
  tenantId: string;
  name: string;
  location: string;
  city: string;
  state: string;
  propertyTypes: ('Hotel' | 'Hostel' | 'Homestay' | 'Camp' | 'Restaurant' | 'Cafe')[];
  totalRooms: number;
  totalDormBeds: number;
  totalTents: number;
  frroPropertyCode: string;
  gstin: string;
  outlets: HospitalityOutlet[];
}

export interface HospitalityTenant {
  id: string;
  name: string;
  legalName: string;
  planTier: PlanTier;
  status: 'Active' | 'Trial' | 'Suspended' | 'Grace Period';
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
  region: string;
  createdAt: string;
  properties: HospitalityProperty[];
}

export const PLAN_TIERS: Record<PlanTier, PlanTierConfig> = {
  S: {
    code: 'S',
    name: 'STARTUP',
    label: 'Startup (S)',
    tagline: 'Built for cafes, homestays, hostels & small riverside camps',
    monthlyPriceInr: 1999,
    targetSegment: ['Small Cafe', 'Homestay', 'Backpackers Hostel', 'Small Riverside Camp'],
    maxProperties: 1,
    maxOutlets: 2,
    maxUsers: 10,
    features: {
      posAndKds: true,
      orderReadyBoard: true,
      qrAndKiosk: true,
      hotelAndFrontDesk: true,
      hostelDorms: true,
      campAdventure: true,
      formIIIWorkflow: true,
      gstAdvanced: true,
      otaReconciliation: false,
      auditAndDayClose: false,
      aiWhatsappAssistant: false,
      multiPropertyEnterprise: false,
      partnerPortal: false,
    },
  },
  G: {
    code: 'G',
    name: 'GROWTH',
    label: 'Growth (G)',
    tagline: 'For multi-outlet resorts, mid-size hotels & adventure camp operators',
    monthlyPriceInr: 4999,
    targetSegment: ['Multiple Outlets', 'Mid-size Hotels', 'Adventure Camp Operators', 'Boutique Resorts'],
    maxProperties: 5,
    maxOutlets: 15,
    maxUsers: 50,
    features: {
      posAndKds: true,
      orderReadyBoard: true,
      qrAndKiosk: true,
      hotelAndFrontDesk: true,
      hostelDorms: true,
      campAdventure: true,
      formIIIWorkflow: true,
      gstAdvanced: true,
      otaReconciliation: true,
      auditAndDayClose: true,
      aiWhatsappAssistant: true,
      multiPropertyEnterprise: false,
      partnerPortal: true,
    },
  },
  E: {
    code: 'E',
    name: 'ENTERPRISE',
    label: 'Enterprise (E)',
    tagline: 'Hospitality chains, hotel groups, franchise networks & regional clusters',
    monthlyPriceInr: 12999,
    targetSegment: ['Hotel Chains', 'Hospitality Groups', 'Franchises', 'Multi-City Operators'],
    maxProperties: 50,
    maxOutlets: 200,
    maxUsers: 500,
    features: {
      posAndKds: true,
      orderReadyBoard: true,
      qrAndKiosk: true,
      hotelAndFrontDesk: true,
      hostelDorms: true,
      campAdventure: true,
      formIIIWorkflow: true,
      gstAdvanced: true,
      otaReconciliation: true,
      auditAndDayClose: true,
      aiWhatsappAssistant: true,
      multiPropertyEnterprise: true,
      partnerPortal: true,
    },
  },
};

export const MOCK_TENANTS: HospitalityTenant[] = [
  {
    id: 'tenant-ganga-heritage',
    name: 'Ganga Heritage Hospitality',
    legalName: 'Ganga Heritage Hospitality Pvt. Ltd.',
    planTier: 'E',
    status: 'Active',
    ownerName: 'Vikram Singhania',
    ownerPhone: '+91 98370 44120',
    ownerEmail: 'vikram@gangaheritage.in',
    region: 'Rishikesh, Uttarakhand',
    createdAt: '2025-04-10',
    properties: [
      {
        id: 'prop-tapovan-resort',
        tenantId: 'tenant-ganga-heritage',
        name: 'Ganga View Resort, Cafe & Hostel — Tapovan',
        location: 'Badrinath Road, Near Laxman Jhula, Tapovan',
        city: 'Rishikesh',
        state: 'Uttarakhand',
        propertyTypes: ['Hotel', 'Hostel', 'Restaurant', 'Cafe'],
        totalRooms: 18,
        totalDormBeds: 24,
        totalTents: 0,
        frroPropertyCode: 'UK-TEH-RSH-04821',
        gstin: '05AABCG7821H1Z9',
        outlets: [
          {
            id: 'out-ganga-terrace',
            propertyId: 'prop-tapovan-resort',
            tenantId: 'tenant-ganga-heritage',
            name: 'Ganga Terrace Kitchen & Cafe',
            type: 'Restaurant',
            code: 'GTK-01',
            gstin: '05AABCG7821H1Z9',
            isOnline: true,
            activeDevices: 6,
          },
          {
            id: 'out-tapovan-desk',
            propertyId: 'prop-tapovan-resort',
            tenantId: 'tenant-ganga-heritage',
            name: 'Tapovan Main Front Desk',
            type: 'Front Desk',
            code: 'TFD-01',
            gstin: '05AABCG7821H1Z9',
            isOnline: true,
            activeDevices: 3,
          },
          {
            id: 'out-rooftop-bakery',
            propertyId: 'prop-tapovan-resort',
            tenantId: 'tenant-ganga-heritage',
            name: 'Himalayan Sunrise Rooftop Cafe',
            type: 'Cafe',
            code: 'HSC-02',
            gstin: '05AABCG7821H1Z9',
            isOnline: true,
            activeDevices: 3,
          },
        ],
      },
      {
        id: 'prop-shivpuri-camp',
        tenantId: 'tenant-ganga-heritage',
        name: 'Shivpuri Rapids Eco Camp & Adventure Base',
        location: 'NH-58 Riverfront, Shivpuri',
        city: 'Rishikesh',
        state: 'Uttarakhand',
        propertyTypes: ['Camp', 'Homestay', 'Restaurant'],
        totalRooms: 6,
        totalDormBeds: 0,
        totalTents: 22,
        frroPropertyCode: 'UK-TEH-SHV-09134',
        gstin: '05AABCG7821H1Z9',
        outlets: [
          {
            id: 'out-camp-desk',
            propertyId: 'prop-shivpuri-camp',
            tenantId: 'tenant-ganga-heritage',
            name: 'Shivpuri Rafting & Camp Desk',
            type: 'Camp Desk',
            code: 'SRD-01',
            gstin: '05AABCG7821H1Z9',
            isOnline: true,
            activeDevices: 4,
          },
          {
            id: 'out-bonfire-dining',
            propertyId: 'prop-shivpuri-camp',
            tenantId: 'tenant-ganga-heritage',
            name: 'Riverside Bonfire Dining Hall',
            type: 'Restaurant',
            code: 'RBD-02',
            gstin: '05AABCG7821H1Z9',
            isOnline: true,
            activeDevices: 2,
          },
        ],
      },
    ],
  },
  {
    id: 'tenant-devbhoomi-stays',
    name: 'Devbhoomi Boutique Homestays',
    legalName: 'Devbhoomi Stays & Trails LLP',
    planTier: 'G',
    status: 'Active',
    ownerName: 'Meera Rawat',
    ownerPhone: '+91 97601 88210',
    ownerEmail: 'meera@devbhoomistays.in',
    region: 'Mussoorie & Rishikesh, Uttarakhand',
    createdAt: '2025-09-18',
    properties: [
      {
        id: 'prop-neelkanth-homestay',
        tenantId: 'tenant-devbhoomi-stays',
        name: 'Neelkanth Valley Retreat & Organic Cafe',
        location: 'Neelkanth Temple Road, Jonk',
        city: 'Rishikesh',
        state: 'Uttarakhand',
        propertyTypes: ['Homestay', 'Cafe'],
        totalRooms: 10,
        totalDormBeds: 8,
        totalTents: 4,
        frroPropertyCode: 'UK-PAU-JNK-03312',
        gstin: '05AADCD4512K1Z3',
        outlets: [
          {
            id: 'out-organic-cafe',
            propertyId: 'prop-neelkanth-homestay',
            tenantId: 'tenant-devbhoomi-stays',
            name: 'Pahadi Organic Cafe',
            type: 'Cafe',
            code: 'POC-01',
            gstin: '05AADCD4512K1Z3',
            isOnline: true,
            activeDevices: 3,
          },
        ],
      },
    ],
  },
  {
    id: 'tenant-aloha-backpackers',
    name: 'Alaknanda Backpackers Hostel',
    legalName: 'Alaknanda Youth Stays',
    planTier: 'S',
    status: 'Trial',
    ownerName: 'Rohan Negi',
    ownerPhone: '+91 94120 77341',
    ownerEmail: 'rohan@alaknandahostel.in',
    region: 'Tapovan, Rishikesh',
    createdAt: '2026-11-11',
    properties: [
      {
        id: 'prop-alaknanda-hostel',
        tenantId: 'tenant-aloha-backpackers',
        name: 'Alaknanda Social Hostel & Chai Bar',
        location: 'Upper Tapovan, Rishikesh',
        city: 'Rishikesh',
        state: 'Uttarakhand',
        propertyTypes: ['Hostel', 'Cafe'],
        totalRooms: 4,
        totalDormBeds: 36,
        totalTents: 0,
        frroPropertyCode: 'UK-TEH-TPV-11904',
        gstin: '05AAECA9912M1Z1',
        outlets: [
          {
            id: 'out-chai-bar',
            propertyId: 'prop-alaknanda-hostel',
            tenantId: 'tenant-aloha-backpackers',
            name: 'Tapovan Chai & Waffle Bar',
            type: 'Cafe',
            code: 'TCB-01',
            gstin: '05AAECA9912M1Z1',
            isOnline: true,
            activeDevices: 2,
          },
        ],
      },
    ],
  },
];
