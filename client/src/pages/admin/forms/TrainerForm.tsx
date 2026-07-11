import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { HiX, HiPlus, HiTrash } from 'react-icons/hi';
import api from '@services/api';
import FormField, { inputClass, textareaClass } from '@components/admin/FormField';
import ImageUpload from '@components/admin/ImageUpload';
import type { Trainer } from '@/types';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  bio: z.string().min(10),
  experience: z.coerce.number().min(0),
  specialties: z.array(z.object({ value: z.string().min(1) })),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  twitter: z.string().optional(),
  linkedin: z.string().optional(),
  avatar: z.string().optional(),
  available: z.boolean(),
});

type FormData = z.infer<typeof schema>;

interface TrainerFormProps {
  trainer?: Trainer | null;
  onClose: () => void;
  onSaved: () => void;
}

export default function TrainerForm({ trainer, onClose, onSaved }: TrainerFormProps) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const isEdit = !!trainer;

  const { register, handleSubmit, formState: { errors }, control, setValue } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: trainer ? {
      name: trainer.name,
      email: trainer.email,
      phone: trainer.phone,
      bio: trainer.bio,
      experience: trainer.experience,
      specialties: trainer.specialties?.map((s) => ({ value: s })) || [{ value: '' }],
      instagram: trainer.socialLinks?.instagram || '',
      facebook: trainer.socialLinks?.facebook || '',
      twitter: trainer.socialLinks?.twitter || '',
      linkedin: trainer.socialLinks?.linkedin || '',
      avatar: trainer.avatar || '',
      available: trainer.available,
    } : {
      name: '', email: '', phone: '', bio: '', experience: 0,
      specialties: [{ value: '' }],
      instagram: '', facebook: '', twitter: '', linkedin: '',
      avatar: '', available: true,
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'specialties' });

  const onSubmit = async (data: FormData) => {
    setSaving(true);
    try {
      const payload: Record<string, unknown> = {
        name: data.name, email: data.email, phone: data.phone,
        bio: data.bio, experience: data.experience,
        specialties: data.specialties.map((s) => s.value),
        socialLinks: { instagram: data.instagram, facebook: data.facebook, twitter: data.twitter, linkedin: data.linkedin },
        available: data.available,
      };
      if (avatarFile) {
        const formData = new FormData();
        formData.append('image', avatarFile);
        formData.append('title', `${data.name}'s Avatar`);
        formData.append('category', 'Trainers');
        const uploadRes = await api.post('/gallery', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        payload.avatar = uploadRes.data.data?.image || '';
      } else if (data.avatar) {
        payload.avatar = data.avatar;
      }
      if (isEdit) await api.put(`/trainers/${trainer._id}`, payload);
      else await api.post('/trainers', payload);
      onSaved();
    } catch (err: any) { setError(err?.response?.data?.message || err?.message || 'Failed to save'); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 pt-20">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-3xl rounded-2xl border border-glass-light bg-luxury-charcoal p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">{isEdit ? 'Edit Trainer' : 'New Trainer'}</h2>
          <button onClick={onClose} className="text-luxury-gray hover:text-white"><HiX size={22} /></button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid gap-5 md:grid-cols-3">
            <FormField label="Name" error={errors.name?.message} required><input {...register('name')} className={inputClass} /></FormField>
            <FormField label="Email" error={errors.email?.message} required><input {...register('email')} className={inputClass} /></FormField>
            <FormField label="Phone" error={errors.phone?.message} required><input {...register('phone')} className={inputClass} /></FormField>
          </div>
          <FormField label="Bio" error={errors.bio?.message} required><textarea {...register('bio')} rows={4} className={textareaClass} /></FormField>
          <div className="grid gap-5 md:grid-cols-2">
            <FormField label="Experience (years)" error={errors.experience?.message} required><input type="number" {...register('experience')} className={inputClass} /></FormField>
            <FormField label="Available">
              <label className="flex items-center gap-3 rounded-xl border border-glass-light bg-luxury-charcoal/50 px-4 py-3">
                <input type="checkbox" {...register('available')} className="h-5 w-5 accent-gold-500" />
                <span className="text-sm text-white">Available for bookings</span>
              </label>
            </FormField>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-luxury-gray">Specialties</label>
            {fields.map((field, i) => (
              <div key={field.id} className="mb-2 flex items-center gap-2">
                <input {...register(`specialties.${i}.value`)} placeholder="e.g. Strength Training" className={inputClass} />
                <button type="button" onClick={() => remove(i)} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-red-500 hover:bg-red-500/10"><HiTrash size={16} /></button>
              </div>
            ))}
            <button type="button" onClick={() => append({ value: '' })} className="flex items-center gap-2 text-sm text-gold-500 hover:text-gold-400"><HiPlus size={16} /> Add Specialty</button>
          </div>
          <FormField label="Avatar"><ImageUpload value={trainer?.avatar} onChange={setAvatarFile} onUrlChange={(url) => setValue('avatar', url)} /></FormField>
          <div>
            <label className="mb-2 block text-sm font-medium text-luxury-gray">Social Links</label>
            <div className="grid gap-3 md:grid-cols-2">
              <input {...register('instagram')} placeholder="Instagram URL" className={inputClass} />
              <input {...register('facebook')} placeholder="Facebook URL" className={inputClass} />
              <input {...register('twitter')} placeholder="Twitter URL" className={inputClass} />
              <input {...register('linkedin')} placeholder="LinkedIn URL" className={inputClass} />
            </div>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="rounded-xl border border-glass-light px-6 py-3 text-sm font-medium text-luxury-gray transition-all hover:bg-glass-light hover:text-white">Cancel</button>
            <button type="submit" disabled={saving} className="rounded-xl bg-gold-500 px-6 py-3 text-sm font-bold text-luxury-black transition-all hover:bg-gold-400 disabled:opacity-50">
              {saving ? 'Saving...' : isEdit ? 'Update Trainer' : 'Create Trainer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
