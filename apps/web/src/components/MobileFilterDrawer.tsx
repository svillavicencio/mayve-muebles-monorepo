import React from 'react';
import ReactDOM from 'react-dom';

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const MobileFilterDrawer: React.FC<MobileFilterDrawerProps> = ({
  isOpen,
  onClose,
  children,
}) => {
  if (!isOpen) return null;

  const overlay = (
    <>
      <div
        data-testid="drawer-backdrop"
        className="fixed inset-0 bg-primary/20 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      <div data-testid="drawer-panel" className="fixed inset-x-0 bottom-0 z-50 bg-surface max-h-[95vh] sm:max-h-[85vh] overflow-y-auto glass-panel">
        <div className="flex items-center justify-between p-4">
          <button
            type="button"
            aria-label="Cerrar"
            onClick={onClose}
            className="text-primary/60 hover:text-primary transition-opacity ml-auto"
          >
            ✕
          </button>
        </div>
        <div className="p-4 pb-24">{children}</div>
        <div className="fixed bottom-0 inset-x-0 p-4 bg-surface border-t border-outline-variant/30">
          <button
            type="button"
            onClick={onClose}
            className="btn-primary w-full py-3 min-h-[44px]"
          >
            Aplicar
          </button>
        </div>
      </div>
    </>
  );

  return ReactDOM.createPortal(overlay, document.body);
};
