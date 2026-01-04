export interface DailyMetrics {
  date: string;
  adSpend: number;
  clicks: number;
  impressions: number;
  callsBooked: number;
  callsCompleted: number;
  emailsSent: number;
  emailsOpened: number;
  emailsReplied: number;
  emailCallsBooked: number;
}

export interface AdCampaign {
  id: string;
  name: string;
  platform: 'Meta' | 'Google' | 'LinkedIn' | 'TikTok';
  status: 'active' | 'paused' | 'completed';
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
  callsBooked: number;
  cpc: number;
  cpm: number;
  costPerCall: number;
}

export interface EmailCampaign {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'completed';
  sent: number;
  delivered: number;
  opened: number;
  replied: number;
  bounced: number;
  callsBooked: number;
  openRate: number;
  replyRate: number;
}

export interface CallMetrics {
  totalBooked: number;
  totalCompleted: number;
  showRate: number;
  noShows: number;
  rescheduled: number;
  closed: number;
  closeRate: number;
}

export interface PipelineStage {
  name: string;
  count: number;
  value: number;
  color: string;
}

export interface WeeklyTrend {
  week: string;
  adSpend: number;
  callsBooked: number;
  showRate: number;
  emailsSent: number;
  emailCallsBooked: number;
}

export interface KPISummary {
  totalAdSpend: number;
  totalCallsBooked: number;
  totalCallsCompleted: number;
  overallShowRate: number;
  totalEmailsSent: number;
  totalEmailCallsBooked: number;
  costPerCall: number;
  costPerShow: number;
  totalCloses: number;
  closeRate: number;
  revenue: number;
  roi: number;
}
