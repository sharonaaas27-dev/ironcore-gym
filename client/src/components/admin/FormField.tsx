import type { ReactNode } from 'react';
import { cn } from '@utils/cn';

interface FormFieldProps {
  label: string;
  error?: string;
  icon?: ReactNode;
  children: ReactNode;
  required?: boolean;
  className?: string;
}

export default function FormField({ label, error, icon, children, required, className }: FormFieldProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <label className="block text-sm font-medium text-luxury-gray">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-luxury-gray">
            {icon}
          </div>
        )}
        {children}
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

export const inputClass = "w-full rounded-xl border border-glass-light bg-luxury-charcoal/50 py-3 px-4 text-white placeholder-luxury-gray outline-none transition-all focus:border-gold-500 focus:ring-1 focus:ring-gold-500";
export const inputWithIconClass = "w-full rounded-xl border border-glass-light bg-luxury-charcoal/50 py-3 pl-12 pr-4 text-white placeholder-luxury-gray outline-none transition-all focus:border-gold-500 focus:ring-1 focus:ring-gold-500";
export const selectClass = "w-full rounded-xl border border-glass-light bg-luxury-charcoal/50 py-3 px-4 text-white outline-none transition-all focus:border-gold-500 focus:ring-1 focus:ring-gold-500 [&>option]:bg-luxury-charcoal";
export const textareaClass = "w-full resize-none rounded-xl border border-glass-light bg-luxury-charcoal/50 py-3 px-4 text-white placeholder-luxury-gray outline-none transition-all focus:border-gold-500 focus:ring-1 focus:ring-gold-500";
