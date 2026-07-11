import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiMail, HiLockClosed, HiUser, HiEye, HiEyeOff, HiStar, HiUserGroup, HiAcademicCap, HiBriefcase, HiPhone, HiDocumentText } from 'react-icons/hi';
import { cn } from '@utils/cn';

interface AuthFormProps {
  mode: 'login' | 'register';
  onSubmit: (data: { name?: string; email: string; password: string; remember?: boolean; role?: 'user' | 'trainer'; bio?: string; specialties?: string[]; experience?: number; phone?: string; certificates?: string[] }) => Promise<void>;
}

const SPECIALTY_OPTIONS = ['Strength Training', 'Cardio', 'Yoga', 'Pilates', 'CrossFit', 'Bodybuilding', 'Weight Loss', 'Nutrition', 'Rehabilitation', 'Martial Arts', 'Swimming', 'Dance'];

export default function AuthForm({ mode, onSubmit }: AuthFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', remember: false, role: 'user' as 'user' | 'trainer', bio: '', specialties: [] as string[], experience: 0, phone: '', certificates: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const toggleSpecialty = (s: string) => {
    setFormData((prev) => ({
      ...prev,
      specialties: prev.specialties.includes(s) ? prev.specialties.filter((x) => x !== s) : [...prev.specialties, s],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await onSubmit({
        ...formData,
        bio: formData.role === 'trainer' ? formData.bio : undefined,
        specialties: formData.role === 'trainer' ? formData.specialties : undefined,
        experience: formData.role === 'trainer' ? formData.experience : undefined,
        certificates: formData.role === 'trainer' && formData.certificates ? formData.certificates.split('\n').filter(Boolean) : undefined,
      });
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Something went wrong');
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
      {mode === 'register' && (
        <>
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
                placeholder="John Doe"
              />
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-luxury-gray">I want to join as</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'user' })}
                className={cn(
                  'flex items-center justify-center gap-2 rounded-xl border py-3 text-sm font-medium transition-all',
                  formData.role === 'user'
                    ? 'border-gold-500 bg-gold-500/10 text-gold-500'
                    : 'border-glass-light bg-luxury-charcoal/50 text-luxury-gray hover:border-gold-500/50'
                )}
              >
                <HiUserGroup size={18} />
                Member
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'trainer' })}
                className={cn(
                  'flex items-center justify-center gap-2 rounded-xl border py-3 text-sm font-medium transition-all',
                  formData.role === 'trainer'
                    ? 'border-blue-500 bg-blue-500/10 text-blue-500'
                    : 'border-glass-light bg-luxury-charcoal/50 text-luxury-gray hover:border-blue-500/50'
                )}
              >
                <HiStar size={18} />
                Trainer
              </button>
            </div>
          </div>
          {formData.role === 'trainer' && (
            <div className="space-y-4 border-t border-glass-light pt-4">
              <p className="text-sm font-medium text-gold-500">Trainer Profile</p>
              <div>
                <label className="mb-2 block text-sm font-medium text-luxury-gray">Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  required
                  rows={3}
                  className="w-full rounded-xl border border-glass-light bg-luxury-charcoal/50 py-3 px-4 text-white placeholder-luxury-gray outline-none transition-all focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                  placeholder="Tell us about your experience and training philosophy..."
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-luxury-gray">Specialties</label>
                <div className="flex flex-wrap gap-2">
                  {SPECIALTY_OPTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => toggleSpecialty(s)}
                      className={cn(
                        'rounded-lg border px-3 py-1.5 text-xs font-medium transition-all',
                        formData.specialties.includes(s)
                          ? 'border-gold-500 bg-gold-500/10 text-gold-500'
                          : 'border-glass-light bg-luxury-charcoal/50 text-luxury-gray hover:border-gold-500/50'
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-2 block text-sm font-medium text-luxury-gray">Experience (Years)</label>
                  <div className="relative">
                    <HiBriefcase className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-luxury-gray" />
                    <input
                      type="number"
                      value={formData.experience || ''}
                      onChange={(e) => setFormData({ ...formData, experience: parseInt(e.target.value) || 0 })}
                      min={0}
                      max={70}
                      required
                      className="w-full rounded-xl border border-glass-light bg-luxury-charcoal/50 py-3.5 pl-12 pr-4 text-white placeholder-luxury-gray outline-none transition-all focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                      placeholder="5"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-luxury-gray">Phone</label>
                  <div className="relative">
                    <HiPhone className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-luxury-gray" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full rounded-xl border border-glass-light bg-luxury-charcoal/50 py-3.5 pl-12 pr-4 text-white placeholder-luxury-gray outline-none transition-all focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-luxury-gray">Certificates (one per line)</label>
                <div className="relative">
                  <HiDocumentText className="pointer-events-none absolute left-4 top-3 text-luxury-gray" />
                  <textarea
                    value={formData.certificates}
                    onChange={(e) => setFormData({ ...formData, certificates: e.target.value })}
                    rows={2}
                    className="w-full rounded-xl border border-glass-light bg-luxury-charcoal/50 py-3 pl-12 pr-4 text-white placeholder-luxury-gray outline-none transition-all focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                    placeholder="NASM Certified Personal Trainer&#10;CPR/AED Certified"
                  />
                </div>
              </div>
            </div>
          )}
        </>
      )}
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
      <div>
        <label className="mb-2 block text-sm font-medium text-luxury-gray">Password</label>
        <div className="relative">
          <HiLockClosed className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-luxury-gray" />
          <input
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            minLength={6}
            className="w-full rounded-xl border border-glass-light bg-luxury-charcoal/50 py-3.5 pl-12 pr-12 text-white placeholder-luxury-gray outline-none transition-all focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-luxury-gray hover:text-white"
          >
            {showPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
          </button>
        </div>
      </div>
      {mode === 'login' && (
        <label className="flex items-center gap-2 text-sm text-luxury-gray">
          <input
            type="checkbox"
            checked={formData.remember || false}
            onChange={(e) => setFormData({ ...formData, remember: e.target.checked })}
            className="h-4 w-4 rounded border-glass-light bg-luxury-charcoal accent-gold-500"
          />
          Remember this account
        </label>
      )}
      {error && <p className="text-sm text-red-500">{error}</p>}
      <button
        type="submit"
        disabled={isLoading}
        className="flex w-full items-center justify-center rounded-full bg-gold-500 py-4 text-sm font-bold uppercase tracking-wider text-luxury-black transition-all hover:bg-gold-400 disabled:opacity-50"
      >
        {isLoading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
      </button>
    </motion.form>
  );
}
