import { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@utils/cn';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  onClick?: () => void;
}

export default function GlassCard({
  children,
  className,
  hover = true,
  glow = false,
  onClick,
}: GlassCardProps) {
  return (
    <motion.div
      className={cn(
        'glass rounded-2xl p-8',
        hover && 'hover-lift cursor-pointer',
        glow && 'hover:shadow-gold',
        className
      )}
      onClick={onClick}
      whileHover={hover ? { y: -4 } : {}}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, ease: [0.77, 0, 0.18, 1] }}
    >
      {children}
    </motion.div>
  );
}
