import { useState, useRef, type ChangeEvent } from 'react';
import { HiPhotograph, HiX } from 'react-icons/hi';
import { cn } from '@utils/cn';

interface ImageUploadProps {
  value?: string;
  onChange: (file: File | null) => void;
  onUrlChange?: (url: string) => void;
  className?: string;
}

export default function ImageUpload({ value, onChange, onUrlChange, className }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(value || null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    onChange(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleRemove = () => {
    onChange(null);
    setPreview(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className={cn('space-y-2', className)}>
      {preview ? (
        <div className="relative overflow-hidden rounded-xl border border-glass-light">
          <img src={preview} alt="Preview" className="h-48 w-full object-cover" />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
          >
            <HiX size={16} />
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={cn(
            'flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-all',
            dragOver ? 'border-gold-500 bg-gold-500/5' : 'border-glass-light hover:border-gold-500/50 hover:bg-glass-light/30'
          )}
        >
          <HiPhotograph className="mb-2 text-luxury-gray" size={32} />
          <p className="text-sm font-medium text-luxury-gray">Drop an image here or click to browse</p>
          <p className="mt-1 text-xs text-luxury-gray">PNG, JPG, WebP up to 5MB</p>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />
      {onUrlChange && (
        <input
          type="text"
          placeholder="Or paste an image URL..."
          value={value || ''}
          onChange={(e) => onUrlChange(e.target.value)}
          className="w-full rounded-xl border border-glass-light bg-luxury-charcoal/50 py-2.5 px-4 text-sm text-white placeholder-luxury-gray outline-none transition-all focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
        />
      )}
    </div>
  );
}
