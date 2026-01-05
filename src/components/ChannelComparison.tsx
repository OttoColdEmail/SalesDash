import { Megaphone, Mail } from 'lucide-react';
import { ChannelMetrics } from '../data/types';

interface ChannelComparisonProps {
  channels: ChannelMetrics[];
}

export default function ChannelComparison({ channels }: ChannelComparisonProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  const paidAds = channels.find(c => c.channel === 'paid_ads');
  const coldEmail = channels.find(c => c.channel === 'cold_email');

  if (!paidAds || !coldEmail) return null;

  const totalCalls = paidAds.callsBooked + coldEmail.callsBooked;
  const totalLive = paidAds.liveCalls + coldEmail.liveCalls;
  const totalQualified = paidAds.qualified + coldEmail.qualified;
  const totalClosed = paidAds.closed + coldEmail.closed;
  const totalRevenue = paidAds.revenue + coldEmail.revenue;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Channel Attribution</h3>
        <p className="text-sm text-gray-500">Performance breakdown: Facebook Ads vs Cold Email</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Paid Ads */}
        <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-lg bg-blue-100 p-2">
              <Megaphone className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold text-blue-900">Facebook Ads</h4>
              <p className="text-sm text-blue-600">
                {((paidAds.callsBooked / totalCalls) * 100).toFixed(0)}% of calls
              </p>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-blue-700">Calls Booked</span>
              <span className="font-semibold text-blue-900">{paidAds.callsBooked}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">Live Calls</span>
              <span className="font-semibold text-blue-900">{paidAds.liveCalls}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">Show Rate</span>
              <span className="font-semibold text-blue-900">{paidAds.showRate.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">Qualified</span>
              <span className="font-semibold text-blue-900">{paidAds.qualified} ({paidAds.qualifiedRate.toFixed(1)}%)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">Closed</span>
              <span className="font-semibold text-blue-900">{paidAds.closed} ({paidAds.closeRate.toFixed(1)}%)</span>
            </div>
            <div className="flex justify-between border-t border-blue-200 pt-2 mt-2">
              <span className="text-blue-700">Revenue</span>
              <span className="font-bold text-blue-900">{formatCurrency(paidAds.revenue)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">CAC</span>
              <span className="font-bold text-blue-900">{formatCurrency(paidAds.cac)}</span>
            </div>
          </div>
        </div>

        {/* Cold Email */}
        <div className="rounded-xl border-2 border-green-200 bg-green-50 p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-lg bg-green-100 p-2">
              <Mail className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h4 className="font-semibold text-green-900">Cold Email</h4>
              <p className="text-sm text-green-600">
                {((coldEmail.callsBooked / totalCalls) * 100).toFixed(0)}% of calls
              </p>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-green-700">Calls Booked</span>
              <span className="font-semibold text-green-900">{coldEmail.callsBooked}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-700">Live Calls</span>
              <span className="font-semibold text-green-900">{coldEmail.liveCalls}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-700">Show Rate</span>
              <span className="font-semibold text-green-900">{coldEmail.showRate.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-700">Qualified</span>
              <span className="font-semibold text-green-900">{coldEmail.qualified} ({coldEmail.qualifiedRate.toFixed(1)}%)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-700">Closed</span>
              <span className="font-semibold text-green-900">{coldEmail.closed} ({coldEmail.closeRate.toFixed(1)}%)</span>
            </div>
            <div className="flex justify-between border-t border-green-200 pt-2 mt-2">
              <span className="text-green-700">Revenue</span>
              <span className="font-bold text-green-900">{formatCurrency(coldEmail.revenue)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-700">CAC</span>
              <span className="font-bold text-green-900">{coldEmail.cac > 0 ? formatCurrency(coldEmail.cac) : 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-gray-900">{totalCalls}</p>
            <p className="text-sm text-gray-500">Total Booked</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{totalLive}</p>
            <p className="text-sm text-gray-500">Total Live</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{totalQualified}</p>
            <p className="text-sm text-gray-500">Total Qualified</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{totalClosed}</p>
            <p className="text-sm text-gray-500">Total Closed</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(totalRevenue)}</p>
            <p className="text-sm text-gray-500">Total Revenue</p>
          </div>
        </div>
      </div>
    </div>
  );
}
