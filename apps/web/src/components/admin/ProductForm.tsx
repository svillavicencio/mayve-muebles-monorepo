import React, { useEffect, useState } from 'react';
import { fetchCategories, createProduct, updateProduct, fetchProducts } from '../../lib/api-client';
import { slugify } from '../../lib/slugify';
import type { Product, Category } from '@mayve/shared';

interface ProductFormProps {
  id?: string;
}

const ProductForm: React.FC<ProductFormProps> = ({ id }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    slug: '',
    description: '',
    price: 0,
    listPrice: 0,
    cashDiscountPrice: 0,
    categoryId: '',
    inStock: true,
    isFeatured: false,
    images: [''],
    materials: '',
    dimensions: '',
    leadTime: 0,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const cats = await fetchCategories<Category[]>();
        setCategories(cats);

        if (id) {
          // In a real app, we'd have fetchProductById. 
          // For now, let's find it in the list or adapt api-client
          const allProducts = await fetchProducts<Product[]>();
          const product = allProducts.find(p => p.id === id);
          if (product) {
            setFormData(product);
          } else {
            setError('Producto no encontrado');
          }
        }
      } catch (err) {
        setError('Error al cargar datos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setFormData(prev => {
      const newData = { ...prev, [name]: val };
      if (name === 'name' && !id) {
        newData.slug = slugify(value);
      }
      return newData;
    });
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...(formData.images || [])];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
  };

  const addImageField = () => {
    setFormData({ ...formData, images: [...(formData.images || []), ''] });
  };

  const removeImageField = (index: number) => {
    const newImages = (formData.images || []).filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError(null);
      
      const dataToSend = {
        ...formData,
        price: Number(formData.price),
        listPrice: Number(formData.listPrice),
        cashDiscountPrice: Number(formData.cashDiscountPrice),
        leadTime: Number(formData.leadTime),
      };

      if (id) {
        await updateProduct(id, dataToSend);
      } else {
        await createProduct(dataToSend);
      }
      
      window.location.href = '/admin/products';
    } catch (err: any) {
      setError(err.message || 'Error al guardar el producto');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-10 text-center label-caps animate-pulse">Cargando formulario...</div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      {error && <div className="p-4 bg-red-50 text-red-500 text-xs uppercase tracking-widest border border-red-100">{error}</div>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Basic Info */}
        <div className="space-y-6">
          <h3 className="label-caps text-secondary border-b border-surface-variant/30 pb-2">Información Básica</h3>
          
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-widest text-secondary/70">Nombre del Producto</label>
            <input 
              type="text" name="name" value={formData.name} onChange={handleChange} required
              className="w-full border-b border-surface-variant focus:border-primary outline-none py-2 text-sm transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-widest text-secondary/70">Slug (URL)</label>
            <input 
              type="text" name="slug" value={formData.slug} onChange={handleChange} required
              className="w-full border-b border-surface-variant focus:border-primary outline-none py-2 text-sm transition-colors bg-surface/30"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-widest text-secondary/70">Categoría</label>
            <select 
              name="categoryId" value={formData.categoryId} onChange={handleChange} required
              className="w-full border-b border-surface-variant focus:border-primary outline-none py-2 text-sm transition-colors bg-transparent"
            >
              <option value="">Seleccionar categoría</option>
              {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-widest text-secondary/70">Descripción</label>
            <textarea 
              name="description" value={formData.description} onChange={handleChange} required rows={4}
              className="w-full border border-surface-variant focus:border-primary outline-none p-3 text-sm transition-colors mt-2"
            />
          </div>
        </div>

        {/* Pricing & Stock */}
        <div className="space-y-6">
          <h3 className="label-caps text-secondary border-b border-surface-variant/30 pb-2">Precios y Stock</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-secondary/70">Precio Base</label>
              <input 
                type="number" name="price" value={formData.price} onChange={handleChange} required
                className="w-full border-b border-surface-variant focus:border-primary outline-none py-2 text-sm transition-colors"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-secondary/70">Precio de Lista</label>
              <input 
                type="number" name="listPrice" value={formData.listPrice} onChange={handleChange}
                className="w-full border-b border-surface-variant focus:border-primary outline-none py-2 text-sm transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-widest text-secondary/70">Precio Ef/Transf</label>
            <input 
              type="number" name="cashDiscountPrice" value={formData.cashDiscountPrice} onChange={handleChange}
              className="w-full border-b border-surface-variant focus:border-primary outline-none py-2 text-sm transition-colors"
            />
          </div>

          <div className="flex space-x-8 pt-4">
            <label className="flex items-center space-x-3 cursor-pointer group">
              <input 
                type="checkbox" name="inStock" checked={formData.inStock} onChange={handleChange}
                className="w-4 h-4 border-surface-variant text-primary focus:ring-0"
              />
              <span className="text-[10px] uppercase tracking-widest text-secondary group-hover:text-primary transition-colors">En Stock</span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer group">
              <input 
                type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange}
                className="w-4 h-4 border-surface-variant text-primary focus:ring-0"
              />
              <span className="text-[10px] uppercase tracking-widest text-secondary group-hover:text-primary transition-colors">Destacado</span>
            </label>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-widest text-secondary/70">Tiempo de entrega (días)</label>
            <input 
              type="number" name="leadTime" value={formData.leadTime} onChange={handleChange}
              className="w-full border-b border-surface-variant focus:border-primary outline-none py-2 text-sm transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="space-y-4">
        <div className="flex justify-between items-end border-b border-surface-variant/30 pb-2">
          <h3 className="label-caps text-secondary">Imágenes (URLs)</h3>
          <button 
            type="button" onClick={addImageField}
            className="text-[9px] uppercase tracking-widest text-secondary hover:text-primary transition-colors"
          >
            + Añadir URL
          </button>
        </div>
        
        <div className="grid grid-cols-1 gap-3">
          {formData.images?.map((url, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input 
                type="text" value={url} onChange={(e) => handleImageChange(index, e.target.value)}
                placeholder="https://ejemplo.com/imagen.jpg"
                className="flex-1 border-b border-surface-variant focus:border-primary outline-none py-2 text-[11px] transition-colors"
              />
              {formData.images!.length > 1 && (
                <button 
                  type="button" onClick={() => removeImageField(index)}
                  className="text-red-400 hover:text-red-600 p-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="pt-10 flex justify-end space-x-4">
        <a 
          href="/admin/products" 
          className="px-8 py-3 text-[10px] uppercase tracking-widest text-secondary hover:text-primary transition-colors border border-surface-variant"
        >
          Cancelar
        </a>
        <button 
          type="submit" disabled={submitting}
          className="px-10 py-3 bg-primary text-white text-[10px] uppercase tracking-widest hover:bg-secondary transition-all disabled:opacity-50"
        >
          {submitting ? 'Guardando...' : id ? 'Actualizar Producto' : 'Crear Producto'}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
