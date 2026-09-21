"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Clock, CheckCircle2, XCircle, Zap, Star } from "lucide-react";
import Header from "@/components/Header";
import Dateline from "@/components/ui/Dateline";
import RequireAuth from "@/components/RequireAuth";
import ReporterWarningGate from "@/components/ReporterWarningGate";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Toggle from "@/components/ui/Toggle";
import { REPORTERS } from "@/lib/mock-data";
import { findNearestOnlineReporter } from "@/lib/geo";
import { useMission } from "@/lib/context/MissionContext";

export default function ReporterDashboardPage() {
  return (
    <RequireAuth role="reporter">
      <ReporterWarningGate>
        <ReporterDashboardContent />
      </ReporterWarningGate>
    </RequireAuth>
  );
}

function ReporterDashboardContent() {
  const router = useRouter();
  const { activeMission, acceptDeadline, acceptMission, declineMission, startLive } = useMission();
  const [available, setAvailable] = useState(true);
  const [secondsLeft, setSecondsLeft] = useState(60);

  useEffect(() => {
    if (!acceptDeadline) return;
    const tick = setInterval(() => setSecondsLeft(Math.max(0, Math.round((acceptDeadline - Date.now()) / 1000))), 250);
    return () => clearInterval(tick);
  }, [acceptDeadline]);

  // Fallback basé sur une vraie proximité géographique (Haversine),
  // pas un choix arbitraire dans la liste — le Reporter en ligne le plus
  // proche du lieu de la mission est proposé ensuite.
  const handleDecline = () => {
    const next = findNearestOnlineReporter(REPORTERS, { lat: activeMission.lat, lng: activeMission.lng }, activeMission.reporterId);
    declineMission(next || null);
  };

  useEffect(() => {
    if (!acceptDeadline) return;
    if (secondsLeft === 0) handleDecline();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft]);

  const isRequestedForMe = activeMission && activeMission.status === "requested";
  const isConfirmed = activeMission && activeMission.status === "confirmed";

  return (
    <div>
      <Header />
      <div className="sf-wrap" style={{ paddingTop: 26, paddingBottom: 50 }}>
        <Dateline>Poste de veille</Dateline>
        <Card style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, marginTop: 6 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, fontWeight: 600 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: available ? "var(--verified)" : "var(--slate-2)" }} />
            {available ? "Disponible pour recevoir des missions" : "Indisponible"}
          </div>
          <Toggle on={available} onChange={setAvailable} />
        </Card>

        <div style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--slate)", marginBottom: 12 }}>
          {isRequestedForMe ? "NOUVELLE DEMANDE" : isConfirmed ? "MISSION À VENIR" : "MISSION"}
        </div>

        {isRequestedForMe && (
          <Card style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 15 }}>{activeMission.description || "Demande sans précision"}</div>
                <div style={{ fontSize: 12.5, color: "var(--slate)", display: "flex", alignItems: "center", gap: 5, marginTop: 3 }}>
                  <MapPin size={12} />{activeMission.place}
                </div>
              </div>
              <div className="sf-mono" style={{ fontSize: 16, fontWeight: 600 }}>~{activeMission.preAuthEstimate} €</div>
            </div>
            {activeMission.participantName && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <span style={{ fontSize: 12.5, fontWeight: 600 }}>{activeMission.participantName}</span>
                <Badge tone={activeMission.participantRating >= 4.2 ? "verified" : "signal"}>
                  <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
                    <Star size={10} fill="currentColor" />{activeMission.participantRating?.toFixed(1)} · {activeMission.participantMissionsCount} missions
                  </span>
                </Badge>
              </div>
            )}
            <div style={{ fontSize: 12, color: "var(--slate)", marginBottom: 14 }}>
              {activeMission.scheduleMode === "now" ? "Maintenant" : `Programmé · ${activeMission.scheduledAt?.replace("T", " ")}`} · {activeMission.duration}
            </div>
            <div className="sf-mono" style={{ fontSize: 13, color: "var(--signal)", marginBottom: 14 }}>
              {secondsLeft}s pour répondre
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <Button full variant="secondary" onClick={handleDecline}><XCircle size={16} />Refuser</Button>
              <Button full onClick={acceptMission}><CheckCircle2 size={16} />Accepter</Button>
            </div>
          </Card>
        )}

        {isConfirmed && (
          <Card style={{ marginBottom: 24 }}>
            <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>{activeMission.reporterName ? activeMission.description : "Mission"}</div>
            <div style={{ fontSize: 12.5, color: "var(--slate)", display: "flex", alignItems: "center", gap: 5, marginBottom: 14 }}>
              <MapPin size={12} />{activeMission.place}
            </div>
            {activeMission.scheduleMode === "scheduled" && (
              <div style={{ fontSize: 12.5, color: "var(--slate)", marginBottom: 14 }}>
                Prévue le {activeMission.scheduledAt?.replace("T", " à ")} — démarrez le live une fois sur place.
              </div>
            )}
            <Button full onClick={() => { startLive(); router.push("/r/mission"); }}>
              <Zap size={15} />Démarrer le live
            </Button>
          </Card>
        )}

        {!activeMission && (
          <Card style={{ textAlign: "center", padding: "36px 20px", color: "var(--slate)", fontSize: 13.5, marginBottom: 24 }}>
            Aucune demande en attente. Elle apparaîtra ici dès qu'un Participant vous sollicitera depuis Explorer.
          </Card>
        )}
      </div>
    </div>
  );
}
