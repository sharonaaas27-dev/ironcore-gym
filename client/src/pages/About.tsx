import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@components/navbar/Navbar';
import Footer from '@components/layout/Footer';
import PageTransition from '@components/ui/PageTransition';
import SectionHeading from '@components/ui/SectionHeading';
import AnimatedCounter from '@components/ui/AnimatedCounter';
import { useScrollAnimation } from '@hooks/useScrollAnimation';
import { useAuth } from '@context/AuthContext';
import api from '@services/api';

const fallbackStats = [
  { target: 5000, suffix: '+', label: 'Members' },
  { target: 50, suffix: '+', label: 'Trainers' },
  { target: 15, suffix: '+', label: 'Years' },
  { target: 98, suffix: '%', label: 'Satisfaction' },
];

const timeline = [
  { year: '2010', event: 'Ash2 Fitness Founded' },
  { year: '2013', event: 'Expansion to 10,000 sq ft' },
  { year: '2016', event: 'Launched Premium Training Programs' },
  { year: '2018', event: 'Opened Second Location' },
  { year: '2020', event: 'Digital Transformation & Virtual Training' },
  { year: '2024', event: 'Named Best Gym in the Region' },
];

const values = [
  { title: 'Excellence', description: 'We pursue the highest standards in everything we do.' },
  { title: 'Community', description: 'Together we rise. Support is our strongest weight.' },
  { title: 'Innovation', description: 'Cutting-edge methods and equipment for best results.' },
  { title: 'Integrity', description: 'Honest guidance, transparent practices, real results.' },
];

export default function About() {
  const { user } = useAuth();
  const { ref, isVisible } = useScrollAnimation<HTMLElement>();
  const [stats, setStats] = useState(fallbackStats);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  useEffect(() => {
    if (user?.role !== 'admin') return;
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/analytics');
        const data = res.data.data || res.data;
        if (data) {
          setStats([
            { target: data.totalMembers || 5000, suffix: '+', label: 'Members' },
            { target: data.activeMemberships || 50, suffix: '+', label: 'Trainers' },
            { target: 15, suffix: '+', label: 'Years' },
            { target: 98, suffix: '%', label: 'Satisfaction' },
          ]);
        }
      } catch {
        // fallback already set
      }
    };
    fetchStats();
  }, [user]);

  return (
    <PageTransition>
      <div className="noise-bg" />
      <Navbar />
      <main className="pt-32">
        <section className="relative py-32">
          <div className="absolute inset-0 bg-gradient-to-b from-luxury-black via-luxury-charcoal/30 to-luxury-black" />
          <div className="relative mx-auto max-w-7xl px-6">
            <SectionHeading
              title="About $Ash2 Fitness"
              subtitle="Since 2010, we've been committed to transforming lives through expert CrossFit training, well-maintained equipment, and a supportive community."
            />
            <div className="grid gap-8 md:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="glass rounded-2xl p-8 text-center">
                  <AnimatedCounter target={stat.target} suffix={stat.suffix} />
                  <p className="mt-2 text-sm text-luxury-gray">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section ref={ref} className="relative py-32">
          <div className="mx-auto max-w-7xl px-6">
            <SectionHeading title="Our $Story" subtitle="A journey of passion, dedication, and the relentless pursuit of excellence." />
            <div className="glass mx-auto max-w-3xl rounded-2xl p-8 md:p-12">
              <p className="text-lg leading-relaxed text-luxury-gray">
                Ash2 Fitness was born from a simple belief: everyone deserves access to
                quality fitness training. With well-maintained equipment and expert
                CrossFit coaching, we help our members achieve their goals in a
                supportive and positive environment.
              </p>
              <p className="mt-6 text-lg leading-relaxed text-luxury-gray">
                Our team of knowledgeable trainers, personalized training
                programs, and unwavering commitment to excellence make Ash2 Fitness
                the ultimate destination for anyone serious about their fitness journey.
              </p>
            </div>
          </div>
        </section>

        <section className="relative py-32 bg-luxury-charcoal/30">
          <div className="mx-auto max-w-7xl px-6">
            <SectionHeading title="Our $Values" subtitle="The principles that drive everything we do." />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {values.map((value, i) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass rounded-2xl p-6 text-center"
                >
                  <h3 className="text-xl font-bold text-gold-500">{value.title}</h3>
                  <p className="mt-3 text-luxury-gray">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative py-32">
          <div className="mx-auto max-w-7xl px-6">
            <SectionHeading title="Our $Timeline" subtitle="Key milestones in our journey to excellence." />
            <div className="relative">
              <div className="absolute left-1/2 h-full w-[1px] -translate-x-1/2 bg-gold-500/30" />
              <div className="space-y-12">
                {timeline.map((item, i) => (
                  <motion.div
                    key={item.year}
                    initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className={`relative flex items-center gap-8 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                  >
                    <div className="flex-1" />
                    <div className="absolute left-1/2 h-4 w-4 -translate-x-1/2 rounded-full bg-gold-500" />
                    <div className="glass flex-1 rounded-2xl p-6">
                      <span className="text-sm font-bold text-gold-500">{item.year}</span>
                      <p className="mt-1 text-white font-semibold">{item.event}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </PageTransition>
  );
}
