import { Router } from 'express';
import { getStoredMetrics, getKPISummary, getWeeklyTrends, getChannelMetrics } from '../data/store';

export const metricsRouter = Router();

// Get all dashboard metrics
metricsRouter.get('/', async (req, res) => {
  try {
    const [kpiSummary, weeklyTrends, channelMetrics, dailyMetrics] = await Promise.all([
      getKPISummary(),
      getWeeklyTrends(),
      getChannelMetrics(),
      getStoredMetrics()
    ]);

    res.json({
      success: true,
      data: {
        kpiSummary,
        weeklyTrends,
        channelMetrics,
        dailyMetrics,
        lastSync: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error fetching metrics:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch metrics' });
  }
});

// Get KPI summary only
metricsRouter.get('/kpi', async (req, res) => {
  try {
    const kpiSummary = await getKPISummary();
    res.json({ success: true, data: kpiSummary });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch KPI summary' });
  }
});

// Get weekly trends
metricsRouter.get('/trends', async (req, res) => {
  try {
    const weeklyTrends = await getWeeklyTrends();
    res.json({ success: true, data: weeklyTrends });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch weekly trends' });
  }
});

// Get channel breakdown
metricsRouter.get('/channels', async (req, res) => {
  try {
    const channelMetrics = await getChannelMetrics();
    res.json({ success: true, data: channelMetrics });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch channel metrics' });
  }
});
