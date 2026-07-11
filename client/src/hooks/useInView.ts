import { useState, useCallback, useRef } from 'react';

interface UseInViewOptions {
  threshold?: number;
  rootMargin?: string;
}

export function useInView<T extends HTMLElement = HTMLDivElement>(
  options: UseInViewOptions = {}
) {
  const { threshold = 0, rootMargin = '0px' } = options;
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<T>(null);

  const setRef = useCallback(
    (node: T | null) => {
      if (ref.current) return;
      if (!node) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        },
        { threshold, rootMargin }
      );

      observer.observe(node);
      (ref as React.MutableRefObject<T | null>).current = node;
    },
    [threshold, rootMargin]
  );

  return { ref: setRef, isInView };
}
