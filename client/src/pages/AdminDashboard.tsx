import { useEffect, useState } from 'react';
import { HiUsers, HiCurrencyDollar, HiCalendar, HiChartBar } from 'react-icons/hi';
import api from '@services/api';
import type { ApiResponse } from '@/types';

interface Analytics {
  totalMembers: number;
  totalBookings: number;
  totalRevenue: number;
  activeMemberships: number;
}

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/analytics')
      .then((res) => setAnalytics(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    { label: 'Total Members', value: analytics?.totalMembers ?? '—', icon: HiUsers },
    { label: 'Revenue', value: analytics?.totalRevenue != null ? `$${analytics.totalRevenue.toLocaleString()}` : '—', icon: HiCurrencyDollar },
    { label: 'Active Bookings', value: analytics?.totalBookings ?? '—', icon: HiCalendar },
    { label: 'Active Memberships', value: analytics?.activeMemberships ?? '—', icon: HiChartBar },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-luxury-gray">Overview of your gym operations.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-gold-500 border-t-transparent" />
        </div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-glass-light bg-luxury-charcoal/50 p-6 transition-all hover:border-gold-500/30"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-luxury-gray">{stat.label}</p>
                    <p className="mt-1 text-3xl font-bold text-white">{stat.value}</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold-500/10">
                    <stat.icon className="text-gold-500" size={24} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-glass-light bg-luxury-charcoal/50 p-6">
              <h2 className="mb-4 text-lg font-bold text-white">Quick Links</h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Manage Blog', href: '/admin/blog' },
                  { label: 'Manage Programs', href: '/admin/programs' },
                  { label: 'Manage Trainers', href: '/admin/trainers' },
                  { label: 'View Contacts', href: '/admin/contacts' },
                  { label: 'View Bookings', href: '/admin/bookings' },
                  { label: 'Manage Users', href: '/admin/users' },
                ].map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="rounded-xl border border-glass-light px-4 py-3 text-sm font-medium text-luxury-gray transition-all hover:border-gold-500/30 hover:text-gold-500"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-glass-light bg-luxury-charcoal/50 p-6">
              <h2 className="mb-4 text-lg font-bold text-white">Recent Activity</h2>
              <p className="text-sm text-luxury-gray">Activity feed will appear here as users interact with the site.</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
