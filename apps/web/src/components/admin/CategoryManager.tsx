import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { fetchCategories, createCategory, deleteCategory } from '../../lib/api-client';
import { slugify } from '../../lib/slugify';
import type { Category } from '@mayve/shared';

const CategoryManager: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [newName, setNewName] = useState('');

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await fetchCategories<Category[]>();
      setCategories(data);
    } catch (err) {
      setError('Error al cargar categorías');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    try {
      setSubmitting(true);
      setError(null);
      await createCategory({
        name: newName,
        slug: slugify(newName),
      });
      setNewName('');
      await loadCategories();
      toast.success('Categoría creada correctamente');
    } catch (err: any) {
      setError(err.message || 'Error al crear categoría');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`¿Estás seguro de eliminar "${name}"? Esto podría afectar a los productos asociados.`)) {
      try {
        await deleteCategory(id);
        setCategories(categories.filter(c => c.id !== id));
        toast.success('Categoría eliminada correctamente');
      } catch (err: any) {
        if (err?.status === 409) {
          toast.error('No se puede eliminar: la categoría no está vacía');
        } else {
          toast.error('Error al eliminar la categoría');
        }
      }
    }
  };

  if (loading && categories.length === 0) return <div className="p-10 text-center label-caps animate-pulse">Cargando categorías...</div>;

  return (
    <div className="max-w-2xl space-y-12">
      {/* Create form */}
      <section className="space-y-6">
        <h3 className="label-caps text-secondary border-b border-surface-variant/30 pb-2">Nueva Categoría</h3>
        <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row items-start lg:items-end space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="w-full lg:flex-1 space-y-1">
            <label className="text-xs uppercase tracking-widest text-secondary/70">Nombre</label>
            <input 
              type="text" value={newName} onChange={(e) => setNewName(e.target.value)} required
              placeholder="Ej. Sofás"
              className="w-full border-b border-surface-variant focus:border-primary outline-none py-2 text-sm transition-colors"
            />
          </div>
          <button 
            type="submit" disabled={submitting}
            className="w-full lg:w-auto px-6 py-4 lg:py-2 bg-primary text-white text-xs uppercase tracking-widest hover:bg-secondary transition-all disabled:opacity-50"
          >
            {submitting ? 'Creando...' : 'Añadir'}
          </button>
        </form>
        {error && <p className="text-xs uppercase tracking-widest text-red-500">{error}</p>}
      </section>

      {/* List */}
      <section className="space-y-6">
        <h3 className="label-caps text-secondary border-b border-surface-variant/30 pb-2">Categorías Existentes</h3>
        <div className="border border-surface-variant/20 rounded-lg overflow-hidden">
          {categories.map((cat) => (
            <div key={cat.id} className="flex justify-between items-center p-4 border-b border-surface-variant/10 hover:bg-surface/50 transition-colors last:border-0">
              <div className="flex flex-col lg:flex-row lg:items-center min-w-0">
                <span className="text-sm font-medium text-primary">{cat.name}</span>
                <span className="text-xs text-secondary/50 font-mono lg:ml-3 min-w-0 truncate">{cat.slug}</span>
              </div>
              <button 
                onClick={() => handleDelete(cat.id, cat.name)}
                className="text-xs uppercase tracking-widest text-red-600 hover:text-red-800 transition-colors h-[44px] px-2 flex items-center justify-center shrink-0 ml-4"
              >
                Eliminar
              </button>
            </div>
          ))}
          {categories.length === 0 && (
            <div className="p-10 text-center text-secondary/40 label-caps">No hay categorías</div>
          )}
        </div>
      </section>
    </div>
  );
};

export default CategoryManager;
