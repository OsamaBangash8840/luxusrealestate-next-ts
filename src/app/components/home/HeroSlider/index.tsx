'use client';
import React from "react";
import dynamic from "next/dynamic";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { settings, slides } from "@/app/base/utils/data";
import { MImage, Typography } from "../../common";
import "../../../globals.css";

// Dynamically import react-slick
const Slider = dynamic(() => import("react-slick"), { ssr: false });

// Custom Left Arrow
const PrevArrow = ({ onClick }: { onClick?: () => void }) => (
  <button
    className="absolute top-1/2 left-4 z-10 -translate-y-1/2 bg-gray-800 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-md hover:bg-gray-700"
    onClick={onClick}
  >
    &#8592;
  </button>
);

// Custom Right Arrow
const NextArrow = ({ onClick }: { onClick?: () => void }) => (
  <button
    className="absolute top-1/2 right-4 z-10 -translate-y-1/2 bg-gray-800 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-md hover:bg-gray-700"
    onClick={onClick}
  >
    &#8594;
  </button>
);

export const HeroSlider = () => {
  // Add custom arrows to settings
  const carouselSettings = {
    ...settings,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <div className="homepage-carousel relative">
      <Slider {...carouselSettings}>
        {slides.map((slide) => (
          <div key={slide.id} className="slide relative">
            {/* MImage component with responsive classes */}
            <MImage
              src={slide.image}
              alt={slide.title}
              w={1000}
              h={1000}
              className="w-full h-full object-cover"  // Set width and height to full container size
            />
            <div className="overlay text-left absolute inset-0 flex flex-col items-start justify-center bg-black bg-opacity-60 text-white">
              <Typography variant="h1"  className="mb-2 text-primary">{slide.title}</Typography>
              <Typography variant="h3" className="mx-[170px]">{slide.description}</Typography>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

