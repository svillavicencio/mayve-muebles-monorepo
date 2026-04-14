import React from 'react';
import { Toaster } from 'sonner';

export function AdminToaster() {
  return (
    <Toaster
      richColors
      position="bottom-right"
      toastOptions={{
        style: { fontSize: '12px' },
      }}
    />
  );
}
