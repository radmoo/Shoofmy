"use client";

import React from "react";
import { ShieldCheck, Star, Clock, Zap } from "lucide-react";
import Header from "@/components/Header";
import Dateline from "@/components/ui/Dateline";
import RequireAuth from "@/components/RequireAuth";
import Card from "@/components/ui/Card";
import { useMission } from "@/lib/context/MissionContext";

const REFERENCE_KPIS = [
  { icon: ShieldCheck, label: "Fiabilité", val: "98%", color: "var(--verified)" },
  { icon: Star, label: "Qualité vidéo", val: "4,9", color: "var(--ember)" },
  { icon: Clock, label: "Ponctualité", val: "97%", color: "var(--verified)" },
  { icon: Zap, label: "Réactivité", val: "1min48", color: "var(--signal)" },
];

export default function ReporterStatsPage() {
  return (
    <RequireAuth role="reporter">
      <ReporterStatsContent />
    </RequireAuth>
  );
}

function ReporterStatsContent() {
  const { history } = useMission();
  const completedThisSession = history.filter((m) => m.status === "done").length;

  return (
    <div>
      <Header />
      <div className="sf-wrap" style={{ paddingTop: 26, paddingBottom: 50 }}>
        <Dateline>Bilan Reporter</Dateline>
        <h1 className="sf-display" style={{ fontSize: 22, marginBottom: 4 }}>Statistiques</h1>
        <p style={{ fontSize: 13, color: "var(--slate)", marginBottom: 24 }}>
          {completedThisSession} mission{completedThisSession !== 1 ? "s" : ""} terminée{completedThisSession !== 1 ? "s" : ""} cette session
          {" · "}127 au total (historique complet, hors session)
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {REFERENCE_KPIS.map((k) => (
            <Card key={k.label}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: `${k.color}1F`, color: k.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <k.icon size={14} />
                </div>
                <span style={{ fontSize: 12, color: "var(--slate)" }}>{k.label}</span>
              </div>
              <div className="sf-mono" style={{ fontSize: 21, fontWeight: 600 }}>{k.val}</div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
