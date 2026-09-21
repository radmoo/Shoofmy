"use client";

import React from "react";
import { AlertTriangle } from "lucide-react";
import Button from "@/components/ui/Button";
import { useSession } from "@/lib/context/SessionContext";

/**
 * Écran bloquant tant que le Reporter n'a pas explicitement reconnu les
 * règles de droit à l'image (cahier des charges section 12) : il filme
 * dans un lieu qu'il ne contrôle pas, doit respecter le consentement des
 * personnes filmées, et Shoofmy n'est pas responsable du contenu diffusé.
 */
export default function ReporterWarningGate({ children }) {
  const { user, acceptReporterWarning } = useSession();

  if (user?.acceptedReporterWarning) return children;

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, background: "var(--cloud)" }}>
      <div style={{ maxWidth: 420, background: "var(--cloud-2)", border: "1px solid var(--line)", borderRadius: "var(--radius-l)", padding: 28 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(232,163,61,0.16)", color: "#8a5c14", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
          <AlertTriangle size={20} />
        </div>
        <h2 className="sf-display" style={{ fontSize: 19, marginBottom: 12 }}>Avant de filmer</h2>
        <ul style={{ fontSize: 13, color: "var(--ink-soft)", lineHeight: 1.7, marginBottom: 22, paddingLeft: 18 }}>
          <li>Vous filmez dans des lieux publics ou avec l'accord de leur responsable — jamais chez quelqu'un sans son consentement explicite.</li>
          <li>Évitez de filmer des personnes de façon identifiable sans leur accord ; recadrez ou détournez la caméra si on vous le demande.</li>
          <li>Shoofmy n'est pas responsable du contenu que vous diffusez — vous restez seul responsable du respect du droit à l'image et de la vie privée d'autrui.</li>
          <li>Tout manquement signalé peut entraîner la suspension de votre compte Reporter.</li>
        </ul>
        <Button full onClick={acceptReporterWarning}>J'ai compris, je m'engage à respecter ces règles</Button>
      </div>
    </div>
  );
}
