"use client";

import { useEffect } from "react";

/**
 * Bascule le thème visuel du produit pendant un live. Le CSS global
 * définit déjà toute une palette [data-theme="dark"] ("ambiance live")
 * mais rien ne posait cet attribut sur <body> — ce hook comble ce trou :
 * sans lui, tout ce thème sombre restait du CSS mort, jamais activé.
 */
export function useLiveTheme(active) {
  useEffect(() => {
    if (active) {
      document.body.dataset.theme = "dark";
    }
    return () => {
      delete document.body.dataset.theme;
    };
  }, [active]);
}
