import React, { useState } from 'react';

interface Props {
  images: string[];
}

export const ProductGallery: React.FC<Props> = ({ images }) => {
  const [mainImage, setMainImage] = useState(images[0] || '/placeholder.jpg');

  return (
    <div className="flex flex-col gap-8">
      <div className="aspect-[4/5] bg-surface-container-low rounded-sm overflow-hidden shadow-ambient">
        <img src={mainImage} alt="Producto" className="w-full h-full object-cover transition-all duration-700" />
      </div>
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {images.map((img, idx) => (
          <button 
            key={idx} 
            onClick={() => setMainImage(img)}
            className={`w-[44px] h-[44px] md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-sm overflow-hidden cursor-pointer p-0 bg-surface-container flex-shrink-0 transition-all duration-300 ${
              mainImage === img ? 'opacity-100 scale-105' : 'opacity-40 hover:opacity-70'
            }`}
          >
            <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
};
