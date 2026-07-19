import { useEffect, useRef, useState } from 'react';
import { useScrollAnimation } from '@hooks/useScrollAnimation';

interface AnimatedCounterProps {
  target: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}

export default function AnimatedCounter({
  target,
  suffix = '',
  prefix = '',
  duration = 2,
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>();
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isVisible || hasAnimated.current) return;
    hasAnimated.current = true;

    const isMobile = window.innerWidth < 768;
    const fps = isMobile ? 20 : 60;
    const steps = duration * fps;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 1000 / fps);

    return () => clearInterval(timer);
  }, [isVisible, target, duration]);

  return (
    <div ref={ref} className="text-center">
      <span className="text-3xl font-bold tracking-tighter text-white md:text-4xl lg:text-6xl">
        {prefix}
        {count.toLocaleString()}
        {suffix}
      </span>
    </div>
  );
}
