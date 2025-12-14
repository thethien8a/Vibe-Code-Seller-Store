import React from 'react';
import { Product } from '../types';
import { Plus, Heart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <div className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-primary-100 h-full flex flex-col">
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img 
          src={product.image} 
          alt={product.name} 
          className="h-full w-full object-cover object-center group-hover:scale-110 transition-transform duration-500" 
        />
        {product.isBestSeller && (
          <span className="absolute top-3 left-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
            Bán chạy
          </span>
        )}
        <button className="absolute top-3 right-3 p-2 rounded-full bg-white/80 text-primary-400 hover:bg-primary-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100">
          <Heart size={18} />
        </button>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <div>
            <p className="text-xs text-primary-500 font-semibold uppercase tracking-wider">{product.category}</p>
            <h3 className="text-lg font-bold text-gray-800 line-clamp-1 group-hover:text-primary-600 transition-colors">
              {product.name}
            </h3>
          </div>
        </div>
        <p className="text-sm text-gray-500 line-clamp-2 mb-4 h-10">{product.description}</p>
        <div className="mt-auto flex items-center justify-between">
          <span className="text-lg font-bold text-primary-600">
            {product.price.toLocaleString('vi-VN')}₫
          </span>
          <button
            onClick={() => onAddToCart(product)}
            className="flex items-center gap-1 bg-primary-100 text-primary-700 px-3 py-2 rounded-xl hover:bg-primary-500 hover:text-white transition-all font-medium text-sm"
          >
            <Plus size={16} /> Thêm
          </button>
        </div>
      </div>
    </div>
  );
};
