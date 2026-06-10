import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

/**
 * Shows a thin progress bar at the top of the page during route transitions.
 * Patches history.pushState/replaceState to detect navigation start before
 * React processes it, giving immediate visual feedback on link clicks.
 */
export function NavigationProgress() {
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const [width, setWidth] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const rafRef = useRef<number>();

  const start = () => {
    setVisible(true);
    setWidth(30);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setWidth(70), 200);
  };

  const done = () => {
    setWidth(100);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setVisible(false);
      setWidth(0);
    }, 300);
  };

  // Hide bar when new route is fully committed
  useEffect(() => {
    done();
  }, [location.pathname]);

  // Patch history API to detect navigation start (fires before React processes it)
  useEffect(() => {
    const orig = history.pushState.bind(history);
    history.pushState = (...args) => {
      start();
      orig(...args);
    };
    const handlePopState = () => start();
    window.addEventListener("popstate", handlePopState);
    return () => {
      history.pushState = orig;
      window.removeEventListener("popstate", handlePopState);
      clearTimeout(timerRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  if (!visible && width === 0) return null;

  return (
    <div
      className="fixed top-0 left-0 z-[9999] h-[2px] bg-primary transition-all duration-300 ease-out"
      style={{ width: `${width}%`, opacity: visible ? 1 : 0 }}
      aria-hidden="true"
    />
  );
}
