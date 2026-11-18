export type ReadyBoardStage = 'NEW' | 'PREPARING' | 'READY' | 'SERVED';

export interface ReadyBoardOrder {
  id: string;
  tokenNumber: string; // Big visual token e.g. #104, #K-12, #QR-08
  orderNumber: string;
  customerShortName: string;
  orderType: 'Dine-In' | 'Takeaway' | 'Kiosk' | 'QR Web' | 'Room Service' | 'Delivery';
  sourceLabel: string; // e.g., Table T-4, Room 201, Kiosk #1, Counter
  stage: ReadyBoardStage;
  elapsedMinutes: number;
  priority: 'Normal' | 'Rush' | 'VIP';
  items: { name: string; qty: number; variant?: string; modifiers?: string[]; notes?: string }[];
  totalAmount: number;
  createdAt: string;
  assignedRider?: string;
  deliveryAddress?: string;
  deliveryOtp?: string;
  codAmount?: number;
  deliveryStatus?: 'Assigned' | 'Picked Up' | 'Out for Delivery' | 'Delivered';
}

export const MOCK_READY_BOARD_ORDERS: ReadyBoardOrder[] = [
  {
    id: 'rb-101', tokenNumber: '104', orderNumber: 'GTK-8904', customerShortName: 'Lukas W.',
    orderType: 'Room Service', sourceLabel: 'Room 101', stage: 'READY', elapsedMinutes: 14, priority: 'Normal',
    items: [
      { name: 'Garhwali Paneer Tikka', qty: 1, modifiers: ['Mint Chutney'], notes: 'Less spicy' },
      { name: 'Ginger Lemon Honey Tea', qty: 2 },
    ],
    totalAmount: 640, createdAt: '12 mins ago',
  },
  {
    id: 'rb-102', tokenNumber: 'K-12', orderNumber: 'GTK-8905', customerShortName: 'Ananya V.',
    orderType: 'Kiosk', sourceLabel: 'Kiosk #1 • Pickup', stage: 'READY', elapsedMinutes: 9, priority: 'Normal',
    items: [
      { name: 'Himalayan Woodfired Margherita', qty: 1, variant: '10" Thin Crust', modifiers: ['Extra Basil'] },
      { name: 'Iced Hazelnut Latte', qty: 1, variant: 'Oat Milk' },
    ],
    totalAmount: 580, createdAt: '9 mins ago',
  },
  {
    id: 'rb-103', tokenNumber: '105', orderNumber: 'GTK-8906', customerShortName: 'Elena R.',
    orderType: 'Dine-In', sourceLabel: 'Table T-03 (Terrace)', stage: 'PREPARING', elapsedMinutes: 18, priority: 'Rush',
    items: [
      { name: 'Pahadi Dal Makhani & Garlic Naan', qty: 2, notes: 'Serve piping hot' },
      { name: 'Avocado Sourdough Toast', qty: 1, modifiers: ['Poached Egg'] },
    ],
    totalAmount: 1120, createdAt: '18 mins ago',
  },
  {
    id: 'rb-104', tokenNumber: 'QR-08', orderNumber: 'GTK-8907', customerShortName: 'Daniel C.',
    orderType: 'QR Web', sourceLabel: 'Hostel Lounge T-09', stage: 'PREPARING', elapsedMinutes: 7, priority: 'Normal',
    items: [
      { name: 'Shakshuka Bowl with Pita', qty: 1, modifiers: ['Extra Feta'] },
      { name: 'Fresh Watermelon Mint Cooler', qty: 1 },
    ],
    totalAmount: 490, createdAt: '7 mins ago',
  },
  {
    id: 'rb-105', tokenNumber: '106', orderNumber: 'GTK-8908', customerShortName: 'Malhotra Fam',
    orderType: 'Dine-In', sourceLabel: 'Table T-06', stage: 'NEW', elapsedMinutes: 2, priority: 'VIP',
    items: [
      { name: 'Royal Garhwali Thali', qty: 3 },
      { name: 'Badam Kesar Lassi', qty: 3 },
    ],
    totalAmount: 1950, createdAt: '2 mins ago',
  },
  {
    id: 'rb-106', tokenNumber: 'DL-21', orderNumber: 'GTK-8909', customerShortName: 'Rohan N.',
    orderType: 'Delivery', sourceLabel: 'Tapovan Upper Lane', stage: 'NEW', elapsedMinutes: 3, priority: 'Normal',
    items: [
      { name: 'Gourmet Veggie Momos (Steam)', qty: 2, modifiers: ['Spicy Red Chutney'] },
      { name: 'Masala Chai Flask (4 Cups)', qty: 1 },
    ],
    totalAmount: 420, createdAt: '3 mins ago',
    assignedRider: 'Vikas Rana', deliveryAddress: 'Near Secret Waterfall Rd, Upper Tapovan, Rishikesh',
    deliveryOtp: '4829', codAmount: 420, deliveryStatus: 'Assigned',
  },
  {
    id: 'rb-107', tokenNumber: 'DL-19', orderNumber: 'GTK-8901', customerShortName: 'Meera R.',
    orderType: 'Delivery', sourceLabel: 'Laxman Jhula Market', stage: 'READY', elapsedMinutes: 16, priority: 'Rush',
    items: [
      { name: 'Sattvik Khichdi & Curd Bowl', qty: 2 },
      { name: 'Organic Herbal Kadha', qty: 2 },
    ],
    totalAmount: 540, createdAt: '16 mins ago',
    assignedRider: 'Vikas Rana', deliveryAddress: 'Opp. German Bakery, Laxman Jhula, Rishikesh',
    deliveryOtp: '7190', codAmount: 0, deliveryStatus: 'Picked Up',
  },
  {
    id: 'rb-108', tokenNumber: '102', orderNumber: 'GTK-8899', customerShortName: 'Hannah L.',
    orderType: 'Takeaway', sourceLabel: 'Counter Pickup', stage: 'SERVED', elapsedMinutes: 26, priority: 'Normal',
    items: [
      { name: 'Vegan Buddha Bowl', qty: 1 },
      { name: 'Matcha Almond Latte', qty: 1 },
    ],
    totalAmount: 620, createdAt: '26 mins ago',
  },
];
