'use client';

import React, { useState } from 'react';
import { X, Save, AlertCircle, Loader2 } from 'lucide-react';
import { UrbenEvent, AdminUser } from '@/types';
import { saveEventApi } from '@/lib/api';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  event?: UrbenEvent | null;
  user: AdminUser;
}

function toDatetimeLocal(val?: string): string {
  if (!val) return '2026-11-15T18:00';
  try {
    const d = new Date(val);
    if (isNaN(d.getTime())) return val.slice(0, 16);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  } catch {
    return val.slice(0, 16);
  }
}

export default function EventModal({
  isOpen,
  onClose,
  onSaved,
  event,
  user,
}: EventModalProps) {
  const isEditing = Boolean(event);

  const [formData, setFormData] = useState({
    title: event?.title || '',
    slug: event?.slug || '',
    tagline: event?.tagline || '',
    category: event?.category || 'Nightlife & Techno',
    startDate: toDatetimeLocal(event?.startDate),
    timeDisplay: event?.timeDisplay || '6:00 PM – 11:00 PM',
    venueName: event?.venueName || '',
    city: event?.city || 'Bengaluru',
    venueAddress: event?.venueAddress || '',
    shortDescription: event?.shortDescription || '',
    fullDescription: event?.fullDescription || '',
    experienceNotes: event?.experienceNotes || '',
    agePolicy: event?.agePolicy || '18+ | Club Rules Apply',
    ticketUrl: event?.ticketUrl || 'https://sortmyscene.com',
    ticketingPlatform: event?.ticketingPlatform || 'SortMyScene',
    ticketStatus: event?.ticketStatus || 'Tickets Live',
    posterUrl: event?.posterUrl || '/assets/events/nocturne/main-poster.png',
    promoVideoUrl: event?.promoVideoUrl || '',
    isFeatured: event?.isFeatured || false,
    isPast: event?.isPast || false,
  });

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => {
        const next = { ...prev, [name]: value };
        // Auto-slug if typing title and not yet editing
        if (name === 'title' && !isEditing) {
          next.slug = value
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
        }
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Requirement: Upcoming events require a background/promo video before saving
    const isUpcoming = !formData.isPast;
    if (isUpcoming && !formData.promoVideoUrl?.trim()) {
      setError('A background or promo video URL is required for upcoming events before saving.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        artists: event?.artists || [],
        collaborators: event?.collaborators || [],
        gallery: event?.gallery || [],
        status: event ? event.status : user.role === 'event_admin' ? 'draft' : 'published',
      };

      const result = await saveEventApi(payload, isEditing, event?.id);

      if (!result.success) {
        setError(result.error || 'Failed to save event');
      } else {
        onSaved();
        onClose();
      }
    } catch {
      setError('Connection error saving event');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#111111] border border-white/15 my-8 p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <h2 className="text-xl font-display font-black text-white uppercase">
            {isEditing ? `EDIT EVENT: ${event?.title}` : 'CREATE NEW EVENT DRAFT'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-950/70 border border-brand-red text-xs text-white flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-brand-red flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 text-xs font-mono">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block uppercase text-zinc-400 mb-1">Event Title *</label>
              <input
                type="text"
                required
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. NOCTURNE"
                className="w-full p-2.5 bg-[#0a0a0a] border border-white/15 text-white focus:border-brand-red focus:outline-none"
              />
            </div>

            <div>
              <label className="block uppercase text-zinc-400 mb-1">Slug URL *</label>
              <input
                type="text"
                required
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                placeholder="e.g. nocturne"
                className="w-full p-2.5 bg-[#0a0a0a] border border-white/15 text-white focus:border-brand-red focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block uppercase text-zinc-400 mb-1">Tagline</label>
              <input
                type="text"
                name="tagline"
                value={formData.tagline}
                onChange={handleChange}
                placeholder="e.g. WHEN THE DARK RISES"
                className="w-full p-2.5 bg-[#0a0a0a] border border-white/15 text-white focus:border-brand-red focus:outline-none"
              />
            </div>

            <div>
              <label className="block uppercase text-zinc-400 mb-1">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-2.5 bg-[#0a0a0a] border border-white/15 text-white focus:border-brand-red focus:outline-none"
              >
                <option value="Nightlife & Techno">Nightlife & Techno</option>
                <option value="Festivals & Concerts">Festivals & Concerts</option>
                <option value="Exclusive Parties">Exclusive Parties</option>
                <option value="Club Events">Club Events</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block uppercase text-zinc-400 mb-1">Date & Time *</label>
              <input
                type="datetime-local"
                required
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full p-2.5 bg-[#0a0a0a] border border-white/15 text-white focus:border-brand-red focus:outline-none"
              />
            </div>

            <div>
              <label className="block uppercase text-zinc-400 mb-1">Display Time</label>
              <input
                type="text"
                name="timeDisplay"
                value={formData.timeDisplay}
                onChange={handleChange}
                placeholder="2:00 PM – 6:00 PM"
                className="w-full p-2.5 bg-[#0a0a0a] border border-white/15 text-white focus:border-brand-red focus:outline-none"
              />
            </div>

            <div>
              <label className="block uppercase text-zinc-400 mb-1">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Bengaluru"
                className="w-full p-2.5 bg-[#0a0a0a] border border-white/15 text-white focus:border-brand-red focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block uppercase text-zinc-400 mb-1">Venue Name *</label>
              <input
                type="text"
                required
                name="venueName"
                value={formData.venueName}
                onChange={handleChange}
                placeholder="e.g. Mall of Asia"
                className="w-full p-2.5 bg-[#0a0a0a] border border-white/15 text-white focus:border-brand-red focus:outline-none"
              />
            </div>

            <div>
              <label className="block uppercase text-zinc-400 mb-1">Venue Address</label>
              <input
                type="text"
                name="venueAddress"
                value={formData.venueAddress}
                onChange={handleChange}
                placeholder="Bellary Road, Byatarayanapura, Bengaluru"
                className="w-full p-2.5 bg-[#0a0a0a] border border-white/15 text-white focus:border-brand-red focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block uppercase text-zinc-400 mb-1">Short Description *</label>
            <textarea
              required
              name="shortDescription"
              rows={2}
              value={formData.shortDescription}
              onChange={handleChange}
              placeholder="Brief summary for listings..."
              className="w-full p-2.5 bg-[#0a0a0a] border border-white/15 text-white focus:border-brand-red focus:outline-none"
            />
          </div>

          <div>
            <label className="block uppercase text-zinc-400 mb-1">Full Description *</label>
            <textarea
              required
              name="fullDescription"
              rows={4}
              value={formData.fullDescription}
              onChange={handleChange}
              placeholder="In-depth curatorial and experience narrative..."
              className="w-full p-2.5 bg-[#0a0a0a] border border-white/15 text-white focus:border-brand-red focus:outline-none"
            />
          </div>

          <div>
            <label className="block uppercase text-zinc-400 mb-1">Thematic Activity (e.g. MISTERY MATCH)</label>
            <input
              type="text"
              name="experienceNotes"
              value={formData.experienceNotes}
              onChange={handleChange}
              placeholder="MISTERY MATCH: SAME NUMBER. DIFFERENT SOULS."
              className="w-full p-2.5 bg-[#0a0a0a] border border-white/15 text-white focus:border-brand-red focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block uppercase text-zinc-400 mb-1">Ticketing Platform</label>
              <select
                name="ticketingPlatform"
                value={formData.ticketingPlatform}
                onChange={handleChange}
                className="w-full p-2.5 bg-[#0a0a0a] border border-white/15 text-white focus:border-brand-red focus:outline-none"
              >
                <option value="SortMyScene">SortMyScene</option>
                <option value="Direct RSVP">Direct RSVP</option>
                <option value="Guestlist">Guestlist</option>
                <option value="Exclusive">Exclusive</option>
              </select>
            </div>

            <div>
              <label className="block uppercase text-zinc-400 mb-1">Ticket Status</label>
              <select
                name="ticketStatus"
                value={formData.ticketStatus}
                onChange={handleChange}
                className="w-full p-2.5 bg-[#0a0a0a] border border-white/15 text-white focus:border-brand-red focus:outline-none"
              >
                <option value="Tickets Live">Tickets Live</option>
                <option value="Filling Fast">Filling Fast</option>
                <option value="Sold Out">Sold Out</option>
                <option value="Free Entry w/ Registration">Free Entry w/ Registration</option>
                <option value="Archived">Archived</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block uppercase text-zinc-400 mb-1">Poster Asset Path or URL</label>
              <input
                type="text"
                name="posterUrl"
                value={formData.posterUrl}
                onChange={handleChange}
                placeholder="/assets/events/nocturne/main-poster.png"
                className="w-full p-2.5 bg-[#0a0a0a] border border-white/15 text-white focus:border-brand-red focus:outline-none"
              />
            </div>

            <div>
              <label className="block uppercase text-zinc-400 mb-1">
                Promo / Background Video URL{' '}
                {!formData.isPast ? (
                  <span className="text-brand-red font-bold">* (Required for Upcoming)</span>
                ) : (
                  <span className="text-zinc-500 font-normal">(Optional for Past)</span>
                )}
              </label>
              <input
                type="text"
                name="promoVideoUrl"
                value={formData.promoVideoUrl}
                onChange={handleChange}
                placeholder="/assets/videos/hero-promo.mov or URL"
                className={`w-full p-2.5 bg-[#0a0a0a] border ${
                  !formData.isPast && !formData.promoVideoUrl?.trim()
                    ? 'border-brand-red/60 focus:border-brand-red'
                    : 'border-white/15 focus:border-brand-red'
                } text-white focus:outline-none`}
              />
              {!formData.isPast && (
                <p className="text-[10px] text-zinc-500 mt-1">
                  Autoplays as the background visual on the homepage when this event is featured.
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block uppercase text-zinc-400 mb-1">Ticket Buying Link</label>
            <input
              type="text"
              name="ticketUrl"
              value={formData.ticketUrl}
              onChange={handleChange}
              placeholder="https://sortmyscene.com/event/..."
              className="w-full p-2.5 bg-[#0a0a0a] border border-white/15 text-white focus:border-brand-red focus:outline-none"
            />
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isPast"
                name="isPast"
                checked={formData.isPast}
                onChange={handleChange}
                className="w-4 h-4 rounded bg-[#0a0a0a] border-white/20 text-brand-red focus:ring-brand-red"
              />
              <label htmlFor="isPast" className="uppercase text-white font-bold cursor-pointer">
                Archive as Past Production (Show in Selected Productions & Archive)
              </label>
            </div>

            {user.role !== 'event_admin' && (
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isFeatured"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleChange}
                  className="w-4 h-4 rounded bg-[#0a0a0a] border-white/20 text-brand-red focus:ring-brand-red"
                />
                <label htmlFor="isFeatured" className="uppercase text-white font-bold cursor-pointer">
                  Set as Featured Headline Event on Homepage
                </label>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-white/10 text-zinc-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-brand-red hover:bg-brand-red-glow text-white font-bold uppercase tracking-wider flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>SAVING...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{isEditing ? 'UPDATE EVENT' : 'SAVE EVENT DRAFT'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
