import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '@hooks/useScrollAnimation';
import SectionHeading from '@components/ui/SectionHeading';
import { FaStar, FaQuoteLeft } from 'react-icons/fa';
import api from '@services/api';

const sampleTestimonials = [
  {
    id: 's1',
    name: 'Vikram Rajan',
    role: 'Member since 2023',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
    content: 'Joined Ash2 Fitness 6 months ago and it has completely transformed my lifestyle. The trainers are incredibly supportive and the equipment is top-notch.',
    rating: 5,
    transformation: { before: '85 kg', after: '72 kg' },
  },
  {
    id: 's2',
    name: 'Meera Nair',
    role: 'Member since 2024',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
    content: 'The CrossFit program here is amazing. The community keeps me motivated and I have never felt stronger. Highly recommend!',
    rating: 5,
    transformation: { before: '68 kg', after: '60 kg' },
  },
  {
    id: 's3',
    name: 'Arjun Menon',
    role: 'Member since 2022',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80',
    content: 'Best decision I ever made for my health. The personalized attention from trainers and the variety of programs keep every session exciting and effective.',
    rating: 5,
  },
];

export default function Testimonials() {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>();
  const [testimonials, setTestimonials] = useState<any[]>(sampleTestimonials);

  useEffect(() => {
    let mounted = true;
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
      .catch(() => {});
    return () => { mounted = false; };
  }, []);

  return (
    <section ref={ref} className="relative py-16 md:py-20 lg:py-32 overflow-hidden">
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
