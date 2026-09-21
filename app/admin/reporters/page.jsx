"use client";

import { Star, MapPin, CheckCircle2, ChevronRight, AlertTriangle } from "lucide-react";
import Card from "@/components/ui/Card";
import Avatar from "@/components/ui/Avatar";
import ReporterAvatar from "@/components/ui/ReporterAvatar";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { ADMIN_REPORTERS_PENDING, ADMIN_REPORTERS_ACTIVE, REPORTERS } from "@/lib/mock-data";
import { useMission } from "@/lib/context/MissionContext";

export default function AdminReportersPage() {
  const { reporterStrikes } = useMission();

  // ADMIN_REPORTERS_ACTIVE ne couvre que 3 Reporters de référence, mais
  // une mission (donc un strike potentiel) peut concerner n'importe
  // lequel des 97 de REPORTERS. Sans ce complément, un strike sur un
  // Reporter hors de la liste de référence resterait invisible ici.
  const referencedIds = new Set(ADMIN_REPORTERS_ACTIVE.map((r) => r.reporterId));
  const extraFlagged = Object.keys(reporterStrikes)
    .filter((id) => reporterStrikes[id] > 0 && !referencedIds.has(id))
    .map((id) => {
      const match = REPORTERS.find((r) => r.id === id);
      return match
        ? { reporterId: id, name: match.name, city: match.city, rating: match.rating.toFixed(1).replace(".", ","), missions: match.missionsCount, badge: null }
        : null;
    })
    .filter(Boolean);

  const displayedReporters = [...ADMIN_REPORTERS_ACTIVE, ...extraFlagged];

  return (
    <>
      <div style={{ marginBottom: 24 }}>
        <h1 className="sf-display" style={{ fontSize: 24 }}>Reporters</h1>
        <p style={{ fontSize: 13, color: "var(--slate)" }}>312 actifs · {ADMIN_REPORTERS_PENDING.length} candidatures en attente</p>
      </div>

      <div style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--slate)", marginBottom: 12 }}>CANDIDATURES EN ATTENTE</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 14, marginBottom: 28 }}>
        {ADMIN_REPORTERS_PENDING.map((r) => (
          <Card key={r.name}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <Avatar name={r.name} size={36} />
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 600 }}>{r.name}</div>
                <div style={{ fontSize: 11.5, color: "var(--slate)" }}>{r.city} · {r.submitted}</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Button full variant="primary" style={{ padding: "8px", fontSize: 12 }}>
                <CheckCircle2 size={13} />Approuver
              </Button>
              <Button full variant="secondary" style={{ padding: "8px", fontSize: 12 }}>Rejeter</Button>
            </div>
          </Card>
        ))}
      </div>

      <div style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--slate)", marginBottom: 12 }}>REPORTERS ACTIFS</div>
      <Card padding={0}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["Reporter", "Ville", "Note", "Missions", "Statut", "Strikes", ""].map((h) => (
                <th key={h} className="sf-mono" style={{ textAlign: "left", fontSize: 10.5, textTransform: "uppercase", color: "var(--slate-2)", padding: "11px 20px", borderBottom: "1px solid var(--line)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayedReporters.map((r) => {
              const full = REPORTERS.find((fr) => fr.id === r.reporterId);
              return (
              <tr key={r.reporterId}>
                <td style={{ padding: "13px 20px", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", gap: 10 }}>
                  {full ? <ReporterAvatar reporter={full} size={30} /> : <Avatar name={r.name} size={30} />}{r.name}
                </td>
                <td style={{ padding: "13px 20px", borderBottom: "1px solid var(--line)", fontSize: 11.5, color: "var(--slate)" }}>
                  <MapPin size={11} style={{ verticalAlign: "-1px", marginRight: 3 }} />{r.city}
                </td>
                <td className="sf-mono" style={{ padding: "13px 20px", borderBottom: "1px solid var(--line)", fontSize: 12.5 }}>
                  <Star size={11} fill="var(--ember)" color="var(--ember)" style={{ verticalAlign: "-1px", marginRight: 3 }} />{r.rating}
                </td>
                <td className="sf-mono" style={{ padding: "13px 20px", borderBottom: "1px solid var(--line)", fontSize: 12.5 }}>{r.missions}</td>
                <td style={{ padding: "13px 20px", borderBottom: "1px solid var(--line)" }}>
                  {r.badge ? <Badge tone="ember">{r.badge}</Badge> : <Badge tone="verified">Actif</Badge>}
                </td>
                <td style={{ padding: "13px 20px", borderBottom: "1px solid var(--line)" }}>
                  {(reporterStrikes[r.reporterId] || 0) > 0 ? (
                    <span style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--signal)", fontSize: 12.5 }}>
                      <AlertTriangle size={12} />{reporterStrikes[r.reporterId]}
                    </span>
                  ) : (
                    <span style={{ fontSize: 12.5, color: "var(--slate-2)" }}>—</span>
                  )}
                </td>
                <td style={{ padding: "13px 20px", borderBottom: "1px solid var(--line)" }}><ChevronRight size={15} color="var(--slate-2)" /></td>
              </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </>
  );
}
