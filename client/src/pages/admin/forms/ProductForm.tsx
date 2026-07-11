import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { HiX } from 'react-icons/hi';
import api from '@services/api';
import FormField, { inputClass, textareaClass, selectClass } from '@components/admin/FormField';
import ImageUpload from '@components/admin/ImageUpload';
import { slugify } from '@utils/helpers';
import type { Product } from '@/types';

const schema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().min(10),
  price: z.coerce.number().min(0),
  salePrice: z.coerce.number().min(0).optional().or(z.literal('')),
  category: z.string().min(1),
  stock: z.coerce.number().min(0),
  featured: z.boolean(),
});

type FormData = z.infer<typeof schema>;

interface ProductFormProps {
  product?: Product | null;
  onClose: () => void;
  onSaved: () => void;
}

export default function ProductForm({ product, onClose, onSaved }: ProductFormProps) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const isEdit = !!product;

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: product ? {
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      salePrice: product.salePrice || '' as unknown as 0,
      category: product.category,
      stock: product.stock,
      featured: product.featured || false,
    } : {
      name: '', slug: '', description: '', price: 0,
      salePrice: '' as unknown as 0, category: '', stock: 0, featured: false,
    },
  });

  const name = watch('name');
  useEffect(() => {
    if (!isEdit && name) setValue('slug', slugify(name));
  }, [name, isEdit, setValue]);

  const onSubmit = async (data: FormData) => {
    setSaving(true);
    try {
      const payload: Record<string, unknown> = {
        ...data,
        salePrice: data.salePrice || undefined,
      };
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        formData.append('title', data.name);
        formData.append('category', 'Products');
        const uploadRes = await api.post('/gallery', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        payload.images = [uploadRes.data.data?.image || ''];
      }
      if (isEdit) await api.put(`/products/${product._id}`, payload);
      else await api.post('/products', payload);
      onSaved();
    } catch (err: any) { setError(err?.response?.data?.message || err?.message || 'Failed to save'); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 pt-20">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-3xl rounded-2xl border border-glass-light bg-luxury-charcoal p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">{isEdit ? 'Edit Product' : 'New Product'}</h2>
          <button onClick={onClose} className="text-luxury-gray hover:text-white"><HiX size={22} /></button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            <FormField label="Name" error={errors.name?.message} required><input {...register('name')} className={inputClass} /></FormField>
            <FormField label="Slug" error={errors.slug?.message} required><input {...register('slug')} className={inputClass} /></FormField>
          </div>
          <FormField label="Description" error={errors.description?.message} required><textarea {...register('description')} rows={4} className={textareaClass} /></FormField>
          <div className="grid gap-5 md:grid-cols-4">
            <FormField label="Price ($)" error={errors.price?.message} required><input type="number" step="0.01" {...register('price')} className={inputClass} /></FormField>
            <FormField label="Sale Price ($)"><input type="number" step="0.01" {...register('salePrice')} className={inputClass} /></FormField>
            <FormField label="Category" error={errors.category?.message} required><input {...register('category')} className={inputClass} /></FormField>
            <FormField label="Stock" error={errors.stock?.message} required><input type="number" {...register('stock')} min={0} className={inputClass} /></FormField>
          </div>
          <FormField label="Featured">
            <label className="flex items-center gap-3 rounded-xl border border-glass-light bg-luxury-charcoal/50 px-4 py-3">
              <input type="checkbox" {...register('featured')} className="h-5 w-5 accent-gold-500" />
              <span className="text-sm text-white">Show as featured product</span>
            </label>
          </FormField>
          <FormField label="Image"><ImageUpload value={product?.images?.[0]} onChange={setImageFile} onUrlChange={(url) => {}} /></FormField>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="rounded-xl border border-glass-light px-6 py-3 text-sm font-medium text-luxury-gray transition-all hover:bg-glass-light hover:text-white">Cancel</button>
            <button type="submit" disabled={saving} className="rounded-xl bg-gold-500 px-6 py-3 text-sm font-bold text-luxury-black transition-all hover:bg-gold-400 disabled:opacity-50">
              {saving ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
