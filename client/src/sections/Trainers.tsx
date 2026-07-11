import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useScrollAnimation } from '@hooks/useScrollAnimation';
import SectionHeading from '@components/ui/SectionHeading';
import { FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import api from '@services/api';

export default function Trainers() {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>();
  const [trainers, setTrainers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    api.get('/trainers')
      .then((res) => {
        if (!mounted) return;
        const data = res.data?.data ?? [];
        setTrainers(data.map((t: any) => ({
          id: t._id,
          name: t.name,
          role: t.bio || t.specialties?.[0] || 'Trainer',
          image: t.avatar,
          specialties: t.specialties,
          experience: t.experience + ' years',
          social: {
            instagram: t.socialLinks?.instagram || '#',
            linkedin: t.socialLinks?.linkedin || '#',
          },
        })));
      })
      .catch(() => { if (mounted) setError('Failed to load trainers'); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  return (
    <section ref={ref} id="trainers" className="relative py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-luxury-black via-luxury-charcoal/20 to-luxury-black" />

      <div className="relative mx-auto max-w-7xl px-6">
        <SectionHeading
          title="Meet Our $Trainers"
          subtitle="World-class coaches dedicated to your transformation. Each trainer brings years of experience and proven results."
        />

        {loading && (
          <div className="flex justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-gold-500 border-t-transparent" />
          </div>
        )}

        {error && (
          <p className="mt-8 text-center text-red-400">{error}</p>
        )}

        {!loading && !error && trainers.length === 0 && (
          <p className="mt-8 text-center text-luxury-gray">No trainers available at the moment.</p>
        )}

        {!loading && !error && trainers.length > 0 && (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {trainers.map((trainer, i) => (
              <motion.div
                key={trainer.id}
                initial={{ opacity: 0, y: 60 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.15, ease: [0.77, 0, 0.18, 1] }}
                className="group glass rounded-2xl overflow-hidden hover-lift"
              >
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={trainer.image}
                    alt={trainer.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-transparent to-transparent opacity-60" />
                  <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                    <a
                      href={trainer.social.instagram}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-glass-light backdrop-blur-sm text-white transition-colors hover:bg-gold-500"
                    >
                      <FaInstagram size={14} />
                    </a>
                    <a
                      href={trainer.social.linkedin}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-glass-light backdrop-blur-sm text-white transition-colors hover:bg-gold-500"
                    >
                      <FaLinkedinIn size={14} />
                    </a>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-white group-hover:text-gold-500 transition-colors">
                    {trainer.name}
                  </h3>
                  <p className="mt-1 text-sm text-gold-500">{trainer.role}</p>
                  <p className="mt-1 text-xs text-luxury-gray">{trainer.experience} experience</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {trainer.specialties.map((s: string) => (
                      <span
                        key={s}
                        className="rounded-full bg-glass-light px-2.5 py-1 text-[10px] font-medium text-luxury-gray"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                  <Link
                    to={`/trainers/${trainer.id}`}
                    className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-gold-500 group-hover:gap-2 transition-all"
                  >
                    Book Session →
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <Link
            to="/trainers"
            className="inline-flex items-center gap-2 rounded-full border border-glass-light px-8 py-3 text-sm font-semibold text-white transition-all hover:bg-white/5"
          >
            View All Trainers →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
