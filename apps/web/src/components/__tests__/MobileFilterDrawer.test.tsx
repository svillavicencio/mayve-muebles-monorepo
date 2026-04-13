import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MobileFilterDrawer } from '../MobileFilterDrawer';

describe('MobileFilterDrawer', () => {
  const onClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('does not render drawer content when isOpen is false', () => {
    render(
      <MobileFilterDrawer isOpen={false} onClose={onClose}>
        <p>Contenido filtros</p>
      </MobileFilterDrawer>
    );
    expect(screen.queryByText('Contenido filtros')).not.toBeInTheDocument();
  });

  it('renders drawer content when isOpen is true', () => {
    render(
      <MobileFilterDrawer isOpen={true} onClose={onClose}>
        <p>Contenido filtros</p>
      </MobileFilterDrawer>
    );
    expect(screen.getByText('Contenido filtros')).toBeInTheDocument();
  });

  it('clicking the backdrop calls onClose', () => {
    render(
      <MobileFilterDrawer isOpen={true} onClose={onClose}>
        <p>Contenido</p>
      </MobileFilterDrawer>
    );
    const backdrop = screen.getByTestId('drawer-backdrop');
    fireEvent.click(backdrop);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('clicking the Aplicar button calls onClose', () => {
    render(
      <MobileFilterDrawer isOpen={true} onClose={onClose}>
        <p>Contenido</p>
      </MobileFilterDrawer>
    );
    fireEvent.click(screen.getByRole('button', { name: /aplicar/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('clicking the close (X) button calls onClose', () => {
    render(
      <MobileFilterDrawer isOpen={true} onClose={onClose}>
        <p>Contenido</p>
      </MobileFilterDrawer>
    );
    fireEvent.click(screen.getByRole('button', { name: /cerrar/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('renders children inside the drawer content area', () => {
    render(
      <MobileFilterDrawer isOpen={true} onClose={onClose}>
        <div data-testid="child-content">Hijo</div>
      </MobileFilterDrawer>
    );
    expect(screen.getByTestId('child-content')).toBeInTheDocument();
    expect(screen.getByText('Hijo')).toBeInTheDocument();
  });

  it('drawer panel has responsive max-height classes for phone and tablet', () => {
    render(
      <MobileFilterDrawer isOpen={true} onClose={onClose}>
        <p>Contenido</p>
      </MobileFilterDrawer>
    );
    const panel = screen.getByTestId('drawer-panel');
    expect(panel).toHaveClass('max-h-[95vh]');
    expect(panel).toHaveClass('sm:max-h-[85vh]');
  });

  it('drawer panel does not have rounded-t-lg class', () => {
    render(
      <MobileFilterDrawer isOpen={true} onClose={onClose}>
        <p>Contenido</p>
      </MobileFilterDrawer>
    );
    const panel = screen.getByTestId('drawer-panel');
    expect(panel).not.toHaveClass('rounded-t-lg');
  });

  it('drawer header div does not have border-b class', () => {
    render(
      <MobileFilterDrawer isOpen={true} onClose={onClose}>
        <p>Contenido</p>
      </MobileFilterDrawer>
    );
    const panel = screen.getByTestId('drawer-panel');
    const header = panel.firstElementChild as HTMLElement;
    expect(header).not.toHaveClass('border-b');
    expect(header).not.toHaveClass('border-outline-variant/30');
  });
});
