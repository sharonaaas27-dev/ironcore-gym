import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '@services/api';
import Navbar from '@components/navbar/Navbar';
import Footer from '@components/layout/Footer';
import PageTransition from '@components/ui/PageTransition';
import SectionHeading from '@components/ui/SectionHeading';

export default function Programs() {
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  useEffect(() => {
    api.get('/programs')
      .then((res) => {
        setPrograms(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err?.response?.data?.message || 'Failed to load programs');
        setLoading(false);
      });
  }, []);

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

  if (error) {
    return (
      <PageTransition>
        <div className="noise-bg" />
        <Navbar />
        <main className="pt-32">
          <section className="relative py-32">
            <div className="absolute inset-0 bg-gradient-to-b from-luxury-black via-luxury-charcoal/30 to-luxury-black" />
            <div className="relative mx-auto max-w-7xl px-6 flex items-center justify-center min-h-[50vh]">
              <div className="text-center">
                <p className="text-red-400 text-lg">{error}</p>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </PageTransition>
    );
  }

  if (programs.length === 0) {
    return (
      <PageTransition>
        <div className="noise-bg" />
        <Navbar />
        <main className="pt-32">
          <section className="relative py-32">
            <div className="absolute inset-0 bg-gradient-to-b from-luxury-black via-luxury-charcoal/30 to-luxury-black" />
            <div className="relative mx-auto max-w-7xl px-6 flex items-center justify-center min-h-[50vh]">
              <div className="text-center">
                <p className="text-luxury-gray text-lg">No programs available at this time.</p>
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
            <SectionHeading
              title="Our $Programs"
              subtitle="Comprehensive training programs designed for every fitness level and goal."
            />
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {programs.map((program, i) => (
                <Link key={program.slug} to={`/programs/${program.slug}`}>
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="group glass rounded-2xl overflow-hidden hover-lift"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img src={program.image} alt={program.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-transparent to-transparent" />
                      <div className="absolute top-4 left-4 flex gap-2">
                        <span className="rounded-full bg-gold-500/90 px-3 py-1 text-xs font-semibold text-luxury-black">{program.intensity}</span>
                        <span className="rounded-full bg-glass-light px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">{program.duration}</span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white group-hover:text-gold-500 transition-colors">{program.title}</h3>
                      <p className="mt-2 text-sm text-luxury-gray">{program.description}</p>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-lg font-bold text-gold-500">${program.price}<span className="text-xs text-luxury-gray">/mo</span></span>
                        <span className="text-sm font-semibold text-white group-hover:translate-x-1 transition-transform">Learn More →</span>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </PageTransition>
  );
}
