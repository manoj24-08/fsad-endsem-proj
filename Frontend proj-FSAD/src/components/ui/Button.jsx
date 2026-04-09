import clsx from 'clsx';

const variants = {
  primary: 'bg-brand-700 text-white hover:bg-brand-600 focus:ring-brand-200 shadow-sm',
  secondary: 'bg-brand-50 text-brand-700 hover:bg-brand-100 focus:ring-brand-100',
  outline: 'border border-brand-300 text-brand-700 hover:bg-brand-50 focus:ring-brand-100',
  ghost: 'text-slate-600 hover:bg-slate-100 focus:ring-slate-200',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-200 shadow-sm',
  'danger-ghost': 'text-red-600 hover:bg-red-50 focus:ring-red-100',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs rounded-lg',
  md: 'px-4 py-2 text-sm rounded-lg',
  lg: 'px-6 py-2.5 text-sm rounded-xl',
  xl: 'px-8 py-3 text-base rounded-xl',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  loading = false,
  icon: Icon,
  iconRight: IconRight,
  fullWidth = false,
  ...props
}) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center gap-2 font-medium transition focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      ) : Icon ? (
        <Icon size={16} />
      ) : null}
      {children}
      {IconRight && !loading && <IconRight size={16} />}
    </button>
  );
}
