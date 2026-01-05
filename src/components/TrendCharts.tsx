import {
  LineChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ComposedChart,
} from 'recharts';
import { WeeklyTrend } from '../data/types';

interface TrendChartsProps {
  data: WeeklyTrend[];
}

export default function TrendCharts({ data }: TrendChartsProps) {
  const tooltipStyle = {
    backgroundColor: '#fff',
    border: '1px solid #E5E7EB',
    borderRadius: '8px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Spend vs Calls Booked */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Spend vs Calls Booked</h3>
        <p className="text-sm text-gray-500 mb-4">Weekly ad spend and resulting calls</p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="week" tick={{ fontSize: 12 }} stroke="#6B7280" />
              <YAxis yAxisId="left" tick={{ fontSize: 12 }} stroke="#6B7280" tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} stroke="#6B7280" />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value, name) => {
                  if (name === 'Spend') return [`$${Number(value).toLocaleString()}`, name];
                  return [value, name];
                }}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="spend" name="Spend" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              <Line yAxisId="right" type="monotone" dataKey="callsBooked" name="Calls" stroke="#10B981" strokeWidth={3} dot={{ r: 4 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Show Rate & Qualified Rate */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Show Rate & Qualified Rate</h3>
        <p className="text-sm text-gray-500 mb-4">Weekly conversion rates</p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="week" tick={{ fontSize: 12 }} stroke="#6B7280" />
              <YAxis
                domain={[50, 90]}
                tick={{ fontSize: 12 }}
                stroke="#6B7280"
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value) => [`${Number(value).toFixed(1)}%`]}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="showRate"
                name="Show Rate"
                stroke="#8B5CF6"
                strokeWidth={3}
                dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="qualifiedRate"
                name="Qualified Rate"
                stroke="#EC4899"
                strokeWidth={3}
                dot={{ fill: '#EC4899', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* CAC Trend */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Customer Acquisition Cost</h3>
        <p className="text-sm text-gray-500 mb-4">Weekly CAC trend</p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="week" tick={{ fontSize: 12 }} stroke="#6B7280" />
              <YAxis yAxisId="left" tick={{ fontSize: 12 }} stroke="#6B7280" tickFormatter={(v) => `$${v}`} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} stroke="#6B7280" />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value, name) => {
                  if (name === 'CAC') return [`$${Number(value).toLocaleString()}`, name];
                  return [value, name];
                }}
              />
              <Legend />
              <Bar yAxisId="right" dataKey="closed" name="Deals Closed" fill="#22C55E" radius={[4, 4, 0, 0]} />
              <Line yAxisId="left" type="monotone" dataKey="cac" name="CAC" stroke="#F59E0B" strokeWidth={3} dot={{ r: 4 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ROI Trend */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Revenue & ROI</h3>
        <p className="text-sm text-gray-500 mb-4">Weekly revenue and return on investment</p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="week" tick={{ fontSize: 12 }} stroke="#6B7280" />
              <YAxis yAxisId="left" tick={{ fontSize: 12 }} stroke="#6B7280" tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} stroke="#6B7280" tickFormatter={(v) => `${v}%`} />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value, name) => {
                  if (name === 'Revenue') return [`$${Number(value).toLocaleString()}`, name];
                  if (name === 'ROI') return [`${Number(value).toFixed(0)}%`, name];
                  return [value, name];
                }}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="revenue" name="Revenue" fill="#06B6D4" radius={[4, 4, 0, 0]} />
              <Line yAxisId="right" type="monotone" dataKey="roi" name="ROI" stroke="#10B981" strokeWidth={3} dot={{ r: 4 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
