import { describe, it, expect } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';

describe.skip('Tailwind 4 Initialization', () => {
  it('should have tailwind 4 generated styles in head', () => {
    const headHtml = document.head.innerHTML;
    
    // Check for Tailwind 4 signature
    expect(headHtml).toContain('tailwindcss v4');
    
    // Check for our custom theme variables
    expect(headHtml).toContain('--color-primary: #000000');
    expect(headHtml).toContain('--color-surface: #f9f9f9');
    expect(headHtml).toContain('--color-secondary: #715a3f');
    
    // Check for utility classes
    expect(headHtml).toContain('.text-primary');
    expect(headHtml).toContain('color: var(--color-primary)');
  });
});
