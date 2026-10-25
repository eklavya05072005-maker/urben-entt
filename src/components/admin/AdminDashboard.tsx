'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Plus,
  LogOut,
  Clock,
  CheckCircle,
  UploadCloud,
  FileText,
  AlertTriangle,
  History,
  Mail,
  ExternalLink,
  Edit,
  Trash2,
  Send,
  Eye,
  ImageIcon,
  Video,
  Copy,
  Check,
  Loader2,
} from 'lucide-react';
import { UrbenEvent, AdminUser, Enquiry, AuditLog, EventStatus, MediaGalleryItem } from '@/types';
import EventModal from '@/components/admin/EventModal';
import {
  fetchAdminEventsApi,
  fetchAdminEnquiriesApi,
  fetchAdminAuditApi,
  fetchMediaGalleryApi,
  uploadMediaApi,
  deleteMediaApi,
  updateEventStatusApi,
  deleteEventApi,
} from '@/lib/api';

interface AdminDashboardProps {
  initialUser: AdminUser;
  onLogout: () => void;
}

export default function AdminDashboard({ initialUser, onLogout }: AdminDashboardProps) {
  const [user] = useState<AdminUser>(initialUser);
  const [activeTab, setActiveTab] = useState<'events' | 'enquiries' | 'media' | 'audit'>('events');
  const [events, setEvents] = useState<UrbenEvent[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [mediaGallery, setMediaGallery] = useState<MediaGalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState<{ text: string; isError?: boolean } | null>(null);

  // Upload Form State
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadCaption, setUploadCaption] = useState('');
  const [uploadTag, setUploadTag] = useState('#URBEN');
  const [uploadUrl, setUploadUrl] = useState('');
  const [uploadBase64, setUploadBase64] = useState<string | null>(null);
  const [uploadFileName, setUploadFileName] = useState('');
  const [uploadFileType, setUploadFileType] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [copiedMediaId, setCopiedMediaId] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<UrbenEvent | null>(null);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [eventsData, enquiriesData, auditData, mediaData] = await Promise.all([
        fetchAdminEventsApi(),
        fetchAdminEnquiriesApi(),
        fetchAdminAuditApi(),
        fetchMediaGalleryApi(),
      ]);

      setEvents(eventsData);
      setEnquiries(enquiriesData);
      setAuditLogs(auditData);
      setMediaGallery(mediaData);
    } catch {
      setActionMessage({ text: 'Error fetching latest data', isError: true });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleStatusTransition = async (eventId: string, newStatus: EventStatus) => {
    setActionMessage(null);
    try {
      const res = await updateEventStatusApi(eventId, newStatus);
      if (!res.success) {
        setActionMessage({ text: res.error || 'Status update denied', isError: true });
      } else {
        setActionMessage({ text: `Event transitioned to ${newStatus.toUpperCase()}` });
        fetchDashboardData();
      }
    } catch {
      setActionMessage({ text: 'Network failure during status update', isError: true });
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Are you sure you want to permanently delete this event?')) return;
    try {
      const res = await deleteEventApi(eventId);
      if (!res.success) {
        setActionMessage({ text: res.error || 'Delete failed', isError: true });
      } else {
        setActionMessage({ text: 'Event deleted successfully' });
        fetchDashboardData();
      }
    } catch {
      setActionMessage({ text: 'Network error deleting event', isError: true });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadFileName(file.name);
    setUploadFileType(file.type);
    if (!uploadTitle) {
      setUploadTitle(file.name.replace(/\.[^/.]+$/, ''));
    }

    const reader = new FileReader();
    reader.onload = () => {
      setUploadBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadBase64 && !uploadUrl) {
      setActionMessage({ text: 'Please select a file to upload or enter a URL', isError: true });
      return;
    }

    setIsUploading(true);
    setActionMessage(null);
    try {
      const res = await uploadMediaApi({
        fileName: uploadFileName,
        fileType: uploadFileType,
        dataBase64: uploadBase64 || undefined,
        url: uploadUrl || undefined,
        title: uploadTitle,
        caption: uploadCaption,
        tag: uploadTag,
      });

      if (!res.success) {
        setActionMessage({ text: res.error || 'Upload failed', isError: true });
      } else {
        setActionMessage({ text: 'Media asset uploaded and saved to gallery successfully!' });
        setUploadTitle('');
        setUploadCaption('');
        setUploadTag('#URBEN');
        setUploadUrl('');
        setUploadBase64(null);
        setUploadFileName('');
        setUploadFileType('');
        fetchDashboardData();
      }
    } catch {
      setActionMessage({ text: 'Network failure during media upload', isError: true });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteMedia = async (mediaId: string) => {
    if (!confirm('Are you sure you want to remove this media asset?')) return;
    try {
      const res = await deleteMediaApi(mediaId);
      if (!res.success) {
        setActionMessage({ text: res.error || 'Delete failed', isError: true });
      } else {
        setActionMessage({ text: 'Media asset deleted successfully' });
        fetchDashboardData();
      }
    } catch {
      setActionMessage({ text: 'Network error deleting media', isError: true });
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMediaId(id);
    setTimeout(() => setCopiedMediaId(null), 2000);
  };

  const getStatusBadge = (status: EventStatus) => {
    switch (status) {
      case 'draft':
        return (
          <span className="px-2.5 py-1 text-[10px] font-mono uppercase bg-zinc-800 text-zinc-300 border border-zinc-700">
            DRAFT
          </span>
        );
      case 'review_pending':
        return (
          <span className="px-2.5 py-1 text-[10px] font-mono uppercase bg-yellow-950/80 text-yellow-400 border border-yellow-700/60 animate-pulse">
            REVIEW PENDING
          </span>
        );
      case 'approved':
        return (
          <span className="px-2.5 py-1 text-[10px] font-mono uppercase bg-blue-950/80 text-blue-400 border border-blue-700/60">
            APPROVED
          </span>
        );
      case 'published':
        return (
          <span className="px-2.5 py-1 text-[10px] font-mono uppercase bg-emerald-950/80 text-emerald-400 border border-emerald-700/60">
            PUBLISHED (LIVE)
          </span>
        );
      case 'archived':
        return (
          <span className="px-2.5 py-1 text-[10px] font-mono uppercase bg-zinc-900 text-zinc-500 border border-zinc-800">
            ARCHIVED
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] text-brand-silver">
      {/* Admin Top Navigation */}
      <header className="bg-[#111111] border-b border-white/10 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <Link
            href="/"
            className="text-lg font-display font-black tracking-widest text-white uppercase"
          >
            URBEN<span className="text-brand-red">.</span>ENTT
          </Link>
          <span className="hidden sm:inline-block px-2.5 py-0.5 text-[10px] font-mono uppercase bg-white/5 border border-white/10 text-zinc-400">
            CONTROL CENTER
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-xs font-mono text-white font-bold">{user.fullName}</div>
            <div className="text-[10px] font-mono uppercase text-brand-red font-semibold">
              ROLE: {user.role.replace('_', ' ')}
            </div>
          </div>

          <Link
            href="/"
            target="_blank"
            className="p-2 text-zinc-400 hover:text-white"
            title="View Public Site"
          >
            <Eye className="w-4 h-4" />
          </Link>

          <button
            type="button"
            onClick={onLogout}
            className="p-2 text-zinc-400 hover:text-brand-red transition-colors"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Banner Alert if any */}
        {actionMessage && (
          <div
            className={`mb-6 p-4 text-xs font-mono border flex items-center justify-between ${
              actionMessage.isError
                ? 'bg-red-950/70 border-brand-red text-white'
                : 'bg-emerald-950/70 border-emerald-600 text-white'
            }`}
          >
            <span>{actionMessage.text}</span>
            <button
              type="button"
              onClick={() => setActionMessage(null)}
              className="text-zinc-400 hover:text-white text-sm"
            >
              ✕
            </button>
          </div>
        )}

        {/* Tab Header & Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4 mb-8">
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setActiveTab('events')}
              className={`px-4 py-2 text-xs font-mono uppercase tracking-wider flex items-center space-x-2 transition-colors ${
                activeTab === 'events'
                  ? 'bg-brand-red text-white font-bold'
                  : 'bg-white/5 text-zinc-400 hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Events & Workflow ({events.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('enquiries')}
              className={`px-4 py-2 text-xs font-mono uppercase tracking-wider flex items-center space-x-2 transition-colors ${
                activeTab === 'enquiries'
                  ? 'bg-brand-red text-white font-bold'
                  : 'bg-white/5 text-zinc-400 hover:text-white'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Enquiries ({enquiries.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('media')}
              className={`px-4 py-2 text-xs font-mono uppercase tracking-wider flex items-center space-x-2 transition-colors ${
                activeTab === 'media'
                  ? 'bg-brand-red text-white font-bold'
                  : 'bg-white/5 text-zinc-400 hover:text-white'
              }`}
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Media & Uploads ({mediaGallery.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('audit')}
              className={`px-4 py-2 text-xs font-mono uppercase tracking-wider flex items-center space-x-2 transition-colors ${
                activeTab === 'audit'
                  ? 'bg-brand-red text-white font-bold'
                  : 'bg-white/5 text-zinc-400 hover:text-white'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Audit History</span>
            </button>
          </div>

          {activeTab === 'events' && (
            <button
              type="button"
              onClick={() => {
                setEditingEvent(null);
                setIsModalOpen(true);
              }}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-brand-red text-white text-xs font-mono uppercase tracking-wider font-bold transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Create Event Draft</span>
            </button>
          )}
        </div>

        {/* TAB 1: EVENTS */}
        {activeTab === 'events' && (
          <div className="space-y-4">
            {events.length === 0 ? (
              <div className="p-12 text-center bg-[#111111] border border-white/10">
                <p className="text-sm font-mono text-zinc-400">No events found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto border border-white/10 bg-[#111111]">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#181818] border-b border-white/10 text-zinc-400 uppercase">
                    <tr>
                      <th className="p-4">Event & Category</th>
                      <th className="p-4">Date / Venue</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Created By</th>
                      <th className="p-4 text-right">Workflow Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {events.map((evt) => (
                      <tr key={evt.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="p-4">
                          <div className="font-bold text-white text-sm uppercase flex items-center space-x-2">
                            <span>{evt.title}</span>
                            {evt.isFeatured && (
                              <span className="px-1.5 py-0.5 text-[9px] bg-brand-red text-white uppercase">
                                FEATURED
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-zinc-500 mt-0.5">{evt.category}</div>
                          <div className="text-[10px] text-zinc-600">/{evt.slug}</div>
                        </td>

                        <td className="p-4 text-zinc-300">
                          <div>{evt.timeDisplay}</div>
                          <div className="text-zinc-500">{evt.venueName}, {evt.city}</div>
                        </td>

                        <td className="p-4">{getStatusBadge(evt.status)}</td>

                        <td className="p-4 text-zinc-400">
                          <div>{evt.createdBy}</div>
                          {evt.approvedBy && (
                            <div className="text-[10px] text-zinc-600">
                              Apprv: {evt.approvedBy}
                            </div>
                          )}
                        </td>

                        <td className="p-4 text-right space-x-2">
                          {/* Event Admin Actions */}
                          {user.role === 'event_admin' && (
                            <>
                              {evt.status === 'draft' && (
                                <button
                                  type="button"
                                  onClick={() => handleStatusTransition(evt.id, 'review_pending')}
                                  className="px-2.5 py-1 bg-yellow-950/80 hover:bg-yellow-800 text-yellow-300 border border-yellow-700/60 uppercase text-[10px]"
                                  title="Submit to Owner for Review"
                                >
                                  Submit Review
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingEvent(evt);
                                  setIsModalOpen(true);
                                }}
                                className="p-1.5 text-zinc-400 hover:text-white"
                                title="Edit Draft"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}

                          {/* Owner / Developer Full Publishing Powers */}
                          {user.role !== 'event_admin' && (
                            <>
                              {evt.status === 'review_pending' && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => handleStatusTransition(evt.id, 'approved')}
                                    className="px-2 py-1 bg-blue-900 hover:bg-blue-800 text-blue-200 uppercase text-[10px]"
                                  >
                                    Approve
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleStatusTransition(evt.id, 'published')}
                                    className="px-2 py-1 bg-emerald-900 hover:bg-emerald-800 text-emerald-200 uppercase text-[10px]"
                                  >
                                    Approve & Publish
                                  </button>
                                </>
                              )}

                              {evt.status === 'approved' && (
                                <button
                                  type="button"
                                  onClick={() => handleStatusTransition(evt.id, 'published')}
                                  className="px-2 py-1 bg-emerald-900 hover:bg-emerald-800 text-emerald-200 uppercase text-[10px]"
                                >
                                  Publish Live
                                </button>
                              )}

                              {evt.status === 'published' && (
                                <button
                                  type="button"
                                  onClick={() => handleStatusTransition(evt.id, 'draft')}
                                  className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 uppercase text-[10px]"
                                >
                                  Unpublish to Draft
                                </button>
                              )}

                              {evt.status === 'draft' && (
                                <button
                                  type="button"
                                  onClick={() => handleStatusTransition(evt.id, 'published')}
                                  className="px-2 py-1 bg-emerald-950/80 hover:bg-emerald-800 text-emerald-300 border border-emerald-700/60 uppercase text-[10px]"
                                >
                                  Quick Publish
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() => {
                                  setEditingEvent(evt);
                                  setIsModalOpen(true);
                                }}
                                className="p-1.5 text-zinc-400 hover:text-white"
                                title="Edit Event"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDeleteEvent(evt.id)}
                                className="p-1.5 text-zinc-500 hover:text-brand-red"
                                title="Delete Event"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ENQUIRIES */}
        {activeTab === 'enquiries' && (
          <div className="space-y-4">
            {enquiries.length === 0 ? (
              <div className="p-12 text-center bg-[#111111] border border-white/10">
                <p className="text-sm font-mono text-zinc-400">No client enquiries received yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {enquiries.map((enq) => (
                  <div key={enq.id} className="p-6 bg-[#111111] border border-white/10 space-y-3 font-mono text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-brand-red font-bold uppercase">{enq.enquiryType}</span>
                      <span className="text-zinc-500">{new Date(enq.createdAt).toLocaleDateString()}</span>
                    </div>

                    <h4 className="text-base font-display font-bold text-white uppercase">
                      {enq.fullName}
                    </h4>

                    <div className="text-zinc-400 space-y-1">
                      <div>Email: <a href={`mailto:${enq.email}`} className="text-white hover:underline">{enq.email}</a></div>
                      {enq.phone && <div>Phone: <span className="text-white">{enq.phone}</span></div>}
                      {enq.eventDate && <div>Target Date: <span className="text-white">{enq.eventDate}</span></div>}
                      {enq.estimatedGuests && <div>Est. Guests: <span className="text-white">{enq.estimatedGuests}</span></div>}
                    </div>

                    <div className="p-3 bg-black/40 border border-white/5 text-zinc-300 leading-relaxed font-sans text-xs">
                      {enq.message}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: MEDIA & UPLOADS */}
        {activeTab === 'media' && (
          <div className="space-y-8">
            {/* Upload Form Box */}
            <div className="p-6 sm:p-8 bg-[#111111] border border-white/10 space-y-6">
              <div className="flex items-center space-x-3 pb-4 border-b border-white/10">
                <UploadCloud className="w-5 h-5 text-brand-red" />
                <h3 className="text-base font-display font-bold text-white uppercase tracking-wider">
                  UPLOAD PHOTOS & VIDEOS (OWNER / ADMIN)
                </h3>
              </div>

              <form onSubmit={handleUploadSubmit} className="space-y-4 font-mono text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* File Upload Zone */}
                  <div>
                    <label className="block text-zinc-400 uppercase mb-1">
                      Choose File (Image or Video)
                    </label>
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleFileSelect}
                      className="w-full p-2 bg-[#090909] border border-white/15 text-zinc-300 file:mr-4 file:py-1.5 file:px-3 file:border-0 file:text-xs file:font-mono file:bg-brand-red file:text-white file:uppercase file:cursor-pointer hover:file:bg-brand-red-glow"
                    />
                    {uploadFileName && (
                      <p className="text-[11px] text-zinc-500 mt-1">
                        Selected: <span className="text-white">{uploadFileName}</span> ({uploadFileType})
                      </p>
                    )}
                  </div>

                  {/* Or Direct URL */}
                  <div>
                    <label className="block text-zinc-400 uppercase mb-1">
                      Or Direct Media URL / Path
                    </label>
                    <input
                      type="text"
                      value={uploadUrl}
                      onChange={(e) => setUploadUrl(e.target.value)}
                      placeholder="/assets/events/nocturne/main-poster.png or https://..."
                      className="w-full p-2.5 bg-[#090909] border border-white/15 text-white focus:border-brand-red focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-zinc-400 uppercase mb-1">Title *</label>
                    <input
                      type="text"
                      required
                      value={uploadTitle}
                      onChange={(e) => setUploadTitle(e.target.value)}
                      placeholder="e.g. NOCTURNE Crowd Shot"
                      className="w-full p-2.5 bg-[#090909] border border-white/15 text-white focus:border-brand-red focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 uppercase mb-1">Caption</label>
                    <input
                      type="text"
                      value={uploadCaption}
                      onChange={(e) => setUploadCaption(e.target.value)}
                      placeholder="e.g. Peak time energy inside Mall of Asia"
                      className="w-full p-2.5 bg-[#090909] border border-white/15 text-white focus:border-brand-red focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 uppercase mb-1">Tag (Hashtag)</label>
                    <input
                      type="text"
                      value={uploadTag}
                      onChange={(e) => setUploadTag(e.target.value)}
                      placeholder="#Nocturne2026"
                      className="w-full p-2.5 bg-[#090909] border border-white/15 text-white focus:border-brand-red focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isUploading}
                    className="px-6 py-2.5 bg-brand-red hover:bg-brand-red-glow text-white font-bold uppercase tracking-wider flex items-center space-x-2"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>UPLOADING TO STORE...</span>
                      </>
                    ) : (
                      <>
                        <UploadCloud className="w-4 h-4" />
                        <span>SAVE TO MEDIA ARCHIVE</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Existing Uploaded Media Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-display font-bold text-white uppercase tracking-wider">
                  GALLERY ASSETS ({mediaGallery.length})
                </h4>
                <span className="text-[11px] font-mono text-zinc-500">
                  First 4 photos appear on Homepage Instagram section; all photos viewable via Explore Gallery
                </span>
              </div>

              {mediaGallery.length === 0 ? (
                <div className="p-8 text-center bg-[#111111] border border-white/10 text-xs font-mono text-zinc-400">
                  No media uploaded yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {mediaGallery.map((m, idx) => (
                    <div
                      key={m.id}
                      className="bg-[#121212] border border-white/10 overflow-hidden flex flex-col justify-between group"
                    >
                      <div className="relative aspect-video w-full bg-black overflow-hidden">
                        {m.mediaType === 'video' ? (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900 text-zinc-400">
                            <Video className="w-8 h-8 text-brand-red mb-1" />
                            <span className="text-[10px] font-mono">VIDEO ASSET</span>
                          </div>
                        ) : (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={m.url}
                            alt={m.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                        <span className="absolute top-2 left-2 px-1.5 py-0.5 text-[9px] font-mono uppercase bg-black/80 text-white border border-white/10">
                          {idx < 4 && m.mediaType === 'image' ? 'HOMEPAGE #' + (idx + 1) : m.mediaType.toUpperCase()}
                        </span>
                      </div>

                      <div className="p-4 space-y-2 font-mono text-xs flex-grow flex flex-col justify-between">
                        <div>
                          <div className="text-[10px] text-brand-red uppercase">{m.tag || '#URBEN'}</div>
                          <h5 className="font-bold text-white text-sm truncate uppercase mt-0.5">
                            {m.title}
                          </h5>
                          {m.caption && (
                            <p className="text-[11px] text-zinc-400 line-clamp-2 mt-1 font-sans">
                              {m.caption}
                            </p>
                          )}
                        </div>

                        <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px]">
                          <button
                            type="button"
                            onClick={() => copyToClipboard(m.url, m.id)}
                            className="inline-flex items-center space-x-1 text-zinc-400 hover:text-white"
                            title="Copy URL"
                          >
                            {copiedMediaId === m.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="text-emerald-400 text-[10px]">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span className="text-[10px]">Copy URL</span>
                              </>
                            )}
                          </button>

                          {user.role !== 'event_admin' && (
                            <button
                              type="button"
                              onClick={() => handleDeleteMedia(m.id)}
                              className="text-zinc-500 hover:text-brand-red"
                              title="Delete Media"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: AUDIT TRAIL */}
        {activeTab === 'audit' && (
          <div className="space-y-4">
            <div className="overflow-x-auto border border-white/10 bg-[#111111]">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#181818] border-b border-white/10 text-zinc-400 uppercase">
                  <tr>
                    <th className="p-4">Timestamp</th>
                    <th className="p-4">Action</th>
                    <th className="p-4">Entity</th>
                    <th className="p-4">Actor</th>
                    <th className="p-4">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-white/[0.02]">
                      <td className="p-4 text-zinc-400">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 bg-brand-red/10 border border-brand-red/30 text-brand-red font-bold">
                          {log.action}
                        </span>
                      </td>
                      <td className="p-4 text-zinc-300">{log.entityType} ({log.entityId})</td>
                      <td className="p-4 text-zinc-400">{log.userEmail}</td>
                      <td className="p-4 text-zinc-500 max-w-xs truncate">
                        {log.details ? JSON.stringify(log.details) : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Event Edit / Create Modal */}
      {isModalOpen && (
        <EventModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSaved={() => {
            fetchDashboardData();
            setActionMessage({ text: 'Event saved successfully' });
          }}
          event={editingEvent}
          user={user}
        />
      )}
    </div>
  );
}
