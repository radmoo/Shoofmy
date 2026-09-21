"use client";

import { useEffect, useRef } from "react";

// Ajoute .sf-in-view (définie dans globals.css) dès qu'un élément .sf-reveal
// entre dans le viewport. Un seul IntersectionObserver pour toute la page
// plutôt qu'un par carte — même esprit que sf-card-interactive : léger,
// sans dépendance, respecte prefers-reduced-motion via le CSS.
export function useReveal(containerRef) {
  useEffect(() => {
    const root = containerRef?.current || document;
    const nodes = root.querySelectorAll(".sf-reveal");
    if (!nodes.length) return;

    if (typeof IntersectionObserver === "undefined") {
      nodes.forEach((n) => n.classList.add("sf-in-view"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("sf-in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, [containerRef]);
}
