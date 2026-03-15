"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface Props {
  src: string;
  alt: string;
  caption: string;
}

export default function InfographicLightbox({ src, alt, caption }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handler);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handler);
    };
  }, [open]);

  return (
    <>
      {/* Thumbnail on page */}
      <section className="mb-16">
        <button
          onClick={() => setOpen(true)}
          className="block w-full rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-zoom-in"
        >
          <Image
            src={src}
            alt={alt}
            width={1400}
            height={800}
            className="w-full h-auto"
            priority
          />
        </button>
        <p className="text-xs text-gray-400 mt-3 text-center">{caption}</p>
      </section>

      {/* Lightbox overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setOpen(false)}
        >
          <button
            className="absolute top-4 right-4 text-white/80 hover:text-white text-3xl font-light transition-colors z-10"
            onClick={() => setOpen(false)}
            aria-label="Close"
          >
            ✕
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            className="max-w-full max-h-full object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
