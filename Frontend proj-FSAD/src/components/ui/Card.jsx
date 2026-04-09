import clsx from 'clsx';

export default function Card({ children, className, hover = false, padding = true, ...props }) {
  return (
    <div
      className={clsx(
        'card',
        hover && 'card-hover cursor-pointer',
        padding && 'p-6',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, action, className }) {
  return (
    <div className={clsx('flex items-start justify-between mb-4', className)}>
      <div>
        <h3 className="text-base font-semibold text-slate-800">{title}</h3>
        {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {action && <div className="ml-4 flex-shrink-0">{action}</div>}
    </div>
  );
}

export function StatCard({ label, value, icon: Icon, trend, color = 'brand' }) {
  const colorMap = {
    brand: { bg: 'bg-brand-50', icon: 'text-brand-600', value: 'text-brand-700' },
    green: { bg: 'bg-green-50', icon: 'text-green-600', value: 'text-green-700' },
    blue: { bg: 'bg-blue-50', icon: 'text-blue-600', value: 'text-blue-700' },
    orange: { bg: 'bg-orange-50', icon: 'text-orange-600', value: 'text-orange-700' },
    red: { bg: 'bg-red-50', icon: 'text-red-600', value: 'text-red-700' },
  };
  const c = colorMap[color] || colorMap.brand;

  return (
    <Card className="flex items-center gap-4">
      {Icon && (
        <div className={clsx('p-3 rounded-xl', c.bg)}>
          <Icon size={22} className={c.icon} />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-500 truncate">{label}</p>
        <p className={clsx('text-2xl font-bold mt-0.5', c.value)}>{value}</p>
        {trend && <p className="text-xs text-slate-400 mt-0.5">{trend}</p>}
      </div>
    </Card>
  );
}

export function Badge({ children, variant = 'default', className }) {
  const variants = {
    default: 'bg-slate-100 text-slate-600',
    brand: 'bg-brand-100 text-brand-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    danger: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
  };
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
