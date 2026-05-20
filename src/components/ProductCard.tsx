import { useState } from 'react';
import { Card, Button, Badge } from '../design-system';
import { useLanguage } from '../hooks/useLanguage';
import { Heart, Star, ShoppingCart, Check, Eye } from 'lucide-react';
import type { Product } from '../types';

const ProductCard = ({
  product,
  onAddToCart,
  onAddToWishlist,
  isInWishlist,
}: {
  product: Product;
  onAddToCart: () => void;
  onAddToWishlist: () => void;
  isInWishlist: boolean;
}) => {
  const { t } = useLanguage();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    onAddToCart();
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'NEW': return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white';
      case 'HOT': return 'bg-gradient-to-r from-red-500 to-orange-500 text-white';
      case 'SALE': return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white';
      case 'EX-UK': return 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white';
      case 'REFURBISHED BOXED': return 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white';
      default: return 'bg-slate-600 text-white';
    }
  };

  return (
    <Card hoverable padding="none" className="overflow-hidden group transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-500/10 border border-slate-200 hover:border-amber-300">
      <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/images/phones/iphone-15.png';
          }}
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end justify-center pb-4 gap-2">
          <button onClick={onAddToWishlist} className={`p-2 backdrop-blur-sm rounded-xl transition-all duration-300 hover:scale-110 ${isInWishlist ? 'bg-red-500/30 text-red-400' : 'bg-white/20 text-white hover:bg-white/30'}`}>
            <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-current' : ''}`} />
          </button>
        </div>
        {product.badge && (
          <Badge variant="success" className={`absolute top-3 left-3 ${getBadgeColor(product.badge)} shadow-lg animate-bounce-in`}>
            {product.badge}
          </Badge>
        )}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-1">
          <div className="text-sm text-gray-500 font-medium">{product.brand}</div>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span className="text-xs text-gray-500">{product.rating}</span>
          </div>
        </div>
        <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-amber-600 transition-colors duration-300 line-clamp-2 min-h-[2.5rem]">{product.name}</h3>
        <div className="flex flex-wrap gap-1 mb-3">
          {product.specs.slice(0, 2).map((spec, i) => (
            <span key={i} className="text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">{spec}</span>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-extrabold text-gray-900">KSh {product.price.toLocaleString()}</span>
            {product.originalPrice && (
              <span className="ml-2 text-sm text-gray-400 line-through">KSh {product.originalPrice.toLocaleString()}</span>
            )}
          </div>
          <Button onClick={handleAdd} size="sm" className={`transition-all duration-300 ${added ? 'bg-green-500 hover:bg-green-600' : ''}`}>
            {added ? <><Check className="w-4 h-4 mr-1" /> Added</> : <><ShoppingCart className="w-4 h-4 mr-1" /> {t('store.addToCart')}</>}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;
