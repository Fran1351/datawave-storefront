"use client";

import { useState, useRef } from "react";
import Image from "next/image";

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({});
  const [isZooming, setIsZooming] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentImage = images[selectedIndex] || images[0];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: "scale(2)",
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Imagen principal con zoom */}
      <div
        ref={containerRef}
        className="relative border border-blue-500/40 rounded-3xl aspect-[3/4] overflow-hidden cursor-zoom-in"
        onMouseEnter={() => setIsZooming(true)}
        onMouseLeave={() => setIsZooming(false)}
        onMouseMove={handleMouseMove}
      >
        {/* Scanlines sutiles */}
        <div
          className="pointer-events-none absolute inset-0 opacity-10 z-10"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, rgba(6,182,212,0.4) 0px, transparent 1px, transparent 3px)",
          }}
        />

        <Image
          src={currentImage}
          alt={productName}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-200 ease-out"
          style={isZooming ? zoomStyle : {}}
        />
      </div>

      {/* Miniaturas - solo se muestran si hay más de una imagen */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${
                selectedIndex === index
                  ? "border-cyan-400"
                  : "border-zinc-700 hover:border-zinc-500"
              }`}
              aria-label={`Ver imagen ${index + 1} de ${productName}`}
            >
              <Image
                src={img}
                alt={`${productName} - vista ${index + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}