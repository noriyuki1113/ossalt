import { useEffect, useRef, useState } from "react";

interface LazySectionProps {
  children: React.ReactNode;
  /** Placeholder height to prevent layout shift before element is visible */
  placeholderHeight?: string;
  /** Distance from viewport edge at which to start loading */
  rootMargin?: string;
  className?: string;
}

/**
 * Defers rendering of children until the section approaches the viewport.
 * Eliminates below-fold network requests and JS execution on initial load.
 * Uses a stable placeholder to prevent cumulative layout shift (CLS).
 */
export function LazySection({
  children,
  placeholderHeight = "300px",
  rootMargin = "300px",
  className,
}: LazySectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (visible) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin, visible]);

  if (!visible) {
    return (
      <div
        ref={ref}
        style={{ minHeight: placeholderHeight }}
        className={className}
        aria-hidden="true"
      />
    );
  }

  return <div className={className}>{children}</div>;
}
