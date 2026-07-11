import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { HiX, HiPlus, HiTrash } from 'react-icons/hi';
import api from '@services/api';
import FormField, { inputClass, textareaClass, selectClass } from '@components/admin/FormField';
import ImageUpload from '@components/admin/ImageUpload';
import { slugify } from '@utils/helpers';
import type { Program } from '@/types';

const schema = z.object({
  title: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().min(10),
  longDescription: z.string().min(20),
  category: z.string().min(1),
  duration: z.string().min(1),
  intensity: z.enum(['beginner', 'intermediate', 'advanced']),
  price: z.coerce.number().min(0),
  image: z.string().optional().or(z.literal('')),
  benefits: z.array(z.object({ value: z.string().min(1) })),
});

type FormData = z.infer<typeof schema>;

interface ProgramFormProps {
  program?: Program | null;
  onClose: () => void;
  onSaved: () => void;
}

export default function ProgramForm({ program, onClose, onSaved }: ProgramFormProps) {
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const isEdit = !!program;

  const { register, handleSubmit, formState: { errors }, control, setValue, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: program ? {
      title: program.title,
      slug: program.slug,
      description: program.description,
      longDescription: program.longDescription,
      category: program.category,
      duration: program.duration,
      intensity: program.intensity,
      price: program.price,
      image: program.image || '',
      benefits: program.benefits?.map((b) => ({ value: b })) || [{ value: '' }],
    } : {
      title: '',
      slug: '',
      description: '',
      longDescription: '',
      category: '',
      duration: '',
      intensity: 'beginner',
      price: 0,
      image: '',
      benefits: [{ value: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'benefits' });
  const title = watch('title');

  useEffect(() => {
    if (!isEdit && title) setValue('slug', slugify(title));
  }, [title, isEdit, setValue]);

  const onSubmit = async (data: FormData) => {
    setSaving(true);
    setError('');
    try {
      if (!data.image && !imageFile) {
        setError('Please provide an image (upload a file or paste a URL).');
        setSaving(false);
        return;
      }
      const payload: Record<string, unknown> = {
        ...data,
        benefits: data.benefits.map((b) => b.value),
      };
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        const uploadRes = await api.post('/programs/upload', formData);
        payload.image = uploadRes.data.data?.image || '';
      }
      if (isEdit) await api.put(`/programs/${program._id}`, payload);
      else await api.post('/programs', payload);
      onSaved();
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to save program. Please try again.';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 pt-20">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-3xl rounded-2xl border border-glass-light bg-luxury-charcoal p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">{isEdit ? 'Edit Program' : 'New Program'}</h2>
          <button onClick={onClose} className="text-luxury-gray hover:text-white"><HiX size={22} /></button>
        </div>
        {error && (
          <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            <FormField label="Title" error={errors.title?.message} required><input {...register('title')} className={inputClass} /></FormField>
            <FormField label="Slug" error={errors.slug?.message} required><input {...register('slug')} className={inputClass} /></FormField>
          </div>
          <FormField label="Description" error={errors.description?.message} required><textarea {...register('description')} rows={2} className={textareaClass} /></FormField>
          <FormField label="Long Description" error={errors.longDescription?.message} required><textarea {...register('longDescription')} rows={6} className={textareaClass} /></FormField>
          <div className="grid gap-5 md:grid-cols-4">
            <FormField label="Category" error={errors.category?.message} required><input {...register('category')} className={inputClass} /></FormField>
            <FormField label="Duration" error={errors.duration?.message} required><input {...register('duration')} placeholder="e.g. 8 weeks" className={inputClass} /></FormField>
            <FormField label="Intensity" error={errors.intensity?.message} required>
              <select {...register('intensity')} className={selectClass}>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </FormField>
            <FormField label="Price ($)" error={errors.price?.message} required><input type="number" {...register('price')} min={0} className={inputClass} /></FormField>
          </div>
          <FormField label="Image" error={errors.image?.message} required>
            <ImageUpload value={program?.image} onChange={setImageFile} onUrlChange={(url) => setValue('image', url)} />
          </FormField>
          <div>
            <label className="mb-2 block text-sm font-medium text-luxury-gray">Benefits</label>
            {fields.map((field, i) => (
              <div key={field.id} className="mb-2 flex items-center gap-2">
                <input {...register(`benefits.${i}.value`)} placeholder="Enter a benefit" className={inputClass} />
                <button type="button" onClick={() => remove(i)} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-red-500 hover:bg-red-500/10"><HiTrash size={16} /></button>
              </div>
            ))}
            <button type="button" onClick={() => append({ value: '' })} className="flex items-center gap-2 text-sm text-gold-500 hover:text-gold-400"><HiPlus size={16} /> Add Benefit</button>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="rounded-xl border border-glass-light px-6 py-3 text-sm font-medium text-luxury-gray transition-all hover:bg-glass-light hover:text-white">Cancel</button>
            <button type="submit" disabled={saving} className="rounded-xl bg-gold-500 px-6 py-3 text-sm font-bold text-luxury-black transition-all hover:bg-gold-400 disabled:opacity-50">
              {saving ? 'Saving...' : isEdit ? 'Update Program' : 'Create Program'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
