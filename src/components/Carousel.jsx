import React, { useEffect, useCallback } from 'react';
import { Carousel as CarouselComponent, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';
import { cn } from "@/lib/utils";

const images = [
  '/carousel/compressed_1.webp',
  '/carousel/compressed_2.webp',
  '/carousel/compressed_3.webp',
  '/carousel/compressed_4.webp',
  '/carousel/compressed_5.webp',
  '/carousel/compressed_6.webp',
  '/carousel/compressed_7.webp',
  '/carousel/compressed_8.webp',
];

export const Carousel = () => {
  const [autoplayPaused, setAutoplayPaused] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [loading, setLoading] = React.useState(Array(images.length).fill(true));
  const [api, setApi] = React.useState(null);

  const autoplay = useCallback(() => {
    if (!api || autoplayPaused) return;
    
    if (api.canScrollNext()) {
      api.scrollNext();
    } else {
      api.scrollTo(0);
    }
  }, [api, autoplayPaused]);

  useEffect(() => {
    const interval = setInterval(autoplay, 5000);
    return () => clearInterval(interval);
  }, [autoplay]);

  useEffect(() => {
    if (!api) return;
    
    const onSelect = () => {
      setSelectedIndex(api.selectedScrollSnap());
    };
    
    onSelect();
    api.on('select', onSelect);
    api.on('reInit', onSelect);
    
    return () => {
      api.off('select', onSelect);
      api.off('reInit', onSelect);
    };
  }, [api]);

  const onMouseEnter = () => setAutoplayPaused(true);
  const onMouseLeave = () => setAutoplayPaused(false);

  const onKeyDown = (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      setAutoplayPaused(prev => !prev);
    }
  };

  const handleImageLoad = (index) => {
    setLoading(prev => {
      const newLoading = [...prev];
      newLoading[index] = false;
      return newLoading;
    });
  };

  return (
    <div 
      className="relative w-full max-w-5xl mx-auto mt-8" 
      role="region" 
      aria-label="Image carousel"
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      <CarouselComponent
        opts={{ 
          loop: true,
          dragFree: true,
          skipSnaps: false,
          dragThreshold: 20,
        }}
        className="w-full"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onApi={setApi}
      >
        <CarouselContent>
          {images.map((src, index) => (
            <CarouselItem key={index}>
              <div className="relative p-1">
                {loading[index] && (
                  <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg" />
                )}
                <img 
                  src={src} 
                  alt={`Slide ${index + 1}`} 
                  className={cn(
                    "w-full h-[400px] object-cover rounded-lg transition-opacity duration-300",
                    loading[index] ? "opacity-0" : "opacity-100"
                  )}
                  onLoad={() => handleImageLoad(index)}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </CarouselComponent>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            className={cn(
              "w-2 h-2 rounded-full transition-all",
              selectedIndex === index ? "bg-white w-4" : "bg-white/50"
            )}
            onClick={() => api?.scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};