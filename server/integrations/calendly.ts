/**
 * Calendly API Integration
 *
 * Setup:
 * 1. Go to https://calendly.com/integrations/api_webhooks
 * 2. Generate a Personal Access Token
 * 3. Create two event types:
 *    - One for Facebook Ads traffic (e.g., "Sales Call - Ads")
 *    - One for Cold Email traffic (e.g., "Sales Call - Email")
 *
 * Required env vars:
 * - CALENDLY_API_KEY: Your personal access token
 * - CALENDLY_ADS_EVENT_URI: URI of your ads event type
 * - CALENDLY_EMAIL_EVENT_URI: URI of your email event type
 */

interface CalendlyEvent {
  uri: string;
  name: string;
  status: 'active' | 'canceled';
  start_time: string;
  end_time: string;
  event_type: string;
  invitees_counter: {
    total: number;
    active: number;
    limit: number;
  };
}

interface CalendlyData {
  date: string;
  adsCallsBooked: number;
  emailCallsBooked: number;
  totalCallsBooked: number;
}

// Store for synced data
let calendlyData: CalendlyData[] = [];

export async function syncCalendly(): Promise<CalendlyData[]> {
  const apiKey = process.env.CALENDLY_API_KEY;
  const adsEventUri = process.env.CALENDLY_ADS_EVENT_URI;
  const emailEventUri = process.env.CALENDLY_EMAIL_EVENT_URI;

  if (!apiKey) {
    throw new Error('Calendly API key not configured. Set CALENDLY_API_KEY');
  }

  // Calculate date range (last 30 days)
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);

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

      // Determine source based on event type URI
      if (adsEventUri && event.event_type === adsEventUri) {
        current.ads++;
      } else if (emailEventUri && event.event_type === emailEventUri) {
        current.email++;
      } else {
        // Default: split evenly or assign to ads
        current.ads++;
      }

      eventsByDate.set(date, current);
    }

    // Convert to array
    calendlyData = Array.from(eventsByDate.entries()).map(([date, counts]) => ({
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
