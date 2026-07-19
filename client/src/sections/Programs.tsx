import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '@services/api';
import { useScrollAnimation } from '@hooks/useScrollAnimation';
import SectionHeading from '@components/ui/SectionHeading';
import GlassCard from '@components/ui/GlassCard';

const samplePrograms = [
  { slug: 'strength-training', title: 'Strength Training', description: 'Build raw power with progressive overload and compound movements. Expert coaching for all levels.', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80', intensity: 'intermediate', duration: '60 min' },
  { slug: 'crossfit', title: 'CrossFit', description: 'High-intensity functional movements combining weightlifting, gymnastics, and cardio for total fitness.', image: 'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=600&q=80', intensity: 'intermediate', duration: '45 min' },
  { slug: 'yoga-flexibility', title: 'Yoga & Flexibility', description: 'Enhance flexibility, balance, and inner peace with guided sessions for all skill levels.', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80', intensity: 'beginner', duration: '60 min' },
  { slug: 'hiit-training', title: 'HIIT Training', description: 'Maximum results in minimum time with intense intervals designed to maximize calorie burn.', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&q=80', intensity: 'advanced', duration: '30 min' },
  { slug: 'weight-loss', title: 'Weight Loss', description: 'Structured programs combining cardio, strength, and nutrition guidance for sustainable results.', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80', intensity: 'beginner', duration: '45 min' },
  { slug: 'boxing-mma', title: 'Boxing & MMA', description: 'Combat sports training for fitness, skill, and conditioning. Learn techniques from experienced coaches.', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=600&q=80', intensity: 'intermediate', duration: '60 min' },
];

export default function Programs() {
  const { ref } = useScrollAnimation<HTMLElement>();
  const [programs, setPrograms] = useState<any[]>(samplePrograms);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/programs')
      .then((res) => {
        const data = res.data.data;
        if (data && data.length > 0) {
          setPrograms(data);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section ref={ref} id="programs" className="relative py-16 md:py-20 lg:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-luxury-black via-luxury-charcoal/30 to-luxury-black" />

      <div className="relative mx-auto max-w-7xl px-6">
        <SectionHeading
          title="Our $Programs"
          subtitle="From beginner to advanced, find the program that challenges you."
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {programs.map((program, i) => (
            <Link key={program.slug} to={`/programs/${program.slug}`}>
              <div
                className="group glass rounded-2xl overflow-hidden hover-lift"
              >
                <div className="relative h-48 md:h-56 overflow-hidden bg-luxury-dark">
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
                <div className="p-4 md:p-6">
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
              </div>
            </Link>
          ))}
        </div>
          <p className="mt-10 text-center text-xs text-luxury-gray/60">
            From beginner to advanced, find the program that challenges you.
          </p>
      </div>
    </section>
  );
}
