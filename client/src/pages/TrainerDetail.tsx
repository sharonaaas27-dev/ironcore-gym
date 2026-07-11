import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '@components/navbar/Navbar';
import Footer from '@components/layout/Footer';
import PageTransition from '@components/ui/PageTransition';
import GlassCard from '@components/ui/GlassCard';
import { FaInstagram, FaLinkedinIn, FaStar } from 'react-icons/fa';
import { HiUserAdd, HiCheck, HiX } from 'react-icons/hi';
import { useAuth } from '@context/AuthContext';
import api from '@services/api';

export default function TrainerDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [trainer, setTrainer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [requesting, setRequesting] = useState(false);
  const [requestStatus, setRequestStatus] = useState<'none' | 'pending' | 'approved' | 'rejected'>('none');

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, []);

  useEffect(() => {
    let mounted = true;
    if (!id) { setError('No trainer ID provided'); setLoading(false); return; }
    api.get(`/trainers/${id}`)
      .then((res) => {
        if (!mounted) return;
        if (res.data?.success && res.data?.data) {
          setTrainer(res.data.data);
          if (user?.trainer?._id === res.data.data._id) {
            setRequestStatus('approved');
          }
        } else {
          setError('Trainer not found');
        }
      })
      .catch(() => { if (mounted) setError('Failed to load trainer'); })
      .finally(() => { if (mounted) setLoading(false); });
  }, [id, user?.trainer?._id]);

  const handleRequestTrainer = async () => {
    if (!user) return;
    setRequesting(true);
    try {
      const res = await api.post('/trainers/request', { trainerId: id });
      if (res.data.data.status === 'approved') {
        setRequestStatus('approved');
      } else {
        setRequestStatus('pending');
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      if (msg?.includes('already your trainer')) setRequestStatus('approved');
      else if (msg?.includes('pending request')) setRequestStatus('pending');
      else alert(msg || 'Failed to send request');
    } finally {
      setRequesting(false);
    }
  };

  return (
    <PageTransition>
      <div className="noise-bg" />
      <Navbar />
      <main className="pt-32">
        <section className="relative py-32">
          <div className="absolute inset-0 bg-gradient-to-b from-luxury-black via-luxury-charcoal/30 to-luxury-black" />
          <div className="relative mx-auto max-w-7xl px-6">
            <Link to="/trainers" className="mb-8 inline-flex items-center gap-2 text-sm text-luxury-gray hover:text-gold-500 transition-colors">← All Trainers</Link>

            {loading && (
              <div className="flex justify-center py-32">
                <div className="h-10 w-10 animate-spin rounded-full border-2 border-gold-500 border-t-transparent" />
              </div>
            )}

            {error && (
              <div className="flex flex-col items-center gap-4 py-32">
                <p className="text-red-400">{error}</p>
                <Link to="/trainers" className="text-sm text-gold-500 hover:underline">Back to trainers</Link>
              </div>
            )}

            {!loading && !error && !trainer && (
              <div className="flex flex-col items-center gap-4 py-32">
                <p className="text-luxury-gray">Trainer not found.</p>
                <Link to="/trainers" className="text-sm text-gold-500 hover:underline">Back to trainers</Link>
              </div>
            )}

            {!loading && !error && trainer && (
              <div className="grid gap-12 lg:grid-cols-2">
                <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }}>
                  <img src={trainer.avatar} alt={trainer.name} className="h-[500px] w-full rounded-2xl object-cover" />
                </motion.div>
                <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}>
                  <GlassCard className="p-8">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex gap-1">
                        {Array.from({ length: Math.round(trainer.rating) || 5 }).map((_, i) => (
                          <FaStar key={i} className="text-gold-500" size={18} />
                        ))}
                      </div>
                      <span className="text-sm text-luxury-gray">{trainer.rating} ({Math.floor(Math.random() * 200 + 50)} reviews)</span>
                    </div>
                    <h1 className="text-4xl font-bold text-white">{trainer.name}</h1>
                    <p className="mt-2 text-lg text-gold-500">{trainer.bio || trainer.specialties?.[0] || 'Trainer'}</p>
                    <p className="mt-6 text-luxury-gray leading-relaxed">{trainer.bio}</p>
                    <div className="mt-6 flex flex-wrap gap-3">
                      {trainer.specialties?.map((s: string) => (
                        <span key={s} className="rounded-full bg-glass-light px-4 py-2 text-xs font-semibold text-luxury-gray">{s}</span>
                      ))}
                    </div>
                    <div className="mt-8 flex flex-wrap gap-3">
                      <Link to="/contact" className="rounded-xl bg-gold-500 px-8 py-3.5 font-bold text-luxury-black transition-all hover:bg-gold-400">Book Session</Link>
                      {user && user.role === 'user' && (
                        requestStatus === 'none' ? (
                          <button onClick={handleRequestTrainer} disabled={requesting}
                            className="flex items-center gap-2 rounded-xl border border-gold-500 px-6 py-3.5 text-sm font-semibold text-gold-500 transition-all hover:bg-gold-500/10 disabled:opacity-50">
                            <HiUserAdd size={18} /> {requesting ? 'Sending...' : 'Request as Trainer'}
                          </button>
                        ) : requestStatus === 'pending' ? (
                          <span className="flex items-center gap-2 rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-6 py-3.5 text-sm font-semibold text-yellow-500">
                            <HiX size={18} /> Request Pending
                          </span>
                        ) : requestStatus === 'approved' ? (
                          <span className="flex items-center gap-2 rounded-xl border border-green-500/30 bg-green-500/10 px-6 py-3.5 text-sm font-semibold text-green-500">
                            <HiCheck size={18} /> Your Trainer
                          </span>
                        ) : null
                      )}
                      <div className="flex gap-2">
                        <a href={trainer.socialLinks?.instagram || '#'} className="flex h-12 w-12 items-center justify-center rounded-xl border border-glass-light text-luxury-gray hover:border-gold-500 hover:text-gold-500"><FaInstagram size={18} /></a>
                        <a href={trainer.socialLinks?.linkedin || '#'} className="flex h-12 w-12 items-center justify-center rounded-xl border border-glass-light text-luxury-gray hover:border-gold-500 hover:text-gold-500"><FaLinkedinIn size={18} /></a>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </PageTransition>
  );
}
