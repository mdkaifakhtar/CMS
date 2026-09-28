import { useState, useEffect } from 'react';
import { Store } from 'lucide-react';

// Professional car wash shop fallback image URL
const DEFAULT_FALLBACK = 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=800&q=80';

const ShopImage = ({ src, alt = 'Car wash shop photo', className = 'w-full h-full object-cover' }) => {
  const [currentSrc, setCurrentSrc] = useState(src || DEFAULT_FALLBACK);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setCurrentSrc(src || DEFAULT_FALLBACK);
    setHasError(false);
  }, [src]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setCurrentSrc(DEFAULT_FALLBACK);
    }
  };

  if (hasError && currentSrc === DEFAULT_FALLBACK) {
    return (
      <div className={`bg-gradient-to-br from-slate-800 to-slate-900 flex flex-col items-center justify-center text-slate-400 p-2 ${className}`}>
        <Store size={28} className="mb-1 text-aqua-400" />
        <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400">Car Wash Shop</span>
      </div>
    );
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      onError={handleError}
      className={className}
      loading="lazy"
    />
  );
};

export default ShopImage;
