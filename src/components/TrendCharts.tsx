import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { WeeklyTrend } from '../data/types';

interface TrendChartsProps {
  data: WeeklyTrend[];
}

export default function TrendCharts({ data }: TrendChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Ad Spend vs Calls Booked */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Ad Spend vs Calls Booked</h3>
        <p className="text-sm text-gray-500 mb-4">Weekly trend of paid ad performance</p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="week" tick={{ fontSize: 12 }} stroke="#6B7280" />
              <YAxis yAxisId="left" tick={{ fontSize: 12 }} stroke="#6B7280" />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} stroke="#6B7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value, name) => {
                  if (name === 'Ad Spend') return [`$${Number(value).toLocaleString()}`, name];
                  return [value, name];
                }}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="adSpend" name="Ad Spend" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              <Bar yAxisId="right" dataKey="callsBooked" name="Calls Booked" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Show Rate Trend */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Show Rate Trend</h3>
        <p className="text-sm text-gray-500 mb-4">Weekly percentage of calls completed</p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="week" tick={{ fontSize: 12 }} stroke="#6B7280" />
              <YAxis
                domain={[60, 80]}
                tick={{ fontSize: 12 }}
                stroke="#6B7280"
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value) => [`${Number(value).toFixed(1)}%`, 'Show Rate']}
              />
              <Line
                type="monotone"
                dataKey="showRate"
                stroke="#8B5CF6"
                strokeWidth={3}
                dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Email Performance */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Cold Email Performance</h3>
        <p className="text-sm text-gray-500 mb-4">Emails sent vs calls booked from email</p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="week" tick={{ fontSize: 12 }} stroke="#6B7280" />
              <YAxis yAxisId="left" tick={{ fontSize: 12 }} stroke="#6B7280" />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} stroke="#6B7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="emailsSent" name="Emails Sent" fill="#EC4899" radius={[4, 4, 0, 0]} />
              <Bar yAxisId="right" dataKey="emailCallsBooked" name="Calls Booked" fill="#F59E0B" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Combined Calls Booked */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Total Calls Booked by Channel</h3>
        <p className="text-sm text-gray-500 mb-4">Weekly breakdown of call sources</p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="week" tick={{ fontSize: 12 }} stroke="#6B7280" />
              <YAxis tick={{ fontSize: 12 }} stroke="#6B7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
              <Bar dataKey="callsBooked" name="Paid Ads" stackId="a" fill="#3B82F6" radius={[0, 0, 0, 0]} />
              <Bar dataKey="emailCallsBooked" name="Cold Email" stackId="a" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
