import { SAMPLE_INVENTORY } from '@/data/inventoryData';
import { InventoryItem } from '@/types/inventory';

export interface CampGearItem {
  id: string;
  name: string;
  category: 'Rafting Safety' | 'Tent & Bedding' | 'Trekking Gear';
  totalUnits: number;
  inUseUnits: number;
  damagedUnits: number;
  minAlertUnits: number;
}

export const MOCK_CAMP_GEAR: CampGearItem[] = [
  { id: 'cg-1', name: 'IRF Certified Life Jackets (M/L)', category: 'Rafting Safety', totalUnits: 45, inUseUnits: 38, damagedUnits: 2, minAlertUnits: 10 },
  { id: 'cg-2', name: 'Whitewater Helmets (High Impact)', category: 'Rafting Safety', totalUnits: 48, inUseUnits: 34, damagedUnits: 1, minAlertUnits: 10 },
  { id: 'cg-3', name: '18ft Self-Bailing Inflatable Rafts', category: 'Rafting Safety', totalUnits: 6, inUseUnits: 4, damagedUnits: 0, minAlertUnits: 2 },
  { id: 'cg-4', name: 'Waterproof Dry Bags (20L)', category: 'Rafting Safety', totalUnits: 30, inUseUnits: 21, damagedUnits: 3, minAlertUnits: 8 },
  { id: 'cg-5', name: 'Swiss Tent Thermal Blankets', category: 'Tent & Bedding', totalUnits: 60, inUseUnits: 42, damagedUnits: 2, minAlertUnits: 15 },
  { id: 'cg-6', name: 'Carbon Trekking Poles (Pairs)', category: 'Trekking Gear', totalUnits: 24, inUseUnits: 16, damagedUnits: 1, minAlertUnits: 6 },
];

/**
 * Restaurant & Camp Inventory Service Interface (Mock)
 */
export const inventoryService = {
  getRestaurantInventory(): InventoryItem[] {
    return SAMPLE_INVENTORY;
  },
  getCampGearInventory(): CampGearItem[] {
    return MOCK_CAMP_GEAR;
  },
};
