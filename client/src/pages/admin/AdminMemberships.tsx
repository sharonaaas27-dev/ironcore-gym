import { useState, useEffect, useCallback } from 'react';
import { HiPlus } from 'react-icons/hi';
import api from '@services/api';
import DataTable, { type Column } from '@components/admin/DataTable';
import ConfirmDialog from '@components/admin/ConfirmDialog';
import MembershipForm from './forms/MembershipForm';
import type { Membership } from '@/types';

export default function AdminMemberships() {
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Membership | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Membership | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetch = useCallback(() => {
    setLoading(true);
    api.get('/memberships')
      .then((res) => setMemberships(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/memberships/${deleteTarget._id}`);
      setMemberships((prev) => prev.filter((m) => m._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch (err) { console.error(err); }
    finally { setDeleting(false); }
  };

  const columns: Column<Membership>[] = [
    { key: 'name', header: 'Name', sortable: true, render: (m) => (
      <div className="flex items-center gap-2">
        <span className="font-medium">{m.name}</span>
        {m.popular && <span className="rounded bg-gold-500/20 px-2 py-0.5 text-xs font-medium text-gold-500">Popular</span>}
      </div>
    )},
    { key: 'type', header: 'Type', sortable: true },
    { key: 'price', header: 'Price', sortable: true, render: (m) => `$${m.price}/${m.duration === 'yearly' ? 'yr' : 'mo'}` },
    { key: 'duration', header: 'Duration', sortable: true },
    { key: 'benefits', header: 'Benefits', render: (m) => `${m.benefits?.length || 0} benefits` },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Memberships</h1>
          <p className="mt-1 text-sm text-luxury-gray">Manage membership plans.</p>
        </div>
        <button onClick={() => { setEditing(null); setFormOpen(true); }}
          className="flex items-center gap-2 rounded-xl bg-gold-500 px-5 py-2.5 text-sm font-bold text-luxury-black transition-all hover:bg-gold-400">
          <HiPlus size={18} /> New Plan
        </button>
      </div>
      <DataTable columns={columns} data={memberships} keyExtractor={(m) => m._id}
        onEdit={(m) => { setEditing(m); setFormOpen(true); }}
        onDelete={(m) => setDeleteTarget(m)}
        searchable searchKeys={['name', 'type']} loading={loading} emptyMessage="No membership plans yet." />
      {formOpen && (
        <MembershipForm membership={editing} onClose={() => { setFormOpen(false); setEditing(null); }}
          onSaved={() => { fetch(); setFormOpen(false); setEditing(null); }} />
      )}
      <ConfirmDialog open={!!deleteTarget} title="Delete Membership Plan"
        message={`Are you sure you want to delete "${deleteTarget?.name}"?`}
        onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} loading={deleting} />
    </div>
  );
}
