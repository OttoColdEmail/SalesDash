import {
  DollarSign,
  Phone,
  TrendingUp,
  Eye,
  UserCheck,
  Target,
  Percent,
  BarChart3,
  RefreshCw,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import KPICard from './components/KPICard';
import PipelineFunnel from './components/PipelineFunnel';
import TrendCharts from './components/TrendCharts';
import ChannelComparison from './components/ChannelComparison';
import {
  pipelineStages,
  weeklyTrends,
  kpiSummary,
  channelMetrics,
  integrationStatus,
} from './data/mockData';

function App() {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  const getStatusIcon = (status: string) => {
    if (status === 'connected') return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (status === 'error') return <XCircle className="h-4 w-4 text-red-500" />;
    return <XCircle className="h-4 w-4 text-gray-400" />;
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
            <div className="flex items-center gap-6">
              {/* Integration Status */}
              <div className="hidden md:flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1.5">
                  {getStatusIcon(integrationStatus.facebook)}
                  <span className="text-gray-600">Facebook</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {getStatusIcon(integrationStatus.calendly)}
                  <span className="text-gray-600">Calendly</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {getStatusIcon(integrationStatus.ghl)}
                  <span className="text-gray-600">GHL</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">
                  {integrationStatus.lastSync
                    ? `Last sync: ${integrationStatus.lastSync}`
                    : 'Using sample data'}
                </span>
                <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
                  <RefreshCw className="h-4 w-4" />
                  Sync Data
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Row 1: Spend, Impressions, CPM */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Ad Performance</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <KPICard
              title="Total Spend"
              value={formatCurrency(kpiSummary.totalSpend)}
              subtitle="Facebook Ads"
              icon={DollarSign}
              color="blue"
            />
            <KPICard
              title="Impressions"
              value={formatNumber(kpiSummary.totalImpressions)}
              subtitle="Total reach"
              icon={Eye}
              color="purple"
            />
            <KPICard
              title="CPM"
              value={`$${kpiSummary.avgCpm.toFixed(2)}`}
              subtitle="Cost per 1,000 impressions"
              icon={Target}
              color="cyan"
            />
          </div>
        </section>

        {/* Row 2: Calls Booked, Cost Per Call */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Calls Booked</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <KPICard
              title="Total Calls Booked"
              value={kpiSummary.totalCallsBooked}
              subtitle={`${kpiSummary.adsCallsBooked} ads + ${kpiSummary.emailCallsBooked} email`}
              icon={Phone}
              color="green"
            />
            <KPICard
              title="Cost Per Call"
              value={formatCurrency(kpiSummary.costPerCall)}
              subtitle="Spend ÷ Calls Booked"
              icon={DollarSign}
              color="orange"
            />
            <KPICard
              title="Booking Rate"
              value={`${((kpiSummary.totalCallsBooked / kpiSummary.totalImpressions) * 100000).toFixed(1)}`}
              subtitle="Calls per 100k impressions"
              icon={TrendingUp}
              color="blue"
            />
          </div>
        </section>

        {/* Row 3: Live Calls, Show Rate, Qualified */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Call Quality</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard
              title="Live Calls"
              value={kpiSummary.totalLiveCalls}
              subtitle="Calls completed"
              icon={Phone}
              color="purple"
            />
            <KPICard
              title="Show Rate"
              value={`${kpiSummary.showRate.toFixed(1)}%`}
              subtitle="Live ÷ Booked"
              icon={Percent}
              color="green"
            />
            <KPICard
              title="Qualified Calls"
              value={kpiSummary.totalQualified}
              subtitle={`${kpiSummary.qualifiedRate.toFixed(1)}% qualified rate`}
              icon={UserCheck}
              color="pink"
            />
            <KPICard
              title="Cost Per Qualified"
              value={formatCurrency(kpiSummary.costPerQualified)}
              subtitle="Spend ÷ Qualified"
              icon={Target}
              color="orange"
            />
          </div>
        </section>

        {/* Row 4: Closes, CAC, Revenue, ROI */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue & ROI</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard
              title="Deals Closed"
              value={kpiSummary.totalClosed}
              subtitle={`${kpiSummary.closeRate.toFixed(1)}% close rate`}
              icon={UserCheck}
              color="green"
            />
            <KPICard
              title="Customer Acquisition Cost"
              value={formatCurrency(kpiSummary.cac)}
              subtitle="Spend ÷ Closed"
              icon={DollarSign}
              color="orange"
            />
            <KPICard
              title="Revenue"
              value={formatCurrency(kpiSummary.totalRevenue)}
              subtitle="Closed deals"
              icon={DollarSign}
              color="cyan"
            />
            <KPICard
              title="ROI"
              value={`${kpiSummary.roi.toFixed(0)}%`}
              subtitle="(Revenue - Spend) ÷ Spend"
              icon={TrendingUp}
              color="green"
            />
          </div>
        </section>

        {/* Pipeline Funnel */}
        <section className="mb-8">
          <PipelineFunnel stages={pipelineStages} />
        </section>

        {/* Channel Comparison */}
        <section className="mb-8">
          <ChannelComparison channels={channelMetrics} />
        </section>

        {/* Trend Charts */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Weekly Trends</h2>
          <TrendCharts data={weeklyTrends} />
        </section>

        {/* Footer */}
        <footer className="text-center text-sm text-gray-500 py-8 border-t border-gray-200">
          <p>SalesDash - Marketing & Sales Reporting Dashboard</p>
          <p className="mt-1">Connect your accounts to see live data</p>
        </footer>
      </main>
    </div>
  );
}

export default App;
