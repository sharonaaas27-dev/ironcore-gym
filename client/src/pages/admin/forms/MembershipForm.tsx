import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { HiX, HiPlus, HiTrash } from 'react-icons/hi';
import api from '@services/api';
import FormField, { inputClass, textareaClass, selectClass } from '@components/admin/FormField';
import type { Membership } from '@/types';

const schema = z.object({
  type: z.enum(['silver', 'gold', 'platinum']),
  name: z.string().min(2),
  description: z.string().min(10),
  price: z.coerce.number().min(0),
  duration: z.enum(['monthly', 'yearly']),
  popular: z.boolean(),
  benefits: z.array(z.object({ value: z.string().min(1) })),
  features: z.array(z.object({ name: z.string().min(1), included: z.boolean() })),
});

type FormData = z.infer<typeof schema>;

interface MembershipFormProps {
  membership?: Membership | null;
  onClose: () => void;
  onSaved: () => void;
}

export default function MembershipForm({ membership, onClose, onSaved }: MembershipFormProps) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const isEdit = !!membership;

  const { register, handleSubmit, formState: { errors }, control } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: membership ? {
      type: membership.type,
      name: membership.name,
      description: membership.description || '',
      price: membership.price,
      duration: membership.duration,
      popular: membership.popular || false,
      benefits: membership.benefits?.map((b) => ({ value: b })) || [{ value: '' }],
      features: membership.features?.map((f) => ({ name: f.name, included: f.included })) || [{ name: '', included: true }],
    } : {
      type: 'silver', name: '', description: '', price: 0,
      duration: 'monthly', popular: false,
      benefits: [{ value: '' }],
      features: [{ name: '', included: true }],
    },
  });

  const { fields: benefitFields, append: appendBenefit, remove: removeBenefit } = useFieldArray({ control, name: 'benefits' });
  const { fields: featureFields, append: appendFeature, remove: removeFeature } = useFieldArray({ control, name: 'features' });

  const onSubmit = async (data: FormData) => {
    setSaving(true);
    try {
      const payload = {
        ...data,
        benefits: data.benefits.map((b) => b.value),
        features: data.features,
      };
      setError('');
      if (isEdit) await api.put(`/memberships/${membership._id}`, payload);
      else await api.post('/memberships', payload);
      onSaved();
    } catch (err: any) { setError(err?.response?.data?.message || err?.message || 'Failed to save'); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 pt-20">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-3xl rounded-2xl border border-glass-light bg-luxury-charcoal p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">{isEdit ? 'Edit Plan' : 'New Plan'}</h2>
          <button onClick={onClose} className="text-luxury-gray hover:text-white"><HiX size={22} /></button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid gap-5 md:grid-cols-4">
            <FormField label="Type" error={errors.type?.message} required>
              <select {...register('type')} className={selectClass}>
                <option value="silver">Silver</option>
                <option value="gold">Gold</option>
                <option value="platinum">Platinum</option>
              </select>
            </FormField>
            <FormField label="Name" error={errors.name?.message} required><input {...register('name')} className={inputClass} /></FormField>
            <FormField label="Price ($)" error={errors.price?.message} required><input type="number" {...register('price')} min={0} className={inputClass} /></FormField>
            <FormField label="Duration" error={errors.duration?.message} required>
              <select {...register('duration')} className={selectClass}>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </FormField>
          </div>
          <FormField label="Description" error={errors.description?.message} required><textarea {...register('description')} rows={2} className={textareaClass} /></FormField>
          <FormField label="Popular">
            <label className="flex items-center gap-3 rounded-xl border border-glass-light bg-luxury-charcoal/50 px-4 py-3">
              <input type="checkbox" {...register('popular')} className="h-5 w-5 accent-gold-500" />
              <span className="text-sm text-white">Mark as popular/recommended</span>
            </label>
          </FormField>
          <div>
            <label className="mb-2 block text-sm font-medium text-luxury-gray">Benefits</label>
            {benefitFields.map((field, i) => (
              <div key={field.id} className="mb-2 flex items-center gap-2">
                <input {...register(`benefits.${i}.value`)} placeholder="Enter a benefit" className={inputClass} />
                <button type="button" onClick={() => removeBenefit(i)} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-red-500 hover:bg-red-500/10"><HiTrash size={16} /></button>
              </div>
            ))}
            <button type="button" onClick={() => appendBenefit({ value: '' })} className="flex items-center gap-2 text-sm text-gold-500 hover:text-gold-400"><HiPlus size={16} /> Add Benefit</button>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-luxury-gray">Features</label>
            {featureFields.map((field, i) => (
              <div key={field.id} className="mb-2 flex items-center gap-2">
                <input {...register(`features.${i}.name`)} placeholder="Feature name" className={inputClass} />
                <label className="flex shrink-0 items-center gap-2 rounded-xl border border-glass-light px-3 py-3 text-xs text-luxury-gray">
                  <input type="checkbox" {...register(`features.${i}.included`)} className="h-4 w-4 accent-gold-500" />
                  Included
                </label>
                <button type="button" onClick={() => removeFeature(i)} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-red-500 hover:bg-red-500/10"><HiTrash size={16} /></button>
              </div>
            ))}
            <button type="button" onClick={() => appendFeature({ name: '', included: true })} className="flex items-center gap-2 text-sm text-gold-500 hover:text-gold-400"><HiPlus size={16} /> Add Feature</button>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="rounded-xl border border-glass-light px-6 py-3 text-sm font-medium text-luxury-gray transition-all hover:bg-glass-light hover:text-white">Cancel</button>
            <button type="submit" disabled={saving} className="rounded-xl bg-gold-500 px-6 py-3 text-sm font-bold text-luxury-black transition-all hover:bg-gold-400 disabled:opacity-50">
              {saving ? 'Saving...' : isEdit ? 'Update Plan' : 'Create Plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
