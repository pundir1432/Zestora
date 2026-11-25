'use client';

import React, { useState } from 'react';
import { RESTAURANT_THEMES } from '@/data/restaurantThemes';
import { DishItem } from '@/types/restaurantWebsite';
import { Navbar } from './Navbar';
import { HeroSection } from './HeroSection';
import { FeatureStrip } from './FeatureStrip';
import { PopularDishesSection } from './PopularDishesSection';
import { AboutSection } from './AboutSection';
import { GallerySection } from './GallerySection';
import { ReviewsSection } from './ReviewsSection';
import { ReservationSection } from './ReservationSection';
import { Footer } from './Footer';
import { BookTableModal } from './BookTableModal';
import { CartDrawer, CartItem } from './CartDrawer';
import { SaaSTenantSwitcher } from './SaaSTenantSwitcher';

interface RestaurantWebsiteTemplateProps {
  initialThemeId?: string;
  showSaaSSwitcher?: boolean;
}

export const RestaurantWebsiteTemplate: React.FC<RestaurantWebsiteTemplateProps> = ({
  initialThemeId = 'foodvista',
  showSaaSSwitcher = true,
}) => {
  const [currentThemeId, setCurrentThemeId] = useState<string>(initialThemeId);
  const [isBookTableOpen, setIsBookTableOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      dish: RESTAURANT_THEMES.foodvista.dishes[0], // Creamy Pasta
      quantity: 1,
    },
    {
      dish: RESTAURANT_THEMES.foodvista.dishes[1], // Paneer Butter Masala
      quantity: 1,
    },
  ]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const currentTheme = RESTAURANT_THEMES[currentThemeId] || RESTAURANT_THEMES.foodvista;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const handleAddToCart = (dish: DishItem) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.dish.id === dish.id);
      if (existing) {
        return prev.map((item) =>
          item.dish.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { dish, quantity: 1 }];
    });
    showToast(`Added ${dish.name} to your order!`);
  };

  const handleUpdateQuantity = (dishId: string, delta: number) => {
    setCartItems((prev) => {
      return prev
        .map((item) => {
          if (item.dish.id === dishId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const handleRemoveItem = (dishId: string) => {
    setCartItems((prev) => prev.filter((item) => item.dish.id !== dishId));
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const scrollToMenu = () => {
    const el = document.getElementById('menu');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      className="restaurant-website-root min-vh-100"
      style={{
        backgroundColor: currentTheme.colors.background,
        color: currentTheme.colors.text,
        fontFamily: 'var(--font-family-sans)',
      }}
    >
      {/* 1. SaaS Multi-Tenant Demo Switcher (Top Bar) */}
      {showSaaSSwitcher && (
        <SaaSTenantSwitcher
          currentThemeId={currentThemeId}
          onSelectTheme={(id) => setCurrentThemeId(id)}
        />
      )}

      {/* 2. Sticky Glass/Dark Navbar */}
      <Navbar
        theme={currentTheme}
        onOpenBookTable={() => setIsBookTableOpen(true)}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* 3. Hero Section */}
      <HeroSection
        theme={currentTheme}
        onOpenBookTable={() => setIsBookTableOpen(true)}
        onExploreMenu={scrollToMenu}
      />

      {/* 4. Horizontal Feature Strip Immediately Below Hero */}
      <FeatureStrip
        features={currentTheme.features}
        primaryColor={currentTheme.colors.primary}
      />

      {/* 5. Popular Dishes / Our Special Section */}
      <PopularDishesSection
        theme={currentTheme}
        onAddToCart={handleAddToCart}
        addedDishIds={cartItems.map((ci) => ci.dish.id)}
        onOpenBookTable={() => setIsBookTableOpen(true)}
      />

      {/* 6. About Section ("More Than Just Food") */}
      <AboutSection
        theme={currentTheme}
        onOpenBookTable={() => setIsBookTableOpen(true)}
      />

      {/* 7. Gallery Section */}
      <GallerySection theme={currentTheme} />

      {/* 8. Customer Reviews Section */}
      <ReviewsSection theme={currentTheme} />

      {/* 9. Reservation CTA Section */}
      <ReservationSection
        theme={currentTheme}
        onOpenBookTable={() => setIsBookTableOpen(true)}
      />

      {/* 10. Dark Luxury Footer */}
      <Footer theme={currentTheme} />

      {/* Interactive Reservation Modal */}
      <BookTableModal
        isOpen={isBookTableOpen}
        onClose={() => setIsBookTableOpen(false)}
        restaurantName={currentTheme.name}
        primaryColor={currentTheme.colors.primary}
      />

      {/* Interactive Cart Order Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        primaryColor={currentTheme.colors.primary}
      />

      {/* Quick Floating Toast Alert */}
      {toastMessage && (
        <div
          className="position-fixed bottom-0 start-50 translate-middle-x mb-4 px-4 py-2 rounded-pill text-white shadow-lg d-flex align-items-center gap-2"
          style={{
            zIndex: 3000,
            backgroundColor: '#17120F',
            border: `1px solid ${currentTheme.colors.primary}`,
            fontSize: '13.5px',
            animation: 'fadeIn 0.2s ease-out',
          }}
        >
          <span
            className="rounded-circle d-inline-block"
            style={{ width: '8px', height: '8px', backgroundColor: currentTheme.colors.primary }}
          />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default RestaurantWebsiteTemplate;
