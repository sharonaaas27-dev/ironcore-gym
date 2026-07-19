import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useScrollAnimation } from '@hooks/useScrollAnimation';
import MagneticButton from '@components/buttons/MagneticButton';

export default function CTA() {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>();

  return (
    <section ref={ref} className="relative py-16 md:py-20 lg:py-32 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,160,23,0.2),transparent_70%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-luxury-black via-luxury-charcoal/50 to-luxury-black" />
      </div>

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.77, 0, 0.18, 1] }}
        >
          <h2 className="text-display-sm md:text-display-md font-bold tracking-tight text-white">
            Ready to Transform
            <br />
            <span className="gradient-text">Your Body?</span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-luxury-gray leading-relaxed">
            Join Ash2 Fitness today and start your journey toward a stronger, healthier,
            and more confident you. Your first session is on us.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <MagneticButton>
              <Link
                to="/membership"
                className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-8 py-4 text-sm font-semibold text-luxury-black transition-all hover:bg-gold-400"
              >
                Claim Free Trial
              </Link>
            </MagneticButton>

            <MagneticButton>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-glass-light px-8 py-4 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10"
              >
                Schedule Tour
              </Link>
            </MagneticButton>
          </div>

          <p className="mt-6 text-sm text-luxury-gray">
            No commitment required. Cancel anytime.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
