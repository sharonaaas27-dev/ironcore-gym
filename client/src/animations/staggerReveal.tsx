import { motion, type Variants } from 'framer-motion';
import { useScrollAnimation } from '@hooks/useScrollAnimation';
import type { ReactNode } from 'react';

interface StaggerRevealProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  variants?: Variants;
}

export default function StaggerReveal({
  children,
  className,
  staggerDelay = 0.1,
  variants: customVariants,
}: StaggerRevealProps) {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>();

  const defaultVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: staggerDelay, delayChildren: 0.2 },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isVisible ? 'visible' : 'hidden'}
      variants={customVariants || defaultVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}
