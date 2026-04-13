import React, { useState, useEffect } from 'react';
import { fetchSiteConfig, updateSiteConfig } from '../../lib/api-client';

export const ConfigForm: React.FC = () => {
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    async function loadConfig() {
      try {
        const data = await fetchSiteConfig<any>();
        setConfig(data);
      } catch (err) {
        setError('Error al cargar la configuración');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadConfig();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await updateSiteConfig(config);
      setSuccess('Configuración actualizada correctamente');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-10 text-center label-caps animate-pulse">Cargando configuración...</div>;
  if (!config) return <div className="text-red-600 text-sm">{error || 'No se pudo cargar la configuración'}</div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && <div className="text-red-600 text-sm">{error}</div>}
      {success && <div className="text-green-600 text-sm">{success}</div>}

      <div>
        <h3 className="text-[10px] uppercase tracking-widest text-secondary border-b border-surface-variant/30 pb-2 mb-6">Contacto</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div className="space-y-1">
            <label htmlFor="whatsapp" className="text-[10px] uppercase tracking-widest text-secondary/70">WhatsApp de Contacto</label>
            <input
              id="whatsapp"
              type="text"
              value={config.whatsapp}
              onChange={(e) => setConfig({ ...config, whatsapp: e.target.value })}
              placeholder="Ej: +5491112345678"
              required
              className="w-full border-b border-surface-variant focus:border-primary outline-none py-2 text-sm transition-colors bg-transparent"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="email" className="text-[10px] uppercase tracking-widest text-secondary/70">Email de Contacto</label>
            <input
              id="email"
              type="email"
              value={config.email}
              onChange={(e) => setConfig({ ...config, email: e.target.value })}
              placeholder="Ej: contacto@mayve.com"
              required
              className="w-full border-b border-surface-variant focus:border-primary outline-none py-2 text-sm transition-colors bg-transparent"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="cashDiscount" className="text-[10px] uppercase tracking-widest text-secondary/70">Descuento por Efectivo (%)</label>
            <input
              id="cashDiscount"
              type="number"
              min="0"
              max="100"
              value={config.cashDiscount}
              onChange={(e) => setConfig({ ...config, cashDiscount: parseInt(e.target.value) || 0 })}
              required
              className="w-full border-b border-surface-variant focus:border-primary outline-none py-2 text-sm transition-colors bg-transparent"
            />
          </div>

          <div className="space-y-1 md:col-span-2">
            <label htmlFor="announcementBanner" className="text-[10px] uppercase tracking-widest text-secondary/70">Banner de Anuncios (Opcional)</label>
            <textarea
              id="announcementBanner"
              value={config.announcementBanner || ''}
              onChange={(e) => setConfig({ ...config, announcementBanner: e.target.value })}
              placeholder="Ej: ¡10% de descuento en toda la web este fin de semana!"
              rows={3}
              className="w-full border-b border-surface-variant focus:border-primary outline-none py-2 text-sm transition-colors bg-transparent"
            />
            <p className="text-[10px] uppercase tracking-widest text-secondary/70 mt-1">Dejá vacío para ocultar el banner.</p>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button type="submit" className="btn-primary px-8 py-3" disabled={saving}>
          {saving ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>
    </form>
  );
};
