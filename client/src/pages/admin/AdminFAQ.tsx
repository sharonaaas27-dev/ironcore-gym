import { useState, useEffect, useCallback } from 'react';
import { HiPlus } from 'react-icons/hi';
import api from '@services/api';
import DataTable, { type Column } from '@components/admin/DataTable';
import ConfirmDialog from '@components/admin/ConfirmDialog';
import FAQForm from './forms/FAQForm';
import type { FAQ } from '@/types';

export default function AdminFAQ() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<FAQ | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<FAQ | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetch = useCallback(() => {
    setLoading(true);
    api.get('/faq')
      .then((res) => setFaqs(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/faq/${deleteTarget._id}`);
      setFaqs((prev) => prev.filter((f) => f._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch (err) { console.error(err); }
    finally { setDeleting(false); }
  };

  const columns: Column<FAQ>[] = [
    { key: 'question', header: 'Question', sortable: true, className: 'max-w-md' },
    { key: 'category', header: 'Category', sortable: true },
    { key: 'order', header: 'Order', sortable: true },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">FAQ</h1>
          <p className="mt-1 text-sm text-luxury-gray">Manage frequently asked questions.</p>
        </div>
        <button onClick={() => { setEditing(null); setFormOpen(true); }}
          className="flex items-center gap-2 rounded-xl bg-gold-500 px-5 py-2.5 text-sm font-bold text-luxury-black transition-all hover:bg-gold-400">
          <HiPlus size={18} /> New FAQ
        </button>
      </div>
      <DataTable columns={columns} data={faqs} keyExtractor={(f) => f._id}
        onEdit={(f) => { setEditing(f); setFormOpen(true); }}
        onDelete={(f) => setDeleteTarget(f)}
        searchable searchKeys={['question', 'category']} loading={loading} emptyMessage="No FAQs yet." />
      {formOpen && (
        <FAQForm faq={editing} onClose={() => { setFormOpen(false); setEditing(null); }}
          onSaved={() => { fetch(); setFormOpen(false); setEditing(null); }} />
      )}
      <ConfirmDialog open={!!deleteTarget} title="Delete FAQ"
        message={`Are you sure you want to delete this FAQ?`}
        onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} loading={deleting} />
    </div>
  );
}
