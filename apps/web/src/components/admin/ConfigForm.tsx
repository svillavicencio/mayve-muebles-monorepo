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

  if (loading) return <div className="loading">Cargando configuración...</div>;
  if (!config) return <div className="error">{error || 'No se pudo cargar la configuración'}</div>;

  return (
    <form onSubmit={handleSubmit} className="admin-form">
      {error && <div className="form-error">{error}</div>}
      {success && <div className="form-success">{success}</div>}

      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="whatsapp">WhatsApp de Contacto</label>
          <input
            id="whatsapp"
            type="text"
            value={config.whatsapp}
            onChange={(e) => setConfig({ ...config, whatsapp: e.target.value })}
            placeholder="Ej: +5491112345678"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email de Contacto</label>
          <input
            id="email"
            type="email"
            value={config.email}
            onChange={(e) => setConfig({ ...config, email: e.target.value })}
            placeholder="Ej: contacto@mayve.com"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="cashDiscount">Descuento por Efectivo (%)</label>
          <input
            id="cashDiscount"
            type="number"
            min="0"
            max="100"
            value={config.cashDiscount}
            onChange={(e) => setConfig({ ...config, cashDiscount: parseInt(e.target.value) || 0 })}
            required
          />
        </div>

        <div className="form-group full-width">
          <label htmlFor="announcementBanner">Banner de Anuncios (Opcional)</label>
          <textarea
            id="announcementBanner"
            value={config.announcementBanner || ''}
            onChange={(e) => setConfig({ ...config, announcementBanner: e.target.value })}
            placeholder="Ej: ¡10% de descuento en toda la web este fin de semana!"
            rows={3}
          />
          <p className="field-hint">Dejá vacío para ocultar el banner.</p>
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-save" disabled={saving}>
          {saving ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>

      <style>{`
        .admin-form {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .form-group.full-width {
          grid-column: span 2;
        }

        .form-group label {
          display: block;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 0.5rem;
          color: var(--color-on-surface);
          opacity: 0.8;
          font-weight: 600;
        }

        .form-group input, .form-group textarea {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid var(--color-surface-container-highest);
          border-radius: 4px;
          font-family: var(--font-sans);
          font-size: 1rem;
          background: var(--color-surface-container-lowest);
        }

        .field-hint {
          font-size: 0.8rem;
          color: var(--color-on-surface);
          opacity: 0.6;
          margin-top: 0.25rem;
        }

        .form-error {
          padding: 1rem;
          background: #fee2e2;
          color: #dc2626;
          border-radius: 4px;
          font-size: 0.9rem;
        }

        .form-success {
          padding: 1rem;
          background: #dcfce7;
          color: #16a34a;
          border-radius: 4px;
          font-size: 0.9rem;
        }

        .btn-save {
          background: var(--color-primary);
          color: white;
          padding: 1rem 2rem;
          border: none;
          border-radius: 4px;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-save:hover:not(:disabled) {
          background: var(--color-secondary);
        }

        .btn-save:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
          .form-group.full-width {
            grid-column: span 1;
          }
        }
      `}</style>
    </form>
  );
};
