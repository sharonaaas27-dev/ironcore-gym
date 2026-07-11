import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@components/navbar/Navbar';
import Footer from '@components/layout/Footer';
import PageTransition from '@components/ui/PageTransition';
import GlassCard from '@components/ui/GlassCard';
import api from '@services/api';

export default function ResetPassword() {
  const { token } = useParams<{ token: string }>();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setStatus('error');
      setMessage('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setStatus('error');
      setMessage('Password must be at least 6 characters.');
      return;
    }
    setSubmitting(true);
    setStatus('idle');
    try {
      const res = await api.post(`/auth/reset-password/${token}`, { password });
      setStatus('success');
      setMessage(res.data.message || 'Password has been reset successfully.');
    } catch {
      setStatus('error');
      setMessage('Invalid or expired reset token. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <div className="noise-bg" />
      <Navbar />
      <main className="flex min-h-screen items-center justify-center pt-24">
        <div className="absolute inset-0 bg-gradient-to-b from-luxury-black via-luxury-charcoal/30 to-luxury-black" />
        <div className="relative w-full max-w-md px-6 py-16">
          <div className="mb-8 text-center">
            <h1 className="text-display-sm font-bold">
              Set New <span className="gradient-text">Password</span>
            </h1>
            <p className="mt-2 text-luxury-gray">Enter your new password below.</p>
          </div>
          <GlassCard className="p-8">
            {status === 'success' ? (
              <div className="text-center">
                <p className="mb-4 text-green-400">{message}</p>
                <Link
                  to="/login"
                  className="inline-block rounded-full bg-gold-500 px-8 py-4 text-sm font-bold uppercase tracking-wider text-luxury-black transition-all hover:bg-gold-400"
                >
                  Sign In
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-luxury-gray">New Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-glass-light bg-luxury-charcoal/50 py-3.5 px-4 text-white placeholder-luxury-gray outline-none transition-all focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-luxury-gray">Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-glass-light bg-luxury-charcoal/50 py-3.5 px-4 text-white placeholder-luxury-gray outline-none transition-all focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                  />
                </div>
                {status === 'error' && (
                  <p className="text-sm text-red-400">{message}</p>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex w-full items-center justify-center rounded-full bg-gold-500 py-4 text-sm font-bold uppercase tracking-wider text-luxury-black transition-all hover:bg-gold-400 disabled:opacity-50"
                >
                  {submitting ? 'Resetting...' : 'Reset Password'}
                </button>
              </form>
            )}
            <div className="mt-6 text-center text-sm text-luxury-gray">
              <Link to="/login" className="text-gold-500 hover:text-gold-400">Back to sign in</Link>
            </div>
          </GlassCard>
        </div>
      </main>
      <Footer />
    </PageTransition>
  );
}
