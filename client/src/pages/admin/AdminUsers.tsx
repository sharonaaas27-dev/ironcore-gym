import { useState, useEffect, useCallback } from 'react';
import { HiShieldCheck, HiUser, HiStar, HiPencil, HiTrash, HiX } from 'react-icons/hi';
import { cn } from '@utils/cn';
import api from '@services/api';
import DataTable, { type Column } from '@components/admin/DataTable';
import ConfirmDialog from '@components/admin/ConfirmDialog';
import { formatDate } from '@utils/helpers';
import type { User } from '@/types';

const roleColors: Record<string, string> = {
  admin: 'bg-purple-500/10 text-purple-500',
  trainer: 'bg-blue-500/10 text-blue-500',
  user: 'bg-green-500/10 text-green-500',
};

const roleIcons: Record<string, typeof HiUser> = {
  admin: HiShieldCheck,
  trainer: HiStar,
  user: HiUser,
};

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', role: 'user' as User['role'] });
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetch = useCallback(() => {
    setLoading(true);
    api.get('/admin/users')
      .then((res) => setUsers(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const openEdit = (u: User) => {
    setEditingUser(u);
    setEditForm({ name: u.name, email: u.email, role: u.role });
  };

  const handleSave = async () => {
    if (!editingUser) return;
    setSaving(true);
    try {
      await api.put(`/admin/users/${editingUser._id}`, editForm);
      setEditingUser(null);
      fetch();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to update user');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/admin/users/${deletingId}`);
      setDeletingId(null);
      fetch();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to delete user');
    } finally {
      setDeleteLoading(false);
    }
  };

  const columns: Column<User>[] = [
    { key: 'name', header: 'Name', sortable: true, render: (u) => (
      <div className="flex items-center gap-3">
        {u.avatar ? <img src={u.avatar} alt="" className="h-9 w-9 rounded-full object-cover" />
          : <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-500/20 text-sm font-bold text-gold-500">{u.name.charAt(0)}</div>}
        <div>
          <span className="font-medium">{u.name}</span>
          <p className="text-xs text-luxury-gray">{u.email}</p>
        </div>
      </div>
    )},
    { key: 'role', header: 'Role', sortable: true, render: (u) => {
      const Icon = roleIcons[u.role] || HiUser;
      return (
        <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium', roleColors[u.role])}>
          <Icon size={12} />
          {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
        </span>
      );
    }},
    { key: 'phone', header: 'Phone', render: (u) => u.phone || '—' },
    { key: 'createdAt', header: 'Joined', sortable: true, render: (u) => formatDate(u.createdAt) },
    { key: 'membership', header: 'Membership', render: (u) => u.membership?.name || '—' },
    { key: 'actions', header: '', render: (u) => (
      <div className="flex items-center gap-1">
        <button
          onClick={() => openEdit(u)}
          className="rounded-lg p-2 text-luxury-gray transition-all hover:bg-gold-500/10 hover:text-gold-500"
          title="Edit user"
        >
          <HiPencil size={16} />
        </button>
        <button
          onClick={() => setDeletingId(u._id)}
          className="rounded-lg p-2 text-luxury-gray transition-all hover:bg-red-500/10 hover:text-red-500"
          title="Delete user"
        >
          <HiTrash size={16} />
        </button>
      </div>
    )},
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Users</h1>
        <p className="mt-1 text-sm text-luxury-gray">View and manage all registered users.</p>
      </div>
      <DataTable
        columns={columns}
        data={users}
        keyExtractor={(u) => u._id}
        searchable
        searchKeys={['name', 'email']}
        loading={loading}
        emptyMessage="No users found."
      />

      {/* Edit Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setEditingUser(null)} />
          <div className="relative w-full max-w-md rounded-2xl border border-glass-light bg-luxury-charcoal p-6 shadow-2xl">
            <button
              onClick={() => setEditingUser(null)}
              className="absolute right-4 top-4 text-luxury-gray hover:text-white"
            >
              <HiX size={20} />
            </button>
            <h3 className="mb-6 text-lg font-bold text-white">Edit User</h3>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-luxury-gray">Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full rounded-xl border border-glass-light bg-luxury-dark px-4 py-3 text-white outline-none transition-all focus:border-gold-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-luxury-gray">Email</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full rounded-xl border border-glass-light bg-luxury-dark px-4 py-3 text-white outline-none transition-all focus:border-gold-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-luxury-gray">Role</label>
                <select
                  value={editForm.role}
                  onChange={(e) => setEditForm({ ...editForm, role: e.target.value as User['role'] })}
                  className="w-full rounded-xl border border-glass-light bg-luxury-dark px-4 py-3 text-white outline-none transition-all focus:border-gold-500"
                >
                  <option value="user">User</option>
                  <option value="trainer">Trainer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setEditingUser(null)}
                className="flex-1 rounded-xl border border-glass-light py-3 text-sm font-medium text-luxury-gray transition-all hover:bg-glass-light hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 rounded-xl bg-gold-500 py-3 text-sm font-bold text-luxury-black transition-all hover:bg-gold-400 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deletingId}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone."
        confirmLabel="Delete User"
        onConfirm={handleDelete}
        onCancel={() => setDeletingId(null)}
        loading={deleteLoading}
      />
    </div>
  );
}
