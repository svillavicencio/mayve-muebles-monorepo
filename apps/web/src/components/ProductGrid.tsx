import React from 'react';
import type { Product } from '@mayve/shared';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  title?: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, isLoading, title }) => {
  if (isLoading) {
    return (
      <div className="text-center p-8 md:p-16 lg:p-24 font-serif text-secondary text-xl opacity-60">
        Curando piezas...
      </div>
    );
  }

  return (
    <div>
      {title && (
        <h2 className="text-4xl md:text-5xl font-serif text-primary mb-12 tracking-tight">
          {title}
        </h2>
      )}
      {products.length === 0 ? (
        <p className="text-center p-8 md:p-16 font-serif text-secondary opacity-60">
          No encontramos productos con esos filtros
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 lg:gap-16">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
