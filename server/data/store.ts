/**
 * Data Store - Aggregates data from all sources
 */

import { getFacebookData, getFacebookSummary } from '../integrations/facebook';
import { getCalendlyData, getCalendlySummary } from '../integrations/calendly';
import { getGHLData, getGHLSummary } from '../integrations/gohighlevel';

interface DailyMetrics {
  date: string;
  spend: number;
  impressions: number;
  cpm: number;
  adsCallsBooked: number;
  emailCallsBooked: number;
  totalCallsBooked: number;
  liveCalls: number;
  qualifiedCalls: number;
  closedDeals: number;
  revenue: number;
  costPerCall: number;
  showRate: number;
  qualifiedRate: number;
  costPerQualified: number;
  closeRate: number;
  cac: number;
  roi: number;
}

interface KPISummary {
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

interface WeeklyTrend {
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

interface ChannelMetrics {
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

// Stored aggregated data
let storedMetrics: DailyMetrics[] = [];
let storedKPISummary: KPISummary | null = null;
let storedWeeklyTrends: WeeklyTrend[] = [];
let storedChannelMetrics: ChannelMetrics[] = [];

export async function aggregateAndStore(): Promise<void> {
  const facebookData = getFacebookData();
  const calendlyData = getCalendlyData();
  const ghlData = getGHLData();

  // Create a map of all dates
  const allDates = new Set<string>();
  facebookData.forEach(d => allDates.add(d.date));
  calendlyData.forEach(d => allDates.add(d.date));
  ghlData.forEach(d => allDates.add(d.date));

  // Aggregate daily metrics
  storedMetrics = Array.from(allDates).sort().map(date => {
    const fb = facebookData.find(d => d.date === date);
    const cal = calendlyData.find(d => d.date === date);
    const ghl = ghlData.find(d => d.date === date);

    const spend = fb?.spend || 0;
    const totalCallsBooked = cal?.totalCallsBooked || 0;
    const liveCalls = ghl?.liveCalls || 0;
    const qualifiedCalls = ghl?.qualifiedCalls || 0;
    const closedDeals = ghl?.closedDeals || 0;
    const revenue = ghl?.revenue || 0;

    return {
      date,
      spend,
      impressions: fb?.impressions || 0,
      cpm: fb?.cpm || 0,
      adsCallsBooked: cal?.adsCallsBooked || 0,
      emailCallsBooked: cal?.emailCallsBooked || 0,
      totalCallsBooked,
      liveCalls,
      qualifiedCalls,
      closedDeals,
      revenue,
      costPerCall: totalCallsBooked > 0 ? spend / totalCallsBooked : 0,
      showRate: totalCallsBooked > 0 ? (liveCalls / totalCallsBooked) * 100 : 0,
      qualifiedRate: liveCalls > 0 ? (qualifiedCalls / liveCalls) * 100 : 0,
      costPerQualified: qualifiedCalls > 0 ? spend / qualifiedCalls : 0,
      closeRate: qualifiedCalls > 0 ? (closedDeals / qualifiedCalls) * 100 : 0,
      cac: closedDeals > 0 ? spend / closedDeals : 0,
      roi: spend > 0 ? ((revenue - spend) / spend) * 100 : 0
    };
  });

  // Calculate KPI summary
  const fbSummary = getFacebookSummary();
  const calSummary = getCalendlySummary();
  const ghlSummary = getGHLSummary();

  const totalSpend = fbSummary?.totalSpend || 0;
  const totalCallsBooked = calSummary?.totalCallsBooked || 0;
  const totalLiveCalls = ghlSummary?.totalLiveCalls || 0;
  const totalQualified = ghlSummary?.totalQualified || 0;
  const totalClosed = ghlSummary?.totalClosed || 0;
  const totalRevenue = ghlSummary?.totalRevenue || 0;

  storedKPISummary = {
    totalSpend,
    totalImpressions: fbSummary?.totalImpressions || 0,
    avgCpm: fbSummary?.avgCpm || 0,
    totalCallsBooked,
    adsCallsBooked: calSummary?.adsCallsBooked || 0,
    emailCallsBooked: calSummary?.emailCallsBooked || 0,
    costPerCall: totalCallsBooked > 0 ? totalSpend / totalCallsBooked : 0,
    totalLiveCalls,
    showRate: totalCallsBooked > 0 ? (totalLiveCalls / totalCallsBooked) * 100 : 0,
    totalQualified,
    qualifiedRate: totalLiveCalls > 0 ? (totalQualified / totalLiveCalls) * 100 : 0,
    costPerQualified: totalQualified > 0 ? totalSpend / totalQualified : 0,
    totalClosed,
    closeRate: totalQualified > 0 ? (totalClosed / totalQualified) * 100 : 0,
    cac: totalClosed > 0 ? totalSpend / totalClosed : 0,
    totalRevenue,
    roi: totalSpend > 0 ? ((totalRevenue - totalSpend) / totalSpend) * 100 : 0
  };

  // Calculate weekly trends
  const weeklyMap = new Map<string, DailyMetrics[]>();
  storedMetrics.forEach(m => {
    const date = new Date(m.date);
    const weekNum = getWeekNumber(date);
    const weekKey = `Week ${weekNum}`;
    const current = weeklyMap.get(weekKey) || [];
    current.push(m);
    weeklyMap.set(weekKey, current);
  });

  storedWeeklyTrends = Array.from(weeklyMap.entries()).map(([week, days]) => {
    const spend = days.reduce((sum, d) => sum + d.spend, 0);
    const callsBooked = days.reduce((sum, d) => sum + d.totalCallsBooked, 0);
    const liveCalls = days.reduce((sum, d) => sum + d.liveCalls, 0);
    const qualified = days.reduce((sum, d) => sum + d.qualifiedCalls, 0);
    const closed = days.reduce((sum, d) => sum + d.closedDeals, 0);
    const revenue = days.reduce((sum, d) => sum + d.revenue, 0);

    return {
      week,
      spend,
      impressions: days.reduce((sum, d) => sum + d.impressions, 0),
      cpm: days.reduce((sum, d) => sum + d.cpm, 0) / days.length,
      callsBooked,
      liveCalls,
      showRate: callsBooked > 0 ? (liveCalls / callsBooked) * 100 : 0,
      qualified,
      qualifiedRate: liveCalls > 0 ? (qualified / liveCalls) * 100 : 0,
      closed,
      revenue,
      cac: closed > 0 ? spend / closed : 0,
      roi: spend > 0 ? ((revenue - spend) / spend) * 100 : 0
    };
  });

  // Calculate channel metrics (simplified - assumes 60/40 split for GHL data)
  const adsCallsBooked = calSummary?.adsCallsBooked || 0;
  const emailCallsBooked = calSummary?.emailCallsBooked || 0;
  const adsRatio = adsCallsBooked / (adsCallsBooked + emailCallsBooked || 1);
  const emailRatio = 1 - adsRatio;

  storedChannelMetrics = [
    {
      channel: 'paid_ads',
      callsBooked: adsCallsBooked,
      liveCalls: Math.round(totalLiveCalls * adsRatio),
      showRate: totalCallsBooked > 0 ? (Math.round(totalLiveCalls * adsRatio) / adsCallsBooked) * 100 : 0,
      qualified: Math.round(totalQualified * adsRatio),
      qualifiedRate: totalLiveCalls > 0 ? (Math.round(totalQualified * adsRatio) / Math.round(totalLiveCalls * adsRatio)) * 100 : 0,
      closed: Math.round(totalClosed * adsRatio),
      closeRate: totalQualified > 0 ? (Math.round(totalClosed * adsRatio) / Math.round(totalQualified * adsRatio)) * 100 : 0,
      revenue: Math.round(totalRevenue * adsRatio),
      cac: Math.round(totalClosed * adsRatio) > 0 ? totalSpend / Math.round(totalClosed * adsRatio) : 0
    },
    {
      channel: 'cold_email',
      callsBooked: emailCallsBooked,
      liveCalls: Math.round(totalLiveCalls * emailRatio),
      showRate: emailCallsBooked > 0 ? (Math.round(totalLiveCalls * emailRatio) / emailCallsBooked) * 100 : 0,
      qualified: Math.round(totalQualified * emailRatio),
      qualifiedRate: totalLiveCalls > 0 ? (Math.round(totalQualified * emailRatio) / Math.round(totalLiveCalls * emailRatio)) * 100 : 0,
      closed: Math.round(totalClosed * emailRatio),
      closeRate: totalQualified > 0 ? (Math.round(totalClosed * emailRatio) / Math.round(totalQualified * emailRatio)) * 100 : 0,
      revenue: Math.round(totalRevenue * emailRatio),
      cac: 0 // No direct spend for cold email
    }
  ];
}

function getWeekNumber(date: Date): number {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

export async function getStoredMetrics(): Promise<DailyMetrics[]> {
  return storedMetrics;
}

export async function getKPISummary(): Promise<KPISummary | null> {
  return storedKPISummary;
}

export async function getWeeklyTrends(): Promise<WeeklyTrend[]> {
  return storedWeeklyTrends;
}

export async function getChannelMetrics(): Promise<ChannelMetrics[]> {
  return storedChannelMetrics;
}
