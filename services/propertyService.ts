import { MOCK_ROOMS, MOCK_HOUSEKEEPING_TASKS, HotelRoom, HousekeepingTask } from '@/mock/rooms';
import { MOCK_DORMS, DormRoom } from '@/mock/beds';
import { MOCK_CAMP_PACKAGES, MOCK_ACTIVITY_SLOTS, MOCK_CAMP_BOOKINGS, CampPackage, ActivitySlot, CampBookingWaiver } from '@/mock/camps';

/**
 * Property, Rooms, Dorms, Housekeeping & Camp Service Interface (Mock)
 */
export const propertyService = {
  getRooms(propertyId?: string): HotelRoom[] {
    return propertyId ? MOCK_ROOMS.filter(r => r.propertyId === propertyId) : MOCK_ROOMS;
  },
  getDorms(propertyId?: string): DormRoom[] {
    return propertyId ? MOCK_DORMS.filter(d => d.propertyId === propertyId) : MOCK_DORMS;
  },
  getHousekeepingTasks(propertyId?: string): HousekeepingTask[] {
    return propertyId ? MOCK_HOUSEKEEPING_TASKS.filter(t => t.propertyId === propertyId) : MOCK_HOUSEKEEPING_TASKS;
  },
  getCampPackages(): CampPackage[] {
    return MOCK_CAMP_PACKAGES;
  },
  getActivitySlots(): ActivitySlot[] {
    return MOCK_ACTIVITY_SLOTS;
  },
  getCampBookings(): CampBookingWaiver[] {
    return MOCK_CAMP_BOOKINGS;
  },
};
