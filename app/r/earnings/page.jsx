"use client";

import React from "react";
import { MapPin, Wallet } from "lucide-react";
import Header from "@/components/Header";
import RequireAuth from "@/components/RequireAuth";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { useMission } from "@/lib/context/MissionContext";

export default function ReporterEarningsPage() {
  return (
    <RequireAuth role="reporter">
      <ReporterEarningsContent />
    </RequireAuth>
  );
}

function ReporterEarningsContent() {
  const { history } = useMission();

  // Calculé depuis le vrai historique partagé (pas un chiffre en dur) :
  // chaque mission terminée pendant la session ajoute son montant ici.
  const completed = history.filter((m) => m.status === "done");
  const total = completed.reduce((sum, m) => sum + (m.finalPrice || 0), 0);

  return (
    <div>
      <Header />
      <div className="sf-wrap" style={{ paddingTop: 26, paddingBottom: 50 }}>
        <div
          className="sf-display"
          style={{
            background: "var(--ink)", color: "#fff", borderRadius: "var(--radius-l)",
            padding: "24px 26px", marginBottom: 22,
          }}
        >
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, color: "rgba(255,255,255,0.55)", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
            <Wallet size={13} />Revenus de cette session
          </div>
          <div style={{ fontSize: 34 }}>{total.toFixed(2)} €</div>
        </div>

        <div style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--slate)", marginBottom: 12 }}>
          MISSIONS TERMINÉES ({completed.length})
        </div>

        {completed.length === 0 ? (
          <Card style={{ textAlign: "center", padding: "36px 20px", color: "var(--slate)", fontSize: 13.5 }}>
            Aucune mission terminée pour l'instant. Termine une mission depuis /r/mission pour la voir
            apparaître ici avec son montant.
          </Card>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {completed.map((m) => (
              <Card key={m.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 600 }}>{m.description || "Mission"}</div>
                  <div style={{ fontSize: 12, color: "var(--slate)", display: "flex", alignItems: "center", gap: 5 }}>
                    <MapPin size={11} />{m.place}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div className="sf-mono" style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 4 }}>{m.finalPrice} €</div>
                  <Badge tone="verified">Payée</Badge>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
