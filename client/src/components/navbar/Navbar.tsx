import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenu, HiX, HiUser, HiLogout, HiShieldCheck, HiViewGrid, HiSwitchHorizontal, HiMail } from 'react-icons/hi';
import { cn } from '@utils/cn';
import { useAuth } from '@context/AuthContext';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Programs', href: '/programs' },
  { label: 'Trainers', href: '/trainers' },
  { label: 'Membership', href: '/membership' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, savedAccounts, switchAccount } = useAuth();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(e.target as Node)) {
        setShowAccountMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <nav
      className={cn(
        'fixed top-0 right-0 left-0 z-50 transition-all duration-500',
        scrolled
          ? 'glass-dark py-3'
          : 'bg-transparent py-6'
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
        <Link to="/" className="relative z-10">
          <h1 className="text-2xl font-bold tracking-tighter">
            IRON<span className="gradient-text">CORE</span>
          </h1>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {user?.role === 'admin' ? (
            <Link
              to="/admin"
              className="flex items-center gap-2 rounded-full border border-gold-500/30 px-4 py-2 text-sm font-medium text-gold-500 transition-all hover:bg-gold-500/10"
            >
              <HiShieldCheck size={16} />
              Admin Panel
            </Link>
          ) : (
            navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  'group relative text-sm font-medium tracking-wider uppercase transition-colors',
                  location.pathname === link.href
                    ? 'text-gold-500'
                    : 'text-luxury-gray hover:text-white'
                )}
              >
                {link.label}
                <span
                  className={cn(
                    'absolute -bottom-1 left-0 h-[2px] bg-gold-500 transition-all duration-300',
                    location.pathname === link.href ? 'w-full' : 'w-0 group-hover:w-full'
                  )}
                />
              </Link>
            ))
          )}
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className="flex items-center gap-1.5 rounded-full border border-gold-500/30 px-4 py-2 text-sm font-medium text-gold-500 transition-all hover:bg-gold-500/10"
                >
                  <HiShieldCheck size={16} />
                  Admin
                </Link>
              )}
              {user?.role !== 'admin' && (
                <>
                  <Link
                    to={user?.role === 'trainer' ? '/trainer/dashboard' : '/dashboard'}
                    className="flex items-center gap-1.5 rounded-full bg-gold-500 px-4 py-2 text-sm font-semibold text-luxury-black transition-all hover:bg-gold-400"
                  >
                    <HiViewGrid size={16} />
                    Dashboard
                  </Link>
                  <Link
                    to="/messages"
                    className="flex items-center gap-1.5 rounded-full border border-glass-light px-4 py-2 text-sm font-medium text-luxury-gray transition-all hover:border-gold-500/30 hover:text-white"
                  >
                    <HiMail size={16} />
                    Messages
                  </Link>
                </>
              )}
              <div className="relative flex items-center gap-2 border-l border-glass-light pl-3" ref={accountMenuRef}>
                <button
                  onClick={() => setShowAccountMenu(!showAccountMenu)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-gold-500/20 text-sm font-bold text-gold-500 transition-all hover:bg-gold-500/30"
                  title={user?.name}
                >
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </button>
                <button
                  onClick={() => { logout(); navigate('/login'); }}
                  className="flex items-center gap-1 rounded-lg p-1.5 text-luxury-gray transition-all hover:text-red-500"
                  title="Logout"
                >
                  <HiLogout size={18} />
                </button>

                {showAccountMenu && (
                  <div className="absolute right-0 top-full mt-2 w-64 overflow-hidden rounded-xl border border-glass-light bg-luxury-charcoal/95 backdrop-blur-xl shadow-xl">
                    <div className="border-b border-glass-light px-4 py-3">
                      <p className="text-sm font-medium text-white">{user?.name}</p>
                      <p className="text-xs text-luxury-gray">{user?.email}</p>
                    </div>
                    {savedAccounts.length > 1 && (
                      <div className="p-2">
                        <p className="px-2 py-1 text-xs font-medium uppercase tracking-wider text-luxury-gray">Switch Account</p>
                        {savedAccounts.filter((a) => a.email !== user?.email).map((account) => (
                          <button
                            key={account.email}
                            onClick={() => { switchAccount(account.token); setShowAccountMenu(false); }}
                            className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm text-luxury-gray transition-all hover:bg-glass-light hover:text-white"
                          >
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gold-500/20 text-xs font-bold text-gold-500">
                              {account.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="text-left">
                              <p className="text-sm text-white">{account.name}</p>
                              <p className="text-xs text-luxury-gray">{account.email}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                    <div className="border-t border-glass-light p-2">
                      <Link
                        to="/login"
                        onClick={() => setShowAccountMenu(false)}
                        className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-gold-500 transition-all hover:bg-gold-500/10"
                      >
                        <HiSwitchHorizontal size={16} />
                        Add another account
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="rounded-full border border-glass-light px-5 py-2.5 text-sm font-medium text-luxury-gray transition-all hover:border-gold-500/30 hover:text-white"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="rounded-full bg-gold-500 px-5 py-2.5 text-sm font-semibold text-luxury-black transition-all hover:bg-gold-400"
              >
                Join Now
              </Link>
            </div>
          )}
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative z-10 text-white md:hidden"
          aria-label="Toggle menu"
        >
          {isOpen ? <HiX size={28} /> : <HiMenu size={28} />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-dark fixed inset-0 flex flex-col items-center justify-center gap-8 md:hidden"
          >
            {user?.role === 'admin' ? (
              <Link to="/admin" className="text-2xl font-bold tracking-wider uppercase text-gold-500">
                Admin Panel
              </Link>
            ) : (
              navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    'text-2xl font-bold tracking-wider uppercase transition-colors',
                    location.pathname === link.href
                      ? 'gradient-text'
                      : 'text-white hover:text-gold-500'
                  )}
                >
                  {link.label}
                </Link>
              ))
            )}
            {isAuthenticated ? (
              user?.role === 'admin' ? (
                <button
                  onClick={() => { logout(); navigate('/login'); setIsOpen(false); }}
                  className="text-2xl font-bold tracking-wider uppercase text-red-400"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    to={user?.role === 'trainer' ? '/trainer/dashboard' : '/dashboard'}
                    className="text-2xl font-bold tracking-wider uppercase text-white"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => { logout(); navigate('/login'); setIsOpen(false); }}
                    className="text-2xl font-bold tracking-wider uppercase text-red-400"
                  >
                    Logout
                  </button>
                </>
              )
            ) : (
              <>
                <Link to="/login" className="text-2xl font-bold tracking-wider uppercase text-white">
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="mt-4 rounded-full bg-gold-500 px-8 py-3 text-lg font-semibold text-luxury-black"
                >
                  Join Now
                </Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
