import { useState, useEffect, useCallback } from 'react';
import api from '@services/api';
import DataTable, { type Column } from '@components/admin/DataTable';
import { formatDate } from '@utils/helpers';
import type { Booking } from '@/types';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500/10 text-yellow-500',
  confirmed: 'bg-green-500/10 text-green-500',
  cancelled: 'bg-red-500/10 text-red-500',
  completed: 'bg-blue-500/10 text-blue-500',
};

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(() => {
    setLoading(true);
    api.get('/admin/bookings')
      .then((res) => setBookings(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const updateStatus = async (id: string, status: string) => {
    try {
      await api.put(`/admin/bookings/${id}`, { status });
      setBookings((prev) => prev.map((b) => b._id === id ? { ...b, status: status as Booking['status'] } : b));
    } catch (err) { console.error(err); }
  };

  const columns: Column<Booking>[] = [
    { key: 'user', header: 'User', sortable: true, render: (b) => b.user?.name || '—' },
    { key: 'type', header: 'Type', sortable: true, render: (b) => (
      <span className="capitalize">{b.type}</span>
    )},
    { key: 'program', header: 'Program', sortable: true, render: (b) => b.program?.title || '—' },
    { key: 'date', header: 'Date', sortable: true, render: (b) => b.date ? formatDate(b.date) : '—' },
    { key: 'time', header: 'Time', render: (b) => b.time || '—' },
    { key: 'trainer', header: 'Trainer', render: (b) => b.trainer?.name || '—' },
    { key: 'status', header: 'Status', sortable: true, render: (b) => (
      <select
        value={b.status}
        onChange={(e) => updateStatus(b._id, e.target.value)}
        className={`rounded-lg px-2.5 py-1 text-xs font-medium outline-none ${statusColors[b.status]}`}
        onClick={(e) => e.stopPropagation()}
      >
        <option value="pending">Pending</option>
        <option value="confirmed">Confirmed</option>
        <option value="completed">Completed</option>
        <option value="cancelled">Cancelled</option>
      </select>
    )},
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Bookings</h1>
        <p className="mt-1 text-sm text-luxury-gray">View and manage all bookings.</p>
      </div>
      <DataTable
        columns={columns}
        data={bookings}
        keyExtractor={(b) => b._id}
        searchable
        searchKeys={['user', 'program']}
        loading={loading}
        emptyMessage="No bookings found."
      />
    </div>
  );
}
