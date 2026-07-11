import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiStar, HiArrowRight } from 'react-icons/hi';
import type { Trainer } from '@/types';

interface TrainerCardProps {
  trainer: Trainer;
  index?: number;
  isVisible?: boolean;
}

export default function TrainerCard({ trainer, index = 0, isVisible = true }: TrainerCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.77, 0, 0.18, 1] }}
    >
      <Link to={`/trainers/${trainer._id}`} className="group glass block rounded-2xl p-6 hover-lift text-center">
        <div className="mx-auto mb-4 h-32 w-32 overflow-hidden rounded-full border-2 border-gold-500/50">
          {trainer.avatar ? (
            <img src={trainer.avatar} alt={trainer.name} className="h-full w-full object-cover" loading="lazy" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-luxury-charcoal text-3xl font-bold text-gold-500">
              {trainer.name.charAt(0)}
            </div>
          )}
        </div>
        <h3 className="text-xl font-bold text-white transition-colors group-hover:text-gold-500">
          {trainer.name}
        </h3>
        <div className="mt-2 flex items-center justify-center gap-1 text-sm text-gold-500">
          <HiStar className="h-4 w-4" />
          <span>{trainer.rating}</span>
          <span className="text-luxury-gray">· {trainer.experience} yr exp</span>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-luxury-gray line-clamp-2">{trainer.bio}</p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {trainer.specialties.slice(0, 3).map((s) => (
            <span key={s} className="rounded-full bg-luxury-charcoal px-3 py-1 text-xs text-luxury-gray">{s}</span>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-center gap-2 text-sm font-semibold text-gold-500">
          <span>View Profile</span>
          <HiArrowRight className="transition-transform group-hover:translate-x-1" />
        </div>
      </Link>
    </motion.div>
  );
}
