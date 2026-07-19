import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { initAnalytics, trackPageView } from "../analytics";

/** Tracks SPA navigations in Google Analytics (skips /admin). */
export default function Analytics() {
  const location = useLocation();

  useEffect(() => {
    initAnalytics();
  }, []);

  useEffect(() => {
    const path = `${location.pathname}${location.search}`;
    if (path.startsWith("/admin")) return;
    trackPageView(path, document.title);
  }, [location.pathname, location.search]);

  return null;
}
