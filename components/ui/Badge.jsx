"use client";

import React from "react";

const TONES = {
  verified: { background: "rgba(23,185,120,0.12)", color: "var(--verified)" },
  signal: { background: "rgba(255,59,48,0.1)", color: "var(--signal)" },
  ember: { background: "rgba(232,163,61,0.16)", color: "#8a5c14" },
  slate: { background: "var(--line)", color: "var(--slate)" },
};

/**
 * Badge de statut réutilisé partout (missions, litiges, tickets, transactions...).
 * @param {{ tone?: keyof typeof TONES, children: React.ReactNode }} props
 */
export default function Badge({ tone = "slate", children }) {
  const t = TONES[tone] || TONES.slate;
  return (
    <span
      className="sf-mono"
      style={{
        fontSize: 11,
        fontWeight: 600,
        padding: "4px 10px",
        borderRadius: 999,
        display: "inline-block",
        ...t,
      }}
    >
      {children}
    </span>
  );
}
