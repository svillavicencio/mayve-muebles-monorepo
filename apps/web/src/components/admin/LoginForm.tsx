import React, { useState } from 'react';
import { login } from '../../lib/api-client';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await login(email, password);
      // Redirect to admin dashboard on success
      // The HTTP-only cookie is managed by the browser
      window.location.href = '/admin';
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-white shadow-ambient border border-surface-variant/50 rounded-lg">
      <h1 className="mb-8 text-2xl font-display text-primary uppercase tracking-label text-center">
        Panel Admin
      </h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-1">
          <label className="label-caps text-secondary block text-xs">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-surface-variant focus:border-secondary bg-surface-container-low transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary text-sm"
            required
            placeholder="tu@email.com"
          />
        </div>

        <div className="space-y-1">
          <label className="label-caps text-secondary block text-xs">
            Contraseña
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-surface-variant focus:border-secondary bg-surface-container-low transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary text-sm"
            required
            placeholder="••••••••"
          />
        </div>

          {error && (
            <div className="text-red-500 text-xs uppercase tracking-wider text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full py-4 text-sm font-medium disabled:opacity-50"
          >
            {isLoading ? 'Iniciando...' : 'Entrar'}
          </button>
        </form>

        <p className="mt-8 text-[10px] text-center uppercase tracking-label-wide text-secondary/70">
          Mayve Muebles &copy; {new Date().getFullYear()}
        </p>
      </div>
  );
};
