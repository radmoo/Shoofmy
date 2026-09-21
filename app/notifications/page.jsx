"use client";

import React from "react";
import { Zap, Wallet, Star, ShieldCheck } from "lucide-react";
import Header from "@/components/Header";
import Dateline from "@/components/ui/Dateline";
import RequireAuth from "@/components/RequireAuth";
import Card from "@/components/ui/Card";
import { useMission } from "@/lib/context/MissionContext";

const REFERENCE = [
  { icon: ShieldCheck, tone: "var(--verified)", title: "Vérification d'identité validée", desc: "Vous pouvez désormais réserver des Reporters", time: "Hier" },
  { icon: Star, tone: "var(--ember)", title: "Léa a laissé un avis", desc: "5 étoiles · « Super visite, merci ! »", time: "Hier" },
];

export default function NotificationsPage() {
  return (
    <RequireAuth role="participant">
      <NotificationsContent />
    </RequireAuth>
  );
}

function NotificationsContent() {
  // Génère de vraies notifications à partir de ce qui s'est passé dans la
  // session (MissionContext), pas seulement des entrées mockées figées.
  const { activeMission, history } = useMission();

  const live = [];
  if (activeMission) {
    if (activeMission.status === "requested") {
      live.push({ icon: Zap, tone: "var(--signal)", title: `Demande envoyée à ${activeMission.reporterName}`, desc: `~${activeMission.preAuthEstimate} € pré-autorisés · ${activeMission.place}`, time: "À l'instant" });
    }
    if (activeMission.status === "confirmed") {
      live.push({ icon: Zap, tone: "var(--signal)", title: `${activeMission.reporterName} a accepté`, desc: activeMission.place, time: "À l'instant" });
    }
    if (activeMission.status === "live") {
      live.push({ icon: Zap, tone: "var(--signal)", title: `${activeMission.reporterName} est en direct`, desc: activeMission.place, time: "En cours" });
    }
  }
  history.forEach((m) => {
    if (m.status === "done") {
      live.push({ icon: Wallet, tone: "var(--verified)", title: "Mission terminée", desc: `${m.reporterName} · ${m.finalPrice} €`, time: "Aujourd'hui" });
    }
  });

  const items = [...live, ...REFERENCE];

  return (
    <div>
      <Header leftIcon="back" />
      <div className="sf-wrap" style={{ paddingTop: 26, paddingBottom: 50 }}>
        <Dateline tone="signal">Dernière heure</Dateline>
        <h1 className="sf-display" style={{ fontSize: 22, marginBottom: 4 }}>Notifications</h1>
        <p style={{ fontSize: 13, color: "var(--slate)", marginBottom: 22 }}>
          {live.length > 0 ? `${live.length} générée${live.length > 1 ? "s" : ""} par votre session en cours` : "Aucune activité en session pour l'instant"}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {items.map((it, i) => (
            <Card key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: `${it.tone}1F`, color: it.tone, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <it.icon size={16} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{it.title}</div>
                <div style={{ fontSize: 12.5, color: "var(--slate)" }}>{it.desc}</div>
              </div>
              <div className="sf-mono" style={{ fontSize: 11, color: "var(--slate-2)", flexShrink: 0 }}>{it.time}</div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
