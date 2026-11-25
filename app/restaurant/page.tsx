import RestaurantWebsiteTemplate from '@/components/restaurant-template/RestaurantWebsiteTemplate';

export const metadata = {
  title: 'Restaurant SaaS Template — Multi-Tenant Customizable Web Experience',
  description: 'Premium dark food luxury restaurant website template with custom button system, online reservation, and menu ordering.',
};

export default function RestaurantPage() {
  return <RestaurantWebsiteTemplate initialThemeId="foodvista" showSaaSSwitcher={true} />;
}
