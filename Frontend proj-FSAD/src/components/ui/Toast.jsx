import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import clsx from 'clsx';
import { useAppData } from '../../context/AppDataContext';

const icons = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
};

const styles = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
};

export default function Toast() {
  const { toast } = useAppData();
  if (!toast) return null;

  const Icon = icons[toast.type] || icons.success;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-4">
      <div
        className={clsx(
          'flex items-center gap-3 px-4 py-3 rounded-xl border shadow-soft max-w-sm',
          styles[toast.type] || styles.success
        )}
      >
        <Icon size={18} className="flex-shrink-0" />
        <p className="text-sm font-medium">{toast.message}</p>
      </div>
    </div>
  );
}
