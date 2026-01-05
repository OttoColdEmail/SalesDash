/**
 * GoHighLevel (GHL) API Integration
 *
 * Pipeline stages we track from "Standard" pipeline:
 * - Intro call, No-show - Qualified, No-Show - Unqualified,
 * - Call held - Proposal, Call held - unqualified,
 * - Closed won - 90 day, closed lost - 90 day
 */

interface GHLOpportunity {
  id: string;
  name: string;
  status: string;
  pipelineStageId: string;
  pipelineId: string;
  monetaryValue: number;
  createdAt: string;
  updatedAt: string;
}

interface GHLPipeline {
  id: string;
  name: string;
  stages: GHLPipelineStage[];
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
const STAGE_MAPPINGS = {
  liveCalls: ['call held', 'closed won', 'closed lost'],
  qualified: ['call held - proposal', 'closed won', 'no-show - qualified'],
  closedWon: ['closed won'],
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

  console.log('GHL: Starting sync...');
  console.log('GHL: Location ID:', locationId);

  const headers = {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    'Version': '2021-07-28'
  };

  try {
    // First, get pipelines to understand stage structure
    console.log('GHL: Fetching pipelines...');
    const pipelinesUrl = `https://services.leadconnectorhq.com/opportunities/pipelines?locationId=${locationId}`;
    console.log('GHL: Pipelines URL:', pipelinesUrl);

    const pipelinesResponse = await fetch(pipelinesUrl, { headers });
    const pipelinesText = await pipelinesResponse.text();
    console.log('GHL: Pipelines response status:', pipelinesResponse.status);
    console.log('GHL: Pipelines response:', pipelinesText.substring(0, 500));

    let pipelinesData;
    try {
      pipelinesData = JSON.parse(pipelinesText);
    } catch (e) {
      console.error('GHL: Failed to parse pipelines response');
      throw new Error(`GHL API error: ${pipelinesText}`);
    }

    if (pipelinesData.pipelines && pipelinesData.pipelines.length > 0) {
      // Find the "Standard" pipeline or use the first one
      const standardPipeline = pipelinesData.pipelines.find((p: GHLPipeline) =>
        p.name.toLowerCase() === 'standard'
      ) || pipelinesData.pipelines[0];

      pipelineStages = standardPipeline.stages || [];
      console.log('GHL: Using pipeline:', standardPipeline.name);
      console.log('GHL: Pipeline stages:', pipelineStages.map((s: GHLPipelineStage) => s.name));
    } else {
      console.log('GHL: No pipelines found in response');
    }

    // Fetch opportunities
    console.log('GHL: Fetching opportunities...');
    const oppsUrl = `https://services.leadconnectorhq.com/opportunities/?locationId=${locationId}&limit=100`;
    console.log('GHL: Opportunities URL:', oppsUrl);

    const oppsResponse = await fetch(oppsUrl, { headers });
    const oppsText = await oppsResponse.text();
    console.log('GHL: Opportunities response status:', oppsResponse.status);
    console.log('GHL: Opportunities response preview:', oppsText.substring(0, 500));

    let oppsData;
    try {
      oppsData = JSON.parse(oppsText);
    } catch (e) {
      console.error('GHL: Failed to parse opportunities response');
      throw new Error(`GHL API error: ${oppsText}`);
    }

    const opportunities = oppsData.opportunities || oppsData.data || [];
    console.log('GHL: Found', opportunities.length, 'opportunities');

    if (opportunities.length === 0) {
      console.log('GHL: No opportunities found');
      return [];
    }

    // Log first opportunity for debugging
    if (opportunities.length > 0) {
      console.log('GHL: Sample opportunity:', JSON.stringify(opportunities[0], null, 2));
    }

    // Group opportunities by date and stage
    const dataByDate = new Map<string, GHLData>();

    for (const opp of opportunities as GHLOpportunity[]) {
      const date = (opp.createdAt || opp.updatedAt || new Date().toISOString()).split('T')[0];
      const current = dataByDate.get(date) || {
        date,
        liveCalls: 0,
        qualifiedCalls: 0,
        closedDeals: 0,
        revenue: 0
      };

      // Find the stage name
      const stage = pipelineStages.find(s => s.id === opp.pipelineStageId);
      const stageName = stage?.name || opp.status || '';

      console.log(`GHL: Opp "${opp.name}" - Stage: "${stageName}" (ID: ${opp.pipelineStageId})`);

      // Categorize based on stage
      if (matchesStage(stageName, STAGE_MAPPINGS.closedWon)) {
        current.closedDeals++;
        current.revenue += opp.monetaryValue || 0;
        console.log(`GHL: -> Counted as CLOSED WON (revenue: ${opp.monetaryValue})`);
      }
      if (matchesStage(stageName, STAGE_MAPPINGS.qualified)) {
        current.qualifiedCalls++;
        console.log(`GHL: -> Counted as QUALIFIED`);
      }
      if (matchesStage(stageName, STAGE_MAPPINGS.liveCalls)) {
        current.liveCalls++;
        console.log(`GHL: -> Counted as LIVE CALL`);
      }

      dataByDate.set(date, current);
    }

    ghlData = Array.from(dataByDate.values());
    console.log(`GHL: Synced ${ghlData.length} days of data`);
    console.log('GHL: Summary:', getGHLSummary());

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
