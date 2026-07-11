import { useState, useEffect, useCallback } from 'react';
import { HiPlus } from 'react-icons/hi';
import api from '@services/api';
import DataTable, { type Column } from '@components/admin/DataTable';
import ConfirmDialog from '@components/admin/ConfirmDialog';
import ProgramForm from './forms/ProgramForm';
import type { Program } from '@/types';

export default function AdminPrograms() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Program | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Program | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetch = useCallback(() => {
    setLoading(true);
    api.get('/programs')
      .then((res) => setPrograms(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/programs/${deleteTarget._id}`);
      setPrograms((prev) => prev.filter((p) => p._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch (err) { console.error(err); }
    finally { setDeleting(false); }
  };

  const columns: Column<Program>[] = [
    { key: 'title', header: 'Title', sortable: true, render: (p) => (
      <div className="flex items-center gap-3">
        {p.image && <img src={p.image} alt="" className="h-10 w-10 rounded-lg object-cover" />}
        <span className="font-medium">{p.title}</span>
      </div>
    )},
    { key: 'category', header: 'Category', sortable: true },
    { key: 'intensity', header: 'Intensity', sortable: true },
    { key: 'duration', header: 'Duration' },
    { key: 'price', header: 'Price', render: (p) => `$${p.price}` },
    { key: 'enrolledCount', header: 'Enrolled', sortable: true },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Programs</h1>
          <p className="mt-1 text-sm text-luxury-gray">Manage fitness programs.</p>
        </div>
        <button onClick={() => { setEditing(null); setFormOpen(true); }}
          className="flex items-center gap-2 rounded-xl bg-gold-500 px-5 py-2.5 text-sm font-bold text-luxury-black transition-all hover:bg-gold-400">
          <HiPlus size={18} /> New Program
        </button>
      </div>
      <DataTable columns={columns} data={programs} keyExtractor={(p) => p._id}
        onEdit={(p) => { setEditing(p); setFormOpen(true); }}
        onDelete={(p) => setDeleteTarget(p)}
        searchable searchKeys={['title', 'category']} loading={loading} emptyMessage="No programs yet." />
      {formOpen && (
        <ProgramForm program={editing} onClose={() => { setFormOpen(false); setEditing(null); }}
          onSaved={() => { fetch(); setFormOpen(false); setEditing(null); }} />
      )}
      <ConfirmDialog open={!!deleteTarget} title="Delete Program"
        message={`Are you sure you want to delete "${deleteTarget?.title}"?`}
        onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} loading={deleting} />
    </div>
  );
}
