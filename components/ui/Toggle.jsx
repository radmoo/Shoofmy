"use client";

import React from "react";

/**
 * Switch on/off animé, utilisé pour les notifications, la disponibilité Reporter...
 * @param {{ on: boolean, onChange: (v: boolean) => void }} props
 */
export default function Toggle({ on, onChange }) {
  return (
    <button
      onClick={() => onChange(!on)}
      style={{
        width: 42,
        height: 25,
        borderRadius: 999,
        background: on ? "var(--verified)" : "var(--line)",
        position: "relative",
        border: "none",
        cursor: "pointer",
        flexShrink: 0,
        transition: "background .18s ease",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 3,
          left: on ? 20 : 3,
          width: 19,
          height: 19,
          borderRadius: "50%",
          background: "#fff",
          transition: "left .18s ease",
          boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
        }}
      />
    </button>
  );
}
