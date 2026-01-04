import {
  DollarSign,
  Phone,
  TrendingUp,
  Mail,
  Target,
  Users,
  BarChart3,
  RefreshCw,
} from 'lucide-react';
import KPICard from './components/KPICard';
import AdCampaignsTable from './components/AdCampaignsTable';
import EmailCampaignsTable from './components/EmailCampaignsTable';
import PipelineFunnel from './components/PipelineFunnel';
import TrendCharts from './components/TrendCharts';
import CallMetricsCard from './components/CallMetricsCard';
import ChannelComparison from './components/ChannelComparison';
import {
  adCampaigns,
  emailCampaigns,
  callMetrics,
  pipelineStages,
  weeklyTrends,
  kpiSummary,
  channelBreakdown,
} from './data/mockData';

function App() {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-600 p-2">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">SalesDash</h1>
                <p className="text-xs text-gray-500">Marketing & Sales Reporting</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">
                Last updated: {new Date().toLocaleString()}
              </span>
              <button className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors">
                <RefreshCw className="h-4 w-4" />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPI Cards */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Key Metrics Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard
              title="Total Ad Spend"
              value={formatCurrency(kpiSummary.totalAdSpend)}
              subtitle="This month"
              icon={DollarSign}
              trend={{ value: 12.5, isPositive: false }}
              color="blue"
            />
            <KPICard
              title="Calls Booked"
              value={kpiSummary.totalCallsBooked + kpiSummary.totalEmailCallsBooked}
              subtitle={`${kpiSummary.totalCallsBooked} ads + ${kpiSummary.totalEmailCallsBooked} email`}
              icon={Phone}
              trend={{ value: 18.2, isPositive: true }}
              color="green"
            />
            <KPICard
              title="Show Rate"
              value={`${kpiSummary.overallShowRate}%`}
              subtitle={`${kpiSummary.totalCallsCompleted} completed`}
              icon={TrendingUp}
              trend={{ value: 2.1, isPositive: true }}
              color="purple"
            />
            <KPICard
              title="Cost per Call"
              value={formatCurrency(kpiSummary.costPerCall)}
              subtitle="Paid ads only"
              icon={Target}
              trend={{ value: 5.3, isPositive: true }}
              color="orange"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            <KPICard
              title="Emails Sent"
              value={kpiSummary.totalEmailsSent.toLocaleString()}
              subtitle="Cold outreach"
              icon={Mail}
              trend={{ value: 8.4, isPositive: true }}
              color="pink"
            />
            <KPICard
              title="Deals Closed"
              value={kpiSummary.totalCloses}
              subtitle={`${kpiSummary.closeRate}% close rate`}
              icon={Users}
              trend={{ value: 15.0, isPositive: true }}
              color="green"
            />
            <KPICard
              title="Revenue"
              value={formatCurrency(kpiSummary.revenue)}
              subtitle="Closed deals"
              icon={DollarSign}
              trend={{ value: 22.5, isPositive: true }}
              color="cyan"
            />
            <KPICard
              title="ROI"
              value={`${kpiSummary.roi.toFixed(0)}%`}
              subtitle="Return on ad spend"
              icon={TrendingUp}
              trend={{ value: 35.2, isPositive: true }}
              color="green"
            />
          </div>
        </section>

        {/* Channel Comparison & Call Metrics */}
        <section className="mb-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChannelComparison
            paidAds={channelBreakdown.paidAds}
            coldEmail={channelBreakdown.coldEmail}
          />
          <CallMetricsCard metrics={callMetrics} />
        </section>

        {/* Pipeline Funnel */}
        <section className="mb-8">
          <PipelineFunnel stages={pipelineStages} />
        </section>

        {/* Trend Charts */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Weekly Trends</h2>
          <TrendCharts data={weeklyTrends} />
        </section>

        {/* Campaign Tables */}
        <section className="mb-8 space-y-6">
          <AdCampaignsTable campaigns={adCampaigns} />
          <EmailCampaignsTable campaigns={emailCampaigns} />
        </section>

        {/* Footer */}
        <footer className="text-center text-sm text-gray-500 py-8 border-t border-gray-200">
          <p>SalesDash - Marketing & Sales Reporting Dashboard</p>
          <p className="mt-1">Data refreshes automatically every 15 minutes</p>
        </footer>
      </main>
    </div>
  );
}

export default App;
