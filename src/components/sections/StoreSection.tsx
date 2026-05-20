import { useState, useMemo, useEffect, useRef } from 'react';
import { products, Product } from '../../data/products';
import { Search, Scale, Heart, Star, Smartphone, Tablet, Laptop, X, ShoppingCart, Eye, Filter, ChevronDown, Sparkles, Zap, Shield, Truck, RotateCcw, Check, Plus, Minus, ArrowRight, MessageCircle } from 'lucide-react';

interface CartItem {
  product: Product;
  quantity: number;
}

const brands = ['All', 'Apple', 'Samsung', 'Xiaomi', 'Google Pixel', 'OnePlus', 'Oppo'];
const conditionFilters = [
  { value: 'all', label: 'All Conditions' },
  { value: 'new', label: '✨ Brand New' },
  { value: 'ex-uk', label: '🇬🇧 EX-UK (No Box)' },
  { value: 'refurb-boxed', label: '📦 Refurbished Boxed' },
  { value: 'refurb', label: '🔄 Refurbished' },
];
const sortOptions = [
  { value: 'default', label: 'Default' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'newest', label: 'Newest First' },
];

export const StoreSection = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeBrand, setActiveBrand] = useState('all');
  const [activeCondition, setActiveCondition] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200000]);
  const [showFilters, setShowFilters] = useState(false);
  const [wishlist, setWishlist] = useState<number[]>(() => {
    try { return JSON.parse(localStorage.getItem('wishlist') || '[]'); } catch { return []; }
  });
  const [compareList, setCompareList] = useState<number[]>([]);
  const [showCompare, setShowCompare] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>(() => {
    try { return JSON.parse(localStorage.getItem('cart') || '[]'); } catch { return []; }
  });
  const [addedToCart, setAddedToCart] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(12);
  const gridRef = useRef<HTMLDivElement>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2000); };

  const toggleWishlist = (id: number) => {
    const next = wishlist.includes(id) ? wishlist.filter(x => x !== id) : [...wishlist, id];
    setWishlist(next);
    localStorage.setItem('wishlist', JSON.stringify(next));
    showToast(wishlist.includes(id) ? 'Removed from wishlist' : 'Added to wishlist ❤️');
  };

  const toggleCompare = (id: number) => {
    if (compareList.includes(id)) { setCompareList(compareList.filter(x => x !== id)); }
    else if (compareList.length < 3) { setCompareList([...compareList, id]); }
  };

  const addToCart = (product: Product) => {
    const existing = cart.find(item => item.product.id === product.id);
    if (existing) { setCart(cart.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)); }
    else { setCart([...cart, { product, quantity: 1 }]); }
    localStorage.setItem('cart', JSON.stringify(cart));
    setAddedToCart(product.id);
    setTimeout(() => setAddedToCart(null), 1500);
    showToast(`${product.name} added to cart! 🛒`);
  };

  const filteredProducts = useMemo(() => {
    let filtered = products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.brand.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesBrand = activeBrand === 'all' || p.brand.toLowerCase() === activeBrand.toLowerCase();
      const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
      let matchesCondition = true;
      if (activeCondition === 'new') matchesCondition = p.badge === 'NEW';
      else if (activeCondition === 'ex-uk') matchesCondition = p.badge === 'EX-UK';
      else if (activeCondition === 'refurb-boxed') matchesCondition = p.badge === 'REFURBISHED BOXED';
      else if (activeCondition === 'refurb') matchesCondition = p.badge === 'REFURBISHED';
      return matchesSearch && matchesBrand && matchesPrice && matchesCondition;
    });
    if (sortBy === 'price-low') filtered.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-high') filtered.sort((a, b) => b.price - a.price);
    else if (sortBy === 'rating') filtered.sort((a, b) => b.rating - a.rating);
    else if (sortBy === 'newest') filtered.sort((a, b) => (b.badge === 'NEW' ? 1 : 0) - (a.badge === 'NEW' ? 1 : 0));
    return filtered;
  }, [searchQuery, activeBrand, activeCondition, sortBy, priceRange]);

  const inStockCount = products.filter(p => p.inStock).length;
  const newCount = products.filter(p => p.badge === 'NEW').length;
  const hotCount = products.filter(p => p.badge === 'HOT').length;
  const exUkCount = products.filter(p => p.badge === 'EX-UK').length;
  const refurbCount = products.filter(p => p.badge === 'REFURBISHED BOXED').length;
  const compareProducts = products.filter(p => compareList.includes(p.id));
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'NEW': return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-blue-500/30';
      case 'HOT': return 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-red-500/30';
      case 'SALE': return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-green-500/30';
      case 'EX-UK': return 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-purple-500/30';
      case 'REFURBISHED BOXED': return 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-amber-500/30';
      case 'REFURBISHED': return 'bg-gradient-to-r from-teal-500 to-green-500 text-white shadow-teal-500/30';
      default: return 'bg-slate-600 text-white';
    }
  };

  const getBrandGradient = (brand: string) => {
    switch (brand) {
      case 'Apple': return 'from-gray-600 to-gray-800';
      case 'Samsung': return 'from-blue-600 to-blue-800';
      case 'Xiaomi': return 'from-orange-500 to-orange-700';
      case 'Google Pixel': return 'from-green-500 to-green-700';
      case 'OnePlus': return 'from-red-500 to-red-700';
      case 'Oppo': return 'from-teal-500 to-teal-700';
      default: return 'from-slate-600 to-slate-800';
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Toast notification */}
      {toast && (
        <div className="fixed top-24 right-4 z-[200] bg-slate-800 border border-amber-500/30 text-white px-5 py-3 rounded-xl shadow-2xl shadow-amber-500/10 flex items-center gap-2 animate-slide-up">
          <Check className="w-4 h-4 text-green-400" />
          <span className="text-sm font-medium">{toast}</span>
        </div>
      )}

      {/* Hero banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-amber-600 via-amber-500 to-orange-500 pt-28 pb-8">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-white rounded-full blur-3xl animate-float-delayed"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-1.5 rounded-full text-sm font-medium">
                  <Sparkles className="w-4 h-4" />
                  {inStockCount} Products
                </span>
                {newCount > 0 && (
                  <span className="inline-flex items-center gap-2 bg-blue-500/30 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-medium">
                    ✨ {newCount} New
                  </span>
                )}
                {exUkCount > 0 && (
                  <span className="inline-flex items-center gap-2 bg-purple-500/30 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-medium">
                    🇬🇧 {exUkCount} EX-UK
                  </span>
                )}
                {refurbCount > 0 && (
                  <span className="inline-flex items-center gap-2 bg-amber-500/30 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-medium">
                    📦 {refurbCount} Refurb Boxed
                  </span>
                )}
                {hotCount > 0 && (
                  <span className="inline-flex items-center gap-2 bg-red-500/30 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-medium">
                    🔥 {hotCount} Hot
                  </span>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2">
                Phone <span className="text-yellow-200">Store</span>
              </h1>
              <p className="text-amber-100 text-lg">Brand New, EX-UK & Refurbished iPhones, Samsung & more. Quality guaranteed.</p>
            </div>
            <div className="flex items-center gap-4">
              <a href="https://wa.me/254703555449" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-white text-amber-700 px-6 py-3 rounded-2xl font-bold hover:bg-amber-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                <MessageCircle className="w-5 h-5" />
                WhatsApp
              </a>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-3 text-white text-center">
                <div className="text-2xl font-bold">{cartCount}</div>
                <div className="text-xs text-amber-100">Cart Items</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Trust badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { icon: <Shield className="w-5 h-5" />, text: 'Warranty Included', color: 'text-amber-400' },
            { icon: <Truck className="w-5 h-5" />, text: 'Free Nairobi Delivery', color: 'text-blue-400' },
            { icon: <Zap className="w-5 h-5" />, text: 'Same Day Service', color: 'text-yellow-400' },
            { icon: <RotateCcw className="w-5 h-5" />, text: '7-Day Returns', color: 'text-green-400' },
          ].map((badge, i) => (
            <div key={i} className="flex items-center gap-3 bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 group hover:border-amber-500/30 transition-all duration-300">
              <span className={`${badge.color} group-hover:scale-110 transition-transform duration-300`}>{badge.icon}</span>
              <span className="text-slate-300 text-sm font-medium">{badge.text}</span>
            </div>
          ))}
        </div>

        {/* M-Pesa payment bar */}
        <div className="bg-gradient-to-r from-green-600/20 via-green-500/10 to-green-600/20 border border-green-500/20 rounded-2xl p-5 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Pay with M-Pesa</h3>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-slate-300">Paybill: <strong className="text-green-400">714888</strong></span>
                  <span className="text-slate-300">Account: <strong className="text-green-400">169405</strong></span>
                </div>
              </div>
            </div>
            <div className="text-xs text-slate-400 text-center md:text-right">
              <p>📍 Stan Bank Building, Moi Avenue, Floor 3 Room 10</p>
              <p>📧 alphamobitech767@gmail.com | 🕐 7AM - 8PM</p>
            </div>
          </div>
        </div>

        {/* Search and filters bar */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input type="text" placeholder="Search phones, tablets, laptops..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-700 text-white rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 placeholder-slate-500 transition-all duration-300" />
            </div>
            <div className="flex gap-3">
              <div className="relative">
                <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-3 bg-slate-900/50 border border-slate-700 text-white rounded-xl focus:border-amber-500 cursor-pointer">
                  {sortOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
              </div>
              <button onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all duration-300 ${showFilters ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-slate-900/50 border-slate-700 text-slate-300 hover:border-slate-600'}`}>
                <Filter className="w-4 h-4" />
                Filters
              </button>
              {compareList.length > 0 && (
                <button onClick={() => setShowCompare(true)} className="flex items-center gap-2 px-4 py-3 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-xl hover:bg-amber-500/20 transition-all duration-300">
                  <Scale className="w-4 h-4" />
                  Compare ({compareList.length})
                </button>
              )}
            </div>
          </div>

          {/* Extended filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-slate-700/50 grid md:grid-cols-3 gap-4 animate-slide-in-up">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Price Range (KSh)</label>
                <div className="flex items-center gap-3">
                  <input type="number" value={priceRange[0]} onChange={e => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])} className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white text-sm" placeholder="Min" />
                  <span className="text-slate-500">—</span>
                  <input type="number" value={priceRange[1]} onChange={e => setPriceRange([priceRange[0], parseInt(e.target.value) || 200000])} className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white text-sm" placeholder="Max" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Condition</label>
                <div className="flex flex-wrap gap-2">
                  {['All', 'Brand New', 'EX-UK', 'Refurbished'].map(cond => (
                    <button key={cond} className="px-3 py-1.5 bg-slate-900/50 border border-slate-700 rounded-lg text-xs text-slate-300 hover:border-amber-500/30 hover:text-amber-400 transition-all">{cond}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Storage</label>
                <div className="flex flex-wrap gap-2">
                  {['All', '64GB', '128GB', '256GB', '512GB', '1TB'].map(storage => (
                    <button key={storage} className="px-3 py-1.5 bg-slate-900/50 border border-slate-700 rounded-lg text-xs text-slate-300 hover:border-amber-500/30 hover:text-amber-400 transition-all">{storage}</button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Condition filter pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {conditionFilters.map(cond => {
            const isActive = activeCondition === cond.value;
            let count = 0;
            if (cond.value === 'all') count = products.length;
            else if (cond.value === 'new') count = products.filter(p => p.badge === 'NEW').length;
            else if (cond.value === 'ex-uk') count = products.filter(p => p.badge === 'EX-UK').length;
            else if (cond.value === 'refurb-boxed') count = products.filter(p => p.badge === 'REFURBISHED BOXED').length;
            else if (cond.value === 'refurb') count = products.filter(p => p.badge === 'REFURBISHED').length;
            return (
              <button key={cond.value} onClick={() => setActiveCondition(cond.value)}
                className={`group relative px-4 py-2 rounded-full font-medium text-xs transition-all duration-300 ${isActive ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/25 scale-105' : 'bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/50 border border-slate-700/50 hover:border-slate-600'}`}>
                {cond.label}
                <span className={`ml-1 text-[10px] ${isActive ? 'text-amber-200' : 'text-slate-500'}`}>({count})</span>
              </button>
            );
          })}
        </div>

        {/* Brand filter pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {brands.map(brand => {
            const isActive = brand === 'All' ? activeBrand === 'all' : activeBrand === brand.toLowerCase();
            const count = brand === 'All' ? products.length : products.filter(p => p.brand === brand).length;
            return (
              <button key={brand} onClick={() => setActiveBrand(brand === 'All' ? 'all' : brand.toLowerCase())}
                className={`group relative px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-300 ${isActive ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/25 scale-105' : 'bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/50 border border-slate-700/50 hover:border-slate-600'}`}>
                {brand}
                <span className={`ml-1.5 text-xs ${isActive ? 'text-amber-200' : 'text-slate-500'}`}>({count})</span>
              </button>
            );
          })}
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-slate-400 text-sm">Showing <strong className="text-white">{Math.min(visibleCount, filteredProducts.length)}</strong> of <strong className="text-white">{filteredProducts.length}</strong> products</p>
        </div>

        {/* Product grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-slate-800/30 rounded-3xl border border-slate-700/30">
            <Search className="w-20 h-20 text-slate-700 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">No products found</h3>
            <p className="text-slate-400 mb-6">Try adjusting your search or filters</p>
            <button onClick={() => { setSearchQuery(''); setActiveBrand('all'); setPriceRange([0, 200000]); }} className="px-6 py-3 bg-amber-500 text-white rounded-xl font-medium hover:bg-amber-600 transition-all">Clear All Filters</button>
          </div>
        ) : (
          <div ref={gridRef} className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredProducts.slice(0, visibleCount).map((product, index) => (
              <div key={product.id}
                className={`group bg-slate-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-slate-700/50 hover:border-amber-500/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-500/5 ${!product.inStock ? 'opacity-60' : ''}`}
                style={{ animationDelay: `${index * 50}ms` }}>

                {/* Image area */}
                <div className="relative h-56 bg-gradient-to-br from-slate-700/50 to-slate-800/50 overflow-hidden">
                  <img src={product.image} alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />

                  {/* Fallback icon */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    {product.category === 'phone' && <Smartphone className="w-16 h-16 text-slate-600/50" />}
                    {product.category === 'tablet' && <Tablet className="w-16 h-16 text-slate-600/50" />}
                    {product.category === 'laptop' && <Laptop className="w-16 h-16 text-slate-600/50" />}
                  </div>

                  {/* Hover overlay with actions */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end justify-center pb-4 gap-2">
                    <button onClick={() => setQuickViewProduct(product)} className="p-2.5 bg-white/10 backdrop-blur-sm rounded-xl text-white hover:bg-white/20 transition-all duration-300 hover:scale-110" title="Quick View">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button onClick={() => toggleWishlist(product.id)} className={`p-2.5 backdrop-blur-sm rounded-xl transition-all duration-300 hover:scale-110 ${wishlist.includes(product.id) ? 'bg-red-500/30 text-red-400' : 'bg-white/10 text-white hover:bg-white/20'}`} title="Wishlist">
                      <Heart className={`w-4 h-4 ${wishlist.includes(product.id) ? 'fill-current' : ''}`} />
                    </button>
                    <button onClick={() => toggleCompare(product.id)} className={`p-2.5 backdrop-blur-sm rounded-xl transition-all duration-300 hover:scale-110 ${compareList.includes(product.id) ? 'bg-amber-500/30 text-amber-400' : 'bg-white/10 text-white hover:bg-white/20'}`} title="Compare">
                      <Scale className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Badge */}
                  {product.badge && (
                    <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold shadow-lg ${getBadgeColor(product.badge)} animate-bounce-in`}>
                      {product.badge}
                    </span>
                  )}

                  {/* Stock status */}
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-slate-900/70 flex items-center justify-center">
                      <span className="bg-red-500/90 text-white px-4 py-2 rounded-full text-sm font-bold">SOLD OUT</span>
                    </div>
                  )}

                  {/* Brand gradient bar */}
                  <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${getBrandGradient(product.brand)}`}></div>
                </div>

                {/* Content */}
                <div className="p-4">
                  {/* Brand and rating */}
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-lg bg-gradient-to-r ${getBrandGradient(product.brand)} text-white`}>{product.brand}</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span className="text-xs text-slate-400 font-medium">{product.rating}</span>
                      <span className="text-xs text-slate-600">({product.reviews})</span>
                    </div>
                  </div>

                  {/* Name */}
                  <h3 className="font-bold text-white mb-2 text-sm leading-tight line-clamp-2 min-h-[2.5rem] group-hover:text-amber-400 transition-colors duration-300">{product.name}</h3>

                  {/* Specs preview */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {product.specs.slice(0, 3).map((spec, i) => (
                      <span key={i} className="text-[10px] text-slate-500 bg-slate-700/50 px-2 py-0.5 rounded-md">{spec}</span>
                    ))}
                  </div>

                  {/* Features */}
                  {product.features.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {product.features.slice(0, 2).map((feature, i) => (
                        <span key={i} className="text-[10px] text-green-400 flex items-center gap-0.5">
                          <Check className="w-2.5 h-2.5" />{feature}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Price */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xl font-extrabold text-amber-400">KSh {product.price.toLocaleString()}</span>
                    {product.originalPrice && (
                      <span className="text-xs text-slate-500 line-through">KSh {product.originalPrice.toLocaleString()}</span>
                    )}
                  </div>

                  {/* Add to cart button */}
                  <button onClick={() => product.inStock && addToCart(product)} disabled={!product.inStock}
                    className={`w-full py-3 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 ${product.inStock ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 hover:-translate-y-0.5 active:translate-y-0' : 'bg-slate-700 text-slate-500 cursor-not-allowed'}`}>
                    {addedToCart === product.id ? (
                      <><Check className="w-4 h-4" /> Added!</>
                    ) : product.inStock ? (
                      <><ShoppingCart className="w-4 h-4" /> Add to Cart</>
                    ) : (
                      'Out of Stock'
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load more */}
        {visibleCount < filteredProducts.length && (
          <div className="text-center mt-10">
            <button onClick={() => setVisibleCount(prev => prev + 12)}
              className="px-8 py-3 bg-slate-800 border border-slate-700 text-white rounded-xl font-medium hover:border-amber-500/30 hover:bg-slate-700 transition-all duration-300">
              Load More Products ({filteredProducts.length - visibleCount} remaining)
            </button>
          </div>
        )}

        {/* Help section */}
        <div className="mt-12 bg-gradient-to-r from-green-600/10 via-green-500/5 to-green-600/10 border border-green-500/20 rounded-2xl p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-green-500/20 rounded-2xl flex items-center justify-center">
                <MessageCircle className="w-7 h-7 text-green-400" />
              </div>
              <div>
                <h4 className="font-bold text-white text-lg">Need Help Choosing?</h4>
                <p className="text-sm text-slate-400">Get personalized recommendations from our experts</p>
              </div>
            </div>
            <a href="https://wa.me/254703555449?text=Hi,%20I%20need%20help%20choosing%20a%20phone" target="_blank" rel="noopener noreferrer"
              className="px-6 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-500 transition-all duration-300 shadow-lg shadow-green-500/20 hover:shadow-green-500/40 hover:-translate-y-0.5 flex items-center gap-2">
              <MessageCircle className="w-4 h-4" /> WhatsApp Us <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>


      {/* Quick View Modal */}
      {quickViewProduct && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-fade-in" onClick={() => setQuickViewProduct(null)}>
          <div className="bg-slate-800 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-slate-700/50 shadow-2xl animate-zoom-in" onClick={e => e.stopPropagation()}>
            <div className="grid md:grid-cols-2 gap-0">
              {/* Image */}
              <div className="relative h-72 md:h-full bg-gradient-to-br from-slate-700 to-slate-800 rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none overflow-hidden">
                <img src={quickViewProduct.image} alt={quickViewProduct.name} className="w-full h-full object-cover" onError={(e) => {(e.target as HTMLImageElement).style.display='none';}} />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  {quickViewProduct.category==='phone' && <Smartphone className="w-20 h-20 text-slate-600/50" />}
                  {quickViewProduct.category==='tablet' && <Tablet className="w-20 h-20 text-slate-600/50" />}
                  {quickViewProduct.category==='laptop' && <Laptop className="w-20 h-20 text-slate-600/50" />}
                </div>
                {quickViewProduct.badge && (
                  <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold shadow-lg ${getBadgeColor(quickViewProduct.badge)}`}>{quickViewProduct.badge}</span>
                )}
                <button onClick={() => setQuickViewProduct(null)} className="absolute top-4 right-4 p-2 bg-slate-900/60 backdrop-blur rounded-full text-white hover:bg-slate-900/80 transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>
              {/* Details */}
              <div className="p-6 md:p-8">
                <span className={`inline-block text-xs font-bold px-3 py-1 rounded-lg bg-gradient-to-r ${getBrandGradient(Product.name)} text-white mb-3`}>{quickViewProduct.brand}</span>
                <h2 className="text-2xl font-bold text-white mb-2">{quickViewProduct.name}</h2>
                <p className="text-slate-400 text-sm mb-4">{quickViewProduct.description}</p>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">{[...Array(5)].map((_,i) => <Star key={i} className={`w-4 h-4 ${i<Math.floor(quickViewProduct.rating)?'text-amber-400 fill-amber-400':'text-slate-600'}`} />)}</div>
                  <span className="text-sm text-slate-400">{quickViewProduct.rating} ({quickViewProduct.reviews} reviews)</span>
                </div>
                <div className="text-3xl font-extrabold text-amber-400 mb-4">KSh {quickViewProduct.price.toLocaleString()}</div>
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-slate-300 mb-2">Specifications</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {quickViewProduct.specs.map((spec,i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-slate-400 bg-slate-700/30 rounded-lg px-3 py-2">
                        <Check className="w-3 h-3 text-green-400" />{spec}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-slate-300 mb-2">Features</h4>
                  <div className="flex flex-wrap gap-2">
                    {quickViewProduct.features.map((f,i) => (
                      <span key={i} className="text-xs text-green-400 bg-green-500/10 px-3 py-1 rounded-full">{f}</span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => { addToCart(quickViewProduct); setQuickViewProduct(null); }}
                    disabled={!quickViewProduct.inStock}
                    className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-bold hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg shadow-amber-500/20 disabled:opacity-40 flex items-center justify-center gap-2">
                    <ShoppingCart className="w-4 h-4" /> Add to Cart
                  </button>
                  <button onClick={() => toggleWishlist(quickViewProduct.id)}
                    className={`p-3 rounded-xl border transition-all ${wishlist.includes(quickViewProduct.id) ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-slate-700/50 border-slate-600 text-slate-400 hover:text-red-400'}`}>
                    <Heart className={`w-5 h-5 ${wishlist.includes(quickViewProduct.id) ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Compare Modal */}
      {showCompare && compareProducts.length > 0 && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-fade-in" onClick={() => setShowCompare(false)}>
          <div className="bg-slate-800 rounded-3xl p-6 max-w-5xl w-full max-h-[90vh] overflow-y-auto border border-slate-700/50 shadow-2xl animate-zoom-in" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">Compare Products</h3>
              <button onClick={() => setShowCompare(false)} className="p-2 hover:bg-slate-700 rounded-xl text-slate-400 transition-all"><X className="w-5 h-5" /></button>
            </div>
            <div className={`grid gap-4 ${compareProducts.length === 1 ? 'grid-cols-1' : compareProducts.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
              {compareProducts.map(p => (
                <div key={p.id} className="bg-slate-700/30 rounded-2xl p-5 relative border border-slate-700/50 hover:border-amber-500/20 transition-all">
                  <button onClick={() => toggleCompare(p.id)} className="absolute top-3 right-3 p-1.5 bg-slate-700 rounded-full text-slate-400 hover:text-white transition-all"><X className="w-3 h-3" /></button>
                  <div className="h-36 bg-slate-700/50 rounded-xl flex items-center justify-center mb-4">
                    {p.category==='phone' && <Smartphone className="w-16 h-16 text-slate-500" />}
                    {p.category==='tablet' && <Tablet className="w-16 h-16 text-slate-500" />}
                    {p.category==='laptop' && <Laptop className="w-16 h-16 text-slate-500" />}
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded bg-gradient-to-r ${getBrandGradient(p.brand)} text-white`}>{p.brand}</span>
                  <h4 className="font-bold text-white text-sm mt-2 mb-1">{p.name}</h4>
                  <p className="text-xl font-extrabold text-amber-400 mb-3">KSh {p.price.toLocaleString()}</p>
                  <div className="space-y-1.5 text-xs mb-4">
                    {p.specs.map((spec,i) => (
                      <div key={i} className="flex items-center gap-2 text-slate-400"><Check className="w-3 h-3 text-green-400 flex-shrink-0" />{spec}</div>
                    ))}
                  </div>
                  <button onClick={() => addToCart(p)} className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl text-sm font-bold hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2">
                    <ShoppingCart className="w-3 h-3" /> Add to Cart
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
