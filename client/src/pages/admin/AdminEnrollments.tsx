import { useState, useEffect, useCallback } from 'react';
import api from '@services/api';
import DataTable, { type Column } from '@components/admin/DataTable';
import { formatDate } from '@utils/helpers';

interface Enrollment {
  _id: string;
  user: { _id: string; name: string; email: string };
  program: { _id: string; title: string; slug: string };
  status: string;
  createdAt: string;
}

export default function AdminEnrollments() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [programs, setPrograms] = useState<{ _id: string; title: string; enrolledCount: number }[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(() => {
    setLoading(true);
    api.get('/admin/program-enrollments')
      .then((res) => {
        setEnrollments(res.data.data.enrollments);
        setPrograms(res.data.data.programs);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const columns: Column<Enrollment>[] = [
    { key: 'user', header: 'User', sortable: true, render: (e) => e.user?.name || '—' },
    { key: 'userEmail', header: 'Email', render: (e) => e.user?.email || '—' },
    { key: 'program', header: 'Program', sortable: true, render: (e) => e.program?.title || '—' },
    { key: 'status', header: 'Status', sortable: true, render: (e) => (
      <span className="rounded-lg bg-green-500/10 px-2.5 py-1 text-xs font-medium text-green-500 capitalize">{e.status}</span>
    )},
    { key: 'createdAt', header: 'Enrolled Date', sortable: true, render: (e) => formatDate(e.createdAt) },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Enrollments</h1>
        <p className="mt-1 text-sm text-luxury-gray">View who enrolled in each program.</p>
      </div>

      {programs.length > 0 && (
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {programs.map((p) => (
            <div key={p._id} className="rounded-xl border border-glass-light bg-luxury-charcoal/50 p-4">
              <p className="font-medium text-white truncate">{p.title}</p>
              <p className="mt-1 text-sm text-luxury-gray">{p.enrolledCount} enrolled</p>
            </div>
          ))}
        </div>
      )}

      <DataTable
        columns={columns}
        data={enrollments}
        keyExtractor={(e) => e._id}
        searchable
        searchKeys={['user.name', 'user.email', 'program.title'] as any}
        loading={loading}
        emptyMessage="No enrollments yet."
      />
    </div>
  );
}
