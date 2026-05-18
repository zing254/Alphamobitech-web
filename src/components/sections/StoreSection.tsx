import { useState, useMemo } from 'react';
import { products, Product } from '../../data/products';
import { Search, Scale, Heart, Star, Smartphone, Tablet, Laptop, X, ShoppingCart } from 'lucide-react';

interface CartItem {
  product: Product;
  quantity: number;
}

const brands = ['All', 'Apple', 'Samsung', 'Xiaomi', 'Google Pixel', 'OnePlus', 'Oppo'];

export const StoreSection = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeBrand, setActiveBrand] = useState('all');
  const [wishlist, setWishlist] = useState<number[]>(() => {
    try { return JSON.parse(localStorage.getItem('wishlist') || '[]'); } catch { return []; }
  });
  const [compareList, setCompareList] = useState<number[]>([]);
  const [showCompare, setShowCompare] = useState(false);
  const [cart, setCart] = useState<CartItem[]>(() => {
    try { return JSON.parse(localStorage.getItem('cart') || '[]'); } catch { return []; }
  });

  const toggleWishlist = (id: number) => {
    const next = wishlist.includes(id) ? wishlist.filter(x => x !== id) : [...wishlist, id];
    setWishlist(next);
    localStorage.setItem('wishlist', JSON.stringify(next));
  };

  const toggleCompare = (id: number) => {
    if (compareList.includes(id)) {
      setCompareList(compareList.filter(x => x !== id));
    } else if (compareList.length < 3) {
      setCompareList([...compareList, id]);
    }
  };

  const addToCart = (product: Product) => {
    const existing = cart.find(item => item.product.id === product.id);
    if (existing) {
      setCart(cart.map(item =>
        item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
    localStorage.setItem('cart', JSON.stringify(cart));
  };

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           p.brand.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesBrand = activeBrand === 'all' || p.brand.toLowerCase() === activeBrand.toLowerCase();
      return matchesSearch && matchesBrand;
    });
  }, [searchQuery, activeBrand]);

  const inStockCount = products.filter(p => p.inStock).length;
  const newCount = products.filter(p => p.badge === 'NEW').length;
  const hotCount = products.filter(p => p.badge === 'HOT').length;
  const compareProducts = products.filter(p => compareList.includes(p.id));

  return (
    <section className="py-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 pt-24">
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-2 bg-green-500/10 text-green-400 px-4 py-1.5 rounded-full text-sm font-medium mb-3">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            {inStockCount} Products In Stock
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-3">
            Phone <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Store</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Best deals on iPhone, Samsung, Redmi & more. Quality guaranteed with warranty.
          </p>
        </div>

        <div className="bg-gradient-to-r from-amber-600 to-amber-700 rounded-2xl p-6 mb-8 text-white shadow-xl shadow-amber-900/30">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center">
                <ShoppingCart className="w-7 h-7" />
              </div>
               <div>
                 <h3 className="text-xl font-bold">M-Pesa Payment</h3>
                 <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 mt-1">
                   <div>
                     <span className="text-amber-200 text-sm">Paybill:</span>
                     <span className="font-bold text-lg ml-2">714888</span>
                   </div>
                   <div>
                     <span className="text-amber-200 text-sm">Account:</span>
                     <span className="font-bold text-lg ml-2">169405</span>
                   </div>
                 </div>
                 <div className="mt-4 p-3 bg-amber-500/10 rounded-lg">
                   <p className="text-amber-200 text-sm mb-1"><strong>Location:</strong> Stan Bank Building, Moi Avenue, Across Archives Floor 3 Room 10</p>
                   <p className="text-amber-200 text-sm mb-1"><strong>Email:</strong> alphamobitech767@gmail.com</p>
                   <p className="text-amber-200 text-sm"><strong>Hours:</strong> 7AM - 8PM</p>
                 </div>
               </div>
              <div className="bg-white/10 rounded-xl px-4 py-2 text-sm font-medium whitespace-nowrap">
                Pay via Lipa Na M-Pesa
              </div>
            </div>
          </div>
        </div>

        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-8 flex items-start gap-3">
          <span className="text-2xl flex-shrink-0">*</span>
          <p className="text-amber-300 font-medium text-sm">
            Always confirm availability and price before ordering. Stock and prices may change without notice. Contact us on WhatsApp for real-time availability.
          </p>
        </div>

        {(newCount > 0 || hotCount > 0) && (
          <div className="flex flex-wrap gap-3 mb-6 justify-center">
            {newCount > 0 && (
              <span className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 px-4 py-2 rounded-full text-sm font-medium">
                {newCount} New Arrivals
              </span>
            )}
            {hotCount > 0 && (
              <span className="inline-flex items-center gap-2 bg-red-500/10 text-red-400 px-4 py-2 rounded-full text-sm font-medium">
                {hotCount} Hot Deals
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
              className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 text-white rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 placeholder-slate-500"
            />
          </div>
          <div className="flex items-center gap-3">
            {compareList.length > 0 && (
              <button onClick={() => setShowCompare(true)} className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 text-amber-400 rounded-lg hover:bg-amber-500/20 transition-colors">
                <Scale className="w-4 h-4" />
                Compare ({compareList.length})
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {brands.map(brand => (
            <button
              key={brand}
              onClick={() => setActiveBrand(brand === 'All' ? 'all' : brand.toLowerCase())}
              className={`px-5 py-2.5 rounded-full font-medium transition-all shadow-sm ${
                (brand === 'All' ? activeBrand === 'all' : activeBrand === brand.toLowerCase())
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-amber-900/30'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
              }`}
            >
              {brand}
            </button>
          ))}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-slate-800 rounded-2xl shadow-lg border border-slate-700/50">
            <Search className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No products found</h3>
            <p className="text-slate-400">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredProducts.map(product => (
              <div key={product.id} className={`bg-slate-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl border border-slate-700/50 transition-all duration-300 hover:-translate-y-1 group ${!product.inStock ? 'opacity-60' : ''}`}>
                <div className="h-52 bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center relative overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  {product.category === 'phone' && <Smartphone className="w-16 h-16 text-slate-600 absolute" />}
                  {product.category === 'tablet' && <Tablet className="w-16 h-16 text-slate-600 absolute" />}
                  {product.category === 'laptop' && <Laptop className="w-16 h-16 text-slate-600 absolute" />}

                  {product.badge && (
                    <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold shadow-lg ${
                      product.badge === 'NEW' ? 'bg-blue-500 text-white' :
                      product.badge === 'HOT' ? 'bg-red-500 text-white' :
                      'bg-slate-600 text-white'
                    }`}>
                      {product.badge}
                    </span>
                  )}

                  {!product.inStock && (
                    <span className="absolute top-3 right-12 px-3 py-1 rounded-full text-xs font-bold bg-slate-700 text-slate-300">
                      SOLD OUT
                    </span>
                  )}

                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="absolute top-3 right-3 p-2 bg-slate-900/60 backdrop-blur rounded-full shadow-md hover:scale-110 transition-transform"
                  >
                    <Heart className={`w-4 h-4 ${wishlist.includes(product.id) ? 'fill-red-500 text-red-500' : 'text-slate-400'}`} />
                  </button>
                </div>

                <div className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                      product.brand === 'Apple' ? 'bg-slate-700 text-slate-300' :
                      product.brand === 'Samsung' ? 'bg-blue-500/10 text-blue-400' :
                      'bg-orange-500/10 text-orange-400'
                    }`}>
                      {product.brand}
                    </span>
                  </div>
                  <h3 className="font-bold text-white mb-1 text-sm leading-tight line-clamp-2 min-h-[2.5rem]">{product.name}</h3>

                  <div className="flex items-center gap-1.5 mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`} />
                      ))}
                    </div>
                    <span className="text-xs text-slate-500">({product.reviews})</span>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg font-bold text-amber-400">KSh {product.price.toLocaleString()}</span>
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
                      className="p-2.5 bg-slate-700 rounded-xl hover:bg-slate-600 disabled:opacity-30 transition-colors"
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

        <div className="mt-12 bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-700/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-green-400" />
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
              className="px-6 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-500 transition-colors shadow-md"
            >
              WhatsApp Us
            </a>
          </div>
        </div>

        {showCompare && compareProducts.length > 0 && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={() => setShowCompare(false)}>
            <div className="bg-slate-800 rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-700/50" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">Compare Products</h3>
                <button onClick={() => setShowCompare(false)} className="p-2 hover:bg-slate-700 rounded-lg text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {compareProducts.map(p => (
                  <div key={p.id} className="border border-slate-700 rounded-xl p-4 relative bg-slate-800/50">
                    <button onClick={() => toggleCompare(p.id)} className="absolute top-2 right-2 p-1 bg-slate-700 rounded-full text-slate-400">
                      <X className="w-4 h-4" />
                    </button>
                    <div className="h-32 bg-slate-700 rounded-lg flex items-center justify-center mb-4">
                      {p.category === 'phone' && <Smartphone className="w-16 h-16 text-slate-500" />}
                      {p.category === 'tablet' && <Tablet className="w-16 h-16 text-slate-500" />}
                      {p.category === 'laptop' && <Laptop className="w-16 h-16 text-slate-500" />}
                    </div>
                    <h4 className="font-bold text-white text-sm mb-1">{p.name}</h4>
                    <p className="text-lg font-bold text-amber-400 mb-3">KSh {p.price.toLocaleString()}</p>
                    <div className="space-y-1.5 text-xs">
                      {p.specs.map((spec, i) => (
                        <div key={i} className="flex justify-between text-slate-400">
                          <span>{spec}</span>
                        </div>
                      ))}
                    </div>
                    <button onClick={() => { addToCart(p); }} className="w-full mt-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-500">
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
