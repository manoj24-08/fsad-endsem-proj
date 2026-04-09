import clsx from 'clsx';

export function Input({ label, error, hint, className, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="label">
          {label}
          {props.required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <input
        className={clsx(
          'input',
          error && 'border-red-400 focus:border-red-400 focus:ring-red-100',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
      {hint && !error && <p className="text-xs text-slate-400">{hint}</p>}
    </div>
  );
}

export function Textarea({ label, error, hint, className, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="label">
          {label}
          {props.required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <textarea
        className={clsx(
          'input resize-none',
          error && 'border-red-400 focus:border-red-400 focus:ring-red-100',
          className
        )}
        rows={4}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
      {hint && !error && <p className="text-xs text-slate-400">{hint}</p>}
    </div>
  );
}

export function Select({ label, error, hint, children, className, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="label">
          {label}
          {props.required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <select
        className={clsx(
          'input',
          error && 'border-red-400 focus:border-red-400 focus:ring-red-100',
          className
        )}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
      {hint && !error && <p className="text-xs text-slate-400">{hint}</p>}
    </div>
  );
}
