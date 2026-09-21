"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Détecte la direction du scroll ("down" | "up") avec un seuil pour
 * éviter le flicker sur les petits mouvements (rebond iOS, trackpad...).
 * Reste "up" tant qu'on n'a pas dépassé `offset` px depuis le haut de
 * page, pour ne jamais masquer la recherche juste après le chargement.
 *
 * @param {number} threshold px de mouvement avant de considérer un vrai changement de direction
 * @param {number} offset px depuis le haut avant que la direction "down" puisse masquer quoi que ce soit
 */
export function useScrollDirection(threshold = 8, offset = 40) {
  const [direction, setDirection] = useState("up");
  const lastY = useRef(0);

  useEffect(() => {
    lastY.current = window.scrollY;

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const delta = y - lastY.current;

        if (y < offset) {
          setDirection("up");
        } else if (Math.abs(delta) > threshold) {
          setDirection(delta > 0 ? "down" : "up");
          lastY.current = y;
        }
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold, offset]);

  return direction;
}
