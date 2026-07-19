import { motion } from 'framer-motion';
import { useScrollAnimation } from '@hooks/useScrollAnimation';
import { HiArrowRight } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import SectionHeading from '@components/ui/SectionHeading';

const features = [
  {
    title: 'State-of-the-Art Equipment',
    description: 'Premium machines and free weights from top brands for optimal training.',
    icon: '🏋️',
  },
  {
    title: 'Expert Trainers',
    description: 'Certified professionals dedicated to your fitness journey and goals.',
    icon: '👨‍🏫',
  },
  {
    title: 'Premium Facilities',
    description: 'Luxury locker rooms, sauna, and recovery zones for complete wellness.',
    icon: '✨',
  },
  {
    title: 'Community Driven',
    description: 'Join a supportive community that motivates and inspires greatness.',
    icon: '🤝',
  },
];

export default function About() {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>();

  return (
    <section ref={ref} id="about" className="relative overflow-hidden py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-luxury-black via-luxury-charcoal/50 to-luxury-black" />

      <div className="relative mx-auto max-w-7xl px-6">
        <SectionHeading
          title="Why $Ash2 Fitness?"
          subtitle="We don't just build bodies. We forge champions, reshape lives, and create an environment where greatness becomes inevitable."
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 60 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15, ease: [0.77, 0, 0.18, 1] }}
              className="group glass rounded-2xl p-8 hover-lift"
            >
              <span className="mb-4 inline-block text-4xl">{feature.icon}</span>
              <h3 className="mb-3 text-xl font-bold text-white">{feature.title}</h3>
              <p className="text-luxury-gray leading-relaxed">{feature.description}</p>
              <div className="mt-6 h-[2px] w-0 bg-gold-500 transition-all duration-500 group-hover:w-full" />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <Link
            to="/about"
            className="group inline-flex items-center gap-2 text-gold-500 transition-colors hover:text-gold-400"
          >
            <span className="text-sm font-semibold tracking-wider uppercase">
              Learn More About Us
            </span>
            <HiArrowRight className="transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
