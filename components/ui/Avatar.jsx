"use client";

import React from "react";

/**
 * Avatar rond avec initiale (ou photo si fournie), utilisé pour
 * Reporters, Participants, Admin.
 * @param {{ name: string, size?: number, online?: boolean, photoUrl?: string }} props
 */
export default function Avatar({ name, size = 44, online = false, photoUrl }) {
  return (
    <div style={{ position: "relative", flexShrink: 0 }}>
      {photoUrl ? (
        <img
          src={photoUrl}
          alt={name || "Photo de profil"}
          width={size}
          height={size}
          style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", display: "block" }}
        />
      ) : (
        <div
          className="sf-display"
          style={{
            width: size,
            height: size,
            borderRadius: "50%",
            background: "linear-gradient(135deg,#232636,#3a3f57)",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: size * 0.36,
            fontWeight: 600,
          }}
        >
          {name ? name[0].toUpperCase() : "?"}
        </div>
      )}
      {online && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: size * 0.24,
            height: size * 0.24,
            borderRadius: "50%",
            background: "var(--signal)",
            border: "2px solid var(--cloud-2)",
          }}
        />
      )}
    </div>
  );
}
