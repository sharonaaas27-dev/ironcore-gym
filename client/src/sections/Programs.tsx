import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '@services/api';
import { useScrollAnimation } from '@hooks/useScrollAnimation';
import SectionHeading from '@components/ui/SectionHeading';
import GlassCard from '@components/ui/GlassCard';

export default function Programs() {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>();
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      <section ref={ref} id="programs" className="relative py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-luxury-black via-luxury-charcoal/30 to-luxury-black" />
        <div className="relative mx-auto max-w-7xl px-6 flex items-center justify-center min-h-[50vh]">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-gold-500 border-t-transparent" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section ref={ref} id="programs" className="relative py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-luxury-black via-luxury-charcoal/30 to-luxury-black" />
        <div className="relative mx-auto max-w-7xl px-6 flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <p className="text-red-400 text-lg">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (programs.length === 0) {
    return (
      <section ref={ref} id="programs" className="relative py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-luxury-black via-luxury-charcoal/30 to-luxury-black" />
        <div className="relative mx-auto max-w-7xl px-6 flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <p className="text-luxury-gray text-lg">No programs available at this time.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} id="programs" className="relative py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-luxury-black via-luxury-charcoal/30 to-luxury-black" />

      <div className="relative mx-auto max-w-7xl px-6">
        <SectionHeading
          title="Our $Programs"
          subtitle="From strength to flexibility, we offer everything you need to achieve your fitness goals."
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {programs.map((program, i) => (
            <Link key={program.slug} to={`/programs/${program.slug}`}>
              <motion.div
                initial={{ opacity: 0, y: 60 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.77, 0, 0.18, 1] }}
                className="group glass rounded-2xl overflow-hidden hover-lift"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={program.image}
                    alt={program.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-transparent to-transparent" />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="rounded-full bg-gold-500/90 px-3 py-1 text-xs font-semibold text-luxury-black">
                      {program.intensity}
                    </span>
                    <span className="rounded-full bg-glass-light px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                      {program.duration}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white group-hover:text-gold-500 transition-colors">
                    {program.title}
                  </h3>
                  <p className="mt-2 text-sm text-luxury-gray leading-relaxed">
                    {program.description}
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-gold-500">
                    <span>Learn More</span>
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
