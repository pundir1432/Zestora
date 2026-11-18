import { MOCK_READY_BOARD_ORDERS, ReadyBoardOrder } from '@/mock/orders';

/**
 * Restaurant Orders, KDS, Ready Board, Kiosk, QR & Rider Service Interface (Mock)
 */
export const orderService = {
  getReadyBoardOrders(): ReadyBoardOrder[] {
    return MOCK_READY_BOARD_ORDERS;
  },
};
