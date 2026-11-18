import { MOCK_RESERVATIONS, MOCK_FOLIOS, StayReservation, GuestFolio } from '@/mock/reservations';
import { MOCK_OTA_TRANSACTIONS, OtaTransaction } from '@/mock/ota';

/**
 * Stay Booking, Front Desk & OTA Service Interface (Mock)
 */
export const bookingService = {
  getReservations(propertyId?: string): StayReservation[] {
    return propertyId ? MOCK_RESERVATIONS.filter(r => r.propertyId === propertyId) : MOCK_RESERVATIONS;
  },
  getFolios(): GuestFolio[] {
    return MOCK_FOLIOS;
  },
  getOtaTransactions(): OtaTransaction[] {
    return MOCK_OTA_TRANSACTIONS;
  },
};
