import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductGallery } from './ProductGallery';
import React from 'react';

const mockImages = [
  '/img1.jpg',
  '/img2.jpg',
  '/img3.jpg',
];

describe('ProductGallery', () => {
  it('should render all images and allow switching main image', () => {
    const { container } = render(<ProductGallery images={mockImages} />);
    
    // Main image should initially be the first one
    const mainImg = screen.getByAltText('Producto') as HTMLImageElement;
    expect(mainImg.src).toContain('/img1.jpg');

    // Clicking second thumbnail
    const thumbs = screen.getAllByRole('button');
    fireEvent.click(thumbs[1]);

    expect(mainImg.src).toContain('/img2.jpg');

    // The Curated Gallery class assertions
    const gallery = container.firstChild as HTMLElement;
    expect(gallery.className).toContain('flex');
    expect(gallery.className).toContain('flex-col');
    expect(gallery.className).toContain('gap-8');

    const mainImgContainer = container.querySelector('.aspect-\\[4\\/5\\]');
    expect(mainImgContainer).toBeDefined();
    expect(mainImgContainer?.className).toContain('rounded-sm');
    expect(mainImgContainer?.className).toContain('shadow-ambient');

    const thumbsContainer = container.querySelector('.overflow-x-auto');
    expect(thumbsContainer).toBeDefined();
    expect(thumbsContainer?.className).toContain('flex');
    expect(thumbsContainer?.className).toContain('gap-4');
    expect(thumbsContainer?.className).toContain('pb-4');

    // Thumbnail selection state (RED phase check for opacity and scale)
    expect(thumbs[1].className).toContain('opacity-100');
    expect(thumbs[1].className).toContain('scale-105');
    expect(thumbs[0].className).toContain('opacity-40');

    // Mobile-first thumbnail sizing
    thumbs.forEach(thumb => {
      expect(thumb.className).toContain('w-[44px]');
      expect(thumb.className).toContain('h-[44px]');
    });
  });
});
