"use client";

import React from "react";

/**
 * Conteneur carte réutilisé partout (missions, KPI, panneaux admin...).
 * @param {{ padding?: number|string, shadow?: boolean, children: React.ReactNode }} props
 */
export default function Card({ padding = 18, shadow = true, children, style, onClick, ...rest }) {
  return (
    <div
      onClick={onClick}
      className={onClick ? "sf-card-interactive" : undefined}
      style={{
        background: "var(--cloud-2)",
        border: "1px solid var(--line)",
        borderRadius: "var(--radius-m)",
        padding,
        boxShadow: shadow ? "var(--shadow-card)" : "none",
        cursor: onClick ? "pointer" : undefined,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
