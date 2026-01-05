import { Router } from 'express';
import { syncFacebookAds } from '../integrations/facebook';
import { syncCalendly } from '../integrations/calendly';
import { syncGoHighLevel } from '../integrations/gohighlevel';
import { aggregateAndStore } from '../data/store';

export const syncRouter = Router();

// Sync all data sources
syncRouter.post('/all', async (req, res) => {
  try {
    const results = {
      facebook: { success: false, error: null as string | null },
      calendly: { success: false, error: null as string | null },
      ghl: { success: false, error: null as string | null }
    };

    // Sync Facebook Ads
    try {
      await syncFacebookAds();
      results.facebook.success = true;
    } catch (error) {
      results.facebook.error = error instanceof Error ? error.message : 'Unknown error';
    }

    // Sync Calendly
    try {
      await syncCalendly();
      results.calendly.success = true;
    } catch (error) {
      results.calendly.error = error instanceof Error ? error.message : 'Unknown error';
    }

    // Sync GoHighLevel
    try {
      await syncGoHighLevel();
      results.ghl.success = true;
    } catch (error) {
      results.ghl.error = error instanceof Error ? error.message : 'Unknown error';
    }

    // Aggregate all data
    await aggregateAndStore();

    res.json({
      success: true,
      results,
      syncedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Sync error:', error);
    res.status(500).json({ success: false, error: 'Sync failed' });
  }
});

// Sync individual sources
syncRouter.post('/facebook', async (req, res) => {
  try {
    await syncFacebookAds();
    res.json({ success: true, syncedAt: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

syncRouter.post('/calendly', async (req, res) => {
  try {
    await syncCalendly();
    res.json({ success: true, syncedAt: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

syncRouter.post('/ghl', async (req, res) => {
  try {
    await syncGoHighLevel();
    res.json({ success: true, syncedAt: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Get integration status
syncRouter.get('/status', async (req, res) => {
  const status = {
    facebook: !!process.env.FACEBOOK_ACCESS_TOKEN ? 'configured' : 'not_configured',
    calendly: !!process.env.CALENDLY_API_KEY ? 'configured' : 'not_configured',
    ghl: !!process.env.GHL_API_KEY ? 'configured' : 'not_configured'
  };

  res.json({ success: true, status });
});
