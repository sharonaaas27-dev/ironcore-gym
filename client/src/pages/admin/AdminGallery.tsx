import { useState, useEffect, useCallback } from 'react';
import { HiPlus, HiX } from 'react-icons/hi';
import api from '@services/api';
import ConfirmDialog from '@components/admin/ConfirmDialog';
import type { GalleryItem } from '@/types';

export default function AdminGallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<GalleryItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetch = useCallback(() => {
    setLoading(true);
    api.get('/gallery')
      .then((res) => setItems(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const handleFile = (f: File) => {
    if (!f.type.startsWith('image/')) return;
    setFile(f);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(f);
  };

  const [uploadError, setUploadError] = useState('');

  const handleUpload = async () => {
    if (!file || !title) return;
    setUploading(true);
    setUploadError('');
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('title', title);
      if (category) formData.append('category', category);
      await api.post('/gallery', formData);
      setUploadOpen(false);
      setTitle('');
      setCategory('');
      setFile(null);
      setPreview(null);
      fetch();
    } catch (err: any) {
      setUploadError(err?.response?.data?.message || 'Upload failed. Please try again.');
    }
    finally { setUploading(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/gallery/${deleteTarget._id}`);
      setItems((prev) => prev.filter((g) => g._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch (err) { console.error(err); }
    finally { setDeleting(false); }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Gallery</h1>
          <p className="mt-1 text-sm text-luxury-gray">Manage gallery images.</p>
        </div>
        <button onClick={() => setUploadOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-gold-500 px-5 py-2.5 text-sm font-bold text-luxury-black transition-all hover:bg-gold-400">
          <HiPlus size={18} /> Upload Image
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold-500 border-t-transparent" />
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-glass-light p-12 text-center">
          <p className="text-luxury-gray">No gallery images yet.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <div key={item._id} className="group relative overflow-hidden rounded-xl border border-glass-light">
              <img src={item.image} alt={item.title} className="h-48 w-full object-cover" />
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
                <p className="text-sm font-medium text-white">{item.title}</p>
                {item.category && <p className="text-xs text-luxury-gray">{item.category}</p>}
                <button onClick={() => setDeleteTarget(item)}
                  className="mt-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-500/80 text-white hover:bg-red-500">
                  <HiX size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {uploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setUploadOpen(false)} />
          <div className="relative w-full max-w-lg rounded-2xl border border-glass-light bg-luxury-charcoal p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Upload Image</h2>
              <button onClick={() => setUploadOpen(false)} className="text-luxury-gray hover:text-white"><HiX size={22} /></button>
            </div>
            <div className="space-y-4">
              {uploadError && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  {uploadError}
                </div>
              )}
              {preview ? (
                <div className="relative overflow-hidden rounded-xl border border-glass-light">
                  <img src={preview} alt="Preview" className="h-48 w-full object-cover" />
                  <button type="button" onClick={() => { setFile(null); setPreview(null); }}
                    className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80">
                    <HiX size={16} />
                  </button>
                </div>
              ) : (
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-glass-light p-8 transition-all hover:border-gold-500/50">
                  <span className="text-sm text-luxury-gray">Click to select image</span>
                  <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} className="hidden" />
                </label>
              )}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-luxury-gray">Title *</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl border border-glass-light bg-luxury-charcoal/50 py-3 px-4 text-white outline-none transition-all focus:border-gold-500" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-luxury-gray">Category</label>
                <input type="text" value={category} onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl border border-glass-light bg-luxury-charcoal/50 py-3 px-4 text-white outline-none transition-all focus:border-gold-500" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setUploadOpen(false)}
                  className="rounded-xl border border-glass-light px-6 py-3 text-sm font-medium text-luxury-gray transition-all hover:bg-glass-light hover:text-white">Cancel</button>
                <button onClick={handleUpload} disabled={uploading || !file || !title}
                  className="rounded-xl bg-gold-500 px-6 py-3 text-sm font-bold text-luxury-black transition-all hover:bg-gold-400 disabled:opacity-50">
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog open={!!deleteTarget} title="Delete Image"
        message="Are you sure you want to delete this image?"
        onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} loading={deleting} />
    </div>
  );
}
