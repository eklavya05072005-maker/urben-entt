'use client';

import React, { useState } from 'react';
import { UrbenEvent, Collaborator, MediaGalleryItem } from '@/types';
import HeroVideo from '@/components/HeroVideo';
import BrandIntroSection from '@/components/BrandIntroSection';
import FeaturedEventSection from '@/components/FeaturedEventSection';
import PastEventsSection from '@/components/PastEventsSection';
import CollaboratorsSection from '@/components/CollaboratorsSection';
import SocialSection from '@/components/SocialSection';
import EnquiryForm from '@/components/EnquiryForm';
import VideoModal from '@/components/VideoModal';

interface HomeClientWrapperProps {
  featuredEvent: UrbenEvent | null;
  collaborators: Collaborator[];
  pastEvents?: UrbenEvent[];
  mediaGallery?: MediaGalleryItem[];
}

export default function HomeClientWrapper({
  featuredEvent,
  collaborators,
  pastEvents,
  mediaGallery,
}: HomeClientWrapperProps) {
  const [isFilmModalOpen, setIsFilmModalOpen] = useState(false);

  return (
    <>
      {/* 1. Full-screen Video Hero (Autoplay muted without stop button, upcoming event only) */}
      <HeroVideo
        featuredEvent={featuredEvent}
        onOpenFilmModal={() => setIsFilmModalOpen(true)}
      />

      {/* 2. Brand Introduction */}
      <BrandIntroSection />

      {/* 3. Featured Event (NOCTURNE / Headline Production) */}
      {featuredEvent && <FeaturedEventSection event={featuredEvent} />}

      {/* 4. Selected Work & Past Events (Dynamic from backend, no video play modal on Home) */}
      <PastEventsSection events={pastEvents} />

      {/* 5. Instagram Dispatches (Max 4 photos on home + Explore Gallery modal) */}
      <SocialSection mediaGallery={mediaGallery} />

      {/* 6. Trusted Partners (Moved to end of Home before enquiry as requested) */}
      <CollaboratorsSection collaborators={collaborators} />

      {/* 7. Contact & Enquiry CTA */}
      <section id="enquiry-section" className="py-24 sm:py-32 bg-[#0c0c0c] border-t border-white/10 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="text-xs font-mono uppercase tracking-widest text-brand-red mb-2">
              INITIATE A CONVERSATION
            </div>
            <h2 className="text-2xl sm:text-5xl font-display font-black text-white tracking-tight uppercase break-words">
              CREATE WITH URBEN
            </h2>
            <p className="text-brand-muted text-sm sm:text-base mt-3 max-w-lg mx-auto">
              Ready to stage a festival, curate an underground club night, or engineer an unforgettable brand activation? Let’s begin.
            </p>
          </div>

          <div className="bg-[#111111] border border-white/10 p-4 sm:p-10 shadow-2xl">
            <EnquiryForm />
          </div>
        </div>
      </section>

      {/* Video Lightbox Modal for Brand Experience Film */}
      <VideoModal
        isOpen={isFilmModalOpen}
        onClose={() => setIsFilmModalOpen(false)}
        videoSrc="/assets/videos/hero-promo.mov"
        title="URBEN.ENTT — Official Brand Experience Film"
      />
    </>
  );
}
