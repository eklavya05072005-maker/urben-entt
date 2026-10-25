'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Instagram, ArrowUpRight, Grid, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { MediaGalleryItem } from '@/types';

interface SocialSectionProps {
  mediaGallery?: MediaGalleryItem[];
}

const DEFAULT_PHOTOS: MediaGalleryItem[] = [
  {
    id: 'soc-1',
    url: '/assets/events/nocturne/main-poster.png',
    mediaType: 'image',
    title: 'NOCTURNE Announcement',
    caption: 'NOCTURNE announcement at Mall of Asia. When the dark rises.',
    tag: '#Nocturne2026',
    createdAt: '2026-10-15T00:00:00Z',
  },
  {
    id: 'soc-2',
    url: '/assets/events/nocturne/dj-katz-poster.png',
    mediaType: 'image',
    title: 'DJ KATZ Artist Showcase',
    caption: 'DJ KATZ takes the helm. Peak time hypnotic techno.',
    tag: '#DJKatz',
    createdAt: '2026-10-16T00:00:00Z',
  },
  {
    id: 'soc-3',
    url: '/assets/events/nocturne/mystery-match.png',
    mediaType: 'image',
    title: 'MISTERY MATCH Activity Feature',
    caption: 'Same number. Different souls. 17 Boys / 17 Girls.',
    tag: '#MisteryMatch',
    createdAt: '2026-10-17T00:00:00Z',
  },
  {
    id: 'soc-4',
    url: '/assets/reference/bengaluru-schedule.png',
    mediaType: 'image',
    title: 'Bengaluru Nightlife Schedule',
    caption: 'Curating the electronic underground scene in Bengaluru.',
    tag: '#BengaluruNightlife',
    createdAt: '2026-10-18T00:00:00Z',
  },
];

export default function SocialSection({ mediaGallery }: SocialSectionProps) {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);

  // Filter gallery items for images only
  const allPhotos = (mediaGallery && mediaGallery.length > 0)
    ? mediaGallery.filter((m) => m.mediaType === 'image')
    : DEFAULT_PHOTOS;

  // Maximum 4 photos on Home as requested in #4
  const displayPhotos = allPhotos.slice(0, 4);
  const hasExtraPhotos = allPhotos.length > 4;

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activePhotoIndex === null) return;
    setActivePhotoIndex((activePhotoIndex + 1) % allPhotos.length);
  };

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activePhotoIndex === null) return;
    setActivePhotoIndex((activePhotoIndex - 1 + allPhotos.length) % allPhotos.length);
  };

  return (
    <section id="social-section" className="py-20 bg-[#080808] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center space-x-2 text-brand-red font-mono text-xs uppercase tracking-widest mb-2">
              <Instagram className="w-4 h-4" />
              <span>FOLLOW THE UNDERGROUND</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-display font-black text-white tracking-tight uppercase">
              INSTAGRAM DISPATCHES
            </h2>
          </div>
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={() => setIsGalleryOpen(true)}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-mono uppercase tracking-wider text-white transition-colors"
            >
              <Grid className="w-3.5 h-3.5 text-brand-red" />
              <span>Explore Gallery ({allPhotos.length})</span>
            </button>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-brand-silver hover:text-brand-red transition-colors"
            >
              <span>@URBEN.ENTT</span>
              <ArrowUpRight className="w-4 h-4 text-brand-red" />
            </a>
          </div>
        </div>

        {/* Max 4 Photos Grid on Homepage */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {displayPhotos.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => setActivePhotoIndex(idx)}
              className="group relative aspect-square bg-[#151515] overflow-hidden border border-white/10 hover:border-brand-red/60 transition-all cursor-pointer block"
            >
              <Image
                src={item.url}
                alt={item.title || item.caption || 'Instagram Photo'}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <span className="text-[11px] font-mono text-brand-red font-bold uppercase">{item.tag || '#URBEN'}</span>
                <p className="text-xs text-white line-clamp-2 mt-1">{item.caption || item.title}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Extra photos callout if there are more than 4 */}
        {hasExtraPhotos && (
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsGalleryOpen(true)}
              className="text-xs font-mono uppercase tracking-wider text-brand-red hover:underline"
            >
              + {allPhotos.length - 4} MORE PHOTOS IN EXPLORE GALLERY
            </button>
          </div>
        )}
      </div>

      {/* Explore Gallery Modal (Shows all photos) */}
      {isGalleryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-5xl bg-[#111111] border border-white/15 p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <div>
                <h3 className="text-xl font-display font-black text-white uppercase">
                  URBEN.ENTT PHOTO GALLERY
                </h3>
                <span className="text-xs font-mono text-zinc-400">
                  {allPhotos.length} DISPATCHES ARCHIVED
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsGalleryOpen(false)}
                className="p-2 text-zinc-400 hover:text-white"
                aria-label="Close Gallery Modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {allPhotos.map((photo, index) => (
                <div
                  key={photo.id}
                  onClick={() => setActivePhotoIndex(index)}
                  className="group relative aspect-square bg-[#1a1a1a] border border-white/10 hover:border-brand-red overflow-hidden cursor-pointer"
                >
                  <Image
                    src={photo.url}
                    alt={photo.title || 'Gallery item'}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover object-center group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end">
                    <span className="text-[10px] font-mono text-brand-red font-bold uppercase">{photo.tag || '#URBEN'}</span>
                    <p className="text-[11px] text-white line-clamp-2">{photo.caption || photo.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Single Photo Lightbox Viewer */}
      {activePhotoIndex !== null && allPhotos[activePhotoIndex] && (
        <div
          onClick={() => setActivePhotoIndex(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-lg"
        >
          <button
            type="button"
            onClick={() => setActivePhotoIndex(null)}
            className="absolute top-6 right-6 p-2 text-zinc-400 hover:text-white z-50"
            aria-label="Close Lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            type="button"
            onClick={handlePrevPhoto}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/60 hover:bg-brand-red text-white border border-white/10 z-50 transition-colors"
            aria-label="Previous Photo"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            type="button"
            onClick={handleNextPhoto}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/60 hover:bg-brand-red text-white border border-white/10 z-50 transition-colors"
            aria-label="Next Photo"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-4xl max-h-[85vh] flex flex-col items-center justify-center relative border border-white/15 bg-[#111111]"
          >
            <div className="relative w-[80vw] max-w-3xl aspect-[4/3] max-h-[70vh] bg-black">
              <Image
                src={allPhotos[activePhotoIndex].url}
                alt={allPhotos[activePhotoIndex].title || 'Photo Lightbox'}
                fill
                sizes="80vw"
                className="object-contain"
              />
            </div>
            <div className="w-full p-4 bg-[#141414] border-t border-white/10 flex items-center justify-between text-xs font-mono">
              <div>
                <span className="text-brand-red font-bold uppercase">{allPhotos[activePhotoIndex].tag || '#URBEN'}</span>
                <p className="text-zinc-300 mt-0.5">{allPhotos[activePhotoIndex].caption || allPhotos[activePhotoIndex].title}</p>
              </div>
              <span className="text-zinc-500">
                {activePhotoIndex + 1} / {allPhotos.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
