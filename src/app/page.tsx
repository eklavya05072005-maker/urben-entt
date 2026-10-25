import React from 'react';
import { fetchFeaturedEvent, fetchCollaborators, fetchPublicEvents, fetchMediaGalleryApi } from '@/lib/api';
import HomeClientWrapper from '@/components/HomeClientWrapper';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [featuredEvent, collaborators, pastEvents, mediaGallery] = await Promise.all([
    fetchFeaturedEvent(),
    fetchCollaborators(),
    fetchPublicEvents({ isPast: true }),
    fetchMediaGalleryApi(),
  ]);

  return (
    <HomeClientWrapper
      featuredEvent={featuredEvent}
      collaborators={collaborators}
      pastEvents={pastEvents}
      mediaGallery={mediaGallery}
    />
  );
}
