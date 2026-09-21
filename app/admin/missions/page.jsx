"use client";

import React from "react";
import { MapPin, Star } from "lucide-react";
import Card from "@/components/ui/Card";
import Dateline from "@/components/ui/Dateline";
import Badge from "@/components/ui/Badge";
import { useMission } from "@/lib/context/MissionContext";

const REFERENCE_MISSIONS = [
  { id: "#28402", participant: "Léa", reporter: "—", place: "Paris 3e", amount: "12 €", status: "Terminée" },
  { id: "#28355", participant: "David", reporter: "Karim", place: "Paris 9e", amount: "7 €", status: "Annulée" },
];

export default function AdminMissionsPage() {
  // Cette page lit le MÊME MissionContext que /explorer, /payment, /live et
  // /r/*. Une mission réservée pendant cette session navigateur apparaît
  // ici en plus des données de référence — preuve que l'admin observe le
  // même état que le reste du produit, pas une copie mockée séparée.
  const { activeMission, history } = useMission();

  const liveRows = [
    ...(activeMission ? [{ ...activeMission, id: activeMission.id.toUpperCase(), live: true }] : []),
    ...history.map((m) => ({ ...m, id: m.id.toUpperCase() })),
  ];

  return (
    <>
      <div style={{ marginBottom: 24 }}>
        <Dateline>Registre</Dateline>
        <h1 className="sf-display" style={{ fontSize: 24 }}>Missions</h1>
        <p style={{ fontSize: 13, color: "var(--slate)" }}>1 902 missions ce mois-ci</p>
      </div>

      {liveRows.length > 0 && (
        <>
          <div style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--slate)", marginBottom: 12 }}>
            SESSION EN COURS (données réelles du contexte partagé)
          </div>
          <Card padding={0} style={{ marginBottom: 24 }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["Mission", "Reporter", "Participant", "Lieu", "Montant", "Statut"].map((h) => (
                    <th key={h} className="sf-mono" style={{ textAlign: "left", fontSize: 10.5, textTransform: "uppercase", color: "var(--slate-2)", padding: "11px 20px", borderBottom: "1px solid var(--line)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {liveRows.map((m, i) => (
                  <tr key={i}>
                    <td className="sf-mono" style={{ padding: "13px 20px", borderBottom: "1px solid var(--line)", fontSize: 12.5 }}>{m.id}</td>
                    <td style={{ padding: "13px 20px", borderBottom: "1px solid var(--line)", fontSize: 13.5 }}>{m.reporterName}</td>
                    <td style={{ padding: "13px 20px", borderBottom: "1px solid var(--line)", fontSize: 12.5 }}>
                      {m.participantName ? (
                        <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                          {m.participantName}
                          {m.participantRating != null && (
                            <span className="sf-mono" style={{ color: "var(--slate)", display: "flex", alignItems: "center", gap: 2 }}>
                              <Star size={10} fill="var(--ember)" color="var(--ember)" />{m.participantRating.toFixed(1)}
                            </span>
                          )}
                        </span>
                      ) : "—"}
                    </td>
                    <td style={{ padding: "13px 20px", borderBottom: "1px solid var(--line)", fontSize: 11.5, color: "var(--slate)" }}>
                      <MapPin size={11} style={{ verticalAlign: "-1px", marginRight: 3 }} />{m.place}
                    </td>
                    <td className="sf-mono" style={{ padding: "13px 20px", borderBottom: "1px solid var(--line)", fontSize: 12.5 }}>
                      {m.status === "done" ? `${m.finalPrice} €` : `~${m.preAuthEstimate} €`}
                    </td>
                    <td style={{ padding: "13px 20px", borderBottom: "1px solid var(--line)" }}>
                      <Badge tone={m.status === "cancelled" ? "slate" : m.status === "done" ? "verified" : "signal"}>
                        {{ requested: "En attente", confirmed: "Confirmée", live: "En direct", done: "Terminée", cancelled: "Annulée", no_reporter_available: "Sans Reporter" }[m.status] || m.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </>
      )}

      <div style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--slate)", marginBottom: 12 }}>DONNÉES DE RÉFÉRENCE</div>
      <Card padding={0}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["Mission", "Participant", "Reporter", "Lieu", "Montant", "Statut"].map((h) => (
                <th key={h} className="sf-mono" style={{ textAlign: "left", fontSize: 10.5, textTransform: "uppercase", color: "var(--slate-2)", padding: "11px 20px", borderBottom: "1px solid var(--line)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {REFERENCE_MISSIONS.map((m) => (
              <tr key={m.id}>
                <td className="sf-mono" style={{ padding: "13px 20px", borderBottom: "1px solid var(--line)", fontSize: 12.5 }}>{m.id}</td>
                <td style={{ padding: "13px 20px", borderBottom: "1px solid var(--line)", fontSize: 13.5 }}>{m.participant}</td>
                <td style={{ padding: "13px 20px", borderBottom: "1px solid var(--line)", fontSize: 13.5 }}>{m.reporter}</td>
                <td style={{ padding: "13px 20px", borderBottom: "1px solid var(--line)", fontSize: 11.5, color: "var(--slate)" }}>
                  <MapPin size={11} style={{ verticalAlign: "-1px", marginRight: 3 }} />{m.place}
                </td>
                <td className="sf-mono" style={{ padding: "13px 20px", borderBottom: "1px solid var(--line)", fontSize: 12.5 }}>{m.amount}</td>
                <td style={{ padding: "13px 20px", borderBottom: "1px solid var(--line)" }}>
                  <Badge tone={m.status === "Annulée" ? "slate" : "verified"}>{m.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}
