import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { HiX } from 'react-icons/hi';
import api from '@services/api';
import FormField, { inputClass, inputWithIconClass, textareaClass, selectClass } from '@components/admin/FormField';
import ImageUpload from '@components/admin/ImageUpload';
import { slugify } from '@utils/helpers';
import type { BlogPost } from '@/types';

const schema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  slug: z.string().min(2, 'Slug is required'),
  excerpt: z.string().min(10, 'Excerpt must be at least 10 characters'),
  content: z.string().min(50, 'Content must be at least 50 characters'),
  category: z.string().min(1, 'Category is required'),
  tags: z.string().optional(),
  image: z.string().optional(),
  readTime: z.coerce.number().min(1, 'Read time is required'),
});

type FormData = z.infer<typeof schema>;

interface BlogFormProps {
  post?: BlogPost | null;
  onClose: () => void;
  onSaved: () => void;
}

const categories = ['Workout', 'Nutrition', 'Wellness', 'Success Stories', 'Tips', 'Events'];

export default function BlogForm({ post, onClose, onSaved }: BlogFormProps) {
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const isEdit = !!post;

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: post ? {
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      tags: post.tags?.join(', '),
      image: post.image || '',
      readTime: post.readTime,
    } : {
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      category: 'Workout',
      tags: '',
      image: '',
      readTime: 5,
    },
  });

  const title = watch('title');

  useEffect(() => {
    if (!isEdit && title) {
      setValue('slug', slugify(title));
    }
  }, [title, isEdit, setValue]);

  const onSubmit = async (data: FormData) => {
    setSaving(true);
    try {
      const payload: Record<string, unknown> = {
        ...data,
        tags: data.tags ? data.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      };

      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        const uploadRes = await api.post('/blog/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        payload.image = uploadRes.data.data?.url || '';
      }

      if (isEdit) {
        await api.put(`/blog/${post._id}`, payload);
      } else {
        await api.post('/blog', payload);
      }
      onSaved();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to save post');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 pt-20">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-3xl rounded-2xl border border-glass-light bg-luxury-charcoal p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">{isEdit ? 'Edit Post' : 'New Post'}</h2>
          <button onClick={onClose} className="text-luxury-gray hover:text-white"><HiX size={22} /></button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            <FormField label="Title" error={errors.title?.message} required>
              <input {...register('title')} placeholder="Post title" className={inputClass} />
            </FormField>
            <FormField label="Slug" error={errors.slug?.message} required>
              <input {...register('slug')} placeholder="post-slug" className={inputClass} />
            </FormField>
          </div>

          <FormField label="Excerpt" error={errors.excerpt?.message} required>
            <textarea {...register('excerpt')} rows={2} placeholder="Brief description..." className={textareaClass} />
          </FormField>

          <FormField label="Content" error={errors.content?.message} required>
            <textarea {...register('content')} rows={12} placeholder="Write your post content here..." className={textareaClass} />
          </FormField>

          <div className="grid gap-5 md:grid-cols-3">
            <FormField label="Category" error={errors.category?.message} required>
              <select {...register('category')} className={selectClass}>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </FormField>
            <FormField label="Tags (comma-separated)">
              <input {...register('tags')} placeholder="gym, fitness, tips" className={inputClass} />
            </FormField>
            <FormField label="Read Time (min)" error={errors.readTime?.message} required>
              <input type="number" {...register('readTime')} min={1} className={inputClass} />
            </FormField>
          </div>

          <FormField label="Featured Image">
            <ImageUpload
              value={post?.image}
              onChange={setImageFile}
              onUrlChange={(url) => setValue('image', url)}
            />
          </FormField>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="rounded-xl border border-glass-light px-6 py-3 text-sm font-medium text-luxury-gray transition-all hover:bg-glass-light hover:text-white">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="rounded-xl bg-gold-500 px-6 py-3 text-sm font-bold text-luxury-black transition-all hover:bg-gold-400 disabled:opacity-50">
              {saving ? 'Saving...' : isEdit ? 'Update Post' : 'Create Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
