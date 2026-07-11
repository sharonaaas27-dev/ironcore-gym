import { useState, useEffect, useCallback } from 'react';
import { HiCheck, HiX, HiStar, HiUser, HiChevronDown, HiChevronUp } from 'react-icons/hi';
import { cn } from '@utils/cn';
import api from '@services/api';
import DataTable, { type Column } from '@components/admin/DataTable';
import ConfirmDialog from '@components/admin/ConfirmDialog';
import { formatDate } from '@utils/helpers';
import type { User } from '@/types';

interface TrainerWithApp extends User {
  application?: {
    bio: string;
    specialties: string[];
    experience: number;
    phone?: string;
    certificates?: string[];
  } | null;
}

export default function AdminTrainerRequests() {
  const [trainers, setTrainers] = useState<TrainerWithApp[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectName, setRejectName] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetch = useCallback(() => {
    setLoading(true);
    api.get('/admin/trainer-requests')
      .then((res) => setTrainers(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const handleApprove = async (id: string) => {
    setActionLoading(id);
    try {
      await api.put(`/admin/trainer-requests/${id}/approve`);
      setTrainers((prev) => prev.filter((t) => t._id !== id));
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to approve trainer');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async () => {
    if (!rejectId) return;
    setActionLoading(rejectId);
    try {
      await api.put(`/admin/trainer-requests/${rejectId}/reject`);
      setTrainers((prev) => prev.filter((t) => t._id !== rejectId));
      setRejectId(null);
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to reject trainer');
    } finally {
      setActionLoading(null);
    }
  };

  const columns: Column<TrainerWithApp>[] = [
    { key: 'name', header: 'Name', sortable: true, render: (u) => (
      <div className="flex items-center gap-3">
        {u.avatar ? <img src={u.avatar} alt="" className="h-9 w-9 rounded-full object-cover" />
          : <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500/20 text-sm font-bold text-blue-500">{u.name.charAt(0)}</div>}
        <div>
          <span className="font-medium text-white">{u.name}</span>
          <p className="text-xs text-luxury-gray">{u.email}</p>
        </div>
      </div>
    )},
    { key: 'specialties', header: 'Specialties', render: (u) => (
      <div className="flex flex-wrap gap-1">
        {u.application?.specialties?.slice(0, 2).map((s) => (
          <span key={s} className="rounded-full bg-blue-500/10 px-2 py-0.5 text-xs text-blue-400">{s}</span>
        ))}
        {(u.application?.specialties?.length || 0) > 2 && (
          <span className="text-xs text-luxury-gray">+{u.application!.specialties.length - 2}</span>
        )}
      </div>
    )},
    { key: 'experience', header: 'Exp', render: (u) => (
      <span className="text-sm text-luxury-gray">{u.application?.experience ?? '—'}yr</span>
    )},
    { key: 'phone', header: 'Phone', render: (u) => u.application?.phone || u.phone || '—' },
    { key: 'createdAt', header: 'Requested', sortable: true, render: (u) => formatDate(u.createdAt) },
    { key: 'details', header: '', render: (u) => (
      <button
        onClick={() => setExpandedId(expandedId === u._id ? null : u._id)}
        className="rounded-lg p-2 text-luxury-gray transition-all hover:bg-glass-light hover:text-white"
      >
        {expandedId === u._id ? <HiChevronUp size={18} /> : <HiChevronDown size={18} />}
      </button>
    )},
    { key: 'actions', header: '', render: (u) => (
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleApprove(u._id)}
          disabled={actionLoading === u._id}
          className="flex items-center gap-1.5 rounded-lg bg-green-500/10 px-3 py-2 text-sm font-medium text-green-500 transition-all hover:bg-green-500/20 disabled:opacity-50"
        >
          <HiCheck size={16} />
          Approve
        </button>
        <button
          onClick={() => { setRejectId(u._id); setRejectName(u.name); }}
          disabled={actionLoading === u._id}
          className="flex items-center gap-1.5 rounded-lg bg-red-500/10 px-3 py-2 text-sm font-medium text-red-500 transition-all hover:bg-red-500/20 disabled:opacity-50"
        >
          <HiX size={16} />
          Reject
        </button>
      </div>
    )},
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Trainer Requests</h1>
        <p className="mt-1 text-sm text-luxury-gray">Review trainer applications, then approve or reject.</p>
      </div>

      {!loading && trainers.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-glass-light bg-luxury-charcoal/50 p-12 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gold-500/10">
            <HiStar className="text-gold-500" size={32} />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-white">No Pending Requests</h3>
          <p className="mt-2 text-sm text-luxury-gray">All trainer applications have been reviewed.</p>
        </div>
      ) : (
        <>
          <DataTable
            columns={columns}
            data={trainers}
            keyExtractor={(u) => u._id}
            searchable
            searchKeys={['name', 'email']}
            loading={loading}
            emptyMessage="No pending trainer requests."
          />
          {trainers.map((t) => expandedId === t._id && t.application && (
            <div key={`detail-${t._id}`} className="mt-2 rounded-xl border border-glass-light bg-luxury-charcoal/30 p-5">
              <h3 className="mb-3 text-sm font-semibold text-white">Application Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-luxury-gray">Bio</span>
                  <p className="mt-1 text-white">{t.application.bio}</p>
                </div>
                <div>
                  <span className="text-luxury-gray">Specialties</span>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {t.application.specialties.map((s) => (
                      <span key={s} className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs text-blue-400">{s}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-luxury-gray">Experience</span>
                  <p className="mt-1 text-white">{t.application.experience} years</p>
                </div>
                <div>
                  <span className="text-luxury-gray">Phone</span>
                  <p className="mt-1 text-white">{t.application.phone || '—'}</p>
                </div>
                {t.application.certificates && t.application.certificates.length > 0 && (
                  <div className="col-span-2">
                    <span className="text-luxury-gray">Certificates</span>
                    <ul className="mt-1 list-inside list-disc text-white">
                      {t.application.certificates.map((c, i) => <li key={i}>{c}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </>
      )}

      <ConfirmDialog
        open={!!rejectId}
        title="Reject Trainer"
        message={`Are you sure you want to reject "${rejectName}"? The applicant will be notified via email.`}
        confirmLabel="Reject Application"
        onConfirm={handleReject}
        onCancel={() => setRejectId(null)}
        loading={actionLoading === rejectId}
      />
    </div>
  );
}