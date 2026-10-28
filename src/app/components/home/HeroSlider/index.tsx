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
    className="absolute top-1/2 left-4 z-10 -translate-y-1/2 bg-background border border-border text-foreground w-12 h-12 flex items-center justify-center transition-colors hover:bg-muted"
    onClick={onClick}
  >
    {"\\u2190"}
  </button>
);

// Custom Right Arrow
const NextArrow = ({ onClick }: { onClick?: () => void }) => (
  <button
    className="absolute top-1/2 right-4 z-10 -translate-y-1/2 bg-background border border-border text-foreground w-12 h-12 flex items-center justify-center transition-colors hover:bg-muted"
    onClick={onClick}
  >
    {"\\u2192"}
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
    <div className="homepage-carousel relative border-b border-border">
      <Slider {...carouselSettings}>
        {slides.map((slide) => (
          <div key={slide.id} className="slide relative">
            {/* MImage component with responsive classes */}
            <MImage
              src={slide.image}
              alt={slide.title}
              w={1000}
              h={1000}
              className="w-full h-full object-cover grayscale-[20%]"  // Set width and height to full container size
            />
            <div className="overlay text-left absolute inset-0 flex flex-col items-start justify-center bg-foreground/40">
              <div className="bg-background border border-border p-8 max-w-2xl ml-[10%] shadow-none">
                <Typography variant="h1"  className="mb-4 text-foreground tracking-tight">{slide.title}</Typography>
                <Typography variant="h3" className="text-muted-foreground font-light">{slide.description}</Typography>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

