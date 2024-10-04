import React from 'react';
import { Carousel as CarouselComponent, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';

const images = [
  '/carousel/1.jpg',
  '/carousel/2.jpg',
  '/carousel/3.jpg',
  '/carousel/4.jpg',
  '/carousel/5.jpg',
  '/carousel/6.jpg',
  '/carousel/7.jpg',
  '/carousel/8.jpg',
];

export const Carousel = () => {
  return (
    <CarouselComponent className="w-full max-w-5xl mx-auto mt-8">
      <CarouselContent>
        {images.map((src, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <img src={src} alt={`Slide ${index + 1}`} className="w-full h-[400px] object-cover rounded-lg" />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </CarouselComponent>
  );
};