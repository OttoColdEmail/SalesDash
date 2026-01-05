/**
 * Facebook Marketing API Integration
 *
 * Setup:
 * 1. Go to https://developers.facebook.com/
 * 2. Create an app or use existing one
 * 3. Add the Marketing API product
 * 4. Get your Access Token from the API Explorer
 * 5. Get your Ad Account ID from Business Manager
 *
 * Required env vars:
 * - FACEBOOK_ACCESS_TOKEN: Your access token
 * - FACEBOOK_AD_ACCOUNT_ID: Your ad account ID (format: act_XXXXX)
 */

interface FacebookInsight {
  date_start: string;
  date_stop: string;
  spend: string;
  impressions: string;
  clicks: string;
  cpm: string;
  cpc: string;
  reach: string;
}

interface FacebookAdsData {
  date: string;
  spend: number;
  impressions: number;
  clicks: number;
  cpm: number;
}

// Store for synced data
let facebookData: FacebookAdsData[] = [];

export async function syncFacebookAds(): Promise<FacebookAdsData[]> {
  const accessToken = process.env.FACEBOOK_ACCESS_TOKEN;
  const adAccountId = process.env.FACEBOOK_AD_ACCOUNT_ID;

  if (!accessToken || !adAccountId) {
    throw new Error('Facebook API credentials not configured. Set FACEBOOK_ACCESS_TOKEN and FACEBOOK_AD_ACCOUNT_ID');
  }

  // Calculate date range (last 30 days)
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);

  const timeRange = JSON.stringify({
    since: startDate.toISOString().split('T')[0],
    until: endDate.toISOString().split('T')[0]
  });

  const fields = 'spend,impressions,clicks,cpm,cpc,reach';
  const level = 'account';
  const timeIncrement = 1; // Daily breakdown

  const url = `https://graph.facebook.com/v18.0/${adAccountId}/insights?` +
    `fields=${fields}&` +
    `time_range=${encodeURIComponent(timeRange)}&` +
    `level=${level}&` +
    `time_increment=${timeIncrement}&` +
    `access_token=${accessToken}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    facebookData = (data.data || []).map((insight: FacebookInsight) => ({
      date: insight.date_start,
      spend: parseFloat(insight.spend) || 0,
      impressions: parseInt(insight.impressions) || 0,
      clicks: parseInt(insight.clicks) || 0,
      cpm: parseFloat(insight.cpm) || 0
    }));

    console.log(`Synced ${facebookData.length} days of Facebook data`);
    return facebookData;
  } catch (error) {
    console.error('Facebook API error:', error);
    throw error;
  }
}

export function getFacebookData(): FacebookAdsData[] {
  return facebookData;
}

export function getFacebookSummary() {
  if (facebookData.length === 0) {
    return null;
  }

  return {
    totalSpend: facebookData.reduce((sum, d) => sum + d.spend, 0),
    totalImpressions: facebookData.reduce((sum, d) => sum + d.impressions, 0),
    totalClicks: facebookData.reduce((sum, d) => sum + d.clicks, 0),
    avgCpm: facebookData.reduce((sum, d) => sum + d.cpm, 0) / facebookData.length
  };
}
