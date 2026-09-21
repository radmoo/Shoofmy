"use client";

import React from "react";

const VARIANTS = {
  primary: { background: "var(--ink)", color: "#fff", border: "1px solid transparent" },
  secondary: { background: "var(--cloud-2)", color: "var(--ink)", border: "1px solid var(--line)" },
  ghost: { background: "transparent", color: "var(--slate)", border: "1px solid transparent" },
  danger: { background: "var(--cloud-2)", color: "var(--signal)", border: "1px solid var(--line)" },
};

/**
 * Bouton partagé de tout le produit.
 * @param {{ variant?: keyof typeof VARIANTS, full?: boolean, disabled?: boolean, onClick?: Function, children: React.ReactNode }} props
 */
export default function Button({ variant = "primary", full = false, disabled = false, onClick, children, style, ...rest }) {
  const v = VARIANTS[variant] || VARIANTS.primary;
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="sf-btn"
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        padding: "13px 22px",
        borderRadius: 8,
        fontWeight: 600,
        fontSize: 14.5,
        width: full ? "100%" : undefined,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        transition: "transform 0.15s var(--ease, ease), box-shadow 0.15s var(--ease, ease), filter 0.15s var(--ease, ease)",
        ...v,
        ...style,
      }}
      {...rest}
    >
      {children}
    </button>
  );
}
