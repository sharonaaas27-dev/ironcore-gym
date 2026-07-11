import { useScrollAnimation } from '@hooks/useScrollAnimation';
import { cn } from '@utils/cn';

interface AnimatedGradientTextProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'span' | 'p';
}

export default function AnimatedGradientText({
  text,
  className,
  as: Tag = 'span',
}: AnimatedGradientTextProps) {
  const { ref, isVisible } = useScrollAnimation<HTMLHeadingElement>();

  return (
    <Tag
      ref={ref}
      className={cn(
        'bg-gold-gradient bg-clip-text text-transparent',
        isVisible && 'animate-gradient-x',
        className
      )}
      style={{ backgroundSize: '200% 200%' }}
    >
      {text}
    </Tag>
  );
}
