import React from 'react';
import type { Product } from '@mayve/shared';

interface Props {
  product: Product;
}

export const ProductCard: React.FC<Props> = ({ product }) => {
  return (
    <div className="bg-surface-container-lowest rounded-sm overflow-hidden transition-all duration-300 hover:shadow-ambient group relative">
      {product.isCustomizable && (
        <div className="absolute top-4 right-4 z-10 px-2 py-1 bg-primary/10 backdrop-blur-sm rounded-full border border-primary/20">
          <span className="text-[10px] label-caps text-primary">Personalizable</span>
        </div>
      )}
      <div className="aspect-square bg-surface-container-low overflow-hidden">
        <img
          src={product.images[0] || '/placeholder.jpg'}
          alt={product.name}
          className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="p-4 md:p-6 lg:p-8">
        <h3 className="text-lg md:text-2xl font-serif mb-2 text-primary">{product.name}</h3>
        <p className="text-xs uppercase tracking-widest text-secondary mb-4 opacity-80">{product.materials || product.structure}</p>
        <div className="flex justify-between items-baseline mb-8">
          <div className="flex flex-col">
            <p className="text-xl text-primary/90">${Number(product.cashDiscountPrice || product.price).toLocaleString('es-AR')}</p>
            <p className="text-[10px] opacity-40 italic">Precio efectivo</p>
          </div>
          {!product.inStock && (
            <span className="text-[10px] label-caps opacity-40">Bajo pedido</span>
          )}
        </div>
        <a
          href={`/products/${product.slug}`}
          className="btn-primary w-full py-4 min-h-[44px] flex items-center justify-center"
        >
          Explorar Pieza
        </a>
      </div>
    </div>
  );
};
