import RestaurantWebsiteTemplate from '@/components/restaurant-template/RestaurantWebsiteTemplate';

export const metadata = {
  title: 'FoodVista — Dark Food Luxury Dining & Gourmet Kitchen',
  description: 'Experience delicious food, warm hospitality and unforgettable moments. Multi-tenant Restaurant SaaS Website Template.',
};

export default function HomePage() {
  return <RestaurantWebsiteTemplate initialThemeId="foodvista" showSaaSSwitcher={true} />;
}
