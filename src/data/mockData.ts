import {
  DailyMetrics,
  PipelineStage,
  WeeklyTrend,
  KPISummary,
  ChannelMetrics,
  IntegrationStatus
} from './types';

// Sample daily metrics - will be replaced by API data
export const dailyMetrics: DailyMetrics[] = [
  {
    date: '2025-12-29',
    spend: 1250, impressions: 42000, cpm: 29.76,
    adsCallsBooked: 12, emailCallsBooked: 8, totalCallsBooked: 20,
    liveCalls: 15, qualifiedCalls: 9, closedDeals: 2, revenue: 12000,
    costPerCall: 62.50, showRate: 75.0, qualifiedRate: 60.0,
    costPerQualified: 138.89, closeRate: 22.2, cac: 625, roi: 860
  },
  {
    date: '2025-12-30',
    spend: 1180, impressions: 38500, cpm: 30.65,
    adsCallsBooked: 10, emailCallsBooked: 6, totalCallsBooked: 16,
    liveCalls: 12, qualifiedCalls: 7, closedDeals: 1, revenue: 6000,
    costPerCall: 73.75, showRate: 75.0, qualifiedRate: 58.3,
    costPerQualified: 168.57, closeRate: 14.3, cac: 1180, roi: 408
  },
  {
    date: '2025-12-31',
    spend: 980, impressions: 32000, cpm: 30.63,
    adsCallsBooked: 8, emailCallsBooked: 5, totalCallsBooked: 13,
    liveCalls: 10, qualifiedCalls: 6, closedDeals: 1, revenue: 6000,
    costPerCall: 75.38, showRate: 76.9, qualifiedRate: 60.0,
    costPerQualified: 163.33, closeRate: 16.7, cac: 980, roi: 512
  },
  {
    date: '2026-01-01',
    spend: 850, impressions: 28000, cpm: 30.36,
    adsCallsBooked: 7, emailCallsBooked: 4, totalCallsBooked: 11,
    liveCalls: 8, qualifiedCalls: 5, closedDeals: 1, revenue: 6000,
    costPerCall: 77.27, showRate: 72.7, qualifiedRate: 62.5,
    costPerQualified: 170.00, closeRate: 20.0, cac: 850, roi: 606
  },
  {
    date: '2026-01-02',
    spend: 1320, impressions: 44000, cpm: 30.00,
    adsCallsBooked: 14, emailCallsBooked: 9, totalCallsBooked: 23,
    liveCalls: 18, qualifiedCalls: 11, closedDeals: 2, revenue: 12000,
    costPerCall: 57.39, showRate: 78.3, qualifiedRate: 61.1,
    costPerQualified: 120.00, closeRate: 18.2, cac: 660, roi: 809
  },
  {
    date: '2026-01-03',
    spend: 1450, impressions: 48000, cpm: 30.21,
    adsCallsBooked: 16, emailCallsBooked: 10, totalCallsBooked: 26,
    liveCalls: 20, qualifiedCalls: 13, closedDeals: 3, revenue: 18000,
    costPerCall: 55.77, showRate: 76.9, qualifiedRate: 65.0,
    costPerQualified: 111.54, closeRate: 23.1, cac: 483, roi: 1141
  },
];

// KPI Summary - calculated from period data
export const kpiSummary: KPISummary = {
  totalSpend: 7030,
  totalImpressions: 232500,
  avgCpm: 30.24,
  totalCallsBooked: 109,
  adsCallsBooked: 67,
  emailCallsBooked: 42,
  costPerCall: 64.50,
  totalLiveCalls: 83,
  showRate: 76.1,
  totalQualified: 51,
  qualifiedRate: 61.4,
  costPerQualified: 137.84,
  totalClosed: 10,
  closeRate: 19.6,
  cac: 703,
  totalRevenue: 60000,
  roi: 753.5,
};

// Weekly trends for charts
export const weeklyTrends: WeeklyTrend[] = [
  { week: 'Week 48', spend: 5200, impressions: 165000, cpm: 31.52, callsBooked: 62, liveCalls: 45, showRate: 72.6, qualified: 26, qualifiedRate: 57.8, closed: 5, revenue: 30000, cac: 1040, roi: 477 },
  { week: 'Week 49', spend: 5800, impressions: 185000, cpm: 31.35, callsBooked: 71, liveCalls: 54, showRate: 76.1, qualified: 32, qualifiedRate: 59.3, closed: 6, revenue: 36000, cac: 967, roi: 521 },
  { week: 'Week 50', spend: 6100, impressions: 198000, cpm: 30.81, callsBooked: 78, liveCalls: 60, showRate: 76.9, qualified: 37, qualifiedRate: 61.7, closed: 7, revenue: 42000, cac: 871, roi: 589 },
  { week: 'Week 51', spend: 6400, impressions: 210000, cpm: 30.48, callsBooked: 85, liveCalls: 66, showRate: 77.6, qualified: 42, qualifiedRate: 63.6, closed: 8, revenue: 48000, cac: 800, roi: 650 },
  { week: 'Week 52', spend: 6800, impressions: 225000, cpm: 30.22, callsBooked: 92, liveCalls: 72, showRate: 78.3, qualified: 46, qualifiedRate: 63.9, closed: 9, revenue: 54000, cac: 756, roi: 694 },
  { week: 'Week 1', spend: 7030, impressions: 232500, cpm: 30.24, callsBooked: 109, liveCalls: 83, showRate: 76.1, qualified: 51, qualifiedRate: 61.4, closed: 10, revenue: 60000, cac: 703, roi: 754 },
];

// Pipeline stages for funnel visualization
export const pipelineStages: PipelineStage[] = [
  { name: 'Calls Booked', count: 109, value: 0, color: '#3B82F6' },
  { name: 'Live Calls', count: 83, value: 0, color: '#8B5CF6', conversionRate: 76.1 },
  { name: 'Qualified', count: 51, value: 306000, color: '#EC4899', conversionRate: 61.4 },
  { name: 'Closed Won', count: 10, value: 60000, color: '#22C55E', conversionRate: 19.6 },
];

// Channel breakdown for attribution
export const channelMetrics: ChannelMetrics[] = [
  {
    channel: 'paid_ads',
    callsBooked: 67,
    liveCalls: 50,
    showRate: 74.6,
    qualified: 30,
    qualifiedRate: 60.0,
    closed: 6,
    closeRate: 20.0,
    revenue: 36000,
    cac: 1172, // 7030 / 6
  },
  {
    channel: 'cold_email',
    callsBooked: 42,
    liveCalls: 33,
    showRate: 78.6,
    qualified: 21,
    qualifiedRate: 63.6,
    closed: 4,
    closeRate: 19.0,
    revenue: 24000,
    cac: 0, // No direct spend on cold email (just tool costs)
  },
];

// Integration status - will be updated by backend
export const integrationStatus: IntegrationStatus = {
  facebook: 'disconnected',
  calendly: 'disconnected',
  ghl: 'disconnected',
  lastSync: null,
};
