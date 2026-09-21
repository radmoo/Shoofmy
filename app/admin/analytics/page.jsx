"use client";

import React from "react";
import { TrendingUp, TrendingDown, ArrowUpRight } from "lucide-react";
import Card from "@/components/ui/Card";
import Dateline from "@/components/ui/Dateline";
import { useMission } from "@/lib/context/MissionContext";

const KPIS = [
  { label: "Utilisateurs actifs", val: "2 480", delta: "+8%", up: true },
  { label: "GMV", val: "18 240 €", delta: "+12%", up: true },
  { label: "Reporters actifs", val: "312", delta: "-2%", up: false },
];

export default function AdminAnalyticsPage() {
  const { history } = useMission();
  const sessionCompleted = history.filter((m) => m.status === "done").length;

  return (
    <>
      <div style={{ marginBottom: 24 }}>
        <Dateline>Chiffres</Dateline>
        <h1 className="sf-display" style={{ fontSize: 24 }}>Analytics</h1>
        <p style={{ fontSize: 13, color: "var(--slate)" }}>Vue d'ensemble plateforme · 30 derniers jours</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 28 }}>
        <Card>
          <div style={{ fontSize: 12, color: "var(--slate)", marginBottom: 8 }}>Missions réalisées</div>
          <div className="sf-mono" style={{ fontSize: 22, fontWeight: 600, marginBottom: 4 }}>1 902</div>
          <div className="sf-mono" style={{ fontSize: 11.5, color: "var(--slate-2)" }}>
            dont {sessionCompleted} cette session (données réelles)
          </div>
        </Card>
        {KPIS.map((k) => (
          <Card key={k.label}>
            <div style={{ fontSize: 12, color: "var(--slate)", marginBottom: 8 }}>{k.label}</div>
            <div className="sf-mono" style={{ fontSize: 22, fontWeight: 600, marginBottom: 4 }}>{k.val}</div>
            <div className="sf-mono" style={{ fontSize: 11.5, display: "flex", alignItems: "center", gap: 4, color: k.up ? "var(--verified)" : "var(--signal)" }}>
              {k.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}{k.delta}
            </div>
          </Card>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 18 }}>
        <Card>
          <div style={{ fontSize: 14.5, fontWeight: 600, marginBottom: 16 }}>Missions par jour</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 140 }}>
            {[42, 58, 39, 71, 64, 80, 55].map((v, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, height: "100%", justifyContent: "flex-end" }}>
                <div style={{ width: "100%", height: `${(v / 80) * 100}%`, borderRadius: "6px 6px 2px 2px", background: "var(--ink)" }} />
                <span className="sf-mono" style={{ fontSize: 10.5, color: "var(--slate-2)" }}>{["L", "M", "M", "J", "V", "S", "D"][i]}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <div style={{ fontSize: 14.5, fontWeight: 600, marginBottom: 16 }}>Croissance des inscriptions</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
              <span>Participants</span>
              <span className="sf-mono">+184 <ArrowUpRight size={11} style={{ verticalAlign: "-1px" }} /></span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
              <span>Reporters</span>
              <span className="sf-mono">+22 <ArrowUpRight size={11} style={{ verticalAlign: "-1px" }} /></span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
              <span>Taux de conversion</span>
              <span className="sf-mono">4,2%</span>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
