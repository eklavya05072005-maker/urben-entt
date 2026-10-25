import type { UrbenEvent, Collaborator, Enquiry, AdminUser, AuditLog, EventStatus, MediaGalleryItem } from '@/types';

/**
 * Returns the normalized backend API base URL.
 * Reads NEXT_PUBLIC_API_URL first, falling back to BACKEND_URL during SSR or http://localhost:5000 locally.
 * Guarantees no double slashes and ends with `/api`.
 */
export function getApiBase(): string {
  const envUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    (typeof window === 'undefined' ? process.env.BACKEND_URL : '') ||
    'http://localhost:5000';

  let cleaned = envUrl.trim().replace(/\/+$/, '');
  if (!cleaned.endsWith('/api')) {
    cleaned = `${cleaned}/api`;
  }
  return cleaned;
}

const TOKEN_KEY = 'urben_session_token';

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setStoredToken(token: string): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // Storage might be disabled
  }
}

export function clearStoredToken(): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // Storage might be disabled
  }
}

function getRequestHeaders(customHeaders: Record<string, string> = {}): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...customHeaders,
  };

  const token = getStoredToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}

// ============================================================================
// Public Endpoints
// ============================================================================

export async function fetchPublicEvents(params?: {
  isPast?: boolean;
  category?: string;
}): Promise<UrbenEvent[]> {
  try {
    const query = new URLSearchParams();
    if (params?.isPast !== undefined) query.set('isPast', String(params.isPast));
    if (params?.category) query.set('category', params.category);

    const qs = query.toString() ? `?${query.toString()}` : '';
    const res = await fetch(`${getApiBase()}/events/public${qs}`, {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.events || [];
  } catch (err) {
    console.error('Failed to fetch public events:', err);
    return [];
  }
}

export async function fetchFeaturedEvent(): Promise<UrbenEvent | null> {
  try {
    const res = await fetch(`${getApiBase()}/events/featured`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.event || null;
  } catch (err) {
    console.error('Failed to fetch featured event:', err);
    return null;
  }
}

export async function fetchEventBySlug(slug: string): Promise<UrbenEvent | null> {
  try {
    const res = await fetch(`${getApiBase()}/events/slug/${encodeURIComponent(slug)}`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.event || null;
  } catch (err) {
    console.error('Failed to fetch event by slug:', err);
    return null;
  }
}

export async function fetchCollaborators(): Promise<Collaborator[]> {
  try {
    const res = await fetch(`${getApiBase()}/events/collaborators`, {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.collaborators || [];
  } catch (err) {
    console.error('Failed to fetch collaborators:', err);
    return [];
  }
}

export async function fetchMediaGalleryApi(): Promise<MediaGalleryItem[]> {
  try {
    const res = await fetch(`${getApiBase()}/media`, {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.media || [];
  } catch (err) {
    console.error('Failed to fetch media gallery:', err);
    return [];
  }
}

export async function submitEnquiryApi(payload: unknown): Promise<{
  success: boolean;
  error?: string;
  errors?: Record<string, string>;
  id?: string;
}> {
  try {
    const res = await fetch(`${getApiBase()}/enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      return {
        success: false,
        error: data.error || 'Failed to submit enquiry',
        errors: data.errors,
      };
    }
    return { success: true, id: data.id };
  } catch (err) {
    console.error('Failed to submit enquiry:', err);
    return { success: false, error: 'Network error communicating with backend' };
  }
}

// ============================================================================
// Authentication & Session Endpoints
// ============================================================================

export async function loginAdminApi(
  email: string,
  password: string
): Promise<{ success: boolean; user?: AdminUser; token?: string; error?: string }> {
  try {
    const res = await fetch(`${getApiBase()}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.error || 'Authentication failed' };
    }

    if (data.token) {
      setStoredToken(data.token);
    }

    return { success: true, user: data.user, token: data.token };
  } catch (err) {
    console.error('Login request error:', err);
    return { success: false, error: 'Unable to connect to authentication server' };
  }
}

export async function logoutAdminApi(): Promise<void> {
  try {
    await fetch(`${getApiBase()}/auth/logout`, {
      method: 'POST',
      headers: getRequestHeaders(),
      credentials: 'include',
    });
  } catch (err) {
    console.error('Logout error:', err);
  } finally {
    clearStoredToken();
  }
}

export async function checkAuthMeApi(): Promise<{
  authenticated: boolean;
  user: AdminUser | null;
}> {
  try {
    const res = await fetch(`${getApiBase()}/auth/me`, {
      headers: getRequestHeaders(),
      credentials: 'include',
    });

    if (!res.ok) {
      return { authenticated: false, user: null };
    }

    const data = await res.json();
    return {
      authenticated: Boolean(data.authenticated),
      user: data.user || null,
    };
  } catch (err) {
    console.error('Auth verification error:', err);
    return { authenticated: false, user: null };
  }
}

// ============================================================================
// Protected Admin Operations
// ============================================================================

export async function fetchAdminEventsApi(): Promise<UrbenEvent[]> {
  try {
    const res = await fetch(`${getApiBase()}/admin/events`, {
      headers: getRequestHeaders(),
      credentials: 'include',
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.events || [];
  } catch (err) {
    console.error('Error fetching admin events:', err);
    return [];
  }
}

export async function fetchAdminEnquiriesApi(): Promise<Enquiry[]> {
  try {
    const res = await fetch(`${getApiBase()}/enquiries`, {
      headers: getRequestHeaders(),
      credentials: 'include',
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.enquiries || [];
  } catch (err) {
    console.error('Error fetching admin enquiries:', err);
    return [];
  }
}

export async function fetchAdminAuditApi(): Promise<AuditLog[]> {
  try {
    const res = await fetch(`${getApiBase()}/admin/audit`, {
      headers: getRequestHeaders(),
      credentials: 'include',
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.logs || [];
  } catch (err) {
    console.error('Error fetching admin audit logs:', err);
    return [];
  }
}

export async function updateEventStatusApi(
  eventId: string,
  newStatus: EventStatus,
  reason?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(`${getApiBase()}/admin/events/${eventId}/status`, {
      method: 'POST',
      headers: getRequestHeaders(),
      credentials: 'include',
      body: JSON.stringify({ status: newStatus, reason }),
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.error || 'Status update denied' };
    }
    return { success: true };
  } catch (err) {
    console.error('Status update network error:', err);
    return { success: false, error: 'Network failure during status update' };
  }
}

export async function deleteEventApi(eventId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(`${getApiBase()}/admin/events/${eventId}`, {
      method: 'DELETE',
      headers: getRequestHeaders(),
      credentials: 'include',
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.error || 'Delete failed' };
    }
    return { success: true };
  } catch (err) {
    console.error('Delete event error:', err);
    return { success: false, error: 'Network error deleting event' };
  }
}

export async function saveEventApi(
  eventData: Partial<UrbenEvent>,
  isEditing: boolean,
  eventId?: string
): Promise<{ success: boolean; error?: string; event?: UrbenEvent }> {
  try {
    const url = isEditing
      ? `${getApiBase()}/admin/events/${eventId}`
      : `${getApiBase()}/admin/events`;

    const res = await fetch(url, {
      method: isEditing ? 'PUT' : 'POST',
      headers: getRequestHeaders(),
      credentials: 'include',
      body: JSON.stringify(eventData),
    });

    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.error || 'Failed to save event' };
    }

    return { success: true, event: data.event };
  } catch (err) {
    console.error('Save event error:', err);
    return { success: false, error: 'Network failure saving event' };
  }
}

export async function uploadMediaApi(payload: {
  fileName?: string;
  fileType?: string;
  dataBase64?: string;
  url?: string;
  title?: string;
  caption?: string;
  tag?: string;
  mediaType?: 'image' | 'video';
}): Promise<{ success: boolean; error?: string; media?: MediaGalleryItem }> {
  try {
    const res = await fetch(`${getApiBase()}/admin/media/upload`, {
      method: 'POST',
      headers: getRequestHeaders(),
      credentials: 'include',
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.error || 'Media upload failed' };
    }

    return { success: true, media: data.media };
  } catch (err) {
    console.error('Upload media API error:', err);
    return { success: false, error: 'Network failure during media upload' };
  }
}

export async function deleteMediaApi(mediaId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(`${getApiBase()}/admin/media/${mediaId}`, {
      method: 'DELETE',
      headers: getRequestHeaders(),
      credentials: 'include',
    });

    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.error || 'Failed to delete media asset' };
    }

    return { success: true };
  } catch (err) {
    console.error('Delete media API error:', err);
    return { success: false, error: 'Network error deleting media asset' };
  }
}
