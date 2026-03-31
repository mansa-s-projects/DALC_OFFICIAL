// ─── Move to Dubai — Tracking + Attribution Utility ─────────────────────────

export const MOVE_TO_DUBAI_EVENTS = {
  LANDING_START_MOVE_CLICK: 'move_to_dubai_landing_start_move_click',
  LANDING_WHATSAPP_HERO_CLICK: 'move_to_dubai_landing_whatsapp_hero_click',
  LANDING_WHATSAPP_FLOATING_CLICK: 'move_to_dubai_landing_whatsapp_floating_click',
  LANDING_WHATSAPP_CONTACT_CLICK: 'move_to_dubai_landing_whatsapp_contact_click',
  LANDING_LEAD_FORM_SUBMIT_SUCCESS: 'move_to_dubai_landing_lead_form_submit_success',
  SERVICE_START_MOVE_CLICK: 'move_to_dubai_service_start_move_click',
  SERVICE_WHATSAPP_HERO_CLICK: 'move_to_dubai_service_whatsapp_hero_click',
  SERVICE_WHATSAPP_FLOATING_CLICK: 'move_to_dubai_service_whatsapp_floating_click',
  SERVICE_WHATSAPP_CONTACT_CLICK: 'move_to_dubai_service_whatsapp_contact_click',
  SERVICE_LEAD_FORM_SUBMIT_SUCCESS: 'move_to_dubai_service_lead_form_submit_success',
} as const;

const STORAGE_KEYS = {
  sessionId: 'dalc_session_id',
  attribution: 'dalc_attribution',
} as const;

export type MoveToDubaiEventName =
  (typeof MOVE_TO_DUBAI_EVENTS)[keyof typeof MOVE_TO_DUBAI_EVENTS];

export interface AttributionSnapshot {
  session_id: string;
  source_page: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_term: string;
  utm_content: string;
  referrer: string;
  user_agent: string;
}

export interface LeadSubmitPayload {
  name: string;
  email?: string;
  phone: string;
  source_page: string;
  source_section: string;
  cta_label: string;
  service_slug?: string;
  destination: string;
}

function isBrowser() {
  return typeof window !== 'undefined';
}

function getUtmValuesFromUrl() {
  if (!isBrowser()) {
    return {
      utm_source: '',
      utm_medium: '',
      utm_campaign: '',
      utm_term: '',
      utm_content: '',
    };
  }

  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get('utm_source') ?? '',
    utm_medium: params.get('utm_medium') ?? '',
    utm_campaign: params.get('utm_campaign') ?? '',
    utm_term: params.get('utm_term') ?? '',
    utm_content: params.get('utm_content') ?? '',
  };
}

function readAttributionFromStorage(): Partial<AttributionSnapshot> {
  if (!isBrowser()) return {};

  const raw = localStorage.getItem(STORAGE_KEYS.attribution);
  if (!raw) return {};

  try {
    return JSON.parse(raw) as Partial<AttributionSnapshot>;
  } catch {
    return {};
  }
}

function writeAttributionToStorage(value: AttributionSnapshot) {
  if (!isBrowser()) return;
  localStorage.setItem(STORAGE_KEYS.attribution, JSON.stringify(value));
}

function getOrCreateSessionId(): string {
  if (!isBrowser()) return 'server-session';

  const existing = localStorage.getItem(STORAGE_KEYS.sessionId);
  if (existing) return existing;

  const created =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

  localStorage.setItem(STORAGE_KEYS.sessionId, created);
  return created;
}

export function initMoveToDubaiAttribution() {
  if (!isBrowser()) return;

  const session_id = getOrCreateSessionId();
  const current = readAttributionFromStorage();
  const utm = getUtmValuesFromUrl();

  const merged: AttributionSnapshot = {
    session_id,
    source_page: window.location.pathname,
    utm_source: utm.utm_source || current.utm_source || '',
    utm_medium: utm.utm_medium || current.utm_medium || '',
    utm_campaign: utm.utm_campaign || current.utm_campaign || '',
    utm_term: utm.utm_term || current.utm_term || '',
    utm_content: utm.utm_content || current.utm_content || '',
    referrer: current.referrer || document.referrer || '',
    user_agent: navigator.userAgent || '',
  };

  writeAttributionToStorage(merged);
}

export function getAttributionSnapshot(): AttributionSnapshot {
  if (!isBrowser()) {
    return {
      session_id: 'server-session',
      source_page: '',
      utm_source: '',
      utm_medium: '',
      utm_campaign: '',
      utm_term: '',
      utm_content: '',
      referrer: '',
      user_agent: '',
    };
  }

  initMoveToDubaiAttribution();
  const stored = readAttributionFromStorage();

  return {
    session_id: getOrCreateSessionId(),
    source_page: window.location.pathname,
    utm_source: stored.utm_source || '',
    utm_medium: stored.utm_medium || '',
    utm_campaign: stored.utm_campaign || '',
    utm_term: stored.utm_term || '',
    utm_content: stored.utm_content || '',
    referrer: stored.referrer || document.referrer || '',
    user_agent: navigator.userAgent || '',
  };
}

async function postWithRetry(endpoint: string, body: Record<string, unknown>) {
  const run = async () =>
    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      keepalive: true,
    });

  try {
    const first = await run();
    if (first.ok) return first;
  } catch {
    // Retry once below.
  }

  return run();
}

export function trackMoveToDubaiEvent(
  event: MoveToDubaiEventName,
  properties?: Record<string, unknown>
) {
  if (!isBrowser()) return;

  const attribution = getAttributionSnapshot();
  const clientEventId =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

  const payload = {
    client_event_id: clientEventId,
    event_name: event,
    page:
      (typeof properties?.source_page === 'string' && properties.source_page) ||
      attribution.source_page,
    section:
      (typeof properties?.source_section === 'string' && properties.source_section) ||
      (typeof properties?.section === 'string' && properties.section) ||
      '',
    cta_label:
      (typeof properties?.cta_label === 'string' && properties.cta_label) ||
      '',
    metadata: properties ?? {},
    session_id: attribution.session_id,
    attribution,
  };

  if (process.env.NODE_ENV === 'development') {
    console.log('[MoveToDubai CTA]', payload.event_name, payload);
  }

  void postWithRetry('/api/track-event', payload);
}

export async function submitMoveToDubaiLead(payload: LeadSubmitPayload) {
  if (!isBrowser()) return;

  const attribution = getAttributionSnapshot();
  const clientSubmissionId =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

  await postWithRetry('/api/submit-lead', {
    ...payload,
    client_submission_id: clientSubmissionId,
    session_id: attribution.session_id,
    utm_source: attribution.utm_source,
    utm_medium: attribution.utm_medium,
    utm_campaign: attribution.utm_campaign,
    utm_term: attribution.utm_term,
    utm_content: attribution.utm_content,
    referrer: attribution.referrer,
    user_agent: attribution.user_agent,
  });
}
