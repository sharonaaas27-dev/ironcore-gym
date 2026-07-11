import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { HiX } from 'react-icons/hi';
import api from '@services/api';
import FormField, { inputClass, textareaClass, selectClass } from '@components/admin/FormField';
import type { FAQ } from '@/types';

const schema = z.object({
  question: z.string().min(5),
  answer: z.string().min(10),
  category: z.string().min(1),
  order: z.coerce.number().min(0),
});

type FormData = z.infer<typeof schema>;

interface FAQFormProps {
  faq?: FAQ | null;
  onClose: () => void;
  onSaved: () => void;
}

const categories = ['General', 'Membership', 'Training', 'Booking', 'Payment', 'Other'];

export default function FAQForm({ faq, onClose, onSaved }: FAQFormProps) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const isEdit = !!faq;

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: faq ? {
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      order: faq.order,
    } : {
      question: '', answer: '', category: 'General', order: 0,
    },
  });

  const onSubmit = async (data: FormData) => {
    setSaving(true);
    try {
      setError('');
      if (isEdit) await api.put(`/faq/${faq._id}`, data);
      else await api.post('/faq', data);
      onSaved();
    } catch (err: any) { setError(err?.response?.data?.message || err?.message || 'Failed to save'); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl rounded-2xl border border-glass-light bg-luxury-charcoal p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">{isEdit ? 'Edit FAQ' : 'New FAQ'}</h2>
          <button onClick={onClose} className="text-luxury-gray hover:text-white"><HiX size={22} /></button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <FormField label="Question" error={errors.question?.message} required><input {...register('question')} className={inputClass} /></FormField>
          <FormField label="Answer" error={errors.answer?.message} required><textarea {...register('answer')} rows={6} className={textareaClass} /></FormField>
          <div className="grid gap-5 md:grid-cols-2">
            <FormField label="Category" error={errors.category?.message} required>
              <select {...register('category')} className={selectClass}>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </FormField>
            <FormField label="Order" error={errors.order?.message} required><input type="number" {...register('order')} min={0} className={inputClass} /></FormField>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="rounded-xl border border-glass-light px-6 py-3 text-sm font-medium text-luxury-gray transition-all hover:bg-glass-light hover:text-white">Cancel</button>
            <button type="submit" disabled={saving} className="rounded-xl bg-gold-500 px-6 py-3 text-sm font-bold text-luxury-black transition-all hover:bg-gold-400 disabled:opacity-50">
              {saving ? 'Saving...' : isEdit ? 'Update FAQ' : 'Create FAQ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
