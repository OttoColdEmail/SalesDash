import { PipelineStage } from '../data/types';

interface PipelineFunnelProps {
  stages: PipelineStage[];
}

export default function PipelineFunnel({ stages }: PipelineFunnelProps) {
  const maxCount = Math.max(...stages.map(s => s.count));

  const formatCurrency = (value: number) => {
    if (value === 0) return '—';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Sales Pipeline</h3>
        <p className="text-sm text-gray-500">Conversion funnel from calls to closed deals</p>
      </div>
      <div className="space-y-3">
        {stages.map((stage, index) => {
          const widthPercent = (stage.count / maxCount) * 100;
          const conversionFromPrev = index > 0
            ? ((stage.count / stages[index - 1].count) * 100).toFixed(1)
            : null;

          return (
            <div key={stage.name} className="relative">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">{stage.name}</span>
                  {conversionFromPrev && (
                    <span className="text-xs text-gray-500">
                      ({conversionFromPrev}% conversion)
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-gray-900">{stage.count}</span>
                  <span className="text-sm text-gray-500 w-24 text-right">
                    {formatCurrency(stage.value)}
                  </span>
                </div>
              </div>
              <div className="h-8 w-full rounded-lg bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-lg transition-all duration-500 flex items-center justify-end pr-3"
                  style={{
                    width: `${widthPercent}%`,
                    backgroundColor: stage.color,
                  }}
                >
                  {widthPercent > 15 && (
                    <span className="text-sm font-medium text-white">
                      {((stage.count / stages[0].count) * 100).toFixed(1)}%
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {((stages[stages.length - 1].count / stages[0].count) * 100).toFixed(1)}%
            </p>
            <p className="text-sm text-gray-500">Overall Conversion</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(stages[stages.length - 1].value)}
            </p>
            <p className="text-sm text-gray-500">Closed Revenue</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(stages[stages.length - 1].value / stages[stages.length - 1].count)}
            </p>
            <p className="text-sm text-gray-500">Avg Deal Size</p>
          </div>
        </div>
      </div>
    </div>
  );
}
