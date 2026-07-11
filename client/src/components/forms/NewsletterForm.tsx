import { useState } from 'react';
import { HiMail } from 'react-icons/hi';
import api from '@services/api';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await api.post('/newsletter/subscribe', { email });
      setStatus('success');
      setEmail('');
    } catch {
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <div className="relative flex-1">
        <HiMail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-luxury-gray" />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Enter your email"
          className="w-full rounded-xl border border-glass-light bg-luxury-charcoal/50 py-3.5 pl-12 pr-4 text-white placeholder-luxury-gray outline-none transition-all focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
        />
      </div>
      <button
        type="submit"
        disabled={status === 'loading'}
        className="rounded-xl bg-gold-500 px-6 py-3.5 text-sm font-bold text-luxury-black transition-all hover:bg-gold-400 disabled:opacity-50"
      >
        {status === 'loading' ? '...' : 'Subscribe'}
      </button>
    </form>
  );
}
