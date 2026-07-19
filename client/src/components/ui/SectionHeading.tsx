import { motion } from 'framer-motion';
import { useScrollAnimation } from '@hooks/useScrollAnimation';
import { cn } from '@utils/cn';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  light?: boolean;
  className?: string;
  align?: 'left' | 'center' | 'right';
}

export default function SectionHeading({
  title,
  subtitle,
  light = false,
  className,
  align = 'center',
}: SectionHeadingProps) {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>();
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <div
      ref={ref}
      className={cn(
        'mb-10 md:mb-16 max-w-3xl',
        align === 'center' && 'mx-auto text-center',
        align === 'right' && 'ml-auto text-right',
        className
      )}
    >
      <motion.div
        initial={isMobile ? false : { opacity: 0, y: 40 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.77, 0, 0.18, 1] }}
      >
        <h2
          className={cn(
            'text-display-sm md:text-display-md lg:text-display-lg font-bold tracking-tight',
            light ? 'text-white' : 'text-luxury-gray'
          )}
        >
          {title.split(' ').map((word, i) =>
            word.startsWith('$') ? (
              <span key={i} className="gradient-text">
                {word.slice(1)}{' '}
              </span>
            ) : (
              <span key={i}>{word}{' '}</span>
            )
          )}
        </h2>
        {subtitle && (
          <motion.p
            initial={isMobile ? false : { opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.77, 0, 0.18, 1] }}
            className="mt-6 text-lg leading-relaxed text-luxury-gray md:text-xl"
          >
            {subtitle}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}
