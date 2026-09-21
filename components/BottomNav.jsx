"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, Search, UserPlus, HelpCircle } from "lucide-react";

// Reprend les 4 destinations de la maquette de référence : explorer (la
// carte, pour se balader visuellement), trouver un reporter (mode liste
// + recherche déjà active, pour quelqu'un qui sait déjà ce qu'il
// cherche et veut aller vite plutôt que fouiller la carte), devenir
// Reporter (onboarding) et l'aide.
const ITEMS = [
  { href: "/explorer", label: "Explorer", icon: MapPin },
  { href: "/explorer?mode=list&search=1", label: "Trouver un reporter", icon: Search },
  { href: "/r/onboarding", label: "Devenir Reporter", icon: UserPlus },
  { href: "/support", label: "Aide", icon: HelpCircle },
];

/**
 * Barre de navigation basse, fixe — purement visuelle pour l'instant
 * (mêmes 4 destinations que la maquette).
 */
export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 150,
        borderTop: "1px solid var(--line)",
        background: "color-mix(in srgb, var(--surface) 94%, transparent)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
      }}
    >
      <div
        style={{
          maxWidth: 640,
          margin: "0 auto",
          display: "flex",
          alignItems: "stretch",
          justifyContent: "space-between",
          padding: "8px 10px calc(8px + env(safe-area-inset-bottom))",
        }}
      >
        {ITEMS.map((item, i) => {
          const active = pathname === item.href && i === 0; // "Explorer" est le seul onglet réellement actif ici
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
                padding: "6px 4px",
                fontSize: 10.5,
                fontWeight: 600,
                textAlign: "center",
                color: active ? "var(--signal)" : "var(--slate)",
              }}
            >
              <Icon size={19} strokeWidth={active ? 2.4 : 2} />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
