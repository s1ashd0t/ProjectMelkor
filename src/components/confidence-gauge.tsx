'use client';

interface ConfidenceGaugeProps {
  label: string;
  value: number;
  color?: 'blue' | 'green' | 'red' | 'yellow';
}

export function ConfidenceGauge({ label, value, color = 'blue' }: ConfidenceGaugeProps) {
  const colorClasses: { [key: string]: { bg: string; text: string; bar: string } } = {
    blue: { bg: 'bg-blue-500/20', text: 'text-blue-400', bar: 'bg-blue-500' },
    green: { bg: 'bg-green-500/20', text: 'text-green-400', bar: 'bg-green-500' },
    red: { bg: 'bg-red-500/20', text: 'text-red-400', bar: 'bg-red-500' },
    yellow: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', bar: 'bg-yellow-500' },
  };

  const colors = colorClasses[color];

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-semibold text-slate-300">{label}</span>
        <span className={`text-sm font-bold ${colors.text}`}>{value.toFixed(0)}%</span>
      </div>
      <div className={`w-full h-2 rounded-full ${colors.bg} overflow-hidden`}>
        <div
          className={`h-full ${colors.bar} transition-all duration-300`}
          style={{ width: `${Math.min(value, 100)}%` }}
        ></div>
      </div>
    </div>
  );
}
