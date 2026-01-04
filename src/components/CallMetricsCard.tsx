import { Phone, PhoneOff, Calendar, CheckCircle, XCircle, TrendingUp } from 'lucide-react';
import { CallMetrics } from '../data/types';

interface CallMetricsCardProps {
  metrics: CallMetrics;
}

export default function CallMetricsCard({ metrics }: CallMetricsCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Call Performance</h3>
        <p className="text-sm text-gray-500">Detailed breakdown of call outcomes</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="rounded-lg bg-blue-50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-600">Booked</span>
          </div>
          <p className="text-2xl font-bold text-blue-900">{metrics.totalBooked}</p>
        </div>

        <div className="rounded-lg bg-green-50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Phone className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-green-600">Completed</span>
          </div>
          <p className="text-2xl font-bold text-green-900">{metrics.totalCompleted}</p>
        </div>

        <div className="rounded-lg bg-purple-50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            <span className="text-sm font-medium text-purple-600">Show Rate</span>
          </div>
          <p className="text-2xl font-bold text-purple-900">{metrics.showRate}%</p>
        </div>

        <div className="rounded-lg bg-red-50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <PhoneOff className="h-5 w-5 text-red-600" />
            <span className="text-sm font-medium text-red-600">No Shows</span>
          </div>
          <p className="text-2xl font-bold text-red-900">{metrics.noShows}</p>
        </div>

        <div className="rounded-lg bg-orange-50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-5 w-5 text-orange-600" />
            <span className="text-sm font-medium text-orange-600">Rescheduled</span>
          </div>
          <p className="text-2xl font-bold text-orange-900">{metrics.rescheduled}</p>
        </div>

        <div className="rounded-lg bg-emerald-50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-5 w-5 text-emerald-600" />
            <span className="text-sm font-medium text-emerald-600">Closed</span>
          </div>
          <p className="text-2xl font-bold text-emerald-900">{metrics.closed}</p>
          <p className="text-xs text-emerald-600 mt-1">{metrics.closeRate}% close rate</p>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-gray-400" />
            <span className="text-sm text-gray-600">Lost Opportunities</span>
          </div>
          <span className="font-medium text-gray-900">
            {metrics.totalCompleted - metrics.closed} calls ({((metrics.totalCompleted - metrics.closed) / metrics.totalCompleted * 100).toFixed(1)}%)
          </span>
        </div>
      </div>
    </div>
  );
}
