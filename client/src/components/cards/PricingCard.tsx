import { motion } from 'framer-motion';
import { HiCheck } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { cn } from '@utils/cn';

interface PricingTier {
  name: string;
  price: number;
  description: string;
  features: string[];
  popular?: boolean;
  href: string;
}

interface PricingCardProps {
  tier: PricingTier;
  index?: number;
  isVisible?: boolean;
}

export default function PricingCard({ tier, index = 0, isVisible = true }: PricingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.77, 0, 0.18, 1] }}
      className={cn(
        'relative rounded-2xl p-8',
        tier.popular ? 'glass ring-2 ring-gold-500 scale-105' : 'glass'
      )}
    >
      {tier.popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gold-500 px-6 py-1.5 text-xs font-bold uppercase tracking-widest text-luxury-black">
          Best Value
        </div>
      )}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-white">{tier.name}</h3>
        <p className="mt-2 text-sm text-luxury-gray">{tier.description}</p>
        <div className="mt-6 flex items-baseline justify-center gap-1">
          <span className="text-5xl font-bold tracking-tighter text-white">${tier.price}</span>
          <span className="text-luxury-gray">/month</span>
        </div>
      </div>
      <ul className="mt-8 space-y-4">
        {tier.features.map((feature) => (
          <li key={feature} className="flex items-center gap-3">
            <HiCheck className="h-5 w-5 flex-shrink-0 text-emerald-500" />
            <span className="text-sm text-white">{feature}</span>
          </li>
        ))}
      </ul>
      <Link
        to={tier.href}
        className={cn(
          'mt-8 flex w-full items-center justify-center rounded-full py-4 text-sm font-bold uppercase tracking-wider transition-all',
          tier.popular
            ? 'bg-gold-500 text-luxury-black hover:bg-gold-400'
            : 'border border-glass-light text-white hover:bg-white/10'
        )}
      >
        {tier.popular ? 'Start Free Trial' : 'Get Started'}
      </Link>
    </motion.div>
  );
}
