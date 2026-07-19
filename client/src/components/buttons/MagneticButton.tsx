import { type ReactNode } from 'react';
import { motion } from 'framer-motion';

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function MagneticButton({ children, className, onClick }: MagneticButtonProps) {
  return (
    <motion.div
      className={`inline-block ${className || ''}`}
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.div>
  );
}
