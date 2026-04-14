import React, { useEffect, useState, useRef } from 'react';
import { fetchCategories, createProduct, updateProduct, fetchProducts } from '../../lib/api-client';
import { slugify } from '../../lib/slugify';
import { getImageUrl } from '../../lib/image-url';
import type { Product, Category } from '@mayve/shared';

interface ProductFormProps {
  id?: string;
}

const ProductForm: React.FC<ProductFormProps> = ({ id }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
    materials: '',
    dimensions: '',
    leadTime: 0,
  });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const cats = await fetchCategories<Category[]>();
        setCategories(cats);

        if (id) {
          const allProducts = await fetchProducts<Product[]>();
          const product = allProducts.find(p => p.id === id);
          if (product) {
            setFormData(product);
            if (product.images) {
              setPreviews(product.images);
            }
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...files]);
      
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeFile = (index: number) => {
    const existingImagesCount = id ? (formData.images?.length || 0) : 0;
    
    if (index >= existingImagesCount) {
      const fileIndex = index - existingImagesCount;
      setSelectedFiles(prev => prev.filter((_, i) => i !== fileIndex));
    } else if (id && formData.images) {
      setFormData(prev => ({
        ...prev,
        images: prev.images?.filter((_, i) => i !== index)
      }));
    }
    
    setPreviews(prev => {
      const url = prev[index];
      if (url.startsWith('blob:')) URL.revokeObjectURL(url);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (previews.length === 0) {
      setError('Debe subir al menos una imagen');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      
      const data = new FormData();
      
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'images' && id) {
          if (Array.isArray(value)) {
            value.forEach(url => data.append('existingImages', url));
          }
        } else if (key !== 'images' && key !== 'category' && value !== undefined && value !== null) {
          data.append(key, value.toString());
        }
      });

      selectedFiles.forEach(file => {
        data.append('images', file);
      });

      if (id) {
        await updateProduct(id, data);
      } else {
        await createProduct(data);
      }
      
      if (typeof window !== 'undefined') {
        window.location.href = '/admin/products';
      }
    } catch (err: any) {
      setError(err.message || 'Error al guardar el producto');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-10 text-center label-caps animate-pulse">Cargando formulario...</div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl" data-testid="product-form">
      {error && (
        <div data-testid="error-message" className="p-4 bg-red-50 text-red-500 text-xs uppercase tracking-widest border border-red-100">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h3 className="label-caps text-secondary border-b border-surface-variant/30 pb-2">Información Básica</h3>
          
          <div className="space-y-1">
            <label htmlFor="name" className="text-xs uppercase tracking-widest text-secondary/70">Nombre del Producto</label>
            <input 
              id="name" type="text" name="name" value={formData.name} onChange={handleChange} required
              className="w-full border-b border-surface-variant focus:border-primary outline-none py-3 text-sm transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="slug" className="text-xs uppercase tracking-widest text-secondary/70">Slug (URL)</label>
            <input 
              id="slug" type="text" name="slug" value={formData.slug} onChange={handleChange} required
              className="w-full border-b border-surface-variant focus:border-primary outline-none py-3 text-sm transition-colors bg-surface/30"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="categoryId" className="text-xs uppercase tracking-widest text-secondary/70">Categoría</label>
            <select 
              id="categoryId" name="categoryId" value={formData.categoryId} onChange={handleChange} required
              className="w-full border-b border-surface-variant focus:border-primary outline-none py-3 text-sm transition-colors bg-transparent"
            >
              <option value="">Seleccionar categoría</option>
              {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </select>
          </div>

          <div className="space-y-1">
            <label htmlFor="description" className="text-xs uppercase tracking-widest text-secondary/70">Descripción</label>
            <textarea 
              id="description" name="description" value={formData.description} onChange={handleChange} required rows={4}
              className="w-full border-b border-surface-variant focus:border-primary outline-none py-3 text-sm transition-colors bg-transparent mt-2"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="materials" className="text-xs uppercase tracking-widest text-secondary/70">Materiales</label>
            <textarea 
              id="materials" name="materials" value={formData.materials} onChange={handleChange} rows={3}
              className="w-full border-b border-surface-variant focus:border-primary outline-none py-3 text-sm transition-colors bg-transparent mt-2"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="dimensions" className="text-xs uppercase tracking-widest text-secondary/70">Dimensiones</label>
            <input 
              id="dimensions" type="text" name="dimensions" value={formData.dimensions} onChange={handleChange}
              className="w-full border-b border-surface-variant focus:border-primary outline-none py-3 text-sm transition-colors"
            />
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="label-caps text-secondary border-b border-surface-variant/30 pb-2">Precios y Stock</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="price" className="text-xs uppercase tracking-widest text-secondary/70">Precio Base</label>
              <input 
                id="price" type="number" name="price" value={formData.price} onChange={handleChange} required
                className="w-full border-b border-surface-variant focus:border-primary outline-none py-3 text-sm transition-colors"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="listPrice" className="text-xs uppercase tracking-widest text-secondary/70">Precio de Lista</label>
              <input 
                id="listPrice" type="number" name="listPrice" value={formData.listPrice} onChange={handleChange}
                className="w-full border-b border-surface-variant focus:border-primary outline-none py-3 text-sm transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="cashDiscountPrice" className="text-xs uppercase tracking-widest text-secondary/70">Precio Ef/Transf</label>
            <input 
              id="cashDiscountPrice" type="number" name="cashDiscountPrice" value={formData.cashDiscountPrice} onChange={handleChange}
              className="w-full border-b border-surface-variant focus:border-primary outline-none py-3 text-sm transition-colors"
            />
          </div>

          <div className="flex space-x-8 pt-4">
            <label className="flex items-center space-x-3 cursor-pointer group">
              <input 
                type="checkbox" name="inStock" checked={formData.inStock} onChange={handleChange}
                className="w-4 h-4 border-surface-variant text-primary focus:ring-0 accent-secondary"
              />
              <span className="text-xs uppercase tracking-widest text-secondary group-hover:text-primary transition-colors">En Stock</span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer group">
              <input 
                type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange}
                className="w-4 h-4 border-surface-variant text-primary focus:ring-0 accent-secondary"
              />
              <span className="text-xs uppercase tracking-widest text-secondary group-hover:text-primary transition-colors">Destacado</span>
            </label>
          </div>

          <div className="space-y-1">
            <label htmlFor="leadTime" className="text-xs uppercase tracking-widest text-secondary/70">Tiempo de entrega (días)</label>
            <input 
              id="leadTime" type="number" name="leadTime" value={formData.leadTime} onChange={handleChange}
              className="w-full border-b border-surface-variant focus:border-primary outline-none py-3 text-sm transition-colors"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-end border-b border-surface-variant/30 pb-2">
          <h3 className="label-caps text-secondary">Imágenes</h3>
          <button 
            type="button" onClick={() => fileInputRef.current?.click()}
            className="text-xs uppercase tracking-widest text-secondary hover:text-primary transition-colors py-2"
          >
            + Añadir Imagen
          </button>
          <input 
            type="file" ref={fileInputRef} onChange={handleFileChange} multiple accept="image/*" 
            className="hidden" id="images-input"
          />
          <label htmlFor="images-input" className="hidden">Imágenes</label>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {previews.map((url, index) => (
            <div key={index} className="relative aspect-square border border-surface-variant/30 group">
              <img src={getImageUrl(url)} alt="Preview" className="w-full h-full object-cover" />
              <button 
                type="button" onClick={() => removeFile(index)}
                className="absolute top-1 right-1 bg-white/80 text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-10 flex flex-col md:flex-row md:justify-end gap-4">
        <a 
          href="/admin/products" 
          className="w-full md:w-auto text-center px-8 py-3 text-xs uppercase tracking-widest text-secondary hover:text-primary transition-colors border border-surface-variant"
        >
          Cancelar
        </a>
        <button 
          type="submit" disabled={submitting}
          className="w-full md:w-auto px-10 py-3 bg-primary text-white text-xs uppercase tracking-widest hover:bg-secondary transition-all disabled:opacity-50"
        >
          {submitting ? 'Guardando...' : id ? 'Actualizar Producto' : 'Crear Producto'}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
