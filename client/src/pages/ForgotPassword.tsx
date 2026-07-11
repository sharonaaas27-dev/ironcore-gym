import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@components/navbar/Navbar';
import Footer from '@components/layout/Footer';
import PageTransition from '@components/ui/PageTransition';
import GlassCard from '@components/ui/GlassCard';
import api from '@services/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus('idle');
    try {
      const res = await api.post('/auth/forgot-password', { email });
      setStatus('success');
      setMessage(res.data.message || 'Check your email for the reset link.');
    } catch {
      setStatus('error');
      setMessage('Failed to send reset email. Please try again.');
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
              Reset <span className="gradient-text">Password</span>
            </h1>
            <p className="mt-2 text-luxury-gray">Enter your email and we'll send you a reset link.</p>
          </div>
          <GlassCard className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-luxury-gray">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="your@email.com"
                  className="w-full rounded-xl border border-glass-light bg-luxury-charcoal/50 py-3.5 px-4 text-white placeholder-luxury-gray outline-none transition-all focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                />
              </div>
              {status === 'success' && (
                <p className="text-sm text-green-400">{message}</p>
              )}
              {status === 'error' && (
                <p className="text-sm text-red-400">{message}</p>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center rounded-full bg-gold-500 py-4 text-sm font-bold uppercase tracking-wider text-luxury-black transition-all hover:bg-gold-400 disabled:opacity-50"
              >
                {submitting ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
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
