/**
 * Calendly API Integration
 *
 * Setup:
 * 1. Go to https://calendly.com/integrations/api_webhooks
 * 2. Generate a Personal Access Token
 * 3. Use two different booking links for attribution:
 *    - Paid Ads: https://calendly.com/andrew-ottoresults/audit-call-90-day-outbound-sprint
 *    - Cold Email: https://calendly.com/andrew-ottoresults/strategy-chat-coldemail-outbound
 *
 * Required env vars:
 * - CALENDLY_API_KEY: Your personal access token
 * - CALENDLY_ADS_EVENT_SLUG: Slug from ads booking URL (e.g., "audit-call-90-day-outbound-sprint")
 * - CALENDLY_EMAIL_EVENT_SLUG: Slug from email booking URL (e.g., "strategy-chat-coldemail-outbound")
 */

interface CalendlyEvent {
  uri: string;
  name: string;
  status: 'active' | 'canceled';
  start_time: string;
  end_time: string;
  event_type: string;
}

interface CalendlyEventType {
  uri: string;
  name: string;
  slug: string;
  scheduling_url: string;
}

interface CalendlyData {
  date: string;
  adsCallsBooked: number;
  emailCallsBooked: number;
  totalCallsBooked: number;
}

// Store for synced data
let calendlyData: CalendlyData[] = [];
let eventTypeMap: Map<string, 'ads' | 'email'> = new Map();

export async function syncCalendly(): Promise<CalendlyData[]> {
  const apiKey = process.env.CALENDLY_API_KEY;
  const adsSlug = process.env.CALENDLY_ADS_EVENT_SLUG || 'audit-call-90-day-outbound-sprint';
  const emailSlug = process.env.CALENDLY_EMAIL_EVENT_SLUG || 'strategy-chat-coldemail-outbound';

  if (!apiKey) {
    throw new Error('Calendly API key not configured. Set CALENDLY_API_KEY');
  }

  const headers = {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json'
  };

  try {
    // First, get the user URI
    const userResponse = await fetch('https://api.calendly.com/users/me', { headers });
    const userData = await userResponse.json();

    if (!userData.resource) {
      throw new Error('Failed to get Calendly user info');
    }

    const userUri = userData.resource.uri;

    // Fetch event types to map slugs to URIs
    const eventTypesUrl = `https://api.calendly.com/event_types?user=${encodeURIComponent(userUri)}`;
    const eventTypesResponse = await fetch(eventTypesUrl, { headers });
    const eventTypesData = await eventTypesResponse.json();

    eventTypeMap.clear();
    if (eventTypesData.collection) {
      for (const eventType of eventTypesData.collection as CalendlyEventType[]) {
        const slug = eventType.scheduling_url.split('/').pop() || '';
        if (slug === adsSlug || eventType.slug === adsSlug) {
          eventTypeMap.set(eventType.uri, 'ads');
        } else if (slug === emailSlug || eventType.slug === emailSlug) {
          eventTypeMap.set(eventType.uri, 'email');
        }
      }
    }

    console.log('Event type mapping:', Object.fromEntries(eventTypeMap));

    // Calculate date range (last 30 days)
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    // Fetch scheduled events
    const eventsUrl = `https://api.calendly.com/scheduled_events?` +
      `user=${encodeURIComponent(userUri)}&` +
      `min_start_time=${startDate.toISOString()}&` +
      `max_start_time=${endDate.toISOString()}&` +
      `status=active&` +
      `count=100`;

    const eventsResponse = await fetch(eventsUrl, { headers });
    const eventsData = await eventsResponse.json();

    if (!eventsData.collection) {
      throw new Error('Failed to fetch Calendly events');
    }

    // Group events by date and source
    const eventsByDate = new Map<string, { ads: number; email: number }>();

    for (const event of eventsData.collection as CalendlyEvent[]) {
      const date = event.start_time.split('T')[0];
      const current = eventsByDate.get(date) || { ads: 0, email: 0 };

      // Determine source based on event type mapping
      const source = eventTypeMap.get(event.event_type);
      if (source === 'ads') {
        current.ads++;
      } else if (source === 'email') {
        current.email++;
      } else {
        // Unknown event type - default to ads
        current.ads++;
      }

      eventsByDate.set(date, current);
    }

    // Convert to array sorted by date
    calendlyData = Array.from(eventsByDate.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, counts]) => ({
        date,
        adsCallsBooked: counts.ads,
        emailCallsBooked: counts.email,
        totalCallsBooked: counts.ads + counts.email
      }));

    console.log(`Synced ${calendlyData.length} days of Calendly data`);
    return calendlyData;
  } catch (error) {
    console.error('Calendly API error:', error);
    throw error;
  }
}

export function getCalendlyData(): CalendlyData[] {
  return calendlyData;
}

export function getCalendlySummary() {
  if (calendlyData.length === 0) {
    return null;
  }

  return {
    totalCallsBooked: calendlyData.reduce((sum, d) => sum + d.totalCallsBooked, 0),
    adsCallsBooked: calendlyData.reduce((sum, d) => sum + d.adsCallsBooked, 0),
    emailCallsBooked: calendlyData.reduce((sum, d) => sum + d.emailCallsBooked, 0)
  };
}
