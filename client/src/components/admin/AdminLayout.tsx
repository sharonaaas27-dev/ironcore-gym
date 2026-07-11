import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import { cn } from '@utils/cn';
import api from '@services/api';
import {
  HiViewGrid, HiPencilAlt, HiCollection, HiUserGroup, HiCreditCard,
  HiPhotograph, HiShoppingBag, HiQuestionMarkCircle, HiMail,
  HiCalendar, HiUsers, HiMenu, HiX, HiLogout, HiCurrencyDollar, HiAcademicCap, HiStar,
} from 'react-icons/hi';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  const navItems: ({ to: string; icon: React.ComponentType<{ size?: number }>; label: string; end?: boolean } | { to: string; icon: React.ComponentType<{ size?: number }>; label: string; end?: boolean; badge: number })[] = [
    { to: '/admin', icon: HiViewGrid, label: 'Dashboard', end: true },
    { to: '/admin/blog', icon: HiPencilAlt, label: 'Blog Posts' },
    { to: '/admin/programs', icon: HiCollection, label: 'Programs' },
    { to: '/admin/trainers', icon: HiUserGroup, label: 'Trainers' },
    { to: '/admin/memberships', icon: HiCreditCard, label: 'Memberships' },
    { to: '/admin/payments', icon: HiCurrencyDollar, label: 'Payments' },
    { to: '/admin/gallery', icon: HiPhotograph, label: 'Gallery' },
    { to: '/admin/products', icon: HiShoppingBag, label: 'Products' },
    { to: '/admin/faq', icon: HiQuestionMarkCircle, label: 'FAQ' },
    { to: '/admin/contacts', icon: HiMail, label: 'Contacts' },
    { to: '/admin/bookings', icon: HiCalendar, label: 'Bookings' },
    { to: '/admin/enrollments', icon: HiAcademicCap, label: 'Enrollments' },
    { to: '/admin/users', icon: HiUsers, label: 'Users' },
    { to: '/admin/trainer-requests', icon: HiStar, label: 'Trainer Requests', badge: pendingCount },
  ];
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPending = () => {
      api.get('/admin/trainer-requests')
        .then((res) => setPendingCount(res.data.count || 0))
        .catch(() => {});
    };
    fetchPending();
    const interval = setInterval(fetchPending, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-luxury-black">
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-glass-light bg-luxury-charcoal/95 backdrop-blur-xl transition-transform duration-300 lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-16 items-center gap-3 border-b border-glass-light px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold-500 text-sm font-bold text-luxury-black">
            I
          </div>
          <span className="text-lg font-bold text-white">IRONCORE</span>
          <span className="rounded bg-gold-500/20 px-2 py-0.5 text-xs font-medium text-gold-500">Admin</span>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all mb-0.5',
                  isActive
                    ? 'bg-gold-500/10 text-gold-500'
                    : 'text-luxury-gray hover:bg-glass-light hover:text-white'
                )
              }
            >
              <item.icon size={18} />
              <span className="flex-1">{item.label}</span>
              {'badge' in item && item.badge > 0 && (
                <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-blue-500 px-1.5 text-xs font-bold text-white">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-glass-light p-4">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-500/20 text-sm font-bold text-gold-500">
              {user?.name?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">{user?.name}</p>
              <p className="truncate text-xs text-luxury-gray">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-luxury-gray transition-all hover:bg-red-500/10 hover:text-red-500"
          >
            <HiLogout size={18} />
            Logout
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex flex-1 flex-col lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-glass-light bg-luxury-charcoal/95 px-6 backdrop-blur-xl">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-luxury-gray hover:bg-glass-light hover:text-white lg:hidden"
          >
            <HiMenu size={22} />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-2 text-sm text-luxury-gray">
            <span>Welcome back,</span>
            <span className="font-medium text-white">{user?.name}</span>
          </div>
        </header>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
