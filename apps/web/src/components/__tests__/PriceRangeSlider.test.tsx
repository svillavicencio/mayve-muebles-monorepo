import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { PriceRangeSlider } from '../PriceRangeSlider';

describe('PriceRangeSlider', () => {
  const defaultProps = {
    min: 500,
    max: 5000,
    value: [500, 5000] as [number, number],
    onChangeMin: vi.fn(),
    onChangeMax: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with min and max values formatted as currency', () => {
    render(<PriceRangeSlider {...defaultProps} />);
    expect(screen.getByText('$500')).toBeInTheDocument();
    expect(screen.getByText('$5.000')).toBeInTheDocument();
  });

  it('renders two range inputs with the correct value props', () => {
    render(<PriceRangeSlider {...defaultProps} value={[800, 3000]} />);
    const inputs = screen.getAllByRole('slider');
    expect(inputs).toHaveLength(2);
    expect(inputs[0]).toHaveValue('800');
    expect(inputs[1]).toHaveValue('3000');
  });

  it('calls onChangeMin when the min slider changes', () => {
    const onChangeMin = vi.fn();
    render(<PriceRangeSlider {...defaultProps} onChangeMin={onChangeMin} />);
    const [minSlider] = screen.getAllByRole('slider');
    fireEvent.change(minSlider, { target: { value: '1200' } });
    expect(onChangeMin).toHaveBeenCalledWith(1200);
  });

  it('calls onChangeMax when the max slider changes', () => {
    const onChangeMax = vi.fn();
    render(<PriceRangeSlider {...defaultProps} onChangeMax={onChangeMax} />);
    const [, maxSlider] = screen.getAllByRole('slider');
    fireEvent.change(maxSlider, { target: { value: '4000' } });
    expect(onChangeMax).toHaveBeenCalledWith(4000);
  });

  it('disables both sliders when min equals max', () => {
    render(<PriceRangeSlider {...defaultProps} min={1200} max={1200} value={[1200, 1200]} />);
    const inputs = screen.getAllByRole('slider');
    expect(inputs[0]).toBeDisabled();
    expect(inputs[1]).toBeDisabled();
  });

  it('enables sliders when min is different from max', () => {
    render(<PriceRangeSlider {...defaultProps} />);
    const inputs = screen.getAllByRole('slider');
    expect(inputs[0]).not.toBeDisabled();
    expect(inputs[1]).not.toBeDisabled();
  });
});
