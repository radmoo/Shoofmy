"use client";

import { useEffect } from "react";

/**
 * Le badge "Powered by Netlify" (hébergement gratuit) est injecté après
 * coup par un script tiers, avec des classes qui varient selon les
 * builds — les sélecteurs CSS fixes dans globals.css ne suffisent pas
 * toujours. On le traque plutôt par ce qu'il EST : un lien fixe en bas
 * d'écran dont le texte contient "Netlify", et on le masque dès qu'il
 * apparaît dans le DOM.
 */
export default function NetlifyBadgeKiller() {
  useEffect(() => {
    const hideBadge = (el) => {
      el.style.setProperty("display", "none", "important");
      el.style.setProperty("visibility", "hidden", "important");
      el.style.setProperty("pointer-events", "none", "important");
    };

    const sweep = () => {
      document.querySelectorAll("a, div, iframe").forEach((el) => {
        if (el.dataset?.sfChecked) return;
        const text = el.textContent || "";
        const href = el.getAttribute?.("href") || el.src || "";
        if (
          (text.includes("Powered by Netlify") || href.includes("netlify.com") || href.includes("netlify.app")) &&
          el.children.length < 5 // évite d'attraper un ancêtre trop large de la page elle-même
        ) {
          hideBadge(el);
        }
        el.dataset.sfChecked = "1";
      });
    };

    sweep();
    const observer = new MutationObserver(sweep);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return null;
}
