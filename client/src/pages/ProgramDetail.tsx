import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '@services/api';
import { useAuth } from '@context/AuthContext';
import Navbar from '@components/navbar/Navbar';
import Footer from '@components/layout/Footer';
import PageTransition from '@components/ui/PageTransition';
import GlassCard from '@components/ui/GlassCard';
import { cn } from '@utils/cn';

const samplePrograms: Record<string, any> = {
  'strength-training': { slug: 'strength-training', title: 'Strength Training', description: 'Build raw power with progressive overload and compound movements. Expert coaching for all levels. Our comprehensive program covers squats, deadlifts, bench press, and olympic lifting with expert coaching.', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80', intensity: 'intermediate', duration: '60 min', price: '1,499', enrolledCount: 128, benefits: ['Increased muscle mass', 'Improved bone density', 'Better posture', 'Enhanced metabolism'] },
  'crossfit': { slug: 'crossfit', title: 'CrossFit', description: 'High-intensity functional movements combining weightlifting, gymnastics, and cardio for total fitness. Each workout is scalable for any fitness level.', image: 'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=800&q=80', intensity: 'intermediate', duration: '45 min', price: '1,299', enrolledCount: 95, benefits: ['Full-body conditioning', 'Improved endurance', 'Functional strength', 'Community atmosphere'] },
  'yoga-flexibility': { slug: 'yoga-flexibility', title: 'Yoga & Flexibility', description: 'Enhance flexibility, balance, and inner peace with guided sessions for all skill levels. A blend of Hatha and Vinyasa yoga.', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80', intensity: 'beginner', duration: '60 min', price: '999', enrolledCount: 72, benefits: ['Increased flexibility', 'Stress relief', 'Better balance', 'Mindfulness'] },
  'hiit-training': { slug: 'hiit-training', title: 'HIIT Training', description: 'Maximum results in minimum time with intense intervals designed to maximize calorie burn and cardiovascular fitness.', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80', intensity: 'advanced', duration: '30 min', price: '1,199', enrolledCount: 110, benefits: ['Rapid fat loss', 'Improved cardiovascular health', 'Time efficient', 'Afterburn effect'] },
  'weight-loss': { slug: 'weight-loss', title: 'Weight Loss', description: 'Structured programs combining cardio, strength, and nutrition guidance for sustainable results.', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80', intensity: 'beginner', duration: '45 min', price: '1,499', enrolledCount: 85, benefits: ['Sustainable weight loss', 'Nutrition guidance', 'Accountability', 'Long-term results'] },
  'boxing-mma': { slug: 'boxing-mma', title: 'Boxing & MMA', description: 'Combat sports training for fitness, skill, and conditioning. Learn techniques from experienced coaches.', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800&q=80', intensity: 'intermediate', duration: '60 min', price: '1,399', enrolledCount: 65, benefits: ['Self-defense skills', 'Improved coordination', 'Cardio conditioning', 'Stress relief'] },
};

export default function ProgramDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [program, setProgram] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [enrollMsg, setEnrollMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, []);

  useEffect(() => {
    if (!slug) return;
    api.get(`/programs/${slug}`)
      .then((res) => {
        setProgram(res.data.data);
        setLoading(false);
      })
      .catch(() => {
        const demo = samplePrograms[slug];
        if (demo) {
          setProgram(demo);
        }
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <PageTransition>
        <div className="noise-bg" />
        <Navbar />
        <main className="pt-32">
          <section className="relative py-32">
            <div className="absolute inset-0 bg-gradient-to-b from-luxury-black via-luxury-charcoal/30 to-luxury-black" />
            <div className="relative mx-auto max-w-7xl px-6 flex items-center justify-center min-h-[50vh]">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-gold-500 border-t-transparent" />
            </div>
          </section>
        </main>
        <Footer />
      </PageTransition>
    );
  }

  if (!program) {
    return (
      <PageTransition>
        <div className="noise-bg" />
        <Navbar />
        <main className="pt-32">
          <section className="relative py-32">
            <div className="absolute inset-0 bg-gradient-to-b from-luxury-black via-luxury-charcoal/30 to-luxury-black" />
            <div className="relative mx-auto max-w-7xl px-6 flex items-center justify-center min-h-[50vh]">
              <div className="text-center">
                <p className="text-luxury-gray text-lg">Program not found.</p>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="noise-bg" />
      <Navbar />
      <main className="pt-32">
        <section className="relative py-32">
          <div className="absolute inset-0 bg-gradient-to-b from-luxury-black via-luxury-charcoal/30 to-luxury-black" />
          <div className="relative mx-auto max-w-7xl px-6">
            <Link to="/programs" className="mb-8 inline-flex items-center gap-2 text-sm text-luxury-gray hover:text-gold-500 transition-colors">← All Programs</Link>
            <div className="grid gap-12 lg:grid-cols-2">
              <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }}>
                <img src={program.image} alt={program.title} className="h-[400px] w-full rounded-2xl object-cover" />
              </motion.div>
              <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}>
                <GlassCard className="p-8">
                  <div className="flex gap-2 mb-4">
                    <span className="rounded-full bg-gold-500/90 px-3 py-1 text-xs font-semibold text-luxury-black">{program.intensity}</span>
                    <span className="rounded-full bg-glass-light px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">{program.duration}</span>
                  </div>
                  <h1 className="text-4xl font-bold text-white">{program.title}</h1>
                  <p className="mt-4 text-luxury-gray leading-relaxed">{program.description}</p>
                  <div className="mt-6">
                    <span className="text-3xl font-bold text-gold-500">₹{program.price}</span>
                    <span className="text-sm text-luxury-gray">/month</span>
                  </div>
                  {enrollMsg && (
                    <div className={cn('mt-4 rounded-xl p-3 text-sm font-medium', enrollMsg.type === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400')}>
                      {enrollMsg.text}
                    </div>
                  )}
                  <div className="mt-8 flex gap-4">
                    <button
                      onClick={async () => {
                        if (!isAuthenticated) { navigate('/login'); return; }
                        setEnrolling(true);
                        setEnrollMsg(null);
                        try {
                          await api.post(`/programs/${slug}/enroll`);
                          setEnrollMsg({ type: 'success', text: 'Successfully enrolled!' });
                          setProgram((prev: any) => prev ? { ...prev, enrolledCount: (prev.enrolledCount || 0) + 1 } : prev);
                        } catch (err: any) {
                          setEnrollMsg({ type: 'error', text: err?.response?.data?.message || 'Enrollment failed' });
                        } finally { setEnrolling(false); }
                      }}
                      disabled={enrolling}
                      className="rounded-xl bg-gold-500 px-8 py-3.5 font-bold text-luxury-black transition-all hover:bg-gold-400 disabled:opacity-50"
                    >
                      {enrolling ? 'Enrolling...' : 'Enroll Now'}
                    </button>
                    <button className="rounded-xl border border-glass-light px-8 py-3.5 font-bold text-white transition-all hover:bg-white/5">Free Trial</button>
                  </div>
                  <p className="mt-3 text-sm text-luxury-gray">{program.enrolledCount || 0} enrolled</p>
                </GlassCard>
              </motion.div>
            </div>
            {program.benefits && program.benefits.length > 0 && (
              <GlassCard className="mt-12 p-8">
                <h2 className="mb-6 text-2xl font-bold text-white">Program Benefits</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {program.benefits.map((b: string, i: number) => (
                    <div key={i} className="flex items-center gap-3 rounded-xl bg-luxury-dark p-4">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold-500/20 text-sm font-bold text-gold-500">{i + 1}</span>
                      <span className="text-sm text-luxury-gray">{b}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            )}
            <GlassCard className="mt-12 p-8">
              <h2 className="mb-6 text-2xl font-bold text-white">Program Schedule</h2>
              <div className="grid gap-4 md:grid-cols-3">
                {['Monday', 'Wednesday', 'Friday'].map((day) => (
                  <div key={day} className="rounded-xl bg-luxury-dark p-4">
                    <p className="font-bold text-gold-500">{day}</p>
                    <p className="mt-1 text-sm text-luxury-gray">6:00 AM - 7:00 AM</p>
                    <p className="text-sm text-luxury-gray">5:00 PM - 6:00 PM</p>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </section>
      </main>
      <Footer />
    </PageTransition>
  );
}
