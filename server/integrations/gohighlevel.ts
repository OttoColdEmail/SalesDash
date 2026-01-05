/**
 * GoHighLevel (GHL) API Integration
 *
 * Setup:
 * 1. Go to Settings > Business Profile > API Keys in your GHL account
 * 2. Generate an API key
 * 3. Note your Location ID from the URL when in a sub-account
 *
 * Required env vars:
 * - GHL_API_KEY: Your API key
 * - GHL_LOCATION_ID: Your location/sub-account ID
 *
 * Pipeline stages we track:
 * - Call completed (live call happened)
 * - Qualified (prospect is qualified)
 * - Closed Won (deal closed)
 */

interface GHLOpportunity {
  id: string;
  name: string;
  status: string;
  pipelineStageId: string;
  monetaryValue: number;
  createdAt: string;
  updatedAt: string;
  contact: {
    id: string;
    name: string;
    email: string;
  };
}

interface GHLPipelineStage {
  id: string;
  name: string;
}

interface GHLData {
  date: string;
  liveCalls: number;
  qualifiedCalls: number;
  closedDeals: number;
  revenue: number;
}

// Store for synced data
let ghlData: GHLData[] = [];
let pipelineStages: GHLPipelineStage[] = [];

// Stage name mappings for "Standard" pipeline
// Stages: Intro call, No-show - Qualified, No-Show - Unqualified,
//         Call held - Proposal, Call held - unqualified,
//         Closed won - 90 day, closed lost - 90 day
const STAGE_MAPPINGS = {
  // Live calls = call actually happened (not no-shows)
  liveCalls: ['call held', 'closed won', 'closed lost'],
  // Qualified = good fit prospect (proposal sent or closed)
  qualified: ['call held - proposal', 'closed won', 'no-show - qualified'],
  // Closed won
  closedWon: ['closed won'],
  // Closed lost (for tracking)
  closedLost: ['closed lost']
};

function matchesStage(stageName: string, keywords: string[]): boolean {
  const lower = stageName.toLowerCase();
  return keywords.some(kw => lower.includes(kw));
}

export async function syncGoHighLevel(): Promise<GHLData[]> {
  const apiKey = process.env.GHL_API_KEY;
  const locationId = process.env.GHL_LOCATION_ID;

  if (!apiKey || !locationId) {
    throw new Error('GHL API credentials not configured. Set GHL_API_KEY and GHL_LOCATION_ID');
  }

  const headers = {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    'Version': '2021-07-28'
  };

  try {
    // First, get pipelines to understand stage structure
    const pipelinesResponse = await fetch(
      `https://services.leadconnectorhq.com/opportunities/pipelines?locationId=${locationId}`,
      { headers }
    );
    const pipelinesData = await pipelinesResponse.json();

    if (pipelinesData.pipelines && pipelinesData.pipelines.length > 0) {
      pipelineStages = pipelinesData.pipelines[0].stages || [];
    }

    // Calculate date range (last 30 days)
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    // Fetch opportunities
    const oppsUrl = `https://services.leadconnectorhq.com/opportunities/search?` +
      `locationId=${locationId}&` +
      `startDate=${startDate.getTime()}&` +
      `endDate=${endDate.getTime()}&` +
      `limit=100`;

    const oppsResponse = await fetch(oppsUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({})
    });
    const oppsData = await oppsResponse.json();

    if (!oppsData.opportunities) {
      console.log('No opportunities found');
      return [];
    }

    // Group opportunities by date and stage
    const dataByDate = new Map<string, GHLData>();

    for (const opp of oppsData.opportunities as GHLOpportunity[]) {
      const date = opp.createdAt.split('T')[0];
      const current = dataByDate.get(date) || {
        date,
        liveCalls: 0,
        qualifiedCalls: 0,
        closedDeals: 0,
        revenue: 0
      };

      // Find the stage name
      const stage = pipelineStages.find(s => s.id === opp.pipelineStageId);
      const stageName = stage?.name || '';

      // Categorize based on stage
      // Check each category independently since stages can match multiple
      if (matchesStage(stageName, STAGE_MAPPINGS.closedWon)) {
        current.closedDeals++;
        current.revenue += opp.monetaryValue || 0;
      }
      if (matchesStage(stageName, STAGE_MAPPINGS.qualified)) {
        current.qualifiedCalls++;
      }
      if (matchesStage(stageName, STAGE_MAPPINGS.liveCalls)) {
        current.liveCalls++;
      }

      dataByDate.set(date, current);
    }

    ghlData = Array.from(dataByDate.values());
    console.log(`Synced ${ghlData.length} days of GHL data`);
    return ghlData;
  } catch (error) {
    console.error('GHL API error:', error);
    throw error;
  }
}

export function getGHLData(): GHLData[] {
  return ghlData;
}

export function getGHLSummary() {
  if (ghlData.length === 0) {
    return null;
  }

  return {
    totalLiveCalls: ghlData.reduce((sum, d) => sum + d.liveCalls, 0),
    totalQualified: ghlData.reduce((sum, d) => sum + d.qualifiedCalls, 0),
    totalClosed: ghlData.reduce((sum, d) => sum + d.closedDeals, 0),
    totalRevenue: ghlData.reduce((sum, d) => sum + d.revenue, 0)
  };
}
