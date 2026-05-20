import { useState, useEffect, Component, ReactNode } from 'react';
import { 
  Smartphone, Battery, Zap, Shield, Clock, 
  Droplets, Camera, Speaker, ArrowRight,
  Star, MapPin, Phone, Mail,
  Send, CheckCircle, Menu, X, ChevronDown, Users,
  Award, Truck, CreditCard, Headphones, Moon, Sun,
  Check, ShoppingCart, Trash2, Plus, Minus, Laptop, Tablet,
  Search, Heart, Scale, ImageOff, ArrowUp, XCircle
} from 'lucide-react';
import AdminDashboard from './AdminDashboard';
import { PageLoader } from './components/Loading';
import CookieConsent from './components/CookieConsent';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import { validateBookingForm, validateContactForm, sanitizeString, sanitizeEmail, sanitizePhone, generateConfirmationNumber } from './utils/validation';

type Page = 'home' | 'services' | 'gallery' | 'reviews' | 'faq' | 'contact' | 'about' | 'booking' | 'admin' | 'store' | 'cart' | 'checkout' | 'wishlist' | 'orders' | 'privacy' | 'terms';

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-800/30 p-4">
          <div className="bg-slate-800 rounded-2xl p-8 shadow-lg max-w-md text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Something went wrong</h2>
            <p className="text-slate-300 mb-4">An unexpected error occurred. Please refresh the page.</p>
            <button onClick={() => window.location.reload()} className="px-6 py-3 bg-amber-600 text-white rounded-xl font-medium hover:bg-amber-700">
              Refresh Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  icon: React.ReactNode;
  duration: string;
  popular?: boolean;
}

interface Testimonial {
  name: string;
  role: string;
  text: string;
  avatar: string;
  rating: number;
}

interface GalleryItem {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
}

interface Product {
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

interface CartItem {
  product: Product;
  quantity: number;
}

const App = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTab, setActiveTab] = useState('All');
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [bookingForm, setBookingForm] = useState({ name: '', phone: '', device: '', service: '', notes: '' });
  const [contactFormData, setContactFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [wishlist, setWishlist] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [compareList, setCompareList] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCompare, setShowCompare] = useState(false);
  const [bookingErrors, setBookingErrors] = useState<Record<string, string>>({});
  const [contactErrors, setContactErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Synchronize currentPage with URL
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.slice(1) || 'home';
      const validPaths = ['home','services','store','orders','gallery','reviews','faq','contact','about','admin','cart','wishlist','checkout','privacy','terms'];
      const page = validPaths.includes(path as Page) ? (path as Page) : 'home';
      setCurrentPage(page);
    };

    const path = window.location.pathname.slice(1) || 'home';
    const validPaths = ['home','services','store','orders','gallery','reviews','faq','contact','about','admin','cart','wishlist','checkout','privacy','terms'];
    const page = validPaths.includes(path as Page) ? (path as Page) : 'home';
    setCurrentPage(page);

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 500);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Page-specific SEO titles and descriptions
  useEffect(() => {
    const pageMeta: Record<string, { title: string; description: string }> = {
      home: {
        title: 'Alphamobitech Phones Solution | Phone Repair Nairobi Kenya',
        description: 'Premium mobile repair services in Nairobi, Kenya. Screen replacement, battery, back glass, charging port. Expert technicians with warranty. Same-day service.',
      },
      services: {
        title: 'Phone Repair Services Nairobi | Screen, Battery, FRP Bypass | Alphamobitech',
        description: 'Professional phone repair services in Nairobi. Screen replacement from KSh 2,800, battery replacement from KSh 2,000, FRP bypass, data recovery, software flashing.',
      },
      store: {
        title: 'Buy Phones Nairobi Kenya | iPhone, Samsung, Redmi | Alphamobitech Store',
        description: 'Shop new and refurbished phones in Nairobi. Best prices on iPhone, Samsung Galaxy, Redmi, and more. Quality guaranteed with warranty. M-Pesa accepted.',
      },
      gallery: {
        title: 'Repair Gallery | Before & After Photos | Alphamobitech',
        description: 'See our repair quality through before and after photos. Screen replacements, battery services, water damage recovery, and more.',
      },
      reviews: {
        title: 'Customer Reviews | What Clients Say | Alphamobitech',
        description: 'Real feedback from our valued customers. 4.9/5 average rating from 127+ reviews. See why Nairobi trusts Alphamobitech for phone repairs.',
      },
      faq: {
        title: 'FAQ | Phone Repair Questions Answered | Alphamobitech',
        description: 'Frequently asked questions about phone repair services. Learn about repair times, warranties, pricing, and more.',
      },
      contact: {
        title: 'Contact Us | Phone Repair Nairobi | Alphamobitech',
        description: 'Get in touch with Alphamobitech. Call 0703555449, WhatsApp, or visit us at Stan Bank Building, Moi Avenue, Nairobi CBD. Open Mon-Sat 7AM-8PM.',
      },
      about: {
        title: 'About Us | Phone Repair Experts Nairobi | Alphamobitech',
        description: 'Learn about Alphamobitech - Nairobi\'s trusted phone repair experts. 5+ years experience, 500+ happy customers, certified technicians.',
      },
      booking: {
        title: 'Book a Repair | Schedule Your Phone Repair | Alphamobitech',
        description: 'Book your phone repair online. Fast, easy booking with same-day service. Screen replacement, battery, charging port, and more.',
      },
      cart: {
        title: 'Shopping Cart | Phone Store | Alphamobitech',
        description: 'Review your selected phones and accessories. Secure checkout with M-Pesa. Free delivery in Nairobi.',
      },
      wishlist: {
        title: 'My Wishlist | Saved Phones | Alphamobitech',
        description: 'Your saved phones and accessories. Compare prices and buy when ready.',
      },
      orders: {
        title: 'Track Your Order | Alphamobitech',
        description: 'Track your phone order status. Enter your order ID to see real-time updates.',
      },
      privacy: {
        title: 'Privacy Policy | Alphamobitech',
        description: 'Our privacy policy explains how we collect, use, and protect your personal information.',
      },
      terms: {
        title: 'Terms of Service | Alphamobitech',
        description: 'Terms and conditions for using Alphamobitech services and purchasing products.',
      },
    };

    const meta = pageMeta[currentPage] || pageMeta.home;
    document.title = meta.title;

    // Update meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', meta.description);
    }

    // Update Open Graph title and description
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', meta.title);
    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', meta.description);
    let twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) twitterTitle.setAttribute('content', meta.title);
    let twitterDesc = document.querySelector('meta[name="twitter:description"]');
    if (twitterDesc) twitterDesc.setAttribute('content', meta.description);

    // Scroll to top on page change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide((prev) => (prev + 1) % 3), 6000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sanitized = {
      name: sanitizeString(contactFormData.name),
      email: sanitizeEmail(contactFormData.email),
      phone: sanitizePhone(contactFormData.phone),
      message: sanitizeString(contactFormData.message),
    };
    const validation = validateContactForm(sanitized);
    if (!validation.isValid) {
      setContactErrors(validation.errors);
      return;
    }
    setContactErrors({});
    setContactSuccess(true);
    setContactFormData({ name: '', email: '', phone: '', message: '' });
    setTimeout(() => setContactSuccess(false), 3000);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sanitized = {
      name: sanitizeString(bookingForm.name),
      phone: sanitizePhone(bookingForm.phone),
      device: sanitizeString(bookingForm.device),
      service: sanitizeString(bookingForm.service),
      notes: sanitizeString(bookingForm.notes),
    };
    const validation = validateBookingForm(sanitized);
    if (!validation.isValid) {
      setBookingErrors(validation.errors);
      return;
    }
    setBookingErrors({});
    const confirmationNumber = generateConfirmationNumber();
    // In production, send to backend
    void confirmationNumber;
    setFormSubmitted(true);
  };

  const addToCart = (product: Product) => {
    const existing = cart.find(item => item.product.id === product.id);
    if (existing) {
      setCart(cart.map(item => 
        item.product.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
    showToast(`${product.name} added to cart!`, 'success');
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: number, delta: number) => {
    setCart(cart.map(item => 
      item.product.id === productId 
        ? { ...item, quantity: Math.max(1, item.quantity + delta) }
        : item
    ));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const toggleWishlist = (productId: number) => {
    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter(id => id !== productId));
    } else {
      setWishlist([...wishlist, productId]);
    }
  };

  const toggleCompare = (productId: number) => {
    if (compareList.includes(productId)) {
      setCompareList(compareList.filter(id => id !== productId));
    } else if (compareList.length < 3) {
      setCompareList([...compareList, productId]);
    }
  };

  const getFilteredProducts = () => {
    let filtered = products;
    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return filtered;
  };

  const navItems = [
    { name: 'Home', id: 'home' as Page },
    { name: 'Services', id: 'services' as Page },
    { name: 'Store', id: 'store' as Page },
    { name: 'Track', id: 'orders' as Page },
    { name: 'Gallery', id: 'gallery' as Page },
    { name: 'Reviews', id: 'reviews' as Page },
    { name: 'FAQ', id: 'faq' as Page },
    { name: 'Contact', id: 'contact' as Page },
    { name: 'About', id: 'about' as Page },
    { name: 'Admin', id: 'admin' as Page },
  ];

  const footerLinks = [
    { name: 'Privacy Policy', id: 'privacy' as Page },
    { name: 'Terms of Service', id: 'terms' as Page },
  ];

  const products: Product[] = [
    { id: 1, name: 'Redmi A7 3/64GB', brand: 'Xiaomi', category: 'phone', price: 11200, description: '3GB RAM, 64GB Storage. Brand new sealed.', specs: ['3GB RAM', '64GB Storage', '6.5" HD+', '5000mAh'], features: ['Brand New', '1 Year Warranty'], image: '/images/phones/a7-3-64.jpg', inStock: true, rating: 4.2, reviews: 15, badge: 'NEW' },
    { id: 2, name: 'Redmi A7 Pro 4/64GB', brand: 'Xiaomi', category: 'phone', price: 12200, description: '4GB RAM, 64GB Storage. Brand new sealed.', specs: ['4GB RAM', '64GB Storage', '6.5" HD+', '5000mAh'], features: ['Brand New', '1 Year Warranty'], image: '/images/phones/a7pro-4-64.jpg', inStock: true, rating: 4.3, reviews: 12, badge: 'NEW' },
    { id: 3, name: 'Redmi A7 Pro 4/128GB', brand: 'Xiaomi', category: 'phone', price: 13900, description: '4GB RAM, 128GB Storage. Brand new sealed.', specs: ['4GB RAM', '128GB Storage', '6.5" HD+', '5000mAh'], features: ['Brand New', '1 Year Warranty'], image: '/images/phones/a7pro-4-128.jpg', inStock: true, rating: 4.4, reviews: 8, badge: 'NEW' },
    { id: 4, name: 'Redmi 15C 4/128GB', brand: 'Xiaomi', category: 'phone', price: 13700, description: '4GB RAM, 128GB Storage. Hot seller!', specs: ['4GB RAM', '128GB Storage', '6.71" HD+', '5160mAh'], features: ['Brand New', 'Hot Deal'], image: '/images/phones/redmi-15c-4-128.jpg', inStock: true, rating: 4.5, reviews: 22, badge: 'HOT' },
    { id: 5, name: 'Redmi 15C 6/128GB', brand: 'Xiaomi', category: 'phone', price: 15300, description: '6GB RAM, 128GB Storage. Hot seller!', specs: ['6GB RAM', '128GB Storage', '6.71" HD+', '5160mAh'], features: ['Brand New', 'Hot Deal'], image: '/images/phones/redmi-15c-6-128.jpg', inStock: true, rating: 4.5, reviews: 18, badge: 'HOT' },
    { id: 6, name: 'Redmi 15C 8/256GB', brand: 'Xiaomi', category: 'phone', price: 17400, description: '8GB RAM, 256GB Storage. Top spec!', specs: ['8GB RAM', '256GB Storage', '6.71" HD+', '5160mAh'], features: ['Brand New', 'Top Spec'], image: '/images/phones/redmi-15c-8-256.jpg', inStock: true, rating: 4.6, reviews: 10 },
    { id: 7, name: 'Redmi 15 6/128GB', brand: 'Xiaomi', category: 'phone', price: 17900, description: '6GB RAM, 128GB Storage. Latest model.', specs: ['6GB RAM', '128GB Storage', '6.79" FHD+', '5110mAh'], features: ['Brand New', '1 Year Warranty'], image: '/images/phones/redmi-15-6-128.jpg', inStock: true, rating: 4.6, reviews: 14, badge: 'NEW' },
    { id: 8, name: 'Redmi 15 8/256GB', brand: 'Xiaomi', category: 'phone', price: 19900, description: '8GB RAM, 256GB Storage. Latest model.', specs: ['8GB RAM', '256GB Storage', '6.79" FHD+', '5110mAh'], features: ['Brand New', '1 Year Warranty'], image: '/images/phones/redmi-15-8-256.jpg', inStock: true, rating: 4.7, reviews: 9, badge: 'NEW' },
    { id: 9, name: 'Redmi Note 15 6/128GB', brand: 'Xiaomi', category: 'phone', price: 23200, description: '6GB RAM, 128GB Storage. Note series.', specs: ['6GB RAM', '128GB Storage', '6.67" AMOLED', '5000mAh'], features: ['Brand New', 'AMOLED Display'], image: '/images/phones/note-15-6-128.jpg', inStock: true, rating: 4.7, reviews: 16, badge: 'NEW' },
    { id: 10, name: 'Redmi Note 15 8/256GB', brand: 'Xiaomi', category: 'phone', price: 26900, description: '8GB RAM, 256GB Storage. Note series.', specs: ['8GB RAM', '256GB Storage', '6.67" AMOLED', '5000mAh'], features: ['Brand New', 'AMOLED Display'], image: '/images/phones/note-15-8-256.jpg', inStock: true, rating: 4.8, reviews: 11, badge: 'NEW' },
    { id: 11, name: 'Redmi Note 15 Pro 8/256GB', brand: 'Xiaomi', category: 'phone', price: 34000, description: '8GB RAM, 256GB Storage. Pro model.', specs: ['8GB RAM', '256GB Storage', '6.67" AMOLED 120Hz', '5110mAh'], features: ['Brand New', '108MP Camera'], image: '/images/phones/note-15pro-8-256.jpg', inStock: true, rating: 4.8, reviews: 13, badge: 'NEW' },
    { id: 12, name: 'Redmi Note 15 Pro 12/512GB', brand: 'Xiaomi', category: 'phone', price: 42000, description: '12GB RAM, 512GB Storage. Top spec Pro.', specs: ['12GB RAM', '512GB Storage', '6.67" AMOLED 120Hz', '5110mAh'], features: ['Brand New', '108MP Camera'], image: '/images/phones/note-15pro-12-512.jpg', inStock: true, rating: 4.9, reviews: 7, badge: 'NEW' },
    { id: 13, name: 'Redmi Note 15 Pro+ 8/256GB', brand: 'Xiaomi', category: 'phone', price: 50000, description: '8GB RAM, 256GB Storage. Pro Plus flagship.', specs: ['8GB RAM', '256GB Storage', '6.67" AMOLED 144Hz', '5000mAh'], features: ['Brand New', '200MP Camera'], image: '/images/phones/note-15pro-8-256.jpg', inStock: true, rating: 4.9, reviews: 5, badge: 'NEW' },
    { id: 14, name: 'Redmi Note 15 Pro+ 12/512GB', brand: 'Xiaomi', category: 'phone', price: 59000, description: '12GB RAM, 512GB Storage. Ultimate Pro Plus.', specs: ['12GB RAM', '512GB Storage', '6.67" AMOLED 144Hz', '5000mAh'], features: ['Brand New', '200MP Camera'], image: '/images/phones/note-15pro-12-512.jpg', inStock: true, rating: 5.0, reviews: 3, badge: 'NEW' },
    { id: 15, name: 'Samsung Galaxy A06 4/64GB', brand: 'Samsung', category: 'phone', price: 11000, description: '4GB RAM, 64GB Storage. Entry level Samsung.', specs: ['4GB RAM', '64GB Storage', '6.7" HD+', '5000mAh'], features: ['EA Warranty', '1 Year Warranty'], image: '/images/phones/a06-4-64.jpg', inStock: true, rating: 4.1, reviews: 25 },
    { id: 16, name: 'Samsung Galaxy A06 4/128GB', brand: 'Samsung', category: 'phone', price: 12500, description: '4GB RAM, 128GB Storage. More storage.', specs: ['4GB RAM', '128GB Storage', '6.7" HD+', '5000mAh'], features: ['EA Warranty', '1 Year Warranty'], image: '/images/phones/a06-4-128.jpg', inStock: true, rating: 4.2, reviews: 20 },
    { id: 17, name: 'Samsung Galaxy A07 4/64GB', brand: 'Samsung', category: 'phone', price: 12600, description: '4GB RAM, 64GB Storage. New A07.', specs: ['4GB RAM', '64GB Storage', '6.7" HD+', '5000mAh'], features: ['EA Warranty', '1 Year Warranty'], image: '/images/phones/a07-4-64.jpg', inStock: true, rating: 4.2, reviews: 15 },
    { id: 18, name: 'Samsung Galaxy A07 4/128GB', brand: 'Samsung', category: 'phone', price: 13400, description: '4GB RAM, 128GB Storage. Hot seller!', specs: ['4GB RAM', '128GB Storage', '6.7" HD+', '5000mAh'], features: ['EA Warranty', '1 Year Warranty'], image: '/images/phones/a07-4-128.jpg', inStock: true, rating: 4.3, reviews: 18, badge: 'HOT' },
    { id: 19, name: 'Samsung Galaxy A16 4/128GB', brand: 'Samsung', category: 'phone', price: 16300, description: '4GB RAM, 128GB Storage. Latest A16.', specs: ['4GB RAM', '128GB Storage', '6.7" FHD+', '5000mAh'], features: ['EA Warranty', '1 Year Warranty'], image: '/images/phones/a16-4-128.jpg', inStock: true, rating: 4.3, reviews: 22, badge: 'NEW' },
    { id: 20, name: 'Samsung Galaxy A16 6/128GB', brand: 'Samsung', category: 'phone', price: 18000, description: '6GB RAM, 128GB Storage. More power.', specs: ['6GB RAM', '128GB Storage', '6.7" FHD+', '5000mAh'], features: ['EA Warranty', '1 Year Warranty'], image: '/images/phones/a16-6-128.jpg', inStock: true, rating: 4.4, reviews: 16 },
    { id: 21, name: 'Samsung Galaxy A17 4/128GB', brand: 'Samsung', category: 'phone', price: 18900, description: '4GB RAM, 128GB Storage. New A17!', specs: ['4GB RAM', '128GB Storage', '6.7" FHD+', '5000mAh'], features: ['EA Warranty', '1 Year Warranty'], image: '/images/phones/a17-4-128.jpg', inStock: true, rating: 4.4, reviews: 14, badge: 'NEW' },
    { id: 22, name: 'Samsung Galaxy A17 6/128GB', brand: 'Samsung', category: 'phone', price: 20000, description: '6GB RAM, 128GB Storage. New A17!', specs: ['6GB RAM', '128GB Storage', '6.7" FHD+', '5000mAh'], features: ['EA Warranty', '1 Year Warranty'], image: '/images/phones/a17-6-128.jpg', inStock: true, rating: 4.5, reviews: 10, badge: 'NEW' },
    { id: 23, name: 'Samsung Galaxy A17 8/256GB', brand: 'Samsung', category: 'phone', price: 26000, description: '8GB RAM, 256GB Storage. Top A17.', specs: ['8GB RAM', '256GB Storage', '6.7" FHD+', '5000mAh'], features: ['EA Warranty', '1 Year Warranty'], image: '/images/phones/a17-8-256.jpg', inStock: true, rating: 4.6, reviews: 8, badge: 'NEW' },
    { id: 24, name: 'Samsung Galaxy A26 6/128GB', brand: 'Samsung', category: 'phone', price: 26000, description: '6GB RAM, 128GB Storage. Temporarily out of stock.', specs: ['6GB RAM', '128GB Storage', '6.7" FHD+ 120Hz', '5000mAh'], features: ['EA Warranty', '1 Year Warranty'], image: '/images/phones/a26-6-128.jpg', inStock: false, rating: 4.5, reviews: 5 },
    { id: 25, name: 'Samsung Galaxy A56 8/256GB', brand: 'Samsung', category: 'phone', price: 47500, description: '8GB RAM, 256GB Storage. Premium mid-range.', specs: ['8GB RAM', '256GB Storage', '6.7" FHD+ 120Hz', '5000mAh'], features: ['EA Warranty', 'IP67'], image: '/images/phones/a56-8-256.jpg', inStock: true, rating: 4.7, reviews: 12 },
    { id: 26, name: 'Samsung Galaxy A37 8/256GB', brand: 'Samsung', category: 'phone', price: 49000, description: '8GB RAM, 256GB Storage. New A37 hot!', specs: ['8GB RAM', '256GB Storage', '6.7" FHD+ 120Hz', '5000mAh'], features: ['EA Warranty', 'Hot Deal'], image: '/images/phones/a37-8-256.jpg', inStock: true, rating: 4.7, reviews: 9, badge: 'HOT' },
    { id: 27, name: 'Samsung Galaxy A57 8/256GB', brand: 'Samsung', category: 'phone', price: 56000, description: '8GB RAM, 256GB Storage. Top A-series hot!', specs: ['8GB RAM', '256GB Storage', '6.7" FHD+ 120Hz', '5000mAh'], features: ['EA Warranty', 'Hot Deal'], image: '/images/phones/a57-8-256.jpg', inStock: true, rating: 4.8, reviews: 6, badge: 'HOT' },
    { id: 28, name: 'Samsung Tab A11 4/64GB', brand: 'Samsung', category: 'tablet', price: 16300, description: '4GB RAM, 64GB Storage. Tablet.', specs: ['4GB RAM', '64GB Storage', '11" Display', '7040mAh'], features: ['EA Warranty', '1 Year Warranty'], image: '/images/phones/tab-a11-64-4.jpg', inStock: true, rating: 4.4, reviews: 8 },
    { id: 29, name: 'Samsung Tab A11 Plus 6/128GB', brand: 'Samsung', category: 'tablet', price: 31500, description: '6GB RAM, 128GB Storage. Plus tablet.', specs: ['6GB RAM', '128GB Storage', '11" Display', '8000mAh'], features: ['EA Warranty', '1 Year Warranty'], image: '/images/phones/tab-a11-plus-128-6.jpg', inStock: true, rating: 4.6, reviews: 5 },
    { id: 30, name: 'Samsung S25 Ultra 256GB', brand: 'Samsung', category: 'phone', price: 119000, description: '12GB RAM, 256GB Storage. Ultra flagship.', specs: ['256GB Storage', '12GB RAM', '6.9" QHD+', '200MP Camera'], features: ['EA Warranty', 'S Pen'], image: '/images/phones/s25ultra-256gb.jpg', inStock: true, rating: 4.9, reviews: 32 },
    { id: 31, name: 'Samsung S25 Ultra 512GB', brand: 'Samsung', category: 'phone', price: 136000, description: '12GB RAM, 512GB Storage. Ultra flagship.', specs: ['512GB Storage', '12GB RAM', '6.9" QHD+', '200MP Camera'], features: ['EA Warranty', 'S Pen'], image: '/images/phones/s25ultra-512gb.jpg', inStock: true, rating: 4.9, reviews: 25 },
    { id: 32, name: 'Samsung S26 Ultra 256GB/12GB', brand: 'Samsung', category: 'phone', price: 140000, description: '12GB RAM, 256GB Storage. Latest Ultra.', specs: ['256GB Storage', '12GB RAM', '6.9" QHD+', '200MP Camera'], features: ['EA Warranty', 'Galaxy AI'], image: '/images/phones/s26-ultra-25612.jpg', inStock: true, rating: 5.0, reviews: 8, badge: 'NEW' },
    { id: 33, name: 'Samsung S26 Ultra 512GB/12GB', brand: 'Samsung', category: 'phone', price: 152000, description: '12GB RAM, 512GB Storage. Latest Ultra top.', specs: ['512GB Storage', '12GB RAM', '6.9" QHD+', '200MP Camera'], features: ['EA Warranty', 'Galaxy AI'], image: '/images/phones/s26-ultra-51212.jpg', inStock: true, rating: 5.0, reviews: 5, badge: 'NEW' },
    { id: 34, name: 'Samsung S26 256GB', brand: 'Samsung', category: 'phone', price: 107000, description: '12GB RAM, 256GB Storage. Latest S26.', specs: ['256GB Storage', '12GB RAM', '6.7" FHD+', '50MP Camera'], features: ['EA Warranty', 'Galaxy AI'], image: '/images/phones/s26-256.jpg', inStock: true, rating: 4.8, reviews: 6, badge: 'NEW' },
    { id: 35, name: 'Samsung S22 Ultra 8/128GB', brand: 'Samsung', category: 'phone', price: 46000, description: '8GB RAM, 128GB Storage. Great value.', specs: ['128GB Storage', '8GB RAM', '6.8" QHD+', '108MP Camera'], features: ['Refurbished', 'S Pen'], image: '/images/phones/s22-ultra-8128gb.jpg', inStock: true, rating: 4.6, reviews: 45 },
    { id: 36, name: 'Samsung S22 Ultra 12/256GB', brand: 'Samsung', category: 'phone', price: 50000, description: '12GB RAM, 256GB Storage. Premium used.', specs: ['256GB Storage', '12GB RAM', '6.8" QHD+', '108MP Camera'], features: ['Refurbished', 'S Pen'], image: '/images/phones/s22-ultra-12256gb.jpg', inStock: true, rating: 4.7, reviews: 38 },
    { id: 37, name: 'Samsung S22 Ultra 12/512GB', brand: 'Samsung', category: 'phone', price: 55000, description: '12GB RAM, 512GB Storage. Top spec.', specs: ['512GB Storage', '12GB RAM', '6.8" QHD+', '108MP Camera'], features: ['Refurbished', 'S Pen'], image: '/images/phones/s22-ultra-12512gb.jpg', inStock: true, rating: 4.8, reviews: 28 },
    { id: 38, name: 'Samsung S23 8/256GB', brand: 'Samsung', category: 'phone', price: 42000, description: '8GB RAM, 256GB Storage. Compact flagship.', specs: ['256GB Storage', '8GB RAM', '6.1" FHD+', '50MP Camera'], features: ['Refurbished', '1 Year Warranty'], image: '/images/phones/s23-8256gb.jpg', inStock: true, rating: 4.6, reviews: 22 },
    { id: 39, name: 'Samsung S23 Ultra 256GB', brand: 'Samsung', category: 'phone', price: 63000, description: '12GB RAM, 256GB Storage. Ultra power.', specs: ['256GB Storage', '12GB RAM', '6.8" QHD+', '200MP Camera'], features: ['Refurbished', 'S Pen'], image: '/images/phones/s23-ultra-256gb.jpg', inStock: true, rating: 4.8, reviews: 35 },
    { id: 40, name: 'Samsung S23 Ultra 512GB', brand: 'Samsung', category: 'phone', price: 67000, description: '12GB RAM, 512GB Storage. Ultra max.', specs: ['512GB Storage', '12GB RAM', '6.8" QHD+', '200MP Camera'], features: ['Refurbished', 'S Pen'], image: '/images/phones/s23-ultra-512gb.jpg', inStock: true, rating: 4.9, reviews: 25 },
    { id: 41, name: 'Samsung S24 Plus 256GB', brand: 'Samsung', category: 'phone', price: 60000, description: '12GB RAM, 256GB Storage. Plus size.', specs: ['256GB Storage', '12GB RAM', '6.7" QHD+', '50MP Camera'], features: ['Refurbished', 'Galaxy AI'], image: '/images/phones/s24-plus-256gb.jpg', inStock: true, rating: 4.7, reviews: 18 },
    { id: 42, name: 'Samsung S24 Ultra 12/256GB', brand: 'Samsung', category: 'phone', price: 82000, description: '12GB RAM, 256GB Storage. Titanium.', specs: ['256GB Storage', '12GB RAM', '6.8" QHD+', '200MP Camera'], features: ['Refurbished', 'Titanium'], image: '/images/phones/s24-ultra-12256gb.jpg', inStock: true, rating: 4.9, reviews: 42 },
    { id: 43, name: 'Samsung S24 Ultra 12/512GB', brand: 'Samsung', category: 'phone', price: 87000, description: '12GB RAM, 512GB Storage. Titanium max.', specs: ['512GB Storage', '12GB RAM', '6.8" QHD+', '200MP Camera'], features: ['Refurbished', 'Titanium'], image: '/images/phones/s24-ultra-12512gb.jpg', inStock: true, rating: 4.9, reviews: 35 },
    { id: 44, name: 'Samsung S25 256GB', brand: 'Samsung', category: 'phone', price: 60000, description: '12GB RAM, 256GB Storage. Latest S25.', specs: ['256GB Storage', '12GB RAM', '6.2" FHD+', '50MP Camera'], features: ['EA Warranty', 'Galaxy AI'], image: '/images/phones/s25-256gb.jpg', inStock: true, rating: 4.7, reviews: 15, badge: 'NEW' },
    { id: 45, name: 'Samsung S25 Ultra 12/256GB', brand: 'Samsung', category: 'phone', price: 95000, description: '12GB RAM, 256GB Storage. New Ultra.', specs: ['256GB Storage', '12GB RAM', '6.9" QHD+', '200MP Camera'], features: ['EA Warranty', 'Galaxy AI'], image: '/images/phones/s25-ultra-12256gb.jpg', inStock: true, rating: 4.9, reviews: 28, badge: 'NEW' },
    { id: 46, name: 'Samsung S25 Ultra 12/512GB', brand: 'Samsung', category: 'phone', price: 105000, description: '12GB RAM, 512GB Storage. New Ultra max.', specs: ['512GB Storage', '12GB RAM', '6.9" QHD+', '200MP Camera'], features: ['EA Warranty', 'Galaxy AI'], image: '/images/phones/s25-ultra-12512gb.jpg', inStock: true, rating: 5.0, reviews: 18, badge: 'NEW' },
    { id: 47, name: 'Samsung Galaxy Fold 6 256GB', brand: 'Samsung', category: 'phone', price: 95000, description: '12GB RAM, 256GB Storage. Foldable.', specs: ['256GB Storage', '12GB RAM', '7.6" Foldable', '50MP Camera'], features: ['Refurbished', 'Foldable'], image: '/images/phones/fold-6-512gb.jpg', inStock: true, rating: 4.8, reviews: 12 },
    { id: 48, name: 'Samsung Galaxy Fold 6 512GB', brand: 'Samsung', category: 'phone', price: 99000, description: '12GB RAM, 512GB Storage. Foldable max.', specs: ['512GB Storage', '12GB RAM', '7.6" Foldable', '50MP Camera'], features: ['Refurbished', 'Foldable'], image: '/images/phones/fold-6-512gb.jpg', inStock: true, rating: 4.9, reviews: 8 },
    { id: 49, name: 'Samsung A16 4/128GB (Dubai)', brand: 'Samsung', category: 'phone', price: 15800, description: '4GB RAM, 128GB Storage. Dubai version.', specs: ['4GB RAM', '128GB Storage', '6.7" FHD+', '5000mAh'], features: ['Dubai Version', '1 Year Warranty'], image: '/images/phones/a16-4-128.jpg', inStock: true, rating: 4.3, reviews: 20 },
    { id: 50, name: 'Samsung A17 8/256GB (Dubai)', brand: 'Samsung', category: 'phone', price: 24000, description: '8GB RAM, 256GB Storage. Dubai version.', specs: ['8GB RAM', '256GB Storage', '6.7" FHD+', '5000mAh'], features: ['Dubai Version', '1 Year Warranty'], image: '/images/phones/a17-8-256.jpg', inStock: true, rating: 4.5, reviews: 15 },
    { id: 51, name: 'Samsung A26 6/128GB (Dubai)', brand: 'Samsung', category: 'phone', price: 25500, description: '6GB RAM, 128GB Storage. Dubai version.', specs: ['6GB RAM', '128GB Storage', '6.7" FHD+ 120Hz', '5000mAh'], features: ['Dubai Version', '1 Year Warranty'], image: '/images/phones/a26-6-128.jpg', inStock: true, rating: 4.5, reviews: 12 },
    { id: 52, name: 'Samsung A26 8/256GB (Dubai)', brand: 'Samsung', category: 'phone', price: 28500, description: '8GB RAM, 256GB Storage. Dubai version.', specs: ['8GB RAM', '256GB Storage', '6.7" FHD+ 120Hz', '5000mAh'], features: ['Dubai Version', '1 Year Warranty'], image: '/images/phones/a26-8-256.jpg', inStock: true, rating: 4.6, reviews: 8 },
    { id: 53, name: 'Samsung A36 6/128GB (Dubai)', brand: 'Samsung', category: 'phone', price: 33000, description: '6GB RAM, 128GB Storage. Dubai version.', specs: ['6GB RAM', '128GB Storage', '6.7" FHD+ 120Hz', '5000mAh'], features: ['Dubai Version', '1 Year Warranty'], image: '/images/phones/a36-6-128.jpg', inStock: true, rating: 4.6, reviews: 10 },
    { id: 54, name: 'Samsung A36 8/256GB (Dubai)', brand: 'Samsung', category: 'phone', price: 35000, description: '8GB RAM, 256GB Storage. Dubai version.', specs: ['8GB RAM', '256GB Storage', '6.7" FHD+ 120Hz', '5000mAh'], features: ['Dubai Version', '1 Year Warranty'], image: '/images/phones/a36-8-256.jpg', inStock: true, rating: 4.7, reviews: 7 },
    { id: 55, name: 'Samsung A56 8/256GB (Dubai)', brand: 'Samsung', category: 'phone', price: 44000, description: '8GB RAM, 256GB Storage. Dubai version.', specs: ['8GB RAM', '256GB Storage', '6.7" FHD+ 120Hz', '5000mAh'], features: ['Dubai Version', 'IP67'], image: '/images/phones/a56-8-256.jpg', inStock: true, rating: 4.7, reviews: 9 },
    { id: 56, name: 'iPhone 11 128GB', brand: 'Apple', category: 'phone', price: 27000, description: '128GB Storage. A13 Bionic chip. Great value.', specs: ['128GB Storage', 'A13 Bionic', '6.1" Display', '12MP Camera'], features: ['Refurbished', '6 Months Warranty'], image: '/images/phones/11-128gb.jpg', inStock: true, rating: 4.4, reviews: 85 },
    { id: 57, name: 'iPhone 11 256GB', brand: 'Apple', category: 'phone', price: 29000, description: '256GB Storage. A13 Bionic chip.', specs: ['256GB Storage', 'A13 Bionic', '6.1" Display', '12MP Camera'], features: ['Refurbished', '6 Months Warranty'], image: '/images/phones/11-256gb.jpg', inStock: true, rating: 4.5, reviews: 72 },
    { id: 58, name: 'iPhone 11 Pro 256GB', brand: 'Apple', category: 'phone', price: 34000, description: '256GB Storage. A13 Bionic. Triple camera.', specs: ['256GB Storage', 'A13 Bionic', '5.8" OLED', '12MP Triple'], features: ['Refurbished', '6 Months Warranty'], image: '/images/phones/11-pro-256gb.jpg', inStock: true, rating: 4.6, reviews: 65 },
    { id: 59, name: 'iPhone 11 Pro Max 256GB', brand: 'Apple', category: 'phone', price: 38000, description: '256GB Storage. A13 Bionic. Max screen.', specs: ['256GB Storage', 'A13 Bionic', '6.5" OLED', '12MP Triple'], features: ['Refurbished', '6 Months Warranty'], image: '/images/phones/11-pro-max-256gb.jpg', inStock: true, rating: 4.7, reviews: 58 },
    { id: 60, name: 'iPhone 11 Pro Max 512GB', brand: 'Apple', category: 'phone', price: 40000, description: '512GB Storage. A13 Bionic. Max storage.', specs: ['512GB Storage', 'A13 Bionic', '6.5" OLED', '12MP Triple'], features: ['Refurbished', '6 Months Warranty'], image: '/images/phones/11-pro-max-512gb.jpg', inStock: true, rating: 4.7, reviews: 42 },
    { id: 61, name: 'iPhone 12 128GB', brand: 'Apple', category: 'phone', price: 32000, description: '128GB Storage. A14 Bionic. 5G capable.', specs: ['128GB Storage', 'A14 Bionic', '6.1" OLED', '12MP Dual'], features: ['Refurbished', '6 Months Warranty'], image: '/images/phones/12-128gb.jpg', inStock: true, rating: 4.5, reviews: 78 },
    { id: 62, name: 'iPhone 12 Pro 128GB', brand: 'Apple', category: 'phone', price: 38000, description: '128GB Storage. A14 Bionic. Pro camera.', specs: ['128GB Storage', 'A14 Bionic', '6.1" OLED', '12MP Triple'], features: ['Refurbished', '6 Months Warranty'], image: '/images/phones/12-pro-128gb.jpg', inStock: true, rating: 4.6, reviews: 65 },
    { id: 63, name: 'iPhone 12 Pro 256GB', brand: 'Apple', category: 'phone', price: 42000, description: '256GB Storage. A14 Bionic. Pro max.', specs: ['256GB Storage', 'A14 Bionic', '6.1" OLED', '12MP Triple'], features: ['Refurbished', '6 Months Warranty'], image: '/images/phones/12-pro-256gb.jpg', inStock: true, rating: 4.7, reviews: 52 },
    { id: 64, name: 'iPhone 12 Pro 512GB', brand: 'Apple', category: 'phone', price: 44000, description: '512GB Storage. A14 Bionic. Top spec.', specs: ['512GB Storage', 'A14 Bionic', '6.1" OLED', '12MP Triple'], features: ['Refurbished', '6 Months Warranty'], image: '/images/phones/12-pro-512gb.jpg', inStock: true, rating: 4.7, reviews: 38 },
    { id: 65, name: 'iPhone 12 Pro Max 128GB', brand: 'Apple', category: 'phone', price: 44000, description: '128GB Storage. A14 Bionic. Max size.', specs: ['128GB Storage', 'A14 Bionic', '6.7" OLED', '12MP Triple'], features: ['Refurbished', '6 Months Warranty'], image: '/images/phones/12-pro-max-128gb.jpg', inStock: true, rating: 4.7, reviews: 55 },
    { id: 66, name: 'iPhone 12 Pro Max 256GB', brand: 'Apple', category: 'phone', price: 49000, description: '256GB Storage. A14 Bionic. Max power.', specs: ['256GB Storage', 'A14 Bionic', '6.7" OLED', '12MP Triple'], features: ['Refurbished', '6 Months Warranty'], image: '/images/phones/12-pro-max-256gb.jpg', inStock: true, rating: 4.8, reviews: 48 },
    { id: 67, name: 'iPhone 12 Pro Max 512GB', brand: 'Apple', category: 'phone', price: 50000, description: '512GB Storage. A14 Bionic. Ultimate.', specs: ['512GB Storage', 'A14 Bionic', '6.7" OLED', '12MP Triple'], features: ['Refurbished', '6 Months Warranty'], image: '/images/phones/12-pro-max-512gb.jpg', inStock: true, rating: 4.8, reviews: 35 },
    { id: 68, name: 'iPhone 13 128GB', brand: 'Apple', category: 'phone', price: 40000, description: '128GB Storage. A15 Bionic. Compact power.', specs: ['128GB Storage', 'A15 Bionic', '6.1" OLED', '12MP Dual'], features: ['Refurbished', '6 Months Warranty'], image: '/images/phones/13-128gb.jpg', inStock: true, rating: 4.6, reviews: 92 },
    { id: 69, name: 'iPhone 13 256GB', brand: 'Apple', category: 'phone', price: 42000, description: '256GB Storage. A15 Bionic.', specs: ['256GB Storage', 'A15 Bionic', '6.1" OLED', '12MP Dual'], features: ['Refurbished', '6 Months Warranty'], image: '/images/phones/13-256gb.jpg', inStock: true, rating: 4.7, reviews: 78 },
    { id: 70, name: 'iPhone 13 512GB', brand: 'Apple', category: 'phone', price: 45000, description: '512GB Storage. A15 Bionic.', specs: ['512GB Storage', 'A15 Bionic', '6.1" OLED', '12MP Dual'], features: ['Refurbished', '6 Months Warranty'], image: '/images/phones/13-512gb.jpg', inStock: true, rating: 4.7, reviews: 55 },
    { id: 71, name: 'iPhone 13 Pro 128GB', brand: 'Apple', category: 'phone', price: 50000, description: '128GB Storage. A15 Bionic. Pro camera.', specs: ['128GB Storage', 'A15 Bionic', '6.1" OLED 120Hz', '12MP Triple'], features: ['Refurbished', '6 Months Warranty'], image: '/images/phones/13-pro-128gb.jpg', inStock: true, rating: 4.8, reviews: 68 },
    { id: 72, name: 'iPhone 13 Pro 256GB', brand: 'Apple', category: 'phone', price: 55000, description: '256GB Storage. A15 Bionic. Pro max.', specs: ['256GB Storage', 'A15 Bionic', '6.1" OLED 120Hz', '12MP Triple'], features: ['Refurbished', '6 Months Warranty'], image: '/images/phones/13-pro-256gb.jpg', inStock: true, rating: 4.8, reviews: 58 },
    { id: 73, name: 'iPhone 13 Pro 512GB', brand: 'Apple', category: 'phone', price: 58000, description: '512GB Storage. A15 Bionic. Top Pro.', specs: ['512GB Storage', 'A15 Bionic', '6.1" OLED 120Hz', '12MP Triple'], features: ['Refurbished', '6 Months Warranty'], image: '/images/phones/13-pro-512gb.jpg', inStock: true, rating: 4.9, reviews: 42 },
    { id: 74, name: 'iPhone 13 Pro 1TB', brand: 'Apple', category: 'phone', price: 60000, description: '1TB Storage. A15 Bionic. Ultimate.', specs: ['1TB Storage', 'A15 Bionic', '6.1" OLED 120Hz', '12MP Triple'], features: ['Refurbished', '6 Months Warranty'], image: '/images/phones/13-pro-1tb.jpg', inStock: true, rating: 4.9, reviews: 28 },
    { id: 75, name: 'iPhone 13 Pro Max 128GB', brand: 'Apple', category: 'phone', price: 57000, description: '128GB Storage. A15 Bionic. Max screen.', specs: ['128GB Storage', 'A15 Bionic', '6.7" OLED 120Hz', '12MP Triple'], features: ['Refurbished', '6 Months Warranty'], image: '/images/phones/13-pro-max-128gb.jpg', inStock: true, rating: 4.8, reviews: 72 },
    { id: 76, name: 'iPhone 13 Pro Max 256GB', brand: 'Apple', category: 'phone', price: 63000, description: '256GB Storage. A15 Bionic. Max power.', specs: ['256GB Storage', 'A15 Bionic', '6.7" OLED 120Hz', '12MP Triple'], features: ['Refurbished', '6 Months Warranty'], image: '/images/phones/13-pro-max-256gb.jpg', inStock: true, rating: 4.9, reviews: 62 },
    { id: 77, name: 'iPhone 13 Pro Max 512GB', brand: 'Apple', category: 'phone', price: 65000, description: '512GB Storage. A15 Bionic. Max spec.', specs: ['512GB Storage', 'A15 Bionic', '6.7" OLED 120Hz', '12MP Triple'], features: ['Refurbished', '6 Months Warranty'], image: '/images/phones/13-pro-max-512gb.jpg', inStock: true, rating: 4.9, reviews: 48 },
    { id: 78, name: 'iPhone 13 Pro Max 1TB', brand: 'Apple', category: 'phone', price: 67000, description: '1TB Storage. A15 Bionic. Ultimate max.', specs: ['1TB Storage', 'A15 Bionic', '6.7" OLED 120Hz', '12MP Triple'], features: ['Refurbished', '6 Months Warranty'], image: '/images/phones/13-pro-max-1tb.jpg', inStock: true, rating: 5.0, reviews: 32 },
    { id: 79, name: 'iPhone 14 128GB', brand: 'Apple', category: 'phone', price: 45000, description: '128GB Storage. A15 Bionic.', specs: ['128GB Storage', 'A15 Bionic', '6.1" OLED', '12MP Dual'], features: ['Refurbished', '6 Months Warranty'], image: '/images/phones/14-128gb.jpg', inStock: true, rating: 4.6, reviews: 85 },
    { id: 80, name: 'iPhone 14 256GB', brand: 'Apple', category: 'phone', price: 50000, description: '256GB Storage. A15 Bionic.', specs: ['256GB Storage', 'A15 Bionic', '6.1" OLED', '12MP Dual'], features: ['Refurbished', '6 Months Warranty'], image: '/images/phones/14-256gb.jpg', inStock: true, rating: 4.7, reviews: 72 },
    { id: 81, name: 'iPhone 14 Plus 128GB', brand: 'Apple', category: 'phone', price: 49000, description: '128GB Storage. A15 Bionic. Plus size.', specs: ['128GB Storage', 'A15 Bionic', '6.7" OLED', '12MP Dual'], features: ['Refurbished', '6 Months Warranty'], image: '/images/phones/14-plus-128gb.jpg', inStock: true, rating: 4.6, reviews: 55 },
    { id: 82, name: 'iPhone 14 Pro 128GB', brand: 'Apple', category: 'phone', price: 63000, description: '128GB Storage. A16 Bionic. Dynamic Island.', specs: ['128GB Storage', 'A16 Bionic', '6.1" OLED 120Hz', '48MP Triple'], features: ['Refurbished', '6 Months Warranty'], image: '/images/phones/14-pro-128gb.jpg', inStock: true, rating: 4.8, reviews: 68 },
    { id: 83, name: 'iPhone 14 Pro 256GB eSIM', brand: 'Apple', category: 'phone', price: 60000, description: '256GB Storage. A16 Bionic. eSIM only.', specs: ['256GB Storage', 'A16 Bionic', '6.1" OLED 120Hz', '48MP Triple'], features: ['Refurbished', 'eSIM Only'], image: '/images/phones/14-pro-256gb.jpg', inStock: true, rating: 4.7, reviews: 45 },
    { id: 84, name: 'iPhone 14 Pro 256GB', brand: 'Apple', category: 'phone', price: 68000, description: '256GB Storage. A16 Bionic. Dynamic Island.', specs: ['256GB Storage', 'A16 Bionic', '6.1" OLED 120Hz', '48MP Triple'], features: ['Refurbished', '6 Months Warranty'], image: '/images/phones/14-pro-256gb.jpg', inStock: true, rating: 4.8, reviews: 62 },
    { id: 85, name: 'iPhone 14 Pro Max 256GB eSIM', brand: 'Apple', category: 'phone', price: 70000, description: '256GB Storage. A16 Bionic. eSIM only.', specs: ['256GB Storage', 'A16 Bionic', '6.7" OLED 120Hz', '48MP Triple'], features: ['Refurbished', 'eSIM Only'], image: '/images/phones/14-pro-max-256gb.jpg', inStock: true, rating: 4.8, reviews: 52 },
    { id: 86, name: 'iPhone 14 Pro Max 256GB', brand: 'Apple', category: 'phone', price: 76000, description: '256GB Storage. A16 Bionic. Max power.', specs: ['256GB Storage', 'A16 Bionic', '6.7" OLED 120Hz', '48MP Triple'], features: ['Refurbished', '6 Months Warranty'], image: '/images/phones/14-pro-max-256gb.jpg', inStock: true, rating: 4.9, reviews: 75 },
    { id: 87, name: 'iPhone 14 Pro Max 512GB eSIM', brand: 'Apple', category: 'phone', price: 77000, description: '512GB Storage. A16 Bionic. eSIM only.', specs: ['512GB Storage', 'A16 Bionic', '6.7" OLED 120Hz', '48MP Triple'], features: ['Refurbished', 'eSIM Only'], image: '/images/phones/14-pro-max-512gb.jpg', inStock: true, rating: 4.9, reviews: 38 },
    { id: 88, name: 'iPhone 14 Pro Max 1TB eSIM', brand: 'Apple', category: 'phone', price: 79000, description: '1TB Storage. A16 Bionic. eSIM only.', specs: ['1TB Storage', 'A16 Bionic', '6.7" OLED 120Hz', '48MP Triple'], features: ['Refurbished', 'eSIM Only'], image: '/images/phones/14-pro-max-1tb.jpg', inStock: true, rating: 5.0, reviews: 22 },
    { id: 89, name: 'iPhone 15 128GB eSIM', brand: 'Apple', category: 'phone', price: 60000, description: '128GB Storage. A16 Bionic. eSIM only.', specs: ['128GB Storage', 'A16 Bionic', '6.1" OLED', '48MP Dual'], features: ['Refurbished', 'eSIM Only'], image: '/images/phones/15-128gb.jpg', inStock: true, rating: 4.7, reviews: 58 },
    { id: 90, name: 'iPhone 15 128GB', brand: 'Apple', category: 'phone', price: 65000, description: '128GB Storage. A16 Bionic. USB-C.', specs: ['128GB Storage', 'A16 Bionic', '6.1" OLED', '48MP Dual'], features: ['Refurbished', '6 Months Warranty'], image: '/images/phones/15-128gb.jpg', inStock: true, rating: 4.8, reviews: 82 },
    { id: 91, name: 'iPhone 15 Plus 128GB', brand: 'Apple', category: 'phone', price: 67000, description: '128GB Storage. A16 Bionic. Plus size.', specs: ['128GB Storage', 'A16 Bionic', '6.7" OLED', '48MP Dual'], features: ['Refurbished', '6 Months Warranty'], image: '/images/phones/15-plus-128gb.jpg', inStock: true, rating: 4.7, reviews: 48 },
    { id: 92, name: 'iPhone 15 Pro Max 256GB eSIM', brand: 'Apple', category: 'phone', price: 85000, description: '256GB Storage. A17 Pro. eSIM only.', specs: ['256GB Storage', 'A17 Pro', '6.7" OLED 120Hz', '48MP Triple'], features: ['Refurbished', 'eSIM Only'], image: '/images/phones/15-pro-max-256gb.jpg', inStock: true, rating: 4.9, reviews: 65 },
    { id: 93, name: 'iPhone 15 Pro Max 256GB', brand: 'Apple', category: 'phone', price: 90000, description: '256GB Storage. A17 Pro. Titanium.', specs: ['256GB Storage', 'A17 Pro', '6.7" OLED 120Hz', '48MP Triple'], features: ['Refurbished', '6 Months Warranty'], image: '/images/phones/15-pro-max-256gb.jpg', inStock: true, rating: 4.9, reviews: 88 },
    { id: 94, name: 'iPhone 15 Pro Max 512GB', brand: 'Apple', category: 'phone', price: 95000, description: '512GB Storage. A17 Pro. Titanium max.', specs: ['512GB Storage', 'A17 Pro', '6.7" OLED 120Hz', '48MP Triple'], features: ['Refurbished', '6 Months Warranty'], image: '/images/phones/15-pro-max-512gb.jpg', inStock: true, rating: 5.0, reviews: 52 },
    { id: 95, name: 'iPhone 16 Pro Max 256GB', brand: 'Apple', category: 'phone', price: 113000, description: '256GB Storage. A18 Pro. Latest flagship.', specs: ['256GB Storage', 'A18 Pro', '6.9" OLED 120Hz', '48MP Triple'], features: ['Brand New', '1 Year Warranty'], image: '/images/phones/16-pro-max-256gb.jpg', inStock: true, rating: 5.0, reviews: 25, badge: 'NEW' },
    { id: 96, name: 'iPhone 16 Pro Max 512GB', brand: 'Apple', category: 'phone', price: 122000, description: '512GB Storage. A18 Pro. Ultimate.', specs: ['512GB Storage', 'A18 Pro', '6.9" OLED 120Hz', '48MP Triple'], features: ['Brand New', '1 Year Warranty'], image: '/images/phones/16-pro-max-512gb.jpg', inStock: true, rating: 5.0, reviews: 18, badge: 'NEW' },
    { id: 97, name: 'iPad Pro 12.9"', brand: 'Apple', category: 'tablet', price: 155000, description: '256GB, Wi-Fi. M2 chip.', specs: ['256GB Storage', 'M2 Chip', '12.9" Display', 'Face ID'], features: ['Free Delivery', '1 Year Warranty'], image: '/images/phones/ipad-pro-129.jpg', inStock: true, rating: 4.9, reviews: 67 },
    { id: 98, name: 'iPad Pro 11"', brand: 'Apple', category: 'tablet', price: 125000, description: '256GB, Wi-Fi. M2 chip.', specs: ['256GB Storage', 'M2 Chip', '11" Display', 'Face ID'], features: ['Free Delivery', '1 Year Warranty'], image: '/images/phones/ipad-pro-11.jpg', inStock: true, rating: 4.8, reviews: 56 },
    { id: 99, name: 'MacBook Pro 16"', brand: 'Apple', category: 'laptop', price: 385000, description: 'M3 Pro, 18GB RAM, 512GB.', specs: ['512GB SSD', 'M3 Pro', '16.2" Display', '18GB RAM'], features: ['Free Delivery', '1 Year Warranty'], image: '/images/phones/macbook-pro-16.jpg', inStock: true, rating: 4.9, reviews: 123 },
    { id: 100, name: 'MacBook Air M3 13"', brand: 'Apple', category: 'laptop', price: 165000, description: '256GB, 8GB RAM. Midnight.', specs: ['256GB SSD', 'M3 Chip', '13.6" Display', '8GB RAM'], features: ['Free Delivery', '1 Year Warranty'], image: '/images/phones/macbook-air-m3-13.jpg', inStock: true, rating: 4.8, reviews: 98 },
  ];

  const services: Service[] = [
    { id: 1, name: 'iPhone Screen Replacement', description: 'Premium display replacement using original parts with warranty', price: 3500, category: 'iPhone', icon: <Smartphone className="w-8 h-8" />, duration: '1-2 hours', popular: true },
    { id: 2, name: 'Samsung Screen Repair', description: 'Galaxy S/Note/A series screen replacement', price: 3000, category: 'Samsung', icon: <Smartphone className="w-8 h-8" />, duration: '1-2 hours', popular: true },
    { id: 3, name: 'OnePlus Screen Service', description: 'Fast screen replacement for all OnePlus models', price: 2800, category: 'OnePlus', icon: <Smartphone className="w-8 h-8" />, duration: '1-2 hours' },
    { id: 4, name: 'Google Pixel Display', description: 'Pixel screen repair for all generations', price: 3200, category: 'Google Pixel', icon: <Smartphone className="w-8 h-8" />, duration: '1-2 hours' },
    { id: 5, name: 'iPhone Battery Service', description: 'Original capacity battery replacement', price: 2500, category: 'iPhone', icon: <Battery className="w-8 h-8" />, duration: '30-45 mins', popular: true },
    { id: 6, name: 'Samsung Battery', description: 'High-quality battery with warranty', price: 2000, category: 'Samsung', icon: <Battery className="w-8 h-8" />, duration: '30-45 mins' },
    { id: 7, name: 'Charging Port Repair', description: 'All brands charging port replacement', price: 2000, category: 'Hardware', icon: <Zap className="w-8 h-8" />, duration: '1 hour' },
    { id: 8, name: 'Camera Repair', description: 'Front & back camera fixes', price: 2500, category: 'Hardware', icon: <Camera className="w-8 h-8" />, duration: '1-2 hours' },
    { id: 9, name: 'Speaker/Mic Repair', description: 'Audio restoration service', price: 1500, category: 'Hardware', icon: <Speaker className="w-8 h-8" />, duration: '1 hour' },
    { id: 10, name: 'Water Damage', description: 'Professional recovery service', price: 3500, category: 'Hardware', icon: <Droplets className="w-8 h-8" />, duration: '1-3 days' },
    { id: 11, name: 'Screen Guard', description: 'Tempered glass screen protector installation', price: 500, category: 'Accessories', icon: <Shield className="w-8 h-8" />, duration: '15 mins' },
    { id: 12, name: 'Back Glass Replacement', description: 'Premium back glass replacement for all models', price: 2500, category: 'Hardware', icon: <Smartphone className="w-8 h-8" />, duration: '1-2 hours' },
  ];

  const categories = ['All', 'iPhone', 'Samsung', 'OnePlus', 'Google Pixel', 'Hardware', 'Accessories'];
  const filteredServices = activeTab === 'All' ? services : services.filter(s => s.category === activeTab);

  const testimonials: Testimonial[] = [
    { name: 'Sarah Johnson', role: 'Marketing Director', text: 'My iPhone screen was completely shattered, and Alphamobitech had it looking brand new in under an hour. Premium service with warranty!', avatar: 'SJ', rating: 5 },
    { name: 'David Kamau', role: 'Business Owner', text: 'Best repair shop in Nairobi! They fixed my phone issue in just 20 minutes. Very professional and affordable prices.', avatar: 'DK', rating: 5 },
    { name: 'Emily Rodriguez', role: 'Teacher', text: 'Fast, professional service. My Samsung battery was replaced quickly, and now it lasts all day. Highly recommend!', avatar: 'ER', rating: 4 },
    { name: 'Michael Ochieng', role: 'Software Developer', text: 'Water damage repair saved my phone! Excellent technicians and great communication.', avatar: 'MO', rating: 5 },
    { name: 'Faith Nekesa', role: 'Student', text: 'My OnePlus screen was cracked and they fixed it same day! Very affordable compared to other shops. Will definitely come back.', avatar: 'FN', rating: 4 },
    { name: 'James Mwangi', role: 'Entrepreneur', text: "Had my iPad water damage fixed here. They were honest about the chances of recovery and it worked! Great service.", avatar: 'JM', rating: 5 },
    { name: 'Grace Atieno', role: 'Nurse', text: 'Quick and reliable service. My phone was ready within 2 hours. The warranty gives peace of mind. Highly recommended!', avatar: 'GA', rating: 4 },
    { name: 'Robert Langat', role: 'Driver', text: "Fixed my charging port issue that other shops could not solve. Fair prices and excellent workmanship.", avatar: 'RL', rating: 5 },
  ];

  const features = [
    { icon: <Truck className="w-8 h-8" />, title: 'Free Pickup & Delivery', description: 'We come to you anywhere in Nairobi' },
    { icon: <CreditCard className="w-8 h-8" />, title: 'Affordable Pricing', description: 'Best rates in Kenya' },
    { icon: <Users className="w-8 h-8" />, title: '500+ Happy Clients', description: 'Satisfied customers nationwide' },
    { icon: <Shield className="w-8 h-8" />, title: 'Warranty on Repairs', description: '30-day guarantee on all services' },
    { icon: <Zap className="w-8 h-8" />, title: 'Same Day Service', description: 'Most repairs done in 1-2 hours' },
    { icon: <Headphones className="w-8 h-8" />, title: '24/7 Support', description: 'Always here to help' },
  ];

  const heroSlides = [
    { 
      title: 'Expert Phone Repair Services', 
      subtitle: 'All Brands Supported', 
      description: 'Premium repair services for iPhone, Samsung, OnePlus, Google Pixel and more. Get your device back to perfect condition.',
      cta: 'Book Now'
    },
    { 
      title: 'Battery Replacement', 
      subtitle: 'All Brands', 
      description: 'Original capacity batteries for iPhone, Samsung, OnePlus and more. Fast replacement service.',
      cta: 'Get Help Now'
    },
    { 
      title: 'Charging Port Repair', 
      subtitle: 'Expert Technicians', 
      description: 'Fix charging issues for all brands. Your trusted mobile repair experts in Kenya.',
      cta: 'Learn More'
    },
  ];

  const galleryItems: GalleryItem[] = [
    { id: 1, title: 'iPhone Screen Repair', description: 'Before & After', image: '/images/iphone-screen-1.jpeg', category: 'Screen' },
    { id: 2, title: 'Samsung Screen', description: 'Premium replacement', image: '/images/samsung-repair.jpeg', category: 'Screen' },
    { id: 3, title: 'Battery Service', description: 'New battery installed', image: '/images/battery-replacement.jpeg', category: 'Battery' },
    { id: 4, title: 'Water Damage', description: 'Recovery success', image: '/images/charging-port.jpeg', category: 'Repair' },
    { id: 5, title: 'Data Recovery', description: 'Files restored', image: '/images/data-recovery.jpeg', category: 'Software' },
    { id: 6, title: 'iPad Repair', description: 'Complete service', image: '/images/ipad-repair.jpeg', category: 'Repair' },
  ];

  const faqs = [
    { q: 'How long does a typical repair take?', a: 'Most common repairs like screen or battery replacements take about 60-90 minutes. More complex repairs may take 24-48 hours. We always aim for same-day service.' },
    { q: 'Do you offer warranty on repairs?', a: 'Yes! We offer a 30-day warranty on all screen and battery replacements. Hardware repairs come with our quality guarantee.' },
    { q: 'Do you use original parts?', a: 'We use high-quality OEM or equivalent parts that meet or exceed original manufacturer specifications. All parts are tested for quality.' },
    { q: 'Can you repair water-damaged devices?', a: 'Yes, we specialize in water damage recovery. Success depends on the extent of damage - bring your device in for a free assessment.' },
    { q: 'Do you offer pickup and delivery?', a: 'Absolutely! We offer free pickup and delivery within Nairobi CBD. Schedule your convenient time.' },
    { q: 'What brands do you repair?', a: 'We repair all major brands including Apple iPhone, Samsung, OnePlus, Google Pixel, Huawei, Xiaomi, Oppo, Vivo, and more.' },
  ];

  const stats = [
    { number: '500+', label: 'Happy Clients' },
    { number: '5+', label: 'Years Experience' },
    { number: '1000+', label: 'Repairs Completed' },
    { number: '30+', label: 'Service Areas' },
  ];

  const Header = () => (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-slate-900/95 shadow-2xl shadow-amber-500/5' : 'bg-transparent'}`}>
      <div className={`main-header transition-all duration-500 ${isScrolled ? 'py-2' : 'py-3'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center">
          <a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('home'); }} className="flex items-center gap-3 group">
            <div className="relative">
              <img 
                src="/logo.svg" 
                alt="Alphamobitech" 
                className="h-14 w-auto object-contain group-hover:scale-110 transition-transform duration-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <div className="absolute -inset-2 bg-amber-500/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold text-white tracking-tight">Alpha<span className="text-amber-500">mobitech</span></span>
              <p className="text-[10px] text-slate-400 -mt-1 tracking-widest uppercase">Phones Solution</p>
            </div>
          </a>

          <nav className="hidden lg:flex items-center gap-1">
            {navItems.filter(item => item.id !== 'admin').map((item) => (
              <a
                key={item.id}
                href="#"
                onClick={(e) => { e.preventDefault(); setCurrentPage(item.id); }}
                className={`relative px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 cursor-pointer group ${
                  currentPage === item.id 
                    ? 'text-amber-500 bg-amber-500/10' 
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.name}
                <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-amber-500 rounded-full transition-all duration-300 ${currentPage === item.id ? 'w-6' : 'w-0 group-hover:w-4'}`}></span>
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a 
              href="tel:0703555449"
              className="hidden md:flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:from-amber-600 hover:to-amber-700 transition-all duration-300 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:-translate-y-0.5"
            >
              <Phone className="w-4 h-4" />
              <span>0703555449</span>
            </a>
            <button 
              onClick={() => { setCurrentPage('cart'); window.scrollTo(0, 0); }}
              className="relative p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-500/30 transition-all duration-300"
              title="Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5 text-slate-300" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce-in">
                  {cartCount}
                </span>
              )}
            </button>
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="lg:hidden p-2.5 text-slate-300 hover:text-white rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="nav-bar bg-gradient-to-r from-amber-500/90 to-amber-600/90 backdrop-blur-md hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center">
            <nav className="flex gap-1 py-2.5">
              {navItems.filter(item => item.id !== 'admin').map((item) => (
                <a
                  key={item.id}
                  href="#"
                  onClick={(e) => { e.preventDefault(); setCurrentPage(item.id); }}
                  className={`relative px-4 py-1.5 rounded-lg text-white font-medium text-sm transition-all duration-300 hover:bg-white/15 cursor-pointer ${
                    currentPage === item.id ? 'bg-white/20 shadow-inner' : ''
                  }`}
                >
                  {item.name}
                </a>
              ))}
            </nav>
            <div className="flex items-center gap-4 text-white text-xs py-2.5">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Mon - Sun: 7AM - 8PM</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>Stan Bank Building, Moi Avenue</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );

  const MobileMenu = () => (
    <div className={`mobile-menu fixed inset-0 z-[100] transition-all duration-300 ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}></div>
      <div className={`absolute right-0 top-0 h-full w-80 bg-slate-800 shadow-2xl transform transition-transform duration-300 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 border-b border-slate-700/30">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <img 
                src="/logo.svg" 
                alt="Alphamobitech" 
                className="w-10 h-10 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
            <button onClick={() => setIsMenuOpen(false)} className="p-2 text-slate-400 hover:text-slate-200">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        <nav className="p-4">
          {navItems.map((item) => (
            <a
              key={item.id}
              href="#"
              onClick={(e) => { e.preventDefault(); setCurrentPage(item.id); setIsMenuOpen(false); }}
              className={`block py-3 px-4 rounded-lg font-medium transition-all ${
                currentPage === item.id 
                  ? 'bg-amber-50 text-amber-600' 
                  : 'text-slate-200 hover:bg-slate-800/30'
              }`}
            >
              {item.name}
            </a>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-slate-700/30">
          <a 
            href="tel:0703555449"
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white py-3 rounded-lg font-medium"
          >
            <Phone className="w-5 h-5" />
            <span>0703555449</span>
          </a>
        </div>
      </div>
    </div>
  );

  const HeroSection = () => (
    <section className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 w-[500px] h-[500px] bg-amber-500/8 rounded-full blur-3xl animate-morph"></div>
        <div className="absolute bottom-20 left-10 w-[400px] h-[400px] bg-blue-500/6 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-amber-400/5 rounded-full blur-3xl animate-ping-slow"></div>
        <div className="absolute bottom-1/3 right-1/4 w-[350px] h-[350px] bg-purple-500/5 rounded-full blur-3xl animate-morph"></div>
        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <div key={i} className="particle" style={{ left: `${15 + i * 15}%`, bottom: '-10px', animationDelay: `${i * 1.5}s`, animationDuration: `${8 + i * 2}s` }}></div>
        ))}
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-16 items-center relative z-10">
        {/* Left content */}
        <div className="animate-slide-in-left">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 px-5 py-2.5 rounded-full text-sm font-medium mb-8 backdrop-blur-sm">
            <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></span>
            {heroSlides[currentSlide].subtitle}
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] mb-6">
            {heroSlides[currentSlide].title}
            <span className="block mt-3 text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 animate-text-shimmer">
              Professional Service
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-lg leading-relaxed">
            {heroSlides[currentSlide].description}
          </p>
          <div className="flex flex-wrap gap-4 mb-12">
            <button 
              onClick={() => setCurrentPage('booking')}
              className="group flex items-center gap-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-amber-600 hover:to-amber-700 transition-all duration-300 shadow-xl shadow-amber-500/25 hover:shadow-amber-500/50 hover:-translate-y-1 hover:scale-105"
            >
              {heroSlides[currentSlide].cta}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
            </button>
            <a 
              href="https://wa.me/254703555449"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 bg-white/5 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-bold text-lg border border-white/10 hover:border-green-500/50 hover:bg-green-500/10 transition-all duration-300 hover:-translate-y-1"
            >
              <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
              <span className="group-hover:text-green-400 transition-colors">WhatsApp Us</span>
            </a>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-8 pt-8 border-t border-white/10">
            {stats.slice(0, 3).map((stat, i) => (
              <div key={i} className="text-center group cursor-default">
                <div className="text-3xl font-extrabold text-amber-500 group-hover:scale-110 transition-transform duration-300">{stat.number}</div>
                <div className="text-xs text-slate-500 mt-1 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right visual */}
        <div className="relative animate-slide-in-right hidden lg:block">
          <div className="relative">
            {/* Decorative ring */}
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-full blur-2xl animate-pulse"></div>
            {/* Main card */}
            <div className="relative glass-dark rounded-3xl p-8 shadow-2xl">
              <div className="grid grid-cols-2 gap-5">
                {[
                  { icon: <Smartphone className="w-10 h-10" />, title: 'Screen', sub: 'Repair', color: 'amber' },
                  { icon: <Battery className="w-10 h-10" />, title: 'Battery', sub: 'Replacement', color: 'green' },
                  { icon: <Shield className="w-10 h-10" />, title: 'Back Glass', sub: 'Replacement', color: 'blue' },
                  { icon: <Zap className="w-10 h-10" />, title: 'Charging', sub: 'Port', color: 'purple' },
                ].map((item, i) => (
                  <div key={i} className={`bg-${item.color}-500/10 backdrop-blur rounded-2xl p-6 text-center group hover:bg-${item.color}-500/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-default`}>
                    <div className={`text-${item.color}-400 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300`}>{item.icon}</div>
                    <div className="text-white font-bold text-lg">{item.title}</div>
                    <div className="text-slate-500 text-xs mt-1">{item.sub}</div>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-center">
                <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 px-5 py-2.5 rounded-full text-sm font-medium">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  Online Now — Ready to Help
                </div>
              </div>
            </div>
            {/* Floating badge */}
            <div className="absolute -top-4 -right-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-lg shadow-amber-500/30 animate-float">
              ⚡ Same Day
            </div>
          </div>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3">
        {[0, 1, 2].map((i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            className={`h-2 rounded-full transition-all duration-500 ${
              currentSlide === i ? 'w-10 bg-amber-500' : 'w-2 bg-slate-600 hover:bg-slate-500'
            }`}
          />
        ))}
      </div>
    </section>
  );

  const TrustBadges = () => (
    <div className="bg-gradient-to-r from-slate-800/80 via-slate-800/50 to-slate-800/80 border-b border-slate-700/30 py-5 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-wrap justify-center gap-6 md:gap-10">
          {[
            { icon: <Shield className="w-5 h-5" />, text: 'Warranty on All Repairs', color: 'text-amber-400' },
            { icon: <Truck className="w-5 h-5" />, text: 'Free Pickup & Delivery in Nairobi', color: 'text-blue-400' },
            { icon: <Zap className="w-5 h-5" />, text: 'Same Day Service', color: 'text-yellow-400' },
            { icon: <CreditCard className="w-5 h-5" />, text: 'M-Pesa Paybill: 714888', color: 'text-green-400' },
            { icon: <Headphones className="w-5 h-5" />, text: '24/7 Support', color: 'text-purple-400' },
          ].map((badge, i) => (
            <div key={i} className="flex items-center gap-2 text-slate-300 text-sm group cursor-default">
              <span className={`${badge.color} group-hover:scale-125 transition-transform duration-300`}>{badge.icon}</span>
              <span className="group-hover:text-white transition-colors duration-300">{badge.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const FeatureBanner = () => (
    <section className="py-12 bg-slate-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {features.map((feature, i) => (
            <div 
              key={i} 
              className="group text-center p-6 rounded-2xl hover:bg-gradient-to-br hover:from-amber-950/30 hover:to-slate-800 transition-all duration-300 cursor-pointer animate-fade-in-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-200 text-amber-600 mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                {feature.icon}
              </div>
              <h3 className="font-semibold text-white mb-1 group-hover:text-amber-600 transition-colors">{feature.title}</h3>
              <p className="text-sm text-slate-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  const BrandsSection = () => (
    <section className="py-16 bg-slate-900 reveal">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <span className="inline-block text-amber-500 font-semibold mb-2">Brands We Work With</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Authorized Repair for <span className="text-amber-500">All Major Brands</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            We service and sell devices from all top manufacturers with genuine parts and expert technicians
          </p>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 items-center">
          {[
            { name: 'Apple', color: 'from-gray-700 to-gray-900', icon: '🍎' },
            { name: 'Samsung', color: 'from-blue-700 to-blue-900', icon: '💎' },
            { name: 'Xiaomi', color: 'from-orange-500 to-orange-700', icon: '🔶' },
            { name: 'OnePlus', color: 'from-red-600 to-red-800', icon: '➕' },
            { name: 'Google', color: 'from-green-600 to-green-800', icon: '🔍' },
            { name: 'Huawei', color: 'from-red-500 to-red-700', icon: '🌸' },
            { name: 'Oppo', color: 'from-green-500 to-green-700', icon: '📱' },
            { name: 'Vivo', color: 'from-blue-500 to-blue-700', icon: '🎵' },
            { name: 'Realme', color: 'from-yellow-500 to-yellow-700', icon: '⚡' },
            { name: 'Tecno', color: 'from-teal-500 to-teal-700', icon: '📲' },
            { name: 'Infinix', color: 'from-purple-500 to-purple-700', icon: '🔥' },
            { name: 'Nokia', color: 'from-blue-600 to-blue-800', icon: '🏔️' },
            { name: 'Sony', color: 'from-gray-600 to-gray-800', icon: '🎮' },
            { name: 'LG', color: 'from-pink-500 to-pink-700', icon: '📺' },
            { name: 'Motorola', color: 'from-gray-500 to-gray-700', icon: '📞' },
            { name: 'Itel', color: 'from-indigo-500 to-indigo-700', icon: '💡' },
          ].map((brand) => (
            <div
              key={brand.name}
              className={`group relative bg-gradient-to-br ${brand.color} rounded-xl p-4 text-center hover:scale-110 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl`}
            >
              <div className="text-2xl mb-1">{brand.icon}</div>
              <div className="text-white text-xs font-semibold">{brand.name}</div>
              <div className="absolute inset-0 bg-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <p className="text-slate-500 text-sm">...and many more brands. Contact us if your brand isn't listed.</p>
        </div>
      </div>
    </section>
  );

  const ServicesSection = () => (
    <section id="services" className="py-20 bg-gradient-to-br from-slate-800/50 to-slate-900 reveal">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block text-amber-600 font-semibold mb-2">Our Services</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Professional Repair Services
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Expert technicians with years of experience handling all mobile brands
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-6 py-3 rounded-full font-medium transition-all ${
                activeTab === cat 
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg' 
                  : 'bg-slate-800 text-slate-300 hover:bg-amber-50 hover:text-amber-600 border border-slate-700/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredServices.map((service, index) => (
            <div 
              key={service.id}
              className={`group relative bg-slate-800 rounded-2xl p-6 shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer animate-fade-in-up ${
                service.popular ? 'ring-2 ring-amber-500' : ''
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {service.popular && (
                <div className="absolute -top-3 right-4">
                  <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    Popular
                  </span>
                </div>
              )}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-200 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                {service.icon}
              </div>
              <div className="text-xs font-medium text-slate-500 mb-2">{service.category}</div>
              <h3 className="font-bold text-white mb-2">{service.name}</h3>
              <p className="text-sm text-slate-400 mb-4">{service.description}</p>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-2xl font-bold text-amber-600">KSh {service.price.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1 text-slate-500 text-sm">
                  <Clock className="w-4 h-4" />
                  {service.duration}
                </div>
              </div>
              <button 
                onClick={() => setCurrentPage('booking')}
                className="w-full py-3 bg-slate-800 text-white rounded-xl font-medium hover:bg-amber-600 hover:scale-105 transition-all cursor-pointer flex items-center justify-center gap-2 group"
              >
                Book Now
                <Check className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  const GallerySection = () => (
    <section id="gallery" className="py-20 bg-slate-900 reveal">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block text-amber-500 font-semibold mb-2">Our Work</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Repair <span className="text-amber-500">Gallery</span>
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            See the quality of our work through these completed repairs
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryItems.map((item) => (
            <div 
              key={item.id}
              className="group relative overflow-hidden rounded-2xl aspect-[4/3]"
            >
              <img 
                src={item.image} 
                alt={item.title}
                loading="lazy"
                width="400"
                height="300"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect fill="%23374151" width="400" height="300"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="24" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3E' + item.title + '%3C/text%3E%3C/svg%3E';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span className="text-amber-500 text-sm font-medium">{item.category}</span>
                  <h3 className="text-white font-bold text-xl mb-1">{item.title}</h3>
                  <p className="text-slate-300 text-sm">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  const ReviewsSection = () => (
    <section id="reviews" className="py-20 bg-gradient-to-br from-amber-950/20 to-slate-900 reveal">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block text-amber-600 font-semibold mb-2">Testimonials</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            What Our <span className="text-amber-600">Clients Say</span>
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Real feedback from our valued customers
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, i) => (
            <div 
              key={i}
              className="group bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, j) => (
                  <Star key={j} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-slate-300 mb-6 italic">"{testimonial.text}"</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white font-bold">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-bold text-white">{testimonial.name}</div>
                  <div className="text-sm text-slate-400">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  const FAQSection = () => (
    <section id="faq" className="py-20 bg-slate-800 reveal">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block text-amber-600 font-semibold mb-2">Help & Support</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Frequently Asked <span className="text-amber-600">Questions</span>
          </h2>
          <p className="text-slate-300">
            Find answers to common questions about our services
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div 
              key={i}
              className={`border border-slate-700/50 rounded-xl overflow-hidden transition-all ${activeFaq === i ? 'border-amber-500 shadow-lg' : ''}`}
            >
              <button
                onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left bg-slate-800 hover:bg-slate-800/30 transition-colors"
              >
                <span className="font-semibold text-white pr-4">{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-amber-600 flex-shrink-0 transition-transform ${activeFaq === i ? 'rotate-180' : ''}`} />
              </button>
              <div className={`overflow-hidden transition-all ${activeFaq === i ? 'max-h-40' : 'max-h-0'}`}>
                <p className="px-5 pb-5 text-slate-300">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  const AboutSection = () => (
    <section id="about" className="py-20 bg-slate-800/30 reveal">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block text-amber-600 font-semibold mb-2">About Us</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Your Trusted Phone Repair Experts in Nairobi
            </h2>
            <p className="text-slate-300 mb-6">
              Alphamobitech Phones Solution is a leading mobile phone repair service provider in Kenya. 
              With over 5 years of experience, we've helped thousands of customers restore their devices 
              to perfect working condition.
            </p>
            <p className="text-slate-300 mb-8">
              Our team of certified technicians uses state-of-the-art equipment and premium quality parts 
              to ensure your device gets the best care possible. We pride ourselves on fast turnaround 
              times, affordable prices, and exceptional customer service.
            </p>

            <div className="grid grid-cols-2 gap-6 mb-8">
              {stats.map((stat, i) => (
                <div key={i} className="bg-slate-800 rounded-xl p-4 shadow-md">
                  <div className="text-3xl font-bold text-amber-600">{stat.number}</div>
                  <div className="text-sm text-slate-400">{stat.label}</div>
                </div>
              ))}
            </div>

            <button 
              onClick={() => setCurrentPage('contact')}
              className="flex items-center gap-2 text-amber-600 font-semibold hover:gap-3 transition-all"
            >
              Contact Us <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 rounded-3xl rotate-3"></div>
            <div className="relative bg-slate-800 rounded-3xl p-8 shadow-2xl">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800/10 backdrop-blur rounded-2xl p-6 text-center">
                  <Award className="w-12 h-12 text-amber-400 mx-auto mb-3" />
                  <div className="text-white font-bold">Certified</div>
                  <div className="text-slate-500 text-sm">Technicians</div>
                </div>
                <div className="bg-slate-800/10 backdrop-blur rounded-2xl p-6 text-center">
                  <Shield className="w-12 h-12 text-green-400 mx-auto mb-3" />
                  <div className="text-white font-bold">Warranty</div>
                  <div className="text-slate-500 text-sm">Guaranteed</div>
                </div>
                <div className="bg-slate-800/10 backdrop-blur rounded-2xl p-6 text-center">
                  <Zap className="w-12 h-12 text-blue-400 mx-auto mb-3" />
                  <div className="text-white font-bold">Fast</div>
                  <div className="text-slate-500 text-sm">Service</div>
                </div>
                <div className="bg-slate-800/10 backdrop-blur rounded-2xl p-6 text-center">
                  <Users className="w-12 h-12 text-purple-400 mx-auto mb-3" />
                  <div className="text-white font-bold">Expert</div>
                  <div className="text-slate-500 text-sm">Support</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  const BookingSection = () => (
    <section id="booking" className="py-20 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 reveal">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block text-amber-500 font-semibold mb-2">Get Started</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Book Your <span className="text-amber-500">Repair</span>
          </h2>
          <p className="text-slate-500">
            Fill out the form below and we'll get back to you within minutes
          </p>
        </div>

        {formSubmitted ? (
          <div className="bg-slate-800 rounded-2xl p-12 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Booking Submitted!</h3>
            <p className="text-slate-300 mb-6">We'll contact you shortly to confirm your appointment.</p>
            <button 
              onClick={() => setFormSubmitted(false)}
              className="text-amber-600 font-medium hover:underline"
            >
              Book Another Service
            </button>
          </div>
        ) : (
          <div className="bg-slate-800 rounded-2xl p-8 shadow-2xl">
            <form onSubmit={handleBookingSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">Your Name</label>
                  <input 
                    type="text" 
                    required
                    value={bookingForm.name}
                    onChange={(e) => { setBookingForm({...bookingForm, name: e.target.value}); setBookingErrors(prev => ({...prev, name: ''})); }}
                    className={`w-full px-4 py-3 bg-slate-700 text-white rounded-xl border ${bookingErrors.name ? 'border-red-500' : 'border-slate-700/50'} focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all`}
                    placeholder="John Doe"
                  />
                  {bookingErrors.name && <p className="text-red-500 text-sm mt-1">{bookingErrors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">Phone Number</label>
                  <input 
                    type="tel" 
                    required
                    value={bookingForm.phone}
                    onChange={(e) => { setBookingForm({...bookingForm, phone: e.target.value}); setBookingErrors(prev => ({...prev, phone: ''})); }}
                    className={`w-full px-4 py-3 bg-slate-700 text-white rounded-xl border ${bookingErrors.phone ? 'border-red-500' : 'border-slate-700/50'} focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all`}
                    placeholder="0700000000"
                  />
                  {bookingErrors.phone && <p className="text-red-500 text-sm mt-1">{bookingErrors.phone}</p>}
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">Device Brand</label>
                  <select 
                    required
                    value={bookingForm.device}
                    onChange={(e) => { setBookingForm({...bookingForm, device: e.target.value}); setBookingErrors(prev => ({...prev, device: ''})); }}
                    className={`w-full px-4 py-3 bg-slate-700 text-white rounded-xl border ${bookingErrors.device ? 'border-red-500' : 'border-slate-700/50'} focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all`}
                  >
                    <option value="">Select Brand</option>
                    <option value="iphone">iPhone</option>
                    <option value="samsung">Samsung</option>
                    <option value="oneplus">OnePlus</option>
                    <option value="google">Google Pixel</option>
                    <option value="huawei">Huawei</option>
                    <option value="xiaomi">Xiaomi</option>
                    <option value="other">Other</option>
                  </select>
                  {bookingErrors.device && <p className="text-red-500 text-sm mt-1">{bookingErrors.device}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">Service Required</label>
                  <select 
                    required
                    value={bookingForm.service}
                    onChange={(e) => { setBookingForm({...bookingForm, service: e.target.value}); setBookingErrors(prev => ({...prev, service: ''})); }}
                    className={`w-full px-4 py-3 bg-slate-700 text-white rounded-xl border ${bookingErrors.service ? 'border-red-500' : 'border-slate-700/50'} focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all`}
                  >
                    <option value="">Select Service</option>
                    <option value="screen">Screen Replacement</option>
                    <option value="battery">Battery Replacement</option>
                    <option value="backglass">Back Glass Replacement</option>
                    <option value="charging">Charging Port</option>
                    <option value="camera">Camera Repair</option>
                    <option value="speaker">Speaker/Mic</option>
                    <option value="water">Water Damage</option>
                    <option value="screenguard">Screen Guard</option>
                    <option value="other">Other</option>
                  </select>
                  {bookingErrors.service && <p className="text-red-500 text-sm mt-1">{bookingErrors.service}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Additional Notes</label>
                <textarea 
                  rows={4}
                  value={bookingForm.notes}
                  onChange={(e) => setBookingForm({...bookingForm, notes: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-700 text-white placeholder-slate-400 rounded-xl border border-slate-700/50 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all resize-none"
                  placeholder="Describe your issue..."
                />
              </div>
              <button 
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-semibold hover:from-amber-600 hover:to-amber-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group overflow-hidden relative"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  <span>Submit Booking Request</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-amber-700 translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
              </button>
            </form>
          </div>
        )}
      </div>
    </section>
  );

  const ContactSection = () => (
    <section id="contact" className="py-20 bg-slate-800 reveal">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block text-amber-600 font-semibold mb-2">Contact Us</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Get In <span className="text-amber-600">Touch</span>
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Have questions? We'd love to hear from you
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-800/20 rounded-xl flex items-center justify-center">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-semibold">Location</div>
                    <div className="opacity-80">Nairobi CBD, Kenya</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-800/20 rounded-xl flex items-center justify-center">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-semibold">Phone</div>
                    <div className="opacity-80">0703555449</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-800/20 rounded-xl flex items-center justify-center">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-semibold">Email</div>
                     <div className="opacity-80">alphamobitech767@gmail.com</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-800/20 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-semibold">Hours</div>
                    <div className="opacity-80">Mon - Sat: 8AM - 6PM</div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <a href="https://facebook.com/alphamobitech" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Facebook" className="w-10 h-10 bg-slate-800/20 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="https://instagram.com/alphamobitech" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Instagram" className="w-10 h-10 bg-slate-800/20 rounded-full flex items-center justify-center hover:bg-pink-600 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
                <a href="https://twitter.com/alphamobitech" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Twitter" className="w-10 h-10 bg-slate-800/20 rounded-full flex items-center justify-center hover:bg-sky-500 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                <a href="https://wa.me/254703555449" target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp" className="w-10 h-10 bg-slate-800/20 rounded-full flex items-center justify-center hover:bg-green-500 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                </a>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/30 rounded-2xl p-8">
            {contactSuccess ? (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                <p className="text-slate-300">We'll get back to you shortly.</p>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-bold text-white mb-6">Send us a Message</h3>
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-200 mb-2">Name</label>
                      <input 
                        type="text" 
                        required
                        value={contactFormData.name}
                        onChange={(e) => { setContactFormData({...contactFormData, name: e.target.value}); setContactErrors(prev => ({...prev, name: ''})); }}
                        className={`w-full px-4 py-3 bg-slate-700 text-white rounded-xl border ${contactErrors.name ? 'border-red-500' : 'border-slate-700/50'} focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all`}
                        placeholder="Your Name"
                      />
                      {contactErrors.name && <p className="text-red-500 text-sm mt-1">{contactErrors.name}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-200 mb-2">Email</label>
                      <input 
                        type="email" 
                        required
                        value={contactFormData.email}
                        onChange={(e) => { setContactFormData({...contactFormData, email: e.target.value}); setContactErrors(prev => ({...prev, email: ''})); }}
                        className={`w-full px-4 py-3 bg-slate-700 text-white rounded-xl border ${contactErrors.email ? 'border-red-500' : 'border-slate-700/50'} focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all`}
                        placeholder="your@email.com"
                      />
                      {contactErrors.email && <p className="text-red-500 text-sm mt-1">{contactErrors.email}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">Phone</label>
                    <input 
                      type="tel" 
                      required
                      value={contactFormData.phone}
                      onChange={(e) => { setContactFormData({...contactFormData, phone: e.target.value}); setContactErrors(prev => ({...prev, phone: ''})); }}
                      className={`w-full px-4 py-3 bg-slate-700 text-white rounded-xl border ${contactErrors.phone ? 'border-red-500' : 'border-slate-700/50'} focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all`}
                      placeholder="0700000000"
                    />
                    {contactErrors.phone && <p className="text-red-500 text-sm mt-1">{contactErrors.phone}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">Message</label>
                    <textarea 
                      rows={4}
                      required
                      value={contactFormData.message}
                      onChange={(e) => { setContactFormData({...contactFormData, message: e.target.value}); setContactErrors(prev => ({...prev, message: ''})); }}
                      className={`w-full px-4 py-3 bg-slate-700 text-white rounded-xl border ${contactErrors.message ? 'border-red-500' : 'border-slate-700/50'} focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all resize-none`}
                      placeholder="Your message..."
                    />
                    {contactErrors.message && <p className="text-red-500 text-sm mt-1">{contactErrors.message}</p>}
                  </div>
                  <button 
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-semibold hover:from-amber-600 hover:to-amber-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
                  >
                    <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    <span>Send Message</span>
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );

  const Footer = () => (
    <footer className="bg-slate-950 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <img 
                src="/logo.svg" 
                alt="Alphamobitech" 
                className="h-12 w-auto object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
            <p className="text-slate-500 mb-6">
              Professional phone repair services in Nairobi, Kenya. Expert technicians with warranty on all repairs.
            </p>
            <div className="flex gap-4">
              <a href="https://facebook.com/alphamobitech" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Facebook" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="https://instagram.com/alphamobitech" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Instagram" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-pink-600 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="https://twitter.com/alphamobitech" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Twitter" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-sky-500 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="https://wa.me/254703555449" target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-green-500 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {navItems.map((item) => (
                <li key={item.id}>
                  <a 
                    href="#"
                    onClick={(e) => { e.preventDefault(); setCurrentPage(item.id); }}
                    className="text-slate-500 hover:text-amber-500 transition-colors"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Services</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-slate-500 hover:text-amber-500 transition-colors">Screen Replacement</a></li>
              <li><a href="#" className="text-slate-500 hover:text-amber-500 transition-colors">Battery Replacement</a></li>
              <li><a href="#" className="text-slate-500 hover:text-amber-500 transition-colors">Back Glass Replacement</a></li>
              <li><a href="#" className="text-slate-500 hover:text-amber-500 transition-colors">Charging Port</a></li>
              <li><a href="#" className="text-slate-500 hover:text-amber-500 transition-colors">Water Damage</a></li>
              <li><a href="#" className="text-slate-500 hover:text-amber-500 transition-colors">Screen Guard</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Contact Info</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-slate-500">
                <Phone className="w-5 h-5 text-amber-500" />
                <span>0703555449</span>
              </li>
              <li className="flex items-center gap-3 text-slate-500">
                <Mail className="w-5 h-5 text-amber-500" />
                 <span>alphamobitech767@gmail.com</span>
              </li>
              <li className="flex items-center gap-3 text-slate-500">
                <MapPin className="w-5 h-5 text-amber-500" />
                <span>Nairobi CBD, Kenya</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 text-center">
          <p className="text-slate-500">
            &copy; {new Date().getFullYear()} Alphamobitech Phones Solution. All rights reserved.
          </p>
          <div className="flex justify-center gap-6 mt-4">
            {footerLinks.map((link) => (
              <a
                key={link.id}
                href="#"
                onClick={(e) => { e.preventDefault(); setCurrentPage(link.id); window.scrollTo(0, 0); }}
                className="text-slate-400 hover:text-amber-500 text-sm transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );

  const StoreSection = () => {
    const [activeBrand, setActiveBrand] = useState<string>('all');
    const filteredProducts = getFilteredProducts().filter(p => {
      if (activeBrand === 'all') return true;
      if (activeBrand === 'iphone') return p.brand === 'Apple';
      if (activeBrand === 'samsung') return p.brand === 'Samsung';
      if (activeBrand === 'xiaomi') return p.brand === 'Xiaomi';
      if (activeBrand === 'tablet') return p.category === 'tablet';
      if (activeBrand === 'laptop') return p.category === 'laptop';
      return true;
    });

    const compareProducts = products.filter(p => compareList.includes(p.id));
    const inStockCount = filteredProducts.filter(p => p.inStock).length;
    const newCount = filteredProducts.filter(p => p.badge === 'NEW').length;
    const hotCount = filteredProducts.filter(p => p.badge === 'HOT').length;

    return (
      <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 pt-28">
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-sm font-medium mb-3">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              {inStockCount} Products In Stock
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-3">
              Phone <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-700">Store</span>
            </h2>
            <p className="text-slate-300 max-w-2xl mx-auto">
              Best deals on iPhone, Samsung, Redmi & more. Quality guaranteed with warranty.
            </p>
          </div>

          <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl p-6 mb-8 text-white shadow-xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-slate-800/20 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">M-Pesa Payment</h3>
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 mt-1">
                   <div>
                     <span className="text-amber-100 text-sm">Paybill:</span>
                     <span className="font-bold text-lg ml-2">714888</span>
                   </div>
                   <div>
                     <span className="text-amber-100 text-sm">Account:</span>
                     <span className="font-bold text-lg ml-2">169405</span>
                   </div>
                  </div>
                </div>
              </div>
               <div className="bg-slate-800/20 rounded-xl px-4 py-2 text-sm font-medium whitespace-nowrap">
                 Pay via Lipa Na M-Pesa
               </div>
               <div className="mt-4 p-3 bg-amber-50/10 rounded-lg">
                 <p className="text-amber-800 text-sm mb-1"><strong>Location:</strong> Stan Bank Building, Moi Avenue, Across Archives Floor 3 Room 10</p>
                 <p className="text-amber-800 text-sm mb-1"><strong>Email:</strong> alphamobitech767@gmail.com</p>
                 <p className="text-amber-800 text-sm"><strong>Hours:</strong> 7AM - 8PM</p>
               </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 flex items-start gap-3">
            <span className="text-2xl flex-shrink-0">⚠️</span>
            <p className="text-amber-800 font-medium text-sm">
              Always confirm availability and price before ordering. Stock and prices may change without notice. Contact us on WhatsApp for real-time availability.
            </p>
          </div>

          {(newCount > 0 || hotCount > 0) && (
            <div className="flex flex-wrap gap-3 mb-6 justify-center">
              {newCount > 0 && (
                <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
                  <span className="text-blue-500">🆕</span> {newCount} New Arrivals
                </span>
              )}
              {hotCount > 0 && (
                <span className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-medium">
                  <span className="text-red-500">🔥</span> {hotCount} Hot Deals
                </span>
              )}
            </div>
          )}

          <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                placeholder="Search phones, tablets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-700/50 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 bg-slate-700 text-white placeholder-slate-400"
              />
            </div>
            <div className="flex items-center gap-3">
              {compareList.length > 0 && (
                <button onClick={() => setShowCompare(true)} className="flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors">
                  <Scale className="w-4 h-4" />
                  Compare ({compareList.length})
                </button>
              )}
              <button
                onClick={() => setCurrentPage('wishlist')}
                className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
              >
                <Heart className="w-4 h-4" />
                Wishlist ({wishlist.length})
              </button>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {[
              { id: 'all', label: 'All Products', icon: '📱' },
              { id: 'iphone', label: 'iPhone', icon: '🍎' },
              { id: 'samsung', label: 'Samsung', icon: '💎' },
              { id: 'xiaomi', label: 'Xiaomi/Redmi', icon: '🔶' },
              { id: 'tablet', label: 'Tablets', icon: '📋' },
              { id: 'laptop', label: 'Laptops', icon: '💻' },
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveBrand(cat.id)}
                className={`px-5 py-2.5 rounded-full font-medium transition-all shadow-sm ${
                  activeBrand === cat.id
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-amber-200'
                    : 'bg-slate-800 text-slate-200 hover:bg-amber-50 hover:text-amber-600 border border-slate-700/50'
                }`}
              >
                <span className="mr-1.5">{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-slate-800 rounded-2xl shadow-lg">
              <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No products found</h3>
              <p className="text-slate-400">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredProducts.map(product => (
                <div key={product.id} className={`bg-slate-800 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group ${!product.inStock ? 'opacity-70' : ''}`}>
                  <div className="h-52 bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center relative overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      width="400"
                      height="500"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                    {product.category === 'phone' && <Smartphone className="w-16 h-16 text-slate-300 absolute" />}
                    {product.category === 'tablet' && <Tablet className="w-16 h-16 text-slate-300 absolute" />}
                    {product.category === 'laptop' && <Laptop className="w-16 h-16 text-slate-300 absolute" />}
                    
                    {product.badge && (
                      <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold shadow-lg ${
                        product.badge === 'NEW' ? 'bg-blue-500 text-white' :
                        product.badge === 'HOT' ? 'bg-red-500 text-white' :
                        'bg-slate-700 text-white'
                      }`}>
                        {product.badge}
                      </span>
                    )}
                    
                    {!product.inStock && (
                      <span className="absolute top-3 right-12 px-3 py-1 rounded-full text-xs font-bold bg-slate-600 text-white">
                        SOLD OUT
                      </span>
                    )}

                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className="absolute top-3 right-3 p-2 bg-slate-800/90 backdrop-blur rounded-full shadow-md hover:scale-110 transition-transform"
                    >
                      <Heart className={`w-4 h-4 ${wishlist.includes(product.id) ? 'fill-red-500 text-red-500' : 'text-slate-500'}`} />
                    </button>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                        product.brand === 'Apple' ? 'bg-slate-100 text-slate-300' :
                        product.brand === 'Samsung' ? 'bg-blue-50 text-blue-600' :
                        'bg-orange-50 text-orange-600'
                      }`}>
                        {product.brand}
                      </span>
                      {product.features.some(f => f.toLowerCase().includes('brand new') || f.toLowerCase().includes('ea warranty')) && (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-green-500/20 text-green-400 border border-green-500/30">
                          ✓ Brand New
                        </span>
                      )}
                      {product.features.some(f => f.toLowerCase().includes('refurbished')) && (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                          ↻ Refurbished
                        </span>
                      )}
                      {product.features.some(f => f.toLowerCase().includes('dubai')) && (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 border border-purple-500/30">
                          🌍 Dubai Version
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-white mb-1 text-sm leading-tight line-clamp-2 min-h-[2.5rem]">{product.name}</h3>
                    
                    <div className="flex items-center gap-1.5 mb-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
                        ))}
                      </div>
                      <span className="text-xs text-slate-500">({product.reviews})</span>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg font-bold text-amber-600">KSh {product.price.toLocaleString()}</span>
                      {product.originalPrice && (
                        <span className="text-xs text-slate-500 line-through">KSh {product.originalPrice.toLocaleString()}</span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => product.inStock && addToCart(product)}
                        disabled={!product.inStock}
                        className="flex-1 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl text-sm font-medium hover:from-amber-600 hover:to-amber-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                      >
                        {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                      </button>
                      <button
                        onClick={() => toggleCompare(product.id)}
                        disabled={compareList.length >= 3 && !compareList.includes(product.id)}
                        className="p-2.5 bg-slate-800/30 rounded-xl hover:bg-slate-100 disabled:opacity-30 transition-colors"
                        title="Compare"
                      >
                        <Scale className="w-4 h-4 text-slate-300" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-12 bg-slate-800 rounded-2xl p-6 shadow-lg">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Phone className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h4 className="font-bold text-white">Need Help Choosing?</h4>
                  <p className="text-sm text-slate-400">Contact us for personalized recommendations</p>
                </div>
              </div>
              <a
                href="https://wa.me/254703555449?text=Hi,%20I%20need%20help%20choosing%20a%20phone"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors shadow-md"
              >
                WhatsApp Us
              </a>
            </div>
          </div>

          {showCompare && compareProducts.length > 0 && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowCompare(false)}>
              <div className="bg-slate-800 rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-white">Compare Products</h3>
                  <button onClick={() => setShowCompare(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {compareProducts.map(p => (
                    <div key={p.id} className="border rounded-xl p-4 relative">
                      <button onClick={() => toggleCompare(p.id)} className="absolute top-2 right-2 p-1 bg-slate-100 rounded-full">
                        <X className="w-4 h-4" />
                      </button>
                      <div className="h-32 bg-slate-800/30 rounded-lg flex items-center justify-center mb-4">
                        {p.category === 'phone' && <Smartphone className="w-16 h-16 text-slate-300" />}
                        {p.category === 'tablet' && <Tablet className="w-16 h-16 text-slate-300" />}
                        {p.category === 'laptop' && <Laptop className="w-16 h-16 text-slate-300" />}
                      </div>
                      <h4 className="font-bold text-white text-sm mb-1">{p.name}</h4>
                      <p className="text-lg font-bold text-amber-600 mb-3">KSh {p.price.toLocaleString()}</p>
                      <div className="space-y-1.5 text-xs">
                        {p.specs.map((spec, i) => (
                          <div key={i} className="flex justify-between text-slate-300">
                            <span>{spec}</span>
                          </div>
                        ))}
                      </div>
                      <button onClick={() => { addToCart(p); }} className="w-full mt-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700">
                        Add to Cart
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    );
  };

  const WishlistSection = () => {
    const wishlistProducts = products.filter(p => wishlist.includes(p.id));
    
    return (
      <section className="py-20 bg-slate-800/30 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 pt-28">
          <h2 className="text-3xl font-bold text-white mb-8">My Wishlist</h2>
          
          {wishlistProducts.length === 0 ? (
            <div className="text-center py-16 bg-slate-800 rounded-2xl shadow-lg">
              <Heart className="w-20 h-20 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Your wishlist is empty</h3>
              <p className="text-slate-400 mb-6">Add items you like to your wishlist</p>
              <button onClick={() => setCurrentPage('store')} className="px-6 py-3 bg-amber-600 text-white rounded-xl font-medium hover:bg-amber-700">
                Browse Products
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {wishlistProducts.map(product => (
                <div key={product.id} className="bg-slate-800 rounded-2xl overflow-hidden shadow-lg">
                  <div className="h-48 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                    {product.category === 'phone' && <Smartphone className="w-20 h-20 text-slate-500 absolute" />}
                    {product.category === 'tablet' && <Tablet className="w-20 h-20 text-slate-500 absolute" />}
                    {product.category === 'laptop' && <Laptop className="w-20 h-20 text-slate-500 absolute" />}
                  </div>
                  <div className="p-5">
                    <div className="text-xs text-amber-600 font-medium mb-1">{product.brand}</div>
                    <h3 className="font-bold text-white mb-2">{product.name}</h3>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xl font-bold text-amber-600">KSh {product.price.toLocaleString()}</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => { addToCart(product); }}
                        className="flex-1 py-3 bg-amber-600 text-white rounded-xl font-medium hover:bg-amber-700"
                      >
                        Add to Cart
                      </button>
                      <button
                        onClick={() => toggleWishlist(product.id)}
                        className="p-3 bg-red-100 text-red-500 rounded-xl hover:bg-red-200"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    );
  };

  const CartSection = () => (
    <section className="py-20 bg-slate-800/30 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 pt-28">
        <h2 className="text-3xl font-bold text-white mb-8">Shopping Cart</h2>
        
        {cart.length === 0 ? (
          <div className="text-center py-16 bg-slate-800 rounded-2xl shadow-lg">
            <ShoppingCart className="w-20 h-20 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Your cart is empty</h3>
            <p className="text-slate-400 mb-6">Start shopping to add items to your cart</p>
            <button onClick={() => setCurrentPage('store')} className="px-6 py-3 bg-amber-600 text-white rounded-xl font-medium hover:bg-amber-700">
              Browse Products
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cart.map(item => (
                <div key={item.product.id} className="bg-slate-800 rounded-xl p-4 shadow-lg flex gap-4">
                  <div className="w-24 h-24 bg-slate-100 rounded-lg flex items-center justify-center relative">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover rounded-lg"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                    {item.product.category === 'phone' && <Smartphone className="w-12 h-12 text-slate-500 absolute" />}
                    {item.product.category === 'tablet' && <Tablet className="w-12 h-12 text-slate-500 absolute" />}
                    {item.product.category === 'laptop' && <Laptop className="w-12 h-12 text-slate-500 absolute" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-semibold text-white">{item.product.name}</h3>
                        <p className="text-sm text-slate-400">{item.product.category}</p>
                      </div>
                      <button onClick={() => removeFromCart(item.product.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <div className="flex items-center gap-3">
                        <button onClick={() => updateQuantity(item.product.id, -1)} className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center hover:bg-slate-200">
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-medium">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product.id, 1)} className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center hover:bg-slate-200">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <span className="font-bold text-amber-600">KSh {(item.product.price * item.quantity).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-slate-800 rounded-xl p-6 shadow-lg h-fit">
              <h3 className="text-lg font-semibold text-white mb-4">Order Summary</h3>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-slate-300">
                  <span>Subtotal ({cartCount} items)</span>
                  <span>KSh {cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Delivery</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-amber-600">KSh {cartTotal.toLocaleString()}</span>
                </div>
              </div>
              <button onClick={() => setCurrentPage('checkout')} className="w-full py-3 bg-amber-600 text-white rounded-xl font-medium hover:bg-amber-700 transition-all">
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );

  const [checkoutData, setCheckoutData] = useState({ name: '', email: '', phone: '', address: '', city: 'Nairobi', paymentMethod: 'mpesa' });
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const orderDetails = cart.map(item => `${item.product.name} x${item.quantity} = KSh ${(item.product.price * item.quantity).toLocaleString()}`).join('%0A');
    const message = `*NEW ORDER*%0A%0AName: ${checkoutData.name}%0AEmail: ${checkoutData.email}%0APhone: ${checkoutData.phone}%0AAddress: ${checkoutData.address}, ${checkoutData.city}%0APayment: ${checkoutData.paymentMethod}%0A%0A*Items:*%0A${orderDetails}%0A%0A*Total: KSh ${cartTotal.toLocaleString()}*`;
    
    window.open(`https://wa.me/254703555449?text=${message}`, '_blank');
    setCheckoutSuccess(true);
  };

  const [trackOrderId, setTrackOrderId] = useState('');
  const [trackedOrder, setTrackedOrder] = useState<{id: string; status: string; date: string} | null>(null);

  const handleTrackOrder = () => {
    if (trackOrderId.toUpperCase().startsWith('ORD')) {
      setTrackedOrder({ id: trackOrderId.toUpperCase(), status: 'confirmed', date: new Date().toLocaleDateString() });
    } else {
      setTrackedOrder(null);
    }
  };

  const TrackOrderSection = () => (
    <section className="py-20 bg-slate-800/30 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 pt-28">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">Track Your Order</h2>
        <div className="bg-slate-800 rounded-xl p-6 shadow-lg">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Enter order ID (e.g., ORD001)"
              value={trackOrderId}
              onChange={(e) => setTrackOrderId(e.target.value)}
              className="flex-1 px-4 py-3 bg-slate-700 text-white placeholder-slate-400 border border-slate-700/50 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
            />
            <button onClick={handleTrackOrder} className="px-6 py-3 bg-amber-600 text-white rounded-xl font-medium hover:bg-amber-700">
              Track
            </button>
          </div>
          {trackedOrder && (
            <div className="mt-6 p-4 bg-green-50 rounded-xl">
              <div className="flex items-center gap-2 text-green-600 mb-4">
                <CheckCircle className="w-6 h-6" />
                <span className="font-semibold">Order Found</span>
              </div>
              <p className="text-white">Order ID: <strong>{trackedOrder.id}</strong></p>
              <p className="text-slate-300">Status: <span className="text-green-600 font-medium">{trackedOrder.status}</span></p>
              <p className="text-slate-400 text-sm">Date: {trackedOrder.date}</p>
            </div>
          )}
          {trackOrderId && !trackedOrder && (
            <div className="mt-4 p-4 bg-red-50 rounded-xl text-red-600">
              Order not found. Please check your order ID.
            </div>
          )}
        </div>
      </div>
    </section>
  );

  const CheckoutSection = () => (
    <section className="py-20 bg-slate-800/30 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 pt-28">
        {checkoutSuccess ? (
          <div className="text-center py-16 bg-slate-800 rounded-2xl shadow-lg">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">Order Placed Successfully!</h3>
            <p className="text-slate-400 mb-6">We&apos;ll contact you shortly to confirm your order.</p>
            <button onClick={() => { setCheckoutSuccess(false); setCart([]); setCurrentPage('home'); }} className="px-6 py-3 bg-amber-600 text-white rounded-xl font-medium hover:bg-amber-700">
              Back to Home
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Checkout</h2>
              <form onSubmit={handleCheckoutSubmit} className="bg-slate-800 rounded-xl p-6 shadow-lg space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">Full Name</label>
                  <input type="text" required value={checkoutData.name} onChange={e => setCheckoutData({...checkoutData, name: e.target.value})} className="w-full px-4 py-3 bg-slate-700 text-white placeholder-slate-400 border border-slate-700/50 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">Email</label>
                  <input type="email" required value={checkoutData.email} onChange={e => setCheckoutData({...checkoutData, email: e.target.value})} className="w-full px-4 py-3 bg-slate-700 text-white placeholder-slate-400 border border-slate-700/50 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20" placeholder="john@email.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">Phone</label>
                  <input type="tel" required value={checkoutData.phone} onChange={e => setCheckoutData({...checkoutData, phone: e.target.value})} className="w-full px-4 py-3 bg-slate-700 text-white placeholder-slate-400 border border-slate-700/50 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20" placeholder="0700000000" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">Delivery Address</label>
                  <input type="text" required value={checkoutData.address} onChange={e => setCheckoutData({...checkoutData, address: e.target.value})} className="w-full px-4 py-3 bg-slate-700 text-white placeholder-slate-400 border border-slate-700/50 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20" placeholder="Street address" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">City</label>
                  <select value={checkoutData.city} onChange={e => setCheckoutData({...checkoutData, city: e.target.value})} className="w-full px-4 py-3 bg-slate-700 text-white border border-slate-700/50 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20">
                    <option>Nairobi</option>
                    <option>Mombasa</option>
                    <option>Kisumu</option>
                    <option>Nakuru</option>
                    <option>Eldoret</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">Payment Method</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 p-3 border border-amber-500 rounded-xl bg-amber-50 cursor-pointer">
                      <input type="radio" name="payment" value="mpesa" checked={checkoutData.paymentMethod === 'mpesa'} onChange={e => setCheckoutData({...checkoutData, paymentMethod: e.target.value})} />
                      <span>M-Pesa</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 border border-slate-700/50 rounded-xl cursor-pointer">
                      <input type="radio" name="payment" value="cash" checked={checkoutData.paymentMethod === 'cash'} onChange={e => setCheckoutData({...checkoutData, paymentMethod: e.target.value})} />
                      <span>Cash on Delivery</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 border border-slate-700/50 rounded-xl cursor-pointer">
                      <input type="radio" name="payment" value="card" checked={checkoutData.paymentMethod === 'card'} onChange={e => setCheckoutData({...checkoutData, paymentMethod: e.target.value})} />
                      <span>Card Payment</span>
                    </label>
                  </div>
                </div>
                <button type="submit" className="w-full py-4 bg-amber-600 text-white rounded-xl font-semibold hover:bg-amber-700 transition-all">
                  Place Order - KSh {cartTotal.toLocaleString()}
                </button>
              </form>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Order Summary</h3>
              <div className="bg-slate-800 rounded-xl p-6 shadow-lg space-y-4">
                {cart.map(item => (
                  <div key={item.product.id} className="flex justify-between">
                    <div>
                      <span className="text-white">{item.product.name}</span>
                      <span className="text-slate-400 text-sm ml-2">x{item.quantity}</span>
                    </div>
                    <span className="font-medium">KSh {(item.product.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
                <div className="border-t pt-4 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-amber-600">KSh {cartTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );

  const WhatsAppFAB = () => (
    <a
      href="https://wa.me/254703555449?text=Hello%2C%20I%20need%20phone%20repair%20services"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white shadow-2xl hover:bg-green-600 hover:scale-110 transition-all z-50 animate-bounce animate-glow-pulse"
    >
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    </a>
  );

  const BackToTop = () => (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={`fixed bottom-24 right-6 w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center text-white shadow-xl hover:shadow-2xl hover:scale-110 transition-all z-50 ${showBackToTop ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );

  const Toast = () => {
    if (!toast) return null;
    return (
      <div className={`fixed top-24 right-4 z-[100] max-w-sm p-4 rounded-xl shadow-2xl flex items-center gap-3 animate-slide-up ${
        toast.type === 'success' ? 'bg-green-600 text-white' :
        toast.type === 'error' ? 'bg-red-600 text-white' :
        'bg-blue-600 text-white'
      }`}>
        {toast.type === 'success' && <CheckCircle className="w-5 h-5 flex-shrink-0" />}
        {toast.type === 'error' && <XCircle className="w-5 h-5 flex-shrink-0" />}
        {toast.type === 'info' && <CheckCircle className="w-5 h-5 flex-shrink-0" />}
        <span className="text-sm font-medium">{toast.message}</span>
        <button onClick={() => setToast(null)} className="ml-2 hover:opacity-70">
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      {isLoading && <PageLoader />}
      {currentPage !== 'admin' && <Header />}
      {currentPage !== 'admin' && <MobileMenu />}
      <Toast />
      <BackToTop />

      <main className={currentPage === 'admin' ? '' : 'pt-0'}>
        {currentPage === 'home' && (
          <>
            <HeroSection />
            <TrustBadges />
            <FeatureBanner />
            <BrandsSection />
            <ServicesSection />
            <GallerySection />
            <ReviewsSection />
            <FAQSection />
            <AboutSection />
            <BookingSection />
            <ContactSection />
          </>
        )}
        {currentPage === 'services' && <div className="pt-24"><ServicesSection /></div>}
        {currentPage === 'store' && <StoreSection />}
        {currentPage === 'orders' && <TrackOrderSection />}
        {currentPage === 'wishlist' && <WishlistSection />}
        {currentPage === 'cart' && <CartSection />}
        {currentPage === 'checkout' && <CheckoutSection />}
        {currentPage === 'gallery' && <div className="pt-24"><GallerySection /></div>}
        {currentPage === 'reviews' && <div className="pt-24"><ReviewsSection /></div>}
        {currentPage === 'faq' && <div className="pt-24"><FAQSection /></div>}
        {currentPage === 'contact' && <div className="pt-24"><ContactSection /></div>}
        {currentPage === 'about' && <div className="pt-24"><AboutSection /></div>}
        {currentPage === 'booking' && <div className="pt-24"><BookingSection /></div>}
        {currentPage === 'privacy' && <div className="pt-24"><PrivacyPolicy /></div>}
        {currentPage === 'terms' && <div className="pt-24"><TermsOfService /></div>}
        {currentPage === 'admin' && <AdminDashboard />}
      </main>

      {currentPage !== 'admin' && <Footer />}
      {currentPage !== 'admin' && <WhatsAppFAB />}
      {currentPage !== 'admin' && <CookieConsent />}
    </div>
  );
};

const AppWithErrorBoundary = () => (
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);

export default AppWithErrorBoundary;