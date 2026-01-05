# SalesDash

Marketing & Sales Reporting Dashboard for tracking paid ads (Facebook) and cold email performance.

## Metrics Tracked

1. **Total Spend** - Facebook Ads spend
2. **Impressions & CPM** - Reach and cost efficiency
3. **Calls Booked & Cost Per Call** - Lead generation efficiency
4. **Live Calls & Show Rate** - Call completion rate
5. **Qualified Calls & Qualified Rate** - Lead quality
6. **Cost Per Qualified Call** - Efficiency metric
7. **Close Rate** - Sales effectiveness
8. **Customer Acquisition Cost (CAC)** - Total cost per customer
9. **ROI** - Return on investment

## Tech Stack

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Charts**: Recharts
- **Backend**: Express.js
- **Integrations**: Facebook Ads API, Calendly API, GoHighLevel API

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env` and fill in your API credentials:

```bash
cp .env.example .env
```

### 3. Configure Calendly for Attribution

Create two separate Calendly event types:
- One for Facebook Ads traffic (e.g., "Sales Call - Ads")
- One for Cold Email traffic (e.g., "Sales Call - Email")

Use different booking links for each traffic source.

### 4. Run the dashboard

**Development mode (frontend only):**
```bash
npm run dev
```

**With backend (for live data):**
```bash
# Terminal 1: Start the API server
npm run server:dev

# Terminal 2: Start the frontend
npm run dev
```

**Production build:**
```bash
npm run build
npm run preview
```

## API Endpoints

- `GET /api/metrics` - All dashboard metrics
- `GET /api/metrics/kpi` - KPI summary
- `GET /api/metrics/trends` - Weekly trends
- `GET /api/metrics/channels` - Channel breakdown
- `POST /api/sync/all` - Sync all data sources
- `POST /api/sync/facebook` - Sync Facebook Ads
- `POST /api/sync/calendly` - Sync Calendly
- `POST /api/sync/ghl` - Sync GoHighLevel
- `GET /api/sync/status` - Integration status

## API Configuration

### Facebook Ads

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create/use an app with Marketing API
3. Get Access Token from Graph API Explorer
4. Get Ad Account ID from Business Manager (format: `act_XXXXX`)

### Calendly

1. Go to [Calendly API Settings](https://calendly.com/integrations/api_webhooks)
2. Generate a Personal Access Token
3. Create two event types for attribution
4. Get the event type URIs

### GoHighLevel

1. Go to Settings > Business Profile > API Keys
2. Generate an API key
3. Get Location ID from URL when in sub-account
