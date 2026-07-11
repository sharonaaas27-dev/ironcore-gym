import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiMail, HiUser, HiPaperAirplane } from 'react-icons/hi';
import { cn } from '@utils/cn';
import api from '@services/api';

export default function ContactForm() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await api.post('/contact', formData);
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-luxury-gray">Name</label>
          <div className="relative">
            <HiUser className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-luxury-gray" />
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full rounded-xl border border-glass-light bg-luxury-charcoal/50 py-3.5 pl-12 pr-4 text-white placeholder-luxury-gray outline-none transition-all focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
              placeholder="Your name"
            />
          </div>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-luxury-gray">Email</label>
          <div className="relative">
            <HiMail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-luxury-gray" />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="w-full rounded-xl border border-glass-light bg-luxury-charcoal/50 py-3.5 pl-12 pr-4 text-white placeholder-luxury-gray outline-none transition-all focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
              placeholder="your@email.com"
            />
          </div>
        </div>
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-luxury-gray">Subject</label>
        <input
          type="text"
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          required
          className="w-full rounded-xl border border-glass-light bg-luxury-charcoal/50 py-3.5 px-4 text-white placeholder-luxury-gray outline-none transition-all focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
          placeholder="How can we help?"
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-luxury-gray">Message</label>
        <textarea
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          required
          rows={5}
          className="w-full resize-none rounded-xl border border-glass-light bg-luxury-charcoal/50 py-3.5 px-4 text-white placeholder-luxury-gray outline-none transition-all focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
          placeholder="Tell us more..."
        />
      </div>
      <button
        type="submit"
        disabled={status === 'loading'}
        className="group flex w-full items-center justify-center gap-2 rounded-full bg-gold-500 py-4 text-sm font-bold uppercase tracking-wider text-luxury-black transition-all hover:bg-gold-400 disabled:opacity-50"
      >
        {status === 'loading' ? 'Sending...' : 'Send Message'}
        <HiPaperAirplane className="transition-transform group-hover:translate-x-1" />
      </button>
      {status === 'success' && (
        <p className="text-center text-sm text-emerald-500">Message sent successfully! We'll get back to you soon.</p>
      )}
      {status === 'error' && (
        <p className="text-center text-sm text-red-500">Failed to send message. Please try again.</p>
      )}
    </motion.form>
  );
}
