import { motion } from 'framer-motion';
import { HiCheck, HiX } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { cn } from '@utils/cn';
import type { Membership, MembershipFeature } from '@/types';

interface MembershipCardProps {
  membership: Membership;
  index?: number;
  isVisible?: boolean;
}

export default function MembershipCard({ membership, index = 0, isVisible = true }: MembershipCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15, ease: [0.77, 0, 0.18, 1] }}
      className={cn(
        'relative rounded-2xl p-8 transition-all duration-500',
        membership.popular
          ? 'glass ring-2 ring-gold-500 scale-105'
          : 'glass hover-lift'
      )}
    >
      {membership.popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gold-500 px-6 py-1.5 text-xs font-bold uppercase tracking-widest text-luxury-black">
          Most Popular
        </div>
      )}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-white">{membership.name}</h3>
        <div className="mt-4 flex items-baseline justify-center gap-1">
          <span className="text-5xl font-bold tracking-tighter text-white">
            ${membership.price}
          </span>
          <span className="text-luxury-gray">/{membership.duration}</span>
        </div>
      </div>
      <ul className="mt-8 space-y-4">
        {(membership.features as MembershipFeature[]).map((feature) => (
          <li key={feature.name} className="flex items-center gap-3">
            {feature.included ? (
              <HiCheck className="h-5 w-5 flex-shrink-0 text-emerald-500" />
            ) : (
              <HiX className="h-5 w-5 flex-shrink-0 text-luxury-gray" />
            )}
            <span className={cn('text-sm', feature.included ? 'text-white' : 'text-luxury-gray')}>
              {feature.name}
            </span>
          </li>
        ))}
      </ul>
      <Link
        to="/checkout"
        className={cn(
          'mt-8 flex w-full items-center justify-center rounded-full py-4 text-sm font-bold uppercase tracking-wider transition-all',
          membership.popular
            ? 'bg-gold-500 text-luxury-black hover:bg-gold-400'
            : 'border border-glass-light text-white hover:bg-white/10'
        )}
      >
        {membership.popular ? 'Get Started' : 'Choose Plan'}
      </Link>
    </motion.div>
  );
}
