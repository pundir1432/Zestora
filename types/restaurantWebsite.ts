export interface RestaurantColors {
  primary: string;          // e.g. #E63946
  primaryHover: string;     // e.g. #C92F3B
  dark: string;              // e.g. #17120F
  darkSecondary: string;     // e.g. #241B17
  background: string;        // e.g. #FFF9F4
  cardBackground: string;    // e.g. #FFFFFF
  text: string;              // e.g. #211A17
  mutedText: string;         // e.g. #766E69
  border: string;            // e.g. #E8DED6
  success: string;           // e.g. #16845B
  softBackground: string;    // e.g. #FFE5E7
}

export interface DishItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  rating: number;
  reviewsCount?: number;
  isPopular?: boolean;
  isVeg?: boolean;
  calories?: string;
  prepTime?: string;
}

export interface RestaurantFeature {
  id: string;
  title: string;
  subtitle: string;
  iconType: 'fresh' | 'quality' | 'ambiance' | 'service';
}

export interface ReviewItem {
  id: string;
  name: string;
  role?: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  image: string;
  span?: 'large' | 'tall' | 'wide' | 'normal';
}

export interface RestaurantThemeConfig {
  id: string;
  name: string;
  tagline: string;
  cuisine: string;
  logoText: string;
  logoSubtext: string;
  colors: RestaurantColors;
  hero: {
    badge: string;
    headingLine1: string;
    headingLine2: string;
    description: string;
    exploreBtnText: string;
    bookBtnText: string;
    happyCustomersCount: string;
    heroImage: string;
    dishTag?: string;
  };
  features: RestaurantFeature[];
  categories: string[];
  dishes: DishItem[];
  specialOffer: {
    badge: string;
    title: string;
    highlight: string;
    subtitle: string;
    ctaText: string;
    code: string;
    bgDark?: boolean;
  };
  about: {
    subheading: string;
    heading: string;
    story1: string;
    story2: string;
    image: string;
    stats: {
      value: string;
      label: string;
    }[];
  };
  gallery: GalleryItem[];
  reviews: ReviewItem[];
  reservation: {
    heading: string;
    subheading: string;
    phone: string;
  };
  footer: {
    aboutText: string;
    address: string;
    phone: string;
    email: string;
    openingHours: {
      days: string;
      time: string;
    }[];
    socialLinks: {
      platform: string;
      url: string;
    }[];
  };
}
