import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(() =>
    typeof window !== 'undefined' && window.innerWidth >= 768
  );
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (window.innerWidth < 768) return;
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsLoading(false), 500);
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 200);
    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-luxury-black"
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.8, ease: [0.77, 0, 0.18, 1] }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="text-center"
          >
            <h1 className="text-6xl font-bold tracking-tighter text-white md:text-8xl">
              IRON
              <span className="gradient-text">CORE</span>
            </h1>
            <div className="mt-8 flex items-center gap-4">
              <div className="h-[2px] w-32 bg-luxury-dark">
                <motion.div
                  className="h-full bg-gold-500"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
              <span className="font-mono text-sm text-gold-500">
                {Math.round(Math.min(progress, 100))}%
              </span>
            </div>
            <p className="mt-4 text-sm tracking-widest text-luxury-gray uppercase">
              Forge Your Strength
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
