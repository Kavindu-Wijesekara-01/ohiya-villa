"use client";

import { useEffect } from "react";

const SELECTOR =
  ".scroll-reveal, .scroll-reveal-img, .scroll-reveal-scale, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-vehicle";

export default function ScrollObserver() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      document.querySelectorAll(SELECTOR).forEach((el) => {
        el.classList.add("is-visible");
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: "0px 0px -40px 0px",
        threshold: 0.05,
      }
    );

    const observeElements = () => {
      const elements = document.querySelectorAll(SELECTOR);
      elements.forEach((el) => {
        if (!el.classList.contains("is-visible")) {
          observer.observe(el);
        }
      });
    };

    observeElements();

    // Re-scan after short delay for dynamically rendered cards & images
    const timer1 = setTimeout(observeElements, 200);
    const timer2 = setTimeout(observeElements, 600);
    const timer3 = setTimeout(observeElements, 1200);

    // Mutation observer for tab filter switching (e.g. Gallery & Attractions)
    const mutationObserver = new MutationObserver(() => {
      observeElements();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return null;
}
