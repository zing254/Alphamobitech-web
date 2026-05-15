export interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  icon: React.ReactNode;
  duration: string;
  popular?: boolean;
}

export interface Testimonial {
  name: string;
  role: string;
  text: string;
  avatar: string;
  rating: number;
}

export interface GalleryItem {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
}

export interface Product {
  id: number;
  name: string;
  brand: string;
  category: 'phone' | 'tablet' | 'laptop';
  price: number;
  originalPrice?: number;
  description: string;
  specs: string[];
  features: string[];
  image: string;
  inStock: boolean;
  rating: number;
  reviews: number;
  badge?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CheckoutData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  paymentMethod: 'mpesa' | 'cash';
}

export interface BookingForm {
  name: string;
  phone: string;
  device: string;
  service: string;
  notes: string;
}

export type Page = 'home' | 'services' | 'gallery' | 'reviews' | 'faq' | 'contact' | 'about' | 'booking' | 'admin' | 'store' | 'cart' | 'checkout' | 'wishlist' | 'orders' | 'privacy' | 'terms';
