import { useState, useMemo } from 'react';
import { products } from '../../data/products';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useWishlist };
import { useLanguage } from '../../hooks/useLanguage';
import ProductCard from '../ProductCard';

const brands = ['All', 'Apple', 'Samsung', 'Xiaomi', 'Google Pixel', 'OnePlus', 'Oppo'];
const categories = ['All', 'phone', 'tablet', 'laptop'];

export const StoreSection = () => {
  return <div style={{color: 'red', fontSize: '40px', textAlign: 'center', padding: '20px'}}>STORE SECTION IS WORKING</div>;
};

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-white to-amber-50/30 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 pt-28">
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-sm font-medium mb-3">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            {inStockCount} Products In Stock
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-800 mb-3">
            Phone <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-700">Store</span>
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Best deals on iPhone, Samsung, Redmi & more. Quality guaranteed with warranty.
          </p>
        </div>

        <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl p-6 mb-8 text-white shadow-xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
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
              <div className="bg-white/20 rounded-xl px-4 py-2 text-sm font-medium whitespace-nowrap">
                Pay via Lipa Na M-Pesa
              </div>
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
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search phones, tablets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200 bg-white"
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
                  : 'bg-white text-slate-700 hover:bg-amber-50 hover:text-amber-600 border border-slate-200'
              }`}
            >
              <span className="mr-1.5">{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
            <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-800 mb-2">No products found</h3>
            <p className="text-slate-500">Try adjusting your search or filters</p>
          )
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredProducts.map(product => (
              <div key={product.id} className={`bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group ${!product.inStock ? 'opacity-70' : ''}`}>
                <div className="h-52 bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center relative overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
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
                    className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur rounded-full shadow-md hover:scale-110 transition-transform"
                  >
                    <Heart className={`w-4 h-4 ${wishlist.includes(product.id) ? 'fill-red-500 text-red-500' : 'text-slate-400'}`} />
                  </button>
                </div>
                
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                      product.brand === 'Apple' ? 'bg-slate-100 text-slate-600' :
                      product.brand === 'Samsung' ? 'bg-blue-50 text-blue-600' :
                      'bg-orange-50 text-orange-600'
                    }`}>
                      {product.brand}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-800 mb-1 text-sm leading-tight line-clamp-2 min-h-[2.5rem]">{product.name}</h3>
                  
                  <div className="flex items-center gap-1.5 mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
                      ))}
                    </div>
                    <span className="text-xs text-slate-400">({product.reviews})</span>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg font-bold text-amber-600">KSh {product.price.toLocaleString()}</span>
                    {product.originalPrice && (
                      <span className="text-xs text-slate-400 line-through">KSh {product.originalPrice.toLocaleString()}</span>
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
                      className="p-2.5 bg-slate-50 rounded-xl hover:bg-slate-100 disabled:opacity-30 transition-colors"
                      title="Compare"
                    >
                      <Scale className="w-4 h-4 text-slate-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Phone className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800">Need Help Choosing?</h4>
                <p className="text-sm text-slate-500">Contact us for personalized recommendations</p>
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
            <div className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-800">Compare Products</h3>
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
                    <div className="h-32 bg-slate-50 rounded-lg flex items-center justify-center mb-4">
                      {p.category === 'phone' && <Smartphone className="w-16 h-16 text-slate-300" />}
                      {p.category === 'tablet' && <Tablet className="w-16 h-16 text-slate-300" />}
                      {p.category === 'laptop' && <Laptop className="w-16 h-16 text-slate-300" />}
                    </div>
                    <h4 className="font-bold text-slate-800 text-sm mb-1">{p.name}</h4>
                    <p className="text-lg font-bold text-amber-600 mb-3">KSh {p.price.toLocaleString()}</p>
                    <div className="space-y-1.5 text-xs">
                      {p.specs.map((spec, i) => (
                        <div key={i} className="flex justify-between text-slate-600">
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
          )}
        </div>
      </div>
    </section>
  );
};


