import React from 'react';

interface PriceRangeSliderProps {
  min: number;
  max: number;
  value: [number, number];
  onChangeMin: (v: number) => void;
  onChangeMax: (v: number) => void;
}

function formatCurrency(value: number): string {
  return `$${value.toLocaleString('es-AR')}`;
}

export const PriceRangeSlider: React.FC<PriceRangeSliderProps> = ({
  min,
  max,
  value,
  onChangeMin,
  onChangeMax,
}) => {
  const disabled = min === max;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between text-sm text-primary/70">
        <span>{formatCurrency(value[0])}</span>
        <span>{formatCurrency(value[1])}</span>
      </div>
      <div className="flex flex-col gap-2">
        <input
          type="range"
          role="slider"
          min={min}
          max={max}
          value={value[0]}
          disabled={disabled}
          onChange={(e) => onChangeMin(Number(e.target.value))}
          className="w-full accent-secondary"
          aria-label="Precio mínimo"
        />
        <input
          type="range"
          role="slider"
          min={min}
          max={max}
          value={value[1]}
          disabled={disabled}
          onChange={(e) => onChangeMax(Number(e.target.value))}
          className="w-full accent-secondary"
          aria-label="Precio máximo"
        />
      </div>
    </div>
  );
};
