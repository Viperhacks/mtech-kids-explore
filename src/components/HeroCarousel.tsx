
import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

import mtechInfo from '@/assets/mtech_logo.svg';
import firstImage from "@/assets/img2.jpg";
import partyCelebrations from '@/assets/img3.jpg';
import scienceImg from '@/assets/science-fair.jpg';


const carouselItems = [
  {
    id: 1,
    image: mtechInfo, 
    alt: 'Mtech Academy Info',
    title: 'Educational Excellence',
    description: 'Stated in 2017 3373 Nehanda Cop. Dzivarasekwa Extension.'
  },
  {
    id: 2,
    image: firstImage,
    alt: 'ECD  Student with certificate',
    title: 'Charmine Makamba - E.C.D 2018',
    description: 'Best Student-Keep on working hard'
  },
  {
    id: 3,
    image: partyCelebrations,
    alt: '2017 E.C.D Party Celebrations',
    title: 'Party Celebrations',
    description: 'Party Celebrations 2017 ECD'
  },
  {
    id: 4,
    image: scienceImg,
    alt: 'Science fair projects',
    title: 'Science Projects Display',
    description: 'Bottle rockets, potato-powered bulbs, and creative minds in action'
  },
];


const HeroCarousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto slide functionality
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(slideInterval);
  }, []);

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);
  };

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative w-full max-h-[500px] overflow-hidden">
      <div 
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {carouselItems.map((item) => (
          <div 
            key={item.id} 
            className="min-w-full h-[300px] md:h-[400px] lg:h-[500px] relative"
          >
            <img 
              src={item.image} 
              alt={item.alt}
              className="w-full h-full object-contain" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6 md:p-10">
              <h2 className="text-white text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
                {item.title}
              </h2>
              <p className="text-white/90 text-sm md:text-base lg:text-lg max-w-2xl">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button 
        onClick={goToPrevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 backdrop-blur-sm hover:bg-white/50 text-white rounded-full p-2 transition-all"
        aria-label="Previous slide"
      >
        <ArrowLeft size={24} />
      </button>

      <button 
        onClick={goToNextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 backdrop-blur-sm hover:bg-white/50 text-white rounded-full p-2 transition-all"
        aria-label="Next slide"
      >
        <ArrowRight size={24} />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {carouselItems.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              currentSlide === index ? 'bg-white scale-125' : 'bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
