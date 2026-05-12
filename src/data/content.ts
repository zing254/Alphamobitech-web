import { 
  Smartphone, Battery, Zap, Shield, Droplets, Camera, Speaker, 
  Truck, CreditCard, Users, Headphones, 
  type LucideIcon 
} from 'lucide-react';

export interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  iconName: string;
  duration: string;
  popular?: boolean;
}

export interface GalleryItem {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
}

export interface SocialLinks {
  facebook: string;
  instagram: string;
  twitter: string;
  whatsapp: string;
}

export interface HeroSlide {
  title: string;
  subtitle: string;
  description: string;
  cta: string;
  image: string;
}

export interface Feature {
  iconName: string;
  title: string;
  description: string;
}

const STORAGE_KEYS = {
  services: 'cms_services',
  gallery: 'cms_gallery',
  socialLinks: 'cms_socialLinks',
  heroSlides: 'cms_heroSlides',
  features: 'cms_features',
};

const ICON_MAP: Record<string, LucideIcon> = {
  Smartphone, Battery, Zap, Shield, Droplets, Camera, Speaker,
  Truck, CreditCard, Users, Headphones,
};

export function getIconComponent(name: string): LucideIcon {
  return ICON_MAP[name] || Smartphone;
}

export const DEFAULT_SERVICES: Service[] = [
  { id: 1, name: 'iPhone Screen Replacement', description: 'Premium display replacement using original parts with warranty', price: 3500, category: 'iPhone', iconName: 'Smartphone', duration: '1-2 hours', popular: true },
  { id: 2, name: 'Samsung Screen Repair', description: 'Galaxy S/Note/A series screen replacement', price: 3000, category: 'Samsung', iconName: 'Smartphone', duration: '1-2 hours', popular: true },
  { id: 3, name: 'OnePlus Screen Service', description: 'Fast screen replacement for all OnePlus models', price: 2800, category: 'OnePlus', iconName: 'Smartphone', duration: '1-2 hours' },
  { id: 4, name: 'Google Pixel Display', description: 'Pixel screen repair for all generations', price: 3200, category: 'Google Pixel', iconName: 'Smartphone', duration: '1-2 hours' },
  { id: 5, name: 'iPhone Battery Service', description: 'Original capacity battery replacement', price: 2500, category: 'iPhone', iconName: 'Battery', duration: '30-45 mins', popular: true },
  { id: 6, name: 'Samsung Battery', description: 'High-quality battery with warranty', price: 2000, category: 'Samsung', iconName: 'Battery', duration: '30-45 mins' },
  { id: 7, name: 'Charging Port Repair', description: 'All brands charging port replacement', price: 2000, category: 'Hardware', iconName: 'Zap', duration: '1 hour' },
  { id: 8, name: 'Camera Repair', description: 'Front & back camera fixes', price: 2500, category: 'Hardware', iconName: 'Camera', duration: '1-2 hours' },
  { id: 9, name: 'Speaker/Mic Repair', description: 'Audio restoration service', price: 1500, category: 'Hardware', iconName: 'Speaker', duration: '1 hour' },
  { id: 10, name: 'Water Damage', description: 'Professional recovery service', price: 3500, category: 'Hardware', iconName: 'Droplets', duration: '1-3 days' },
  { id: 11, name: 'Screen Guard', description: 'Tempered glass screen protector installation', price: 500, category: 'Accessories', iconName: 'Shield', duration: '15 mins' },
  { id: 12, name: 'Back Glass Replacement', description: 'Premium back glass replacement for all models', price: 2500, category: 'Hardware', iconName: 'Smartphone', duration: '1-2 hours' },
];

export const DEFAULT_GALLERY: GalleryItem[] = [
  { id: 1, title: 'iPhone Screen Repair', description: 'Before & After', image: '/images/iphone-screen-1.jpeg', category: 'Screen' },
  { id: 2, title: 'Samsung Screen', description: 'Premium replacement', image: '/images/samsung-repair.jpeg', category: 'Screen' },
  { id: 3, title: 'Battery Service', description: 'New battery installed', image: '/images/battery-replacement.jpeg', category: 'Battery' },
  { id: 4, title: 'Water Damage', description: 'Recovery success', image: '/images/charging-port.jpeg', category: 'Repair' },
  { id: 5, title: 'Data Recovery', description: 'Files restored', image: '/images/data-recovery.jpeg', category: 'Software' },
  { id: 6, title: 'iPad Repair', description: 'Complete service', image: '/images/ipad-repair.jpeg', category: 'Repair' },
];

export const DEFAULT_SOCIAL_LINKS: SocialLinks = {
  facebook: 'https://www.facebook.com/share/17j6bRdUoC/',
  instagram: 'https://www.instagram.com/alphamobitech_phones_solutions?igsh=OXVrZWJjZXI1cXdq',
  twitter: '#',
  whatsapp: 'https://wa.me/message/MOVH7UZMA2QBA1',
};

export const DEFAULT_HERO_SLIDES: HeroSlide[] = [
  { title: 'Expert Phone Repair Services', subtitle: 'All Brands Supported', description: 'Premium repair services for iPhone, Samsung, OnePlus, Google Pixel and more. Get your device back to perfect condition.', cta: 'Book Now', image: 'phone-repair-hero.png' },
  { title: 'Battery Replacement', subtitle: 'All Brands', description: 'Original capacity batteries for iPhone, Samsung, OnePlus and more. Fast replacement service.', cta: 'Get Help Now', image: 'battery-service.png' },
  { title: 'Charging Port Repair', subtitle: 'Expert Technicians', description: 'Fix charging issues for all brands. Your trusted mobile repair experts in Kenya.', cta: 'Learn More', image: 'charging-service.png' },
];

export const DEFAULT_FEATURES: Feature[] = [
  { iconName: 'Truck', title: 'Free Pickup & Delivery', description: 'We come to you anywhere in Nairobi' },
  { iconName: 'CreditCard', title: 'Affordable Pricing', description: 'Best rates in Kenya' },
  { iconName: 'Users', title: '500+ Happy Clients', description: 'Satisfied customers nationwide' },
  { iconName: 'Shield', title: 'Warranty on Repairs', description: '6-month guarantee on all services' },
  { iconName: 'Zap', title: 'Same Day Service', description: 'Most repairs done in 1-2 hours' },
  { iconName: 'Headphones', title: '24/7 Support', description: 'Always here to help' },
];

function loadFromStorage<T>(key: string, defaults: T): T {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaults;
  } catch {
    return defaults;
  }
}

export function getServices(): Service[] {
  return loadFromStorage<Service[]>(STORAGE_KEYS.services, DEFAULT_SERVICES);
}

export function saveServices(services: Service[]): void {
  localStorage.setItem(STORAGE_KEYS.services, JSON.stringify(services));
}

export function getGallery(): GalleryItem[] {
  return loadFromStorage<GalleryItem[]>(STORAGE_KEYS.gallery, DEFAULT_GALLERY);
}

export function saveGallery(items: GalleryItem[]): void {
  localStorage.setItem(STORAGE_KEYS.gallery, JSON.stringify(items));
}

export function getSocialLinks(): SocialLinks {
  return loadFromStorage<SocialLinks>(STORAGE_KEYS.socialLinks, DEFAULT_SOCIAL_LINKS);
}

export function saveSocialLinks(links: SocialLinks): void {
  localStorage.setItem(STORAGE_KEYS.socialLinks, JSON.stringify(links));
}

export function getHeroSlides(): HeroSlide[] {
  return loadFromStorage<HeroSlide[]>(STORAGE_KEYS.heroSlides, DEFAULT_HERO_SLIDES);
}

export function saveHeroSlides(slides: HeroSlide[]): void {
  localStorage.setItem(STORAGE_KEYS.heroSlides, JSON.stringify(slides));
}

export function getFeatures(): Feature[] {
  return loadFromStorage<Feature[]>(STORAGE_KEYS.features, DEFAULT_FEATURES);
}

export function saveFeatures(features: Feature[]): void {
  localStorage.setItem(STORAGE_KEYS.features, JSON.stringify(features));
}

export const AVAILABLE_ICONS = ['Smartphone', 'Battery', 'Zap', 'Shield', 'Droplets', 'Camera', 'Speaker', 'Truck', 'CreditCard', 'Users', 'Headphones'];

export const SERVICE_CATEGORIES = ['All', 'iPhone', 'Samsung', 'OnePlus', 'Google Pixel', 'Hardware', 'Accessories'];
