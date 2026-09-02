import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export function ScrollToTop() {
  const { pathname } = useLocation();
  const prevPath = useRef(pathname);

  useEffect(() => {
    // Only scroll when actually navigating to a different page
    if (prevPath.current === pathname) return;
    prevPath.current = pathname;
    // Use requestAnimationFrame so scroll happens after new page paints,
    // not mid-transition (avoids briefly showing old page scrolled to top)
    const raf = requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "instant" });
    });
    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  return null;
}
