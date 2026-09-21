import React from "react";

/**
 * Petite étiquette "dateline" mono/majuscules, posée juste au-dessus
 * d'un titre de page — reprend le vocabulaire éditorial de la Landing
 * (agence de presse) pour que toutes les pages appartiennent au même
 * univers visuel, sans avoir à refaire chaque mise en page.
 */
export default function Dateline({ children, tone = "slate", center = false }) {
  const color = tone === "signal" ? "var(--signal)" : "var(--slate)";
  return (
    <div
      className="sf-mono"
      style={{
        fontSize: 10.5,
        letterSpacing: "0.09em",
        textTransform: "uppercase",
        color,
        fontWeight: 700,
        marginBottom: 6,
        display: "flex",
        alignItems: "center",
        justifyContent: center ? "center" : "flex-start",
        gap: 6,
      }}
    >
      {children}
    </div>
  );
}
