import { useState, useEffect } from 'react';
import Navbar from '@components/navbar/Navbar';
import Footer from '@components/layout/Footer';
import PageTransition from '@components/ui/PageTransition';
import GlassCard from '@components/ui/GlassCard';
import { HiCalendar, HiCreditCard, HiChartBar, HiBell, HiUser } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import api from '@services/api';

function SkeletonCard() {
  return (
    <GlassCard hover={false} className="p-6">
      <div className="flex animate-pulse items-center gap-4">
        <div className="h-12 w-12 rounded-xl bg-luxury-dark" />
        <div className="space-y-2">
          <div className="h-3 w-20 rounded bg-luxury-dark" />
          <div className="h-5 w-28 rounded bg-luxury-dark" />
        </div>
      </div>
    </GlassCard>
  );
}

function SkeletonRow() {
  return (
    <div className="flex animate-pulse items-center justify-between rounded-xl bg-luxury-dark p-4">
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 rounded-full bg-luxury-charcoal" />
        <div className="space-y-2">
          <div className="h-4 w-32 rounded bg-luxury-charcoal" />
          <div className="h-3 w-24 rounded bg-luxury-charcoal" />
        </div>
      </div>
      <div className="h-6 w-20 rounded-full bg-luxury-charcoal" />
    </div>
  );
}

export default function Dashboard() {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState<any>(authUser || null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const results = await Promise.allSettled([
        api.get('/auth/me'),
        api.get('/bookings/my'),
        api.get('/payments'),
        api.get('/notifications'),
      ]);

      const [userResult, bookingsResult, paymentsResult, notifResult] = results;

      if (userResult.status === 'fulfilled') {
        setUser(userResult.value.data.data || userResult.value.data);
      }

      if (bookingsResult.status === 'fulfilled') {
        setBookings(bookingsResult.value.data.data || bookingsResult.value.data || []);
      }

      if (paymentsResult.status === 'fulfilled') {
        setPayments(paymentsResult.value.data.data || paymentsResult.value.data || []);
      }

      if (notifResult.status === 'fulfilled') {
        const notifs = notifResult.value.data.data || notifResult.value.data || [];
        setUnreadCount(notifs.filter((n: any) => !n.read).length);
      }

      setLoading(false);
    };
    fetchData();
  }, []);

  const upcomingBookings = bookings.filter((b) => b.status !== 'cancelled' && b.status !== 'completed');
  const stats = user
    ? [
        { label: 'Membership', value: user.membership?.name || 'Active', icon: HiCreditCard },
        { label: 'Next Booking', value: upcomingBookings.length > 0 ? `${upcomingBookings[0].date}, ${upcomingBookings[0].time}` : 'No upcoming bookings', icon: HiCalendar },
        { label: 'Payments', value: `${payments.length} total`, icon: HiChartBar },
        { label: 'Notifications', value: `${unreadCount} Unread`, icon: HiBell },
      ]
    : [];

  return (
    <PageTransition>
      <div className="noise-bg" />
      <Navbar />
      <main className="pt-32">
        <section className="relative min-h-screen py-32">
          <div className="absolute inset-0 bg-gradient-to-b from-luxury-black via-luxury-charcoal/30 to-luxury-black" />
          <div className="relative mx-auto max-w-7xl px-6">
            <h1 className="mb-2 text-3xl font-bold text-white">Welcome back, {user?.name || authUser?.name || 'Athlete'}</h1>
            {loading ? (
              <div className="space-y-10">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                </div>
                <div className="grid gap-8 lg:grid-cols-2">
                  <GlassCard className="p-8">
                    <div className="mb-6 h-6 w-48 animate-pulse rounded bg-luxury-dark" />
                    <div className="space-y-4">
                      <SkeletonRow />
                      <SkeletonRow />
                    </div>
                  </GlassCard>
                  <GlassCard className="p-8">
                    <div className="mb-6 h-6 w-40 animate-pulse rounded bg-luxury-dark" />
                    <div className="space-y-4">
                      <SkeletonRow />
                      <SkeletonRow />
                    </div>
                  </GlassCard>
                </div>
              </div>
            ) : error ? (
              <p className="text-red-400">Failed to load dashboard data.</p>
            ) : (
              <>
                <p className="mb-10 text-luxury-gray">Here's your fitness overview.</p>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                  {stats.map((stat) => (
                    <GlassCard key={stat.label} hover={false} className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold-500/20">
                          <stat.icon className="text-gold-500" size={24} />
                        </div>
                        <div>
                          <p className="text-sm text-luxury-gray">{stat.label}</p>
                          <p className="font-bold text-white">{stat.value}</p>
                        </div>
                      </div>
                    </GlassCard>
                  ))}
                </div>

                {user?.trainer && (
                  <GlassCard className="mt-8 p-6">
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gold-500/20">
                        {user.trainer.avatar ? (
                          <img src={user.trainer.avatar} alt={user.trainer.name} className="h-14 w-14 rounded-full object-cover" />
                        ) : (
                          <HiUser className="text-gold-500" size={28} />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-luxury-gray">Your Trainer</p>
                        <p className="text-lg font-bold text-white">{user.trainer.name}</p>
                        <p className="text-sm text-gold-500">{user.trainer.specialties?.slice(0, 2).join(', ')}</p>
                      </div>
                      <Link to={`/trainers/${user.trainer._id}`} className="rounded-xl bg-gold-500 px-5 py-2.5 text-sm font-bold text-luxury-black transition-all hover:bg-gold-400">
                        View Profile
                      </Link>
                    </div>
                  </GlassCard>
                )}

                <div className="mt-12 grid gap-8 lg:grid-cols-2">
                  <GlassCard className="p-8">
                    <h2 className="mb-6 text-xl font-bold text-white">Upcoming Bookings</h2>
                    <div className="space-y-4">
                      {bookings.length > 0 ? (
                        bookings.map((b: any, i: number) => (
                          <div key={i} className="flex items-center justify-between rounded-xl bg-luxury-dark p-4">
                            <div>
                              <p className="font-semibold text-white">{b.type}</p>
                              <p className="text-sm text-luxury-gray">{b.date} • {b.trainer?.name || 'Assigned Trainer'}</p>
                            </div>
                            <span className="rounded-full bg-gold-500/20 px-3 py-1 text-xs font-semibold text-gold-500">Confirmed</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-luxury-gray">No upcoming bookings.</p>
                      )}
                    </div>
                  </GlassCard>

                  <GlassCard className="p-8">
                    <h2 className="mb-6 text-xl font-bold text-white">Payment History</h2>
                    <div className="space-y-4">
                      {payments.length > 0 ? (
                        payments.slice(0, 5).map((p: any) => (
                          <div key={p._id} className="flex items-center justify-between rounded-xl bg-luxury-dark p-4">
                            <div>
                              <p className="font-semibold text-white">Membership Payment</p>
                              <p className="text-sm text-luxury-gray">{new Date(p.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right">
                              <span className="font-bold text-gold-500">${p.amount}</span>
                              <p className={`text-xs ${p.status === 'completed' ? 'text-green-500' : p.status === 'failed' ? 'text-red-500' : 'text-yellow-500'}`}>
                                {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-luxury-gray">No payment history yet.</p>
                      )}
                    </div>
                  </GlassCard>
                </div>
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </PageTransition>
  );
}
