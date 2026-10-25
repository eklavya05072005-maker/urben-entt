'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, ArrowRight, Calendar, Archive } from 'lucide-react';
import { UrbenEvent } from '@/types';

interface PastEventsSectionProps {
  events?: UrbenEvent[];
}

export default function PastEventsSection({ events }: PastEventsSectionProps) {
  // Use passed events or empty if none
  const pastEvents = (events || []).filter((e) => e.isPast && e.status === 'published');

  if (pastEvents.length === 0) {
    return null;
  }

  return (
    <section id="past-events-section" className="py-24 sm:py-32 bg-[#080808] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-brand-red mb-3">
              ARCHIVE & RETROSPECTIVES
            </div>
            <h2 className="text-3xl sm:text-5xl font-display font-black text-white tracking-tight uppercase">
              SELECTED PRODUCTIONS
            </h2>
          </div>
          <Link
            href="/past-events"
            className="inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-brand-silver hover:text-brand-red transition-colors"
          >
            <span>VIEW FULL ARCHIVE</span>
            <ArrowRight className="w-4 h-4 text-brand-red" />
          </Link>
        </div>

        {/* Grid of Past Productions (Dynamic from Backend) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pastEvents.map((item) => (
            <Link
              key={item.id}
              href={`/events/${item.slug}`}
              className="group bg-[#111111] border border-white/10 overflow-hidden flex flex-col justify-between hover:border-brand-red/50 transition-all duration-300 block"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-black">
                <Image
                  src={item.posterUrl || '/assets/events/nocturne/main-poster.png'}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                <div className="absolute top-3 right-3 text-[10px] font-mono uppercase px-2 py-0.5 bg-black/80 text-zinc-400 border border-white/10 flex items-center space-x-1">
                  <Archive className="w-3 h-3 text-brand-red" />
                  <span>ARCHIVE</span>
                </div>
              </div>

              {/* Card Meta */}
              <div className="p-6 flex flex-col flex-grow justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono uppercase text-brand-red mb-2">
                    <span>{item.category}</span>
                    <span className="text-zinc-500">{item.timeDisplay}</span>
                  </div>

                  <h3 className="text-xl font-display font-bold text-white uppercase group-hover:text-brand-silver transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-brand-muted mt-2 leading-relaxed line-clamp-2">
                    {item.shortDescription}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-zinc-400">
                  <span className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3 text-brand-red" />
                    <span>{item.venueName}, {item.city}</span>
                  </span>
                  <span className="text-brand-red group-hover:translate-x-1 transition-transform inline-flex items-center space-x-1 text-[11px]">
                    <span>RECAP</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
