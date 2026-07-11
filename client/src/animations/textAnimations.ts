import type { Variants } from 'framer-motion';

export const textReveal: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.77, 0, 0.18, 1] },
  },
};

export const wordReveal: Variants = {
  hidden: { opacity: 0, y: 50, rotateX: -90 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.8, delay: i * 0.05, ease: [0.77, 0, 0.18, 1] },
  }),
};

export const charReveal: Variants = {
  hidden: { opacity: 0, y: 50, rotateX: -90 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.5, delay: i * 0.03, ease: 'power4.out' },
  }),
};
