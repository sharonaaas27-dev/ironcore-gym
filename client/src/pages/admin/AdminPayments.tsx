import { useState, useEffect, useCallback } from 'react';
import api from '@services/api';
import DataTable, { type Column } from '@components/admin/DataTable';
import { formatDate } from '@utils/helpers';
import type { Payment } from '@/types';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500/10 text-yellow-500',
  completed: 'bg-green-500/10 text-green-500',
  failed: 'bg-red-500/10 text-red-500',
  refunded: 'bg-blue-500/10 text-blue-500',
};

export default function AdminPayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(() => {
    setLoading(true);
    api.get('/admin/payments')
      .then((res) => setPayments(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const columns: Column<Payment>[] = [
    { key: 'user', header: 'User', sortable: true, render: (p) => p.user?.name || '—' },
    { key: 'amount', header: 'Amount', sortable: true, render: (p) => `$${p.amount.toFixed(2)}` },
    { key: 'status', header: 'Status', sortable: true, render: (p) => (
      <span className={`rounded-lg px-2.5 py-1 text-xs font-medium ${statusColors[p.status]}`}>{p.status}</span>
    )},
    { key: 'method', header: 'Method', render: (p) => p.method || '—' },
    { key: 'createdAt', header: 'Date', sortable: true, render: (p) => formatDate(p.createdAt) },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Payments</h1>
        <p className="mt-1 text-sm text-luxury-gray">View all payment transactions.</p>
      </div>
      <DataTable
        columns={columns}
        data={payments}
        keyExtractor={(p) => p._id}
        searchable
        searchKeys={['user.name', 'user.email'] as any}
        loading={loading}
        emptyMessage="No payments found."
      />
    </div>
  );
}
