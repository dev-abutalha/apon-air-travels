'use client';

import { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export function AlbumViewer({ images }: { images: Array<{ url: string; alt?: string; caption?: string }> }) {
  const [active, setActive] = useState<number | null>(null);

  if (!images.length) return null;

  const open = (i: number) => setActive(i);
  const close = () => setActive(null);
  const prev = () => setActive((i) => (i === null ? i : (i - 1 + images.length) % images.length));
  const next = () => setActive((i) => (i === null ? i : (i + 1) % images.length));

  return (
    <>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => open(i)}
            className="group overflow-hidden rounded-lg border bg-slate-200"
            aria-label={`View image ${i + 1}`}
          >
            <div className="aspect-square">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.url}
                alt={img.alt || `Gallery image ${i + 1}`}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              />
            </div>
          </button>
        ))}
      </div>

      {active !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
          <button onClick={close} className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20" aria-label="Close">
            <X className="h-6 w-6" />
          </button>
          <button onClick={prev} className="absolute left-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20" aria-label="Previous">
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button onClick={next} className="absolute right-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20" aria-label="Next">
            <ChevronRight className="h-6 w-6" />
          </button>
          <div className="max-h-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[active].url}
              alt={images[active].alt || 'Gallery image'}
              className="max-h-[85vh] max-w-full rounded-lg object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
}
