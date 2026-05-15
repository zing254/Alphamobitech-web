import { Card, Button, Badge } from '../design-system';
import { useLanguage } from '../hooks/useLanguage';
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
  return (
    <Card hoverable padding="none" className="overflow-hidden group">
      <div className="relative aspect-square bg-gray-100">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/images/phones/iphone-15.png';
          }}
        />
        {product.badge && (
          <Badge variant="success" className="absolute top-3 left-3">
            {product.badge}
          </Badge>
        )}
        <button
          onClick={onAddToWishlist}
          className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
        >
          <svg className={`w-5 h-5 ${isInWishlist ? 'text-red-500 fill-red-500' : 'text-gray-600'}`} fill={isInWishlist ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>
      <div className="p-4">
        <div className="text-sm text-gray-500 mb-1">{product.brand}</div>
        <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
        <div className="flex items-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
          <span className="text-sm text-gray-500">({product.reviews})</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-bold text-gray-900">KSh {product.price.toLocaleString()}</span>
            {product.originalPrice && (
              <span className="ml-2 text-sm text-gray-500 line-through">
                KSh {product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
          <Button onClick={onAddToCart} size="sm">
            {t('store.addToCart')}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;