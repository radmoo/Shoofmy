"use client";

import React from "react";

/**
 * Modale générique en bottom-sheet sur mobile, centrée sur desktop.
 * @param {{ open: boolean, onClose: () => void, children: React.ReactNode }} props
 */
export default function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div
      onClick={onClose}
      className="sf-modal-backdrop"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(16,18,26,0.5)",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        zIndex: 50,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="sf-modal-sheet"
        style={{
          background: "var(--cloud-2)",
          borderRadius: "var(--radius-l) var(--radius-l) 0 0",
          padding: "28px 24px",
          width: "100%",
          maxWidth: 420,
        }}
      >
        {children}
      </div>
    </div>
  );
}
