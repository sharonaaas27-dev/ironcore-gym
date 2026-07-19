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
  const { ref } = useScrollAnimation<HTMLDivElement>();

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
      <div
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
          <p
            className="mt-6 text-lg leading-relaxed text-luxury-gray md:text-xl"
          >
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
