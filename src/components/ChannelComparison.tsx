import { Megaphone, Mail } from 'lucide-react';

interface ChannelData {
  callsBooked: number;
  spend: number;
  costPerCall: number;
  showRate: number;
  closes: number;
}

interface ChannelComparisonProps {
  paidAds: ChannelData;
  coldEmail: ChannelData;
}

export default function ChannelComparison({ paidAds, coldEmail }: ChannelComparisonProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2
    }).format(value);
  };

  const totalCalls = paidAds.callsBooked + coldEmail.callsBooked;
  const totalCloses = paidAds.closes + coldEmail.closes;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Channel Comparison</h3>
        <p className="text-sm text-gray-500">Performance breakdown by acquisition channel</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Paid Ads */}
        <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-lg bg-blue-100 p-2">
              <Megaphone className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold text-blue-900">Paid Ads</h4>
              <p className="text-sm text-blue-600">
                {((paidAds.callsBooked / totalCalls) * 100).toFixed(0)}% of total calls
              </p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-blue-700">Calls Booked</span>
              <span className="font-semibold text-blue-900">{paidAds.callsBooked}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">Total Spend</span>
              <span className="font-semibold text-blue-900">{formatCurrency(paidAds.spend)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">Cost per Call</span>
              <span className="font-semibold text-blue-900">{formatCurrency(paidAds.costPerCall)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">Show Rate</span>
              <span className="font-semibold text-blue-900">{paidAds.showRate}%</span>
            </div>
            <div className="flex justify-between border-t border-blue-200 pt-3">
              <span className="text-blue-700">Closes</span>
              <span className="font-bold text-blue-900">{paidAds.closes}</span>
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
                {((coldEmail.callsBooked / totalCalls) * 100).toFixed(0)}% of total calls
              </p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-green-700">Calls Booked</span>
              <span className="font-semibold text-green-900">{coldEmail.callsBooked}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-700">Tool Cost</span>
              <span className="font-semibold text-green-900">{formatCurrency(coldEmail.spend)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-700">Cost per Call</span>
              <span className="font-semibold text-green-900">{formatCurrency(coldEmail.costPerCall)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-700">Show Rate</span>
              <span className="font-semibold text-green-900">{coldEmail.showRate}%</span>
            </div>
            <div className="flex justify-between border-t border-green-200 pt-3">
              <span className="text-green-700">Closes</span>
              <span className="font-bold text-green-900">{coldEmail.closes}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-gray-900">{totalCalls}</p>
            <p className="text-sm text-gray-500">Total Calls</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{totalCloses}</p>
            <p className="text-sm text-gray-500">Total Closes</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency((paidAds.spend + coldEmail.spend) / totalCloses)}
            </p>
            <p className="text-sm text-gray-500">Cost per Close</p>
          </div>
        </div>
      </div>
    </div>
  );
}
