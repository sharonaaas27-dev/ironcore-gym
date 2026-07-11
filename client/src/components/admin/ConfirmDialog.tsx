import { HiExclamation, HiX } from 'react-icons/hi';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Delete',
  onConfirm,
  onCancel,
  loading,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-md rounded-2xl border border-glass-light bg-luxury-charcoal p-6 shadow-2xl">
        <button
          onClick={onCancel}
          className="absolute right-4 top-4 text-luxury-gray hover:text-white"
        >
          <HiX size={20} />
        </button>
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/20">
          <HiExclamation className="text-red-500" size={24} />
        </div>
        <h3 className="mb-2 text-lg font-bold text-white">{title}</h3>
        <p className="mb-6 text-sm text-luxury-gray">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-xl border border-glass-light py-3 text-sm font-medium text-luxury-gray transition-all hover:bg-glass-light hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 rounded-xl bg-red-500 py-3 text-sm font-bold text-white transition-all hover:bg-red-600 disabled:opacity-50"
          >
            {loading ? 'Deleting...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
