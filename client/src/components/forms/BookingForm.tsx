import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiCalendar, HiClock, HiUser } from 'react-icons/hi';
import api from '@services/api';

interface BookingFormProps {
  trainers?: { _id: string; name: string }[];
  onSuccess?: () => void;
}

export default function BookingForm({ trainers = [], onSuccess }: BookingFormProps) {
  const [formData, setFormData] = useState({ trainer: '', date: '', time: '', type: 'training' });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    try {
      await api.post('/bookings', formData);
      setMessage('Booking created successfully!');
      setFormData({ trainer: '', date: '', time: '', type: 'training' });
      onSuccess?.();
    } catch {
      setMessage('Failed to create booking. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      <div>
        <label className="mb-2 block text-sm font-medium text-luxury-gray">Session Type</label>
        <div className="flex gap-4">
          {['training', 'class'].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setFormData({ ...formData, type })}
              className={`rounded-xl px-6 py-3 text-sm font-semibold transition-all ${
                formData.type === type
                  ? 'bg-gold-500 text-luxury-black'
                  : 'border border-glass-light text-luxury-gray hover:text-white'
              }`}
            >
              {type === 'training' ? 'Personal Training' : 'Group Class'}
            </button>
          ))}
        </div>
      </div>
      {trainers.length > 0 && (
        <div>
          <label className="mb-2 block text-sm font-medium text-luxury-gray">Trainer (optional)</label>
          <div className="relative">
            <HiUser className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-luxury-gray" />
            <select
              value={formData.trainer}
              onChange={(e) => setFormData({ ...formData, trainer: e.target.value })}
              className="w-full appearance-none rounded-xl border border-glass-light bg-luxury-charcoal/50 py-3.5 pl-12 pr-4 text-white outline-none transition-all focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
            >
              <option value="">Any trainer</option>
              {trainers.map((t) => (
                <option key={t._id} value={t._id}>{t.name}</option>
              ))}
            </select>
          </div>
        </div>
      )}
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-luxury-gray">Date</label>
          <div className="relative">
            <HiCalendar className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-luxury-gray" />
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
              className="w-full rounded-xl border border-glass-light bg-luxury-charcoal/50 py-3.5 pl-12 pr-4 text-white outline-none transition-all focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
            />
          </div>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-luxury-gray">Time</label>
          <div className="relative">
            <HiClock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-luxury-gray" />
            <input
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              required
              className="w-full rounded-xl border border-glass-light bg-luxury-charcoal/50 py-3.5 pl-12 pr-4 text-white outline-none transition-all focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
            />
          </div>
        </div>
      </div>
      {message && (
        <p className={`text-sm ${message.includes('success') ? 'text-emerald-500' : 'text-red-500'}`}>{message}</p>
      )}
      <button
        type="submit"
        disabled={isLoading}
        className="flex w-full items-center justify-center rounded-full bg-gold-500 py-4 text-sm font-bold uppercase tracking-wider text-luxury-black transition-all hover:bg-gold-400 disabled:opacity-50"
      >
        {isLoading ? 'Booking...' : 'Book Session'}
      </button>
    </motion.form>
  );
}
