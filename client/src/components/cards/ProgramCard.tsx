import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiArrowRight } from 'react-icons/hi';
import type { Program } from '@/types';

interface ProgramCardProps {
  program: Program;
  index?: number;
  isVisible?: boolean;
}

export default function ProgramCard({ program, index = 0, isVisible = true }: ProgramCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.77, 0, 0.18, 1] }}
    >
      <Link to={`/programs/${program.slug}`} className="group glass block overflow-hidden rounded-2xl hover-lift">
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
          <h3 className="text-xl font-bold text-white transition-colors group-hover:text-gold-500">
            {program.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-luxury-gray">{program.description}</p>
          <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-gold-500">
            <span>Learn More</span>
            <HiArrowRight className="transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
