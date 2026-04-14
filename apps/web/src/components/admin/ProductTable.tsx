import React, { useEffect, useState } from 'react';
import { fetchProducts, deleteProduct } from '../../lib/api-client';
import { getImageUrl } from '../../lib/image-url';
import type { Product } from '@mayve/shared';

const ProductTable: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await fetchProducts<Product[]>();
      setProducts(data);
    } catch (err) {
      setError('Error al cargar productos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar "${name}"?`)) {
      try {
        await deleteProduct(id);
        setProducts(products.filter(p => p.id !== id));
      } catch (err) {
        alert('Error al eliminar el producto');
      }
    }
  };

  if (loading) return <div className="p-10 text-center label-caps animate-pulse">Cargando productos...</div>;
  if (error) return <div className="p-10 text-center text-red-500 label-caps">{error}</div>;

  return (
    <div className="relative">
      <div className="pb-6 border-b border-surface-variant/30 flex justify-between items-center">
        <span className="label-caps text-secondary text-xs">{products.length} Productos</span>
        <a 
          href="/admin/products/new" 
          className="btn-primary px-4 py-2"
        >
          Nuevo
        </a>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block mt-6 relative overflow-x-auto">
        <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white to-transparent z-10" />
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface border-b border-surface-variant/30">
              <th className="p-4 label-caps text-xs text-secondary">Imagen</th>
              <th className="p-4 label-caps text-xs text-secondary">Nombre</th>
              <th className="p-4 label-caps text-xs text-secondary">Categoría</th>
              <th className="p-4 label-caps text-xs text-secondary">Precio</th>
              <th className="p-4 label-caps text-xs text-secondary">Stock</th>
              <th className="p-4 label-caps text-xs text-secondary text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-surface-variant/10 hover:bg-surface/50 transition-colors">
                <td className="p-4">
                  <div className="w-12 h-12 bg-surface-variant overflow-hidden">
                    {product.images?.[0] ? (
                      <img src={getImageUrl(product.images[0])} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-secondary opacity-50 uppercase tracking-tighter text-center">Sin imagen</div>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <div className="font-medium text-primary text-sm">{product.name}</div>
                  <div className="text-xs text-secondary/60 font-mono mt-1">{product.slug}</div>
                </td>
                <td className="p-4">
                  <span className="text-xs uppercase tracking-wider bg-surface-variant/50 px-2 py-1 text-secondary">
                    {product.category?.name || 'S/C'}
                  </span>
                </td>
                <td className="p-4 text-sm">
                  ${product.price?.toLocaleString()}
                </td>
                <td className="p-4">
                  <span className={`text-xs uppercase tracking-widest ${product.inStock ? 'text-primary' : 'text-secondary/60'}`}>
                    {product.inStock ? 'En Stock' : 'Agotado'}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end space-x-1">
                    <a 
                      href={`/admin/products/edit/${product.id}`}
                      className="text-xs uppercase tracking-widest text-secondary hover:text-primary transition-colors h-12 w-12 flex items-center justify-center"
                      title="Editar"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                      </svg>
                    </a>
                    <button 
                      onClick={() => handleDelete(product.id, product.name)}
                      className="text-xs uppercase tracking-widest text-red-500 hover:text-red-700 transition-colors h-12 w-12 flex items-center justify-center"
                      title="Eliminar"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile/Tablet Card View */}
      <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white border border-surface-variant/20 p-4 rounded-lg flex flex-col min-[340px]:flex-row gap-4 min-[340px]:gap-6 shadow-sm">
            <div className="w-20 h-20 bg-surface-variant shrink-0 rounded-sm overflow-hidden mx-auto min-[340px]:mx-0">
              {product.images?.[0] ? (
                <img src={getImageUrl(product.images[0])} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-secondary opacity-50 uppercase text-center p-2">Sin imagen</div>
              )}
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs uppercase tracking-wider bg-surface-variant/50 px-2 py-0.5 text-secondary">
                    {product.category?.name || 'S/C'}
                  </span>
                  <span className="text-sm font-medium">${product.price?.toLocaleString()}</span>
                </div>
                <h3 className="font-medium text-sm text-primary truncate mb-2">{product.name}</h3>
                <div className={`text-xs uppercase tracking-widest ${product.inStock ? 'text-primary' : 'text-secondary/60'}`}>
                  {product.inStock ? 'En Stock' : 'Agotado'}
                </div>
              </div>
              <div className="flex space-x-2 mt-3 pt-2 border-t border-surface-variant/10">
                <a 
                  href={`/admin/products/edit/${product.id}`}
                  className="text-xs uppercase tracking-widest text-secondary hover:text-primary transition-colors flex items-center h-12 pr-4 font-medium"
                >
                  <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                  </svg>
                  Editar
                </a>
                <button 
                  onClick={() => handleDelete(product.id, product.name)}
                  className="text-xs uppercase tracking-widest text-red-500 hover:text-red-700 transition-colors flex items-center h-12 px-4 font-medium"
                >
                  <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="p-12 text-center text-secondary/50 label-caps">
          No se encontraron productos
        </div>
      )}
    </div>
  );
};

export default ProductTable;
