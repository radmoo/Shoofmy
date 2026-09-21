"use client";

import React from "react";
import Link from "next/link";
import { MapPin, PlayCircle } from "lucide-react";
import Header from "@/components/Header";
import Dateline from "@/components/ui/Dateline";
import RequireAuth from "@/components/RequireAuth";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { useMission } from "@/lib/context/MissionContext";

export default function HistoryPage() {
  return (
    <RequireAuth role="participant">
      <HistoryContent />
    </RequireAuth>
  );
}

function HistoryContent() {
  const { history } = useMission();

  return (
    <div>
      <Header />
      <div className="sf-wrap" style={{ paddingTop: 26, paddingBottom: 50 }}>
        <Dateline>Archives · Missions passées</Dateline>
        <h1 className="sf-display" style={{ fontSize: 22, marginBottom: 4 }}>Historique</h1>
        <p style={{ fontSize: 13, color: "var(--slate)", marginBottom: 22 }}>
          {history.length} mission{history.length > 1 ? "s" : ""} cette session
        </p>

        {history.length === 0 ? (
          <Card style={{ textAlign: "center", padding: "40px 20px", color: "var(--slate)", fontSize: 14 }}>
            Aucune mission terminée pour l'instant. Réservez un Reporter depuis Explorer pour voir apparaître
            l'historique ici — c'est le même état qui traverse tout le parcours.
          </Card>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {history.map((m) => (
              <Card key={m.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{m.reporterName}</div>
                  <div style={{ fontSize: 12, color: "var(--slate)", display: "flex", alignItems: "center", gap: 5 }}>
                    <MapPin size={11} />{m.place} · {m.duration}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div className="sf-mono" style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 4 }}>
                    {m.status === "cancelled" ? "0 €" : `${m.finalPrice} €`}
                  </div>
                  <Badge tone={m.status === "cancelled" ? "slate" : "verified"}>
                    {m.status === "cancelled" ? "Annulée" : "Terminée"}
                  </Badge>
                  {m.status === "done" && (
                    <Link href={`/replay/${m.id}`} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11.5, color: "var(--slate)", marginTop: 6, justifyContent: "flex-end" }}>
                      <PlayCircle size={12} />Replay
                    </Link>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
