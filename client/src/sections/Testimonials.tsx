import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '@hooks/useScrollAnimation';
import SectionHeading from '@components/ui/SectionHeading';
import { FaStar, FaQuoteLeft } from 'react-icons/fa';
import api from '@services/api';

export default function Testimonials() {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>();
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    api.get('/testimonials')
      .then((res) => {
        if (!mounted) return;
        if (res.data?.success && Array.isArray(res.data.data)) {
          setTestimonials(res.data.data.map((t: any) => ({
            id: t._id,
            name: t.user?.name || 'Member',
            role: t.user?.email ? 'Member' : 'Member',
            image: t.user?.avatar || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&q=80',
            content: t.content,
            rating: t.rating,
            transformation: t.transformation,
          })));
        }
      })
      .catch(() => { if (mounted) setError(true); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return (
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-luxury-black via-luxury-charcoal/30 to-luxury-black" />
        <div className="relative mx-auto max-w-7xl px-6">
          <SectionHeading
            title="$Transformation Stories"
            subtitle="Real results from real people. Every journey is unique, but the destination is the same: a stronger, healthier you."
          />
          <div className="grid gap-8 md:grid-cols-3">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="glass rounded-2xl p-8 relative animate-pulse">
                <div className="mb-4 h-4 w-24 bg-white/10 rounded" />
                <div className="mb-6 space-y-2">
                  <div className="h-3 bg-white/10 rounded w-full" />
                  <div className="h-3 bg-white/10 rounded w-5/6" />
                  <div className="h-3 bg-white/10 rounded w-4/6" />
                </div>
                <div className="mb-6 h-16 bg-white/10 rounded-xl" />
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-white/10" />
                  <div className="space-y-1">
                    <div className="h-3 w-20 bg-white/10 rounded" />
                    <div className="h-2 w-14 bg-white/10 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-luxury-black via-luxury-charcoal/30 to-luxury-black" />
        <div className="relative mx-auto max-w-7xl px-6">
          <SectionHeading
            title="$Transformation Stories"
            subtitle="Real results from real people. Every journey is unique, but the destination is the same: a stronger, healthier you."
          />
          <p className="text-center text-luxury-gray">Unable to load testimonials. Please try again later.</p>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return (
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-luxury-black via-luxury-charcoal/30 to-luxury-black" />
        <div className="relative mx-auto max-w-7xl px-6">
          <SectionHeading
            title="$Transformation Stories"
            subtitle="Real results from real people. Every journey is unique, but the destination is the same: a stronger, healthier you."
          />
          <p className="text-center text-luxury-gray">No testimonials available yet.</p>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-luxury-black via-luxury-charcoal/30 to-luxury-black" />

      <div className="relative mx-auto max-w-7xl px-6">
        <SectionHeading
          title="$Transformation Stories"
          subtitle="Real results from real people. Every journey is unique, but the destination is the same: a stronger, healthier you."
        />

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 60 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15, ease: [0.77, 0, 0.18, 1] }}
              className="glass rounded-2xl p-8 relative"
            >
              <FaQuoteLeft className="absolute top-6 right-6 text-3xl text-gold-500/20" />

              <div className="mb-4 flex gap-1">
                {Array.from({ length: testimonial.rating }).map((_, j) => (
                  <FaStar key={j} className="text-gold-500" size={16} />
                ))}
              </div>

              <p className="mb-6 text-luxury-gray leading-relaxed">{testimonial.content}</p>

              {testimonial.transformation && (
                <div className="mb-6 flex items-center gap-4 rounded-xl bg-glass-light p-3">
                  <div className="text-center">
                    <p className="text-[10px] text-luxury-gray uppercase tracking-wider">Before</p>
                    <p className="text-sm font-bold text-red-400">{testimonial.transformation.before}</p>
                  </div>
                  <div className="flex-1 h-[2px] bg-gold-500/50" />
                  <div className="text-center">
                    <p className="text-[10px] text-luxury-gray uppercase tracking-wider">After</p>
                    <p className="text-sm font-bold text-green-400">{testimonial.transformation.after}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-semibold text-white">{testimonial.name}</p>
                  <p className="text-xs text-gold-500">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
