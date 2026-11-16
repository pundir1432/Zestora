export type MenuCategoryType = 
  | 'Starters'
  | 'Main Course'
  | 'Pizza'
  | 'Burgers'
  | 'Beverages'
  | 'Desserts'
  | 'Combos'
  | 'Sweets / Mithai'
  | 'Bakery & Breads'
  | 'Coffee & Brews'
  | 'Cocktails & Spirits';

export interface FoodVariant {
  id: string;
  name: string; // e.g. "Small (8\")", "Medium (10\")", "Large (12\")", "Half", "Full"
  price: number;
}

export interface FoodAddon {
  id: string;
  name: string; // e.g. "Extra Cheese", "Extra Dip", "Almond Milk", "Hazelnut Shot"
  price: number;
}

export interface WeightOption {
  label: string; // e.g. "250 Grams", "500 Grams", "1 Kg"
  grams: number;
  price: number;
}

export interface RecipeIngredient {
  inventoryItemId: string;
  ingredientName: string;
  quantity: number; // e.g., 0.15 kg, 0.05 L
  unit: string;
}

export interface MenuItem {
  id: string;
  restaurantId?: string;
  name: string;
  category: MenuCategoryType;
  description: string;
  price: number;
  discountedPrice?: number;
  isVeg: boolean;
  isAvailable: boolean;
  isPopular?: boolean;
  image: string;
  preparationTime: number; // in minutes
  kitchenStation?: 'Main Kitchen' | 'Bakery' | 'Beverage Counter' | 'Pizza Station' | 'Dessert Station';
  variants?: FoodVariant[];
  addons?: FoodAddon[];
  calories?: number;
  spiceLevel?: 'Mild' | 'Medium' | 'Spicy' | 'Extra Spicy';
  // Advanced Multi-Business Fields:
  isWeightBased?: boolean;
  pricePerKg?: number;
  weightOptions?: WeightOption[];
  isCustomCake?: boolean;
  egglessAvailable?: boolean;
  isBeverage?: boolean;
  recipeIngredients?: RecipeIngredient[];
  timingTag?: 'All Day' | 'Breakfast' | 'Lunch' | 'Dinner' | 'Happy Hour';
}

export interface MenuCategory {
  id: string;
  name: MenuCategoryType;
  itemCount: number;
  iconName: string;
}
