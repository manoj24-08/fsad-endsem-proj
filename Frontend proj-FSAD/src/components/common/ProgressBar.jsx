import clsx from 'clsx';

export default function ProgressBar({ value = 0, max = 100, label, showPercent = true, size = 'md', color = 'brand' }) {
  const pct = Math.min(100, Math.round((value / max) * 100));

  const heights = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-4' };
  const colors = {
    brand: 'bg-brand-600',
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    orange: 'bg-orange-500',
    red: 'bg-red-500',
  };

  return (
    <div className="w-full">
      {(label || showPercent) && (
        <div className="flex justify-between items-center mb-1">
          {label && <span className="text-xs text-slate-600">{label}</span>}
          {showPercent && <span className="text-xs font-medium text-slate-700">{pct}%</span>}
        </div>
      )}
      <div className={clsx('w-full bg-slate-100 rounded-full overflow-hidden', heights[size])}>
        <div
          className={clsx('h-full rounded-full transition-all duration-500', colors[color])}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
