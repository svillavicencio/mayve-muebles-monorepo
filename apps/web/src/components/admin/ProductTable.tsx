import React, { useEffect, useState } from 'react';
import { fetchProducts, deleteProduct } from '../../lib/api-client';
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
    <div className="overflow-x-auto relative">
      <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white to-transparent md:hidden" />
      <div className="pb-6 border-b border-surface-variant/30 flex justify-between items-center">
        <span className="label-caps text-secondary">{products.length} Productos en total</span>
        <a 
          href="/admin/products/new" 
          className="btn-primary px-4 py-2"
        >
          Nuevo Producto
        </a>
      </div>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-surface border-b border-surface-variant/30">
            <th className="p-4 label-caps text-[10px] text-secondary">Imagen</th>
            <th className="p-4 label-caps text-[10px] text-secondary">Nombre</th>
            <th className="p-4 label-caps text-[10px] text-secondary">Categoría</th>
            <th className="p-4 label-caps text-[10px] text-secondary">Precio</th>
            <th className="p-4 label-caps text-[10px] text-secondary">Stock</th>
            <th className="p-4 label-caps text-[10px] text-secondary text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-b border-surface-variant/10 hover:bg-surface/50 transition-colors">
              <td className="p-4">
                <div className="w-12 h-12 bg-surface-variant overflow-hidden">
                  {product.images?.[0] ? (
                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] text-secondary opacity-50 uppercase tracking-tighter">Sin imagen</div>
                  )}
                </div>
              </td>
              <td className="p-4">
                <div className="font-medium text-primary text-sm">{product.name}</div>
                <div className="text-[10px] text-secondary/60 font-mono mt-1">{product.slug}</div>
              </td>
              <td className="p-4">
                <span className="text-[10px] uppercase tracking-wider bg-surface-variant/50 px-2 py-1 text-secondary">
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
                <div className="flex justify-end space-x-3">
                  <a 
                    href={`/admin/products/edit/${product.id}`}
                    className="text-[10px] uppercase tracking-widest text-secondary hover:text-primary transition-colors"
                  >
                    Editar
                  </a>
                  <button 
                    onClick={() => handleDelete(product.id, product.name)}
                    className="text-[10px] uppercase tracking-widest text-red-500 hover:text-red-700 transition-colors"
                  >
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {products.length === 0 && (
            <tr>
              <td colSpan={6} className="p-12 text-center text-secondary/50 label-caps">
                No se encontraron productos
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
