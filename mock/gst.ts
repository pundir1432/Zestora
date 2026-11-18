export interface GstSlabRule {
  id: string;
  category: 'Restaurant' | 'Room Accommodation' | 'Camp & Adventure' | 'Services & Laundry' | 'Aggregator Delivery';
  slabName: string;
  conditionLabel: string;
  hsnSac: string;
  totalRatePercent: number;
  cgstPercent: number;
  sgstPercent: number;
  igstPercent: number;
  itcEligible: boolean;
  effectiveFrom: string;
  status: 'Active' | 'Scheduled' | 'CA Review Pending';
  notes: string;
}

export interface GstDocumentRecord {
  id: string;
  docNumber: string;
  docType: 'Tax Invoice' | 'Bill of Supply' | 'Credit Note' | 'Advance Receipt' | 'Aggregator Order';
  date: string;
  partyName: string;
  partyGstin?: string;
  supplyType: 'Intra-State (CGST+SGST)' | 'Inter-State (IGST)';
  hsnSac: string;
  taxableValue: number;
  cgst: number;
  sgst: number;
  igst: number;
  grandTotal: number;
  status: 'Issued' | 'Adjusted' | 'Settled';
}

export const MOCK_GST_SLAB_RULES: GstSlabRule[] = [
  {
    id: 'gst-room-low',
    category: 'Room Accommodation',
    slabName: 'Room & Dorm Tariff (<= ₹7,500 / night)',
    conditionLabel: 'Declared / Transaction Value up to ₹7,500 per unit per day',
    hsnSac: '996311',
    totalRatePercent: 12,
    cgstPercent: 6,
    sgstPercent: 6,
    igstPercent: 12,
    itcEligible: true,
    effectiveFrom: '2025-04-01',
    status: 'Active',
    notes: 'Applies to Standard Rooms, Deluxe Rooms & Hostel Dorm Beds up to ₹7,500 threshold. Final applicability subject to CA review.',
  },
  {
    id: 'gst-room-high',
    category: 'Room Accommodation',
    slabName: 'Luxury Room / Suite Tariff (> ₹7,500 / night)',
    conditionLabel: 'Specified Premises Threshold — Above ₹7,500 per unit per day',
    hsnSac: '996311',
    totalRatePercent: 18,
    cgstPercent: 9,
    sgstPercent: 9,
    igstPercent: 18,
    itcEligible: true,
    effectiveFrom: '2025-04-01',
    status: 'Active',
    notes: 'Triggers higher slab (> ₹7,500) on Suites & Family Cottages; also impacts specified premises restaurant GST classification — verify with CA.',
  },
  {
    id: 'gst-rest-5',
    category: 'Restaurant',
    slabName: 'Standalone / Non-Specified Restaurant Dining',
    conditionLabel: 'F&B Dine-in & Takeaway (No ITC)',
    hsnSac: '996331',
    totalRatePercent: 5,
    cgstPercent: 2.5,
    sgstPercent: 2.5,
    igstPercent: 5,
    itcEligible: false,
    effectiveFrom: '2025-04-01',
    status: 'Active',
    notes: '5% without ITC for non-specified premises. Configurable per outlet.',
  },
  {
    id: 'gst-rest-18',
    category: 'Restaurant',
    slabName: 'Specified Premises Hotel Restaurant Dining',
    conditionLabel: 'Restaurant inside property with room tariff > ₹7,500',
    hsnSac: '996332',
    totalRatePercent: 18,
    cgstPercent: 9,
    sgstPercent: 9,
    igstPercent: 18,
    itcEligible: true,
    effectiveFrom: '2025-04-01',
    status: 'CA Review Pending',
    notes: 'Configurable toggle for properties opting into Specified Premises declaration with CA sign-off.',
  },
  {
    id: 'gst-camp-18',
    category: 'Camp & Adventure',
    slabName: 'Adventure Activities (Rafting / Trekking / Bungee)',
    conditionLabel: 'Outdoor Adventure & Tour Packages',
    hsnSac: '998552',
    totalRatePercent: 18,
    cgstPercent: 9,
    sgstPercent: 9,
    igstPercent: 18,
    itcEligible: true,
    effectiveFrom: '2025-04-01',
    status: 'Active',
    notes: 'Standard service SAC for adventure & guided activity packages.',
  },
  {
    id: 'gst-agg-5',
    category: 'Aggregator Delivery',
    slabName: 'ECO / Aggregator Restaurant Supply (Sec 9(5))',
    conditionLabel: 'Zomato / Swiggy collected & remitted GST',
    hsnSac: '996331',
    totalRatePercent: 5,
    cgstPercent: 2.5,
    sgstPercent: 2.5,
    igstPercent: 5,
    itcEligible: false,
    effectiveFrom: '2025-04-01',
    status: 'Active',
    notes: 'Tracked separately in GSTR-1 Table 14 / 3B Table 3.1.1(ii) as ECO remitted supply.',
  },
];

export const MOCK_GST_DOCUMENTS: GstDocumentRecord[] = [
  {
    id: 'gdoc-1', docNumber: 'INV/26-27/01421', docType: 'Tax Invoice', date: '18 Nov 2026',
    partyName: 'Lukas Weber (Room 101)', supplyType: 'Intra-State (CGST+SGST)', hsnSac: '996311',
    taxableValue: 13030, cgst: 830.5, sgst: 830.5, igst: 0, grandTotal: 14691, status: 'Issued',
  },
  {
    id: 'gdoc-2', docNumber: 'INV/26-27/01422', docType: 'Tax Invoice', date: '18 Nov 2026',
    partyName: 'Elena Rossi & Marco Conti (Suite 201)', supplyType: 'Intra-State (CGST+SGST)', hsnSac: '996311',
    taxableValue: 12540, cgst: 1022, sgst: 1022, igst: 0, grandTotal: 14584, status: 'Issued',
  },
  {
    id: 'gdoc-3', docNumber: 'ADV/26-27/00118', docType: 'Advance Receipt', date: '18 Nov 2026',
    partyName: 'Apex Corporate Retreat Group (B2B)', partyGstin: '07AAACA9120B1Z4',
    supplyType: 'Inter-State (IGST)', hsnSac: '996311',
    taxableValue: 45000, cgst: 0, sgst: 0, igst: 8100, grandTotal: 53100, status: 'Settled',
  },
  {
    id: 'gdoc-4', docNumber: 'CN/26-27/00019', docType: 'Credit Note', date: '17 Nov 2026',
    partyName: 'Rajeshwar Malhotra (Overcharge Adjustment)', supplyType: 'Intra-State (CGST+SGST)', hsnSac: '996331',
    taxableValue: -800, cgst: -20, sgst: -20, igst: 0, grandTotal: -840, status: 'Adjusted',
  },
  {
    id: 'gdoc-5', docNumber: 'BOS/26-27/00084', docType: 'Bill of Supply', date: '17 Nov 2026',
    partyName: 'Exempt Fresh Fruit & Organic Produce Counter', supplyType: 'Intra-State (CGST+SGST)', hsnSac: '0804',
    taxableValue: 1450, cgst: 0, sgst: 0, igst: 0, grandTotal: 1450, status: 'Settled',
  },
  {
    id: 'gdoc-6', docNumber: 'ECO/ZMT/99210', docType: 'Aggregator Order', date: '18 Nov 2026',
    partyName: 'Zomato Batch (14 Delivery Orders — Sec 9(5))', partyGstin: '05AABCZ1234F1Z2',
    supplyType: 'Intra-State (CGST+SGST)', hsnSac: '996331',
    taxableValue: 8640, cgst: 216, sgst: 216, igst: 0, grandTotal: 9072, status: 'Settled',
  },
];
