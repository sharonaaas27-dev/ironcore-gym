import { useEffect, useRef } from 'react';

export function useParallax(speed: number = 0.5) {
  const ref = useRef<HTMLDivElement>(null);
  const tick = useRef<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      tick.current = window.scrollY;
      if (ref.current) {
        const y = tick.current * speed;
        ref.current.style.transform = `translateY(${y}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return ref;
}
