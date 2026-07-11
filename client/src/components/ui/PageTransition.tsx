import { motion, type HTMLMotionProps } from 'framer-motion';

interface PageTransitionProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
}

const variants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.77, 0, 0.18, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.98,
    transition: {
      duration: 0.4,
      ease: [0.77, 0, 0.18, 1],
    },
  },
};

export default function PageTransition({ children, ...props }: PageTransitionProps) {
  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      {...props}
    >
      {children}
    </motion.div>
  );
}
