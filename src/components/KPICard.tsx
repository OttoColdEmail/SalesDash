import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color: 'blue' | 'green' | 'purple' | 'orange' | 'pink' | 'cyan';
}

const colorClasses = {
  blue: 'bg-blue-50 text-blue-600 border-blue-200',
  green: 'bg-green-50 text-green-600 border-green-200',
  purple: 'bg-purple-50 text-purple-600 border-purple-200',
  orange: 'bg-orange-50 text-orange-600 border-orange-200',
  pink: 'bg-pink-50 text-pink-600 border-pink-200',
  cyan: 'bg-cyan-50 text-cyan-600 border-cyan-200',
};

const iconBgClasses = {
  blue: 'bg-blue-100',
  green: 'bg-green-100',
  purple: 'bg-purple-100',
  orange: 'bg-orange-100',
  pink: 'bg-pink-100',
  cyan: 'bg-cyan-100',
};

export default function KPICard({ title, value, subtitle, icon: Icon, trend, color }: KPICardProps) {
  return (
    <div className={`rounded-xl border p-5 ${colorClasses[color]}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium opacity-80">{title}</p>
          <p className="mt-2 text-3xl font-bold">{value}</p>
          {subtitle && (
            <p className="mt-1 text-sm opacity-70">{subtitle}</p>
          )}
          {trend && (
            <div className={`mt-2 flex items-center text-sm ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              <span>{trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%</span>
              <span className="ml-1 opacity-70">vs last week</span>
            </div>
          )}
        </div>
        <div className={`rounded-lg p-3 ${iconBgClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
