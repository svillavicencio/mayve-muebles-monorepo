import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

export const MobileNav: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const overlay = isOpen ? (
    <nav className="fixed inset-0 z-[9999] flex flex-col justify-center items-center gap-8 bg-[#f9f9f9]">
      <button
        aria-label="Cerrar menú"
        className="absolute top-4 right-4 flex items-center justify-center w-[44px] h-[44px]"
        onClick={() => setIsOpen(false)}
      >
        ✕
      </button>
      <a href="/products" className="label-caps min-h-[44px] flex items-center text-primary">Colecciones</a>
      <a href="/about" className="label-caps min-h-[44px] flex items-center text-primary">Nuestra Artesana</a>
      <a href="/contact" className="label-caps min-h-[44px] flex items-center text-primary">Contacto</a>
    </nav>
  ) : null;

  return (
    <>
      <button
        aria-label="Abrir menú"
        className="flex flex-col items-center justify-center gap-1.5 w-[44px] h-[44px]"
        onClick={() => setIsOpen(true)}
      >
        <span className="block w-5 h-0.5 bg-current"></span>
        <span className="block w-5 h-0.5 bg-current"></span>
        <span className="block w-5 h-0.5 bg-current"></span>
      </button>

      {typeof document !== 'undefined' && createPortal(overlay, document.body)}
    </>
  );
};
