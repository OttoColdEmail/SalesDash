// Aggregated daily metrics from all sources
export interface DailyMetrics {
  date: string;
  // Facebook Ads
  spend: number;
  impressions: number;
  cpm: number;
  // Calendly (by source)
  adsCallsBooked: number;
  emailCallsBooked: number;
  totalCallsBooked: number;
  // GoHighLevel
  liveCalls: number;
  qualifiedCalls: number;
  closedDeals: number;
  revenue: number;
  // Calculated metrics
  costPerCall: number;
  showRate: number;
  qualifiedRate: number;
  costPerQualified: number;
  closeRate: number;
  cac: number;
  roi: number;
}

// Summary KPIs for the dashboard header
export interface KPISummary {
  totalSpend: number;
  totalImpressions: number;
  avgCpm: number;
  totalCallsBooked: number;
  adsCallsBooked: number;
  emailCallsBooked: number;
  costPerCall: number;
  totalLiveCalls: number;
  showRate: number;
  totalQualified: number;
  qualifiedRate: number;
  costPerQualified: number;
  totalClosed: number;
  closeRate: number;
  cac: number;
  totalRevenue: number;
  roi: number;
}

// Weekly trend data for charts
export interface WeeklyTrend {
  week: string;
  spend: number;
  impressions: number;
  cpm: number;
  callsBooked: number;
  liveCalls: number;
  showRate: number;
  qualified: number;
  qualifiedRate: number;
  closed: number;
  revenue: number;
  cac: number;
  roi: number;
}

// Channel breakdown for attribution
export interface ChannelMetrics {
  channel: 'paid_ads' | 'cold_email';
  callsBooked: number;
  liveCalls: number;
  showRate: number;
  qualified: number;
  qualifiedRate: number;
  closed: number;
  closeRate: number;
  revenue: number;
  cac: number;
}

// Pipeline/funnel stages
export interface PipelineStage {
  name: string;
  count: number;
  value: number;
  color: string;
  conversionRate?: number;
}

// API integration status
export interface IntegrationStatus {
  facebook: 'connected' | 'disconnected' | 'error';
  calendly: 'connected' | 'disconnected' | 'error';
  ghl: 'connected' | 'disconnected' | 'error';
  lastSync: string | null;
}
