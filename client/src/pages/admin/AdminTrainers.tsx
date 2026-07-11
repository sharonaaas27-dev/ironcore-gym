import { useState, useEffect, useCallback } from 'react';
import { HiPlus } from 'react-icons/hi';
import api from '@services/api';
import DataTable, { type Column } from '@components/admin/DataTable';
import ConfirmDialog from '@components/admin/ConfirmDialog';
import TrainerForm from './forms/TrainerForm';
import type { Trainer } from '@/types';

export default function AdminTrainers() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Trainer | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Trainer | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetch = useCallback(() => {
    setLoading(true);
    api.get('/trainers')
      .then((res) => setTrainers(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/trainers/${deleteTarget._id}`);
      setTrainers((prev) => prev.filter((t) => t._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch (err) { console.error(err); }
    finally { setDeleting(false); }
  };

  const columns: Column<Trainer>[] = [
    { key: 'name', header: 'Name', sortable: true, render: (t) => (
      <div className="flex items-center gap-3">
        {t.avatar ? <img src={t.avatar} alt="" className="h-10 w-10 rounded-full object-cover" />
          : <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-500/20 text-sm font-bold text-gold-500">{t.name.charAt(0)}</div>}
        <span className="font-medium">{t.name}</span>
      </div>
    )},
    { key: 'email', header: 'Email' },
    { key: 'specialties', header: 'Specialties', render: (t) => t.specialties?.slice(0, 2).join(', ') || '—' },
    { key: 'experience', header: 'Experience', sortable: true, render: (t) => `${t.experience}yrs` },
    { key: 'available', header: 'Status', render: (t) => (
      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${t.available ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
        {t.available ? 'Available' : 'Unavailable'}
      </span>
    )},
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Trainers</h1>
          <p className="mt-1 text-sm text-luxury-gray">Manage fitness trainers.</p>
        </div>
        <button onClick={() => { setEditing(null); setFormOpen(true); }}
          className="flex items-center gap-2 rounded-xl bg-gold-500 px-5 py-2.5 text-sm font-bold text-luxury-black transition-all hover:bg-gold-400">
          <HiPlus size={18} /> New Trainer
        </button>
      </div>
      <DataTable columns={columns} data={trainers} keyExtractor={(t) => t._id}
        onEdit={(t) => { setEditing(t); setFormOpen(true); }}
        onDelete={(t) => setDeleteTarget(t)}
        searchable searchKeys={['name', 'email', 'specialties']} loading={loading} emptyMessage="No trainers yet." />
      {formOpen && (
        <TrainerForm trainer={editing} onClose={() => { setFormOpen(false); setEditing(null); }}
          onSaved={() => { fetch(); setFormOpen(false); setEditing(null); }} />
      )}
      <ConfirmDialog open={!!deleteTarget} title="Delete Trainer"
        message={`Are you sure you want to delete "${deleteTarget?.name}"?`}
        onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} loading={deleting} />
    </div>
  );
}
