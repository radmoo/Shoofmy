"use client";

import React, { useState } from "react";
import { reporterPhotoUrl, reporterMapThumbUrl } from "@/lib/geo";

/**
 * Avatar de Reporter : photo (illustration générée, stable par id) +
 * pastille carte en superposition montrant où il se trouve (lat/lng
 * du mock data), en plus du point "en ligne" habituel.
 * @param {{ reporter: object, size?: number, online?: boolean, showMap?: boolean }} props
 */
/**
 * Avatar de Reporter : photo + point "en ligne" en overlay.
 * (La miniature de carte de localisation a été retirée : à la taille
 * d'un avatar elle était illisible et ressemblait à un artefact visuel
 * plutôt qu'à une info utile — la ville est déjà affichée en texte à côté.)
 *
 * La photo vient d'un service externe (i.pravatar.cc) : si elle échoue à
 * charger (lenteur/indisponibilité du service), on retombe sur les
 * initiales du Reporter plutôt que de laisser un cercle vide qui se fond
 * dans le fond blanc des cartes — sinon seul le point "en ligne" reste
 * visible, comme si la tête avait disparu.
 * @param {{ reporter: object, size?: number, online?: boolean }} props
 */
export default function ReporterAvatar({ reporter, size = 44, online }) {
  const isOnline = online ?? reporter?.online;
  const [imgFailed, setImgFailed] = useState(false);
  const initial = reporter?.name ? reporter.name[0].toUpperCase() : "?";

  return (
    <div style={{ position: "relative", flexShrink: 0, width: size, height: size }}>
      {imgFailed ? (
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
            fontSize: size * 0.4,
            fontWeight: 600,
          }}
        >
          {initial}
        </div>
      ) : (
        <img
          src={reporterPhotoUrl(reporter, size * 2)}
          alt={reporter?.name || "Reporter"}
          width={size}
          height={size}
          onError={() => setImgFailed(true)}
          style={{
            width: size,
            height: size,
            borderRadius: "50%",
            background: "var(--cloud-2)",
            objectFit: "cover",
            display: "block",
          }}
        />
      )}

      {isOnline && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: size * 0.26,
            height: size * 0.26,
            borderRadius: "50%",
            background: "var(--signal)",
            border: "2px solid var(--cloud-2)",
          }}
        />
      )}
    </div>
  );
}
