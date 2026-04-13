import React, { useEffect, useState } from 'react';
import type { Product } from '@mayve/shared';
import { fetchProducts } from '../lib/api-client';
import { ProductGrid } from './ProductGrid';

interface FeaturedProductGridProps {
  limit?: number;
  title?: string;
}

export const FeaturedProductGrid: React.FC<FeaturedProductGridProps> = ({ limit, title }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts<Product[]>({ featured: 'true' })
      .then((data) => setProducts(limit ? data.slice(0, limit) : data))
      .finally(() => setLoading(false));
  }, [limit]);

  return <ProductGrid products={products} isLoading={loading} title={title} />;
};
