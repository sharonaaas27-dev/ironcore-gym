import { useState, useEffect, useCallback } from 'react';
import { HiPlus } from 'react-icons/hi';
import api from '@services/api';
import DataTable, { type Column } from '@components/admin/DataTable';
import ConfirmDialog from '@components/admin/ConfirmDialog';
import BlogForm from './forms/BlogForm';
import { formatDate } from '@utils/helpers';
import type { BlogPost } from '@/types';

export default function AdminBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<BlogPost | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchPosts = useCallback(() => {
    setLoading(true);
    api.get('/blog')
      .then((res) => setPosts(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/blog/${deleteTarget._id}`);
      setPosts((prev) => prev.filter((p) => p._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  const columns: Column<BlogPost>[] = [
    { key: 'title', header: 'Title', sortable: true, render: (p) => (
      <div className="flex items-center gap-3">
        {p.image && <img src={p.image} alt="" className="h-10 w-10 rounded-lg object-cover" />}
        <span className="font-medium">{p.title}</span>
      </div>
    )},
    { key: 'category', header: 'Category', sortable: true },
    { key: 'author', header: 'Author', render: (p) => p.author?.name || '—' },
    { key: 'publishedAt', header: 'Published', sortable: true, render: (p) => p.publishedAt ? formatDate(p.publishedAt) : '—' },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Blog Posts</h1>
          <p className="mt-1 text-sm text-luxury-gray">Create and manage blog content.</p>
        </div>
        <button
          onClick={() => { setEditing(null); setFormOpen(true); }}
          className="flex items-center gap-2 rounded-xl bg-gold-500 px-5 py-2.5 text-sm font-bold text-luxury-black transition-all hover:bg-gold-400"
        >
          <HiPlus size={18} />
          New Post
        </button>
      </div>

      <DataTable
        columns={columns}
        data={posts}
        keyExtractor={(p) => p._id}
        onEdit={(p) => { setEditing(p); setFormOpen(true); }}
        onDelete={(p) => setDeleteTarget(p)}
        searchable
        searchKeys={['title', 'category']}
        loading={loading}
        emptyMessage="No blog posts yet. Create your first post!"
      />

      {formOpen && (
        <BlogForm
          post={editing}
          onClose={() => { setFormOpen(false); setEditing(null); }}
          onSaved={() => { fetchPosts(); setFormOpen(false); setEditing(null); }}
        />
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Blog Post"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
}
