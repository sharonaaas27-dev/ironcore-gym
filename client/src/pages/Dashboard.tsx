import { useState, useEffect } from 'react';
import Navbar from '@components/navbar/Navbar';
import Footer from '@components/layout/Footer';
import PageTransition from '@components/ui/PageTransition';
import GlassCard from '@components/ui/GlassCard';
import { HiCalendar, HiCreditCard, HiChartBar, HiBell, HiUser, HiMail, HiChevronDown, HiChevronUp } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import api from '@services/api';
import { formatDate } from '@utils/helpers';

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
  const [contactMessages, setContactMessages] = useState<any[]>([]);
  const [expandedMsg, setExpandedMsg] = useState<string | null>(null);
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
        api.get('/contact/my'),
      ]);

      const [userResult, bookingsResult, paymentsResult, notifResult, contactResult] = results;

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

      if (contactResult.status === 'fulfilled') {
        setContactMessages(contactResult.value.data.data || []);
      }

      setLoading(false);
    };
    fetchData();
  }, []);

  const upcomingBookings = bookings.filter((b) => b.status !== 'cancelled' && b.status !== 'completed');
  const repliedCount = contactMessages.filter((m) => m.status === 'replied').length;
  const stats = user
    ? [
        { label: 'Membership', value: user.membership?.name || 'Active', icon: HiCreditCard },
        { label: 'Next Booking', value: upcomingBookings.length > 0 ? `${upcomingBookings[0].date}, ${upcomingBookings[0].time}` : 'No upcoming bookings', icon: HiCalendar },
        { label: 'Payments', value: `${payments.length} total`, icon: HiChartBar },
        { label: 'Notifications', value: `${unreadCount} Unread`, icon: HiBell },
        ...(contactMessages.length > 0 ? [{ label: 'Inbox', value: `${repliedCount} Reply${repliedCount !== 1 ? 's' : ''}`, icon: HiMail }] : []),
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

                {contactMessages.length > 0 && (
                  <GlassCard className="mt-8 p-8">
                    <h2 className="mb-6 text-xl font-bold text-white">My Messages</h2>
                    <div className="space-y-3">
                      {contactMessages.map((msg: any) => (
                        <div key={msg._id}>
                          <button
                            onClick={() => setExpandedMsg(expandedMsg === msg._id ? null : msg._id)}
                            className="flex w-full items-center justify-between rounded-xl bg-luxury-dark p-4 text-left transition-all hover:bg-luxury-charcoal"
                          >
                            <div className="min-w-0 flex-1">
                              <p className="font-semibold text-white">{msg.subject}</p>
                              <p className="mt-0.5 text-sm text-luxury-gray">{formatDate(msg.createdAt)}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                                msg.status === 'replied'
                                  ? 'bg-green-500/10 text-green-500'
                                  : 'bg-luxury-charcoal text-luxury-gray'
                              }`}>
                                {msg.status === 'replied' ? 'Replied' : 'Sent'}
                              </span>
                              {expandedMsg === msg._id ? <HiChevronUp className="text-luxury-gray" /> : <HiChevronDown className="text-luxury-gray" />}
                            </div>
                          </button>
                          {expandedMsg === msg._id && (
                            <div className="space-y-3 border-l-2 border-gold-500/30 pl-4 ml-2 mt-3">
                              <div className="rounded-lg bg-luxury-dark/50 p-3">
                                <p className="mb-1 text-xs font-medium text-luxury-gray">Your message</p>
                                <p className="whitespace-pre-wrap text-sm text-white">{msg.message}</p>
                              </div>
                              {msg.replies?.map((reply: any) => (
                                <div key={reply._id} className="rounded-lg border border-glass-light/30 bg-gold-500/5 p-3">
                                  <p className="mb-1 text-xs font-medium text-gold-500">{reply.repliedBy?.name || 'Staff'} replied</p>
                                  <p className="whitespace-pre-wrap text-sm text-white">{reply.message}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                )}
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </PageTransition>
  );
}
