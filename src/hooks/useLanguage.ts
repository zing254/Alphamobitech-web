import { useState, useEffect, useCallback } from 'react';

export type Language = 'en' | 'sw' | 'ki';

export interface Translations {
  [key: string]: string | Translations;
}

const translations: Record<Language, Translations> = {
  en: {
    'nav.home': 'Home',
    'nav.services': 'Services',
    'nav.store': 'Store',
    'nav.booking': 'Book Repair',
    'nav.contact': 'Contact',
    'nav.about': 'About',
    'nav.gallery': 'Gallery',
    'nav.reviews': 'Reviews',
    'nav.faq': 'FAQ',
    'nav.admin': 'Admin',
    'nav.cart': 'Cart',
    'nav.wishlist': 'Wishlist',
    'hero.title': 'Premium Mobile Repair in Nairobi',
    'hero.subtitle': 'Expert phone repairs and quality devices at unbeatable prices in Nairobi',
    'hero.shopDevices': 'Shop Devices',
    'hero.repairServices': 'Repair Services',
    'services.title': 'Our Services',
    'services.subtitle': 'Professional repair services with warranty',
    'store.title': 'Device Store',
    'store.subtitle': 'Quality phones, tablets & laptops',
    'store.search': 'Search products...',
    'store.noResults': 'No products found matching your criteria.',
    'store.addToCart': 'Add to Cart',
    'booking.title': 'Book a Repair',
    'booking.subtitle': 'Fill out the form below and we\'ll get back to you within 15 minutes',
    'booking.selectService': 'Select Service',
    'booking.bookButton': 'Book Repair Service',
    'contact.title': 'Contact Us',
    'about.title': 'About Us',
    'gallery.title': 'Our Gallery',
    'reviews.title': 'Customer Reviews',
    'faq.title': 'Frequently Asked Questions',
    'cart.title': 'Shopping Cart',
    'cart.empty': 'Your cart is empty',
    'cart.emptyHint': 'Add some products to get started.',
    'cart.continueShopping': 'Continue Shopping',
    'cart.summary': 'Order Summary',
    'cart.subtotal': 'Subtotal',
    'cart.shipping': 'Shipping',
    'cart.free': 'Free',
    'cart.total': 'Total',
    'cart.checkout': 'Proceed to Checkout',
    'cart.clear': 'Clear Cart',
    'checkout.title': 'Checkout',
    'checkout.success': 'Order Placed Successfully!',
    'checkout.empty': 'No items to checkout',
    'checkout.contact': 'Contact Information',
    'checkout.shippingAddress': 'Shipping Address',
    'checkout.payment': 'Payment Method',
    'checkout.placeOrder': 'Place Order',
    'checkout.backToHome': 'Back to Home',
    'checkout.continueShopping': 'Continue Shopping',
    'checkout.summary': 'Order Summary',
    'common.loading': 'Loading...',
    'common.submit': 'Submit',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.close': 'Close',
    'common.search': 'Search...',
    'common.filter': 'Filter',
    'common.all': 'All',
    'common.price': 'Price',
    'common.brand': 'Brand',
    'common.inStock': 'In Stock',
    'common.outOfStock': 'Out of Stock',
    'common.addToCart': 'Add to Cart',
    'common.buyNow': 'Buy Now',
    'common.compare': 'Compare',
    'common.wishlist': 'Wishlist',
    'notification.title': 'Notifications',
    'notification.enable': 'Enable Notifications',
    'notification.disable': 'Disable Notifications',
    'notification.orderUpdates': 'Order Updates',
    'notification.promotions': 'Promotions',
    'notification.repairUpdates': 'Repair Updates',
    'notification.chatMessages': 'Chat Messages',
    'language.label': 'Language',
    'language.english': 'English',
    'language.swahili': 'Swahili',
    'language.kikuyu': 'Kikuyu',
  },
  sw: {
    'nav.home': 'Nyumbani',
    'nav.services': 'Huduma',
    'nav.store': 'Duka',
    'nav.booking': 'Agiza Matengenezo',
    'nav.contact': 'Wasiliana',
    'nav.about': 'Kuhusu',
    'nav.gallery': 'Matunzio',
    'nav.reviews': 'Maoni',
    'nav.faq': 'Maswali',
    'nav.admin': 'Admin',
    'nav.cart': 'Kikapu',
    'nav.wishlist': 'Wishlist',
    'hero.title': 'Matengenezo ya Simu na Bei Nzuri',
    'hero.subtitle': 'Matengenezo ya simu ya kitaalam na vifaa vya ubora kwa bei isiyoshindana Nairobi',
    'hero.shopDevices': 'Nunua Vifaa',
    'hero.repairServices': 'Huduma za Matengenezo',
    'services.title': 'Huduma Zetu',
    'services.subtitle': 'Huduma za matengenezo ya kitaalam na dhamana',
    'store.title': 'Duka la Vifaa',
    'store.subtitle': 'Simu, tablets na laptops za ubora',
    'store.search': 'Tafuta bidhaa...',
    'store.noResults': 'Hakuna bidhaa zilizopatikana.',
    'store.addToCart': 'Weka kwenye Kikapu',
    'booking.title': 'Agiza Matengenezo',
    'booking.subtitle': 'Jaza fomu hapa chini na tutakujibu ndani ya dakika 15',
    'booking.selectService': 'Chagua Huduma',
    'booking.bookButton': 'Agiza Huduma ya Matengenezo',
    'contact.title': 'Wasiliana Nasi',
    'about.title': 'Kuhusu Sisi',
    'gallery.title': 'Matunzio Yetu',
    'reviews.title': 'Maoni ya Wateja',
    'faq.title': 'Maswali Yanayoulizwa Mara kwa Mara',
    'cart.title': 'Kikapu cha Ununuzi',
    'cart.empty': 'Kikapu chako hakina kitu',
    'cart.emptyHint': 'Ongeza bidhaa ili kuanza.',
    'cart.continueShopping': 'Endelea Kununua',
    'cart.summary': 'Muhtasari wa Agizo',
    'cart.subtotal': 'Jumla Ndogo',
    'cart.shipping': 'Usafirishaji',
    'cart.free': 'Bure',
    'cart.total': 'Jumla',
    'cart.checkout': 'Nenda kwa Malipo',
    'cart.clear': 'Futa Kikapu',
    'checkout.title': 'Malipo',
    'checkout.success': 'Agizo Limewekwa Kwa Mafanikio!',
    'checkout.empty': 'Hakuna bidhaa za kulipa',
    'checkout.contact': 'Maelezo ya Mawasiliano',
    'checkout.shippingAddress': 'Anwani ya Usafirishaji',
    'checkout.payment': 'Njia ya Malipo',
    'checkout.placeOrder': 'Weka Agizo',
    'checkout.backToHome': 'Rudi Nyumbani',
    'checkout.continueShopping': 'Endelea Kununua',
    'checkout.summary': 'Muhtasari wa Agizo',
    'common.loading': 'Inapakia...',
    'common.submit': 'Wasilisha',
    'common.cancel': 'Ghairi',
    'common.save': 'Hifadhi',
    'common.delete': 'Futa',
    'common.edit': 'Hariri',
    'common.close': 'Funga',
    'common.search': 'Tafuta...',
    'common.filter': 'Chuja',
    'common.all': 'Zote',
    'common.price': 'Bei',
    'common.brand': 'Chapa',
    'common.inStock': 'Inapatikana',
    'common.outOfStock': 'Hainapatikana',
    'common.addToCart': 'Weka kwenye Kikapu',
    'common.buyNow': 'Nunua Sasa',
    'common.compare': 'Linganisha',
    'common.wishlist': 'Wishlist',
    'notification.title': 'Arifa',
    'notification.enable': 'Washa Arifa',
    'notification.disable': 'Zima Arifa',
    'notification.orderUpdates': 'Sasisho za Agizo',
    'notification.promotions': 'Mapendekezo',
    'notification.repairUpdates': 'Sasisho za Matengenezo',
    'notification.chatMessages': 'Ujumbe wa Mazungumzo',
    'language.label': 'Lugha',
    'language.english': 'Kiingereza',
    'language.swahili': 'Kiswahili',
    'language.kikuyu': 'Kikuyu',
  },
  ki: {
    'nav.home': 'Guka',
    'nav.services': 'Witumiki',
    'nav.store': 'Hati',
    'nav.booking': 'Hika Guthondeka',
    'nav.contact': 'Twana',
    'nav.about': 'Tugukurumira',
    'nav.gallery': 'Mifasio',
    'nav.reviews': 'Maoni',
    'nav.faq': 'Macio',
    'nav.admin': 'Admin',
    'nav.cart': 'Kikapu',
    'nav.wishlist': 'Wishlist',
    'hero.title': 'Guthondeka kwa Simu na Bei Njege',
    'hero.subtitle': 'Guthondeka kwa simu cia kiumbe na hati cia ubora Nairobi',
    'hero.shopDevices': 'Guraya Haci',
    'hero.repairServices': 'Witumiki wa Guthondeka',
    'services.title': 'Witumiki Waithu',
    'services.subtitle': 'Witumiki wa guthondeka cia kiumbe na waranti',
    'store.title': 'Hati ya Hatikia',
    'store.subtitle': 'Simu, tablets na laptops cia ubora',
    'store.search': 'Konyia bidhaa...',
    'store.noResults': 'Hati irio na mwandiko.',
    'store.addToCart': 'Ikira kwa Kikapu',
    'booking.title': 'Hika Guthondeka',
    'booking.subtitle': 'Ikira fomu ici na tukugutha uri ndini ya dakika 15',
    'booking.selectService': 'Thaura Witumiki',
    'booking.bookButton': 'Hika Witumiki wa Guthondeka',
    'contact.title': 'Twana Nitu',
    'about.title': 'Tugukurumira',
    'gallery.title': 'Mifasio Waitu',
    'reviews.title': 'Maoni ma Andu',
    'faq.title': 'Macio Make',
    'cart.title': 'Kikapu kia Guraya',
    'cart.empty': 'Kikapu gaku gikorirwo',
    'cart.emptyHint': 'Ongerera hati ici kuhandika.',
    'cart.continueShopping': 'Endelea Guraya',
    'cart.summary': 'Muhtasari wa Agizo',
    'cart.subtotal': 'Jumla Nini',
    'cart.shipping': 'Kuhandika',
    'cart.free': 'Wa Tiri',
    'cart.total': 'Jumla',
    'cart.checkout': 'Thiina Malipo',
    'cart.clear': 'Thutha Kikapu',
    'checkout.title': 'Malipo',
    'checkout.success': 'Agizo Rikiretwo Wega!',
    'checkout.empty': 'Gukorirwo na hati cia kulipa',
    'checkout.contact': 'Maelezo ma Kugwatana',
    'checkout.shippingAddress': 'Kiroto kia Kuhandika',
    'checkout.payment': 'Njira ya Kulipa',
    'checkout.placeOrder': 'Ikira Agizo',
    'checkout.backToHome': 'Cooka Guka',
    'checkout.continueShopping': 'Endelea Guraya',
    'checkout.summary': 'Muhtasari wa Agizo',
    'common.loading': 'Irakara...',
    'common.submit': 'Tuma',
    'common.cancel': 'Gwita',
    'common.save': 'Gakira',
    'common.delete': 'Thutha',
    'common.edit': 'Hindura',
    'common.close': 'Uga',
    'common.search': 'Konyia...',
    'common.filter': 'Thimo',
    'common.all': 'Ciothe',
    'common.price': 'Bei',
    'common.brand': 'Rika',
    'common.inStock': 'Ironi',
    'common.outOfStock': 'Ti Ironi',
    'common.addToCart': 'Ikira kwa Kikapu',
    'common.buyNow': 'Guraya Haci',
    'common.compare': 'Ranganya',
    'common.wishlist': 'Wishlist',
    'notification.title': 'Maririkanio',
    'notification.enable': 'Nyagia Maririkanio',
    'notification.disable': 'Gwita Maririkanio',
    'notification.orderUpdates': 'Sasisho cia Agizo',
    'notification.promotions': 'Makinya',
    'notification.repairUpdates': 'Sasisho cia Guthondeka',
    'notification.chatMessages': 'Ujumbe wa Mazungumzo',
    'language.label': 'Rurimi',
    'language.english': 'Kiingereza',
    'language.swahili': 'Kiswahili',
    'language.kikuyu': 'Gikuyu',
  }
};

export function useLanguage() {
  const [language, setLanguageState] = useState<Language>(() => {
    const stored = localStorage.getItem('language');
    if (stored && ['en', 'sw', 'ki'].includes(stored)) {
      return stored as Language;
    }
    return 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
  }, [language]);

  const t = useCallback((key: string, params?: Record<string, string | number>): string => {
    const lang = translations[language];
    if (typeof lang === 'object' && lang !== null && key in lang) {
      const val = lang[key];
      if (typeof val === 'string') {
        if (params) {
          return Object.entries(params).reduce<string>((acc, [k, v]) => {
            return acc.replace(`{${k}}`, String(v));
          }, val);
        }
        return val;
      }
    }

    const keys = key.split('.');
    let result: Translations | string = lang;

    for (const k of keys) {
      if (typeof result === 'object' && result !== null && k in result) {
        result = result[k] as Translations;
      } else {
        return key;
      }
    }

    if (typeof result !== 'string') return key;
    
    let finalResult: string = result;

    if (params) {
      finalResult = Object.entries(params).reduce<string>((acc, [k, v]) => {
        return acc.replace(`{${k}}`, String(v));
      }, finalResult);
    }

    return finalResult;
  }, [language]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
  }, []);

  return {
    language,
    setLanguage,
    t,
    languages: [
      { code: 'en' as Language, name: 'English', flag: '🇬🇧' },
      { code: 'sw' as Language, name: 'Swahili', flag: '🇰🇪' },
      { code: 'ki' as Language, name: 'Kikuyu', flag: '🇰🇪' },
    ]
  };
}
