import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MobileNav } from './MobileNav';
import React from 'react';

describe('MobileNav', () => {
  afterEach(() => {
    document.body.classList.remove('overflow-hidden');
  });

  it('renders a hamburger button with aria-label="Abrir menú" when menu is closed', () => {
    render(<MobileNav />);
    const hamburger = screen.getByRole('button', { name: 'Abrir menú' });
    expect(hamburger).toBeDefined();
  });

  it('hamburger button is present on initial render', () => {
    render(<MobileNav />);
    const hamburger = screen.getByRole('button', { name: 'Abrir menú' });
    expect(hamburger).toBeDefined();
  });

  it('clicking hamburger opens nav overlay (nav element becomes visible)', () => {
    render(<MobileNav />);
    const hamburger = screen.getByRole('button', { name: 'Abrir menú' });
    fireEvent.click(hamburger);
    const nav = screen.getByRole('navigation');
    expect(nav).toBeDefined();
  });

  it('overlay contains three links: /products "Colecciones", /about "Nuestra Artesana", /contact "Contacto"', () => {
    render(<MobileNav />);
    fireEvent.click(screen.getByRole('button', { name: 'Abrir menú' }));

    const colecciones = screen.getByRole('link', { name: 'Colecciones' });
    expect(colecciones.getAttribute('href')).toBe('/products');

    const artesana = screen.getByRole('link', { name: 'Nuestra Artesana' });
    expect(artesana.getAttribute('href')).toBe('/about');

    const contacto = screen.getByRole('link', { name: 'Contacto' });
    expect(contacto.getAttribute('href')).toBe('/contact');
  });

  it('each nav link has min-h-[44px] class', () => {
    render(<MobileNav />);
    fireEvent.click(screen.getByRole('button', { name: 'Abrir menú' }));

    const links = screen.getAllByRole('link');
    links.forEach(link => {
      expect(link.className).toContain('min-h-[44px]');
    });
  });

  it('pressing Escape closes the overlay', () => {
    render(<MobileNav />);
    fireEvent.click(screen.getByRole('button', { name: 'Abrir menú' }));
    expect(screen.getByRole('navigation')).toBeDefined();

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('navigation')).toBeNull();
  });

  it('when overlay is open, document.body has overflow-hidden class', () => {
    render(<MobileNav />);
    fireEvent.click(screen.getByRole('button', { name: 'Abrir menú' }));
    expect(document.body.classList.contains('overflow-hidden')).toBe(true);
  });

  it('when overlay is closed, document.body does NOT have overflow-hidden class', () => {
    render(<MobileNav />);
    expect(document.body.classList.contains('overflow-hidden')).toBe(false);
  });

  it('overlay renders as direct child of document.body via React portal', () => {
    render(<MobileNav />);
    fireEvent.click(screen.getByRole('button', { name: 'Abrir menú' }));
    const nav = screen.getByRole('navigation');
    expect(nav.parentElement).toBe(document.body);
  });

  it('overlay is NOT present in document.body when menu is closed', () => {
    render(<MobileNav />);
    expect(screen.queryByRole('navigation')).toBeNull();
  });
});
