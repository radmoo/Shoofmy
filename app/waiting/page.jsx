"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Clock, MapPin, X } from "lucide-react";
import Header from "@/components/Header";
import Dateline from "@/components/ui/Dateline";
import RequireAuth from "@/components/RequireAuth";
import Button from "@/components/ui/Button";
import { useMission } from "@/lib/context/MissionContext";

export default function WaitingPage() {
  return (
    <RequireAuth role="participant">
      <WaitingContent />
    </RequireAuth>
  );
}

function WaitingContent() {
  const router = useRouter();
  const { activeMission, acceptDeadline, noShowDeadline, cancelMission, recordNoShow } = useMission();
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [noShowSecondsLeft, setNoShowSecondsLeft] = useState(0);

  useEffect(() => {
    if (!acceptDeadline) return;
    const tick = setInterval(() => setSecondsLeft(Math.max(0, Math.round((acceptDeadline - Date.now()) / 1000))), 250);
    return () => clearInterval(tick);
  }, [acceptDeadline]);

  useEffect(() => {
    if (!noShowDeadline) return;
    const tick = setInterval(() => {
      const left = Math.max(0, Math.round((noShowDeadline - Date.now()) / 1000));
      setNoShowSecondsLeft(left);
      // Grâce écoulée sans démarrage du live : no-show avéré (section 10).
      if (left === 0) recordNoShow();
    }, 250);
    return () => clearInterval(tick);
  }, [noShowDeadline, recordNoShow]);

  useEffect(() => {
    if (!activeMission) return;
    if (activeMission.status === "live") router.replace("/live");
  }, [activeMission, router]);

  if (!activeMission) {
    return (
      <div>
        <Header leftIcon="back" />
        <div className="sf-wrap" style={{ paddingTop: 40, textAlign: "center" }}>
          <Dateline center>Statut</Dateline>
          <p style={{ color: "var(--slate)", marginBottom: 16 }}>Aucune demande en cours — le Reporter n'est peut-être pas venu (no-show), auquel cas vous avez été intégralement remboursé.</p>
          <Button onClick={() => router.push("/explorer")}>Explorer les Reporters</Button>
        </div>
      </div>
    );
  }

  if (activeMission.status === "no_reporter_available") {
    return (
      <div>
        <Header leftIcon="back" />
        <div className="sf-wrap" style={{ paddingTop: 60, textAlign: "center" }}>
          <Dateline center tone="signal">Statut</Dateline>
          <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>Aucun Reporter disponible pour l'instant</p>
          <p style={{ fontSize: 13.5, color: "var(--slate)", marginBottom: 24 }}>
            Tous les Reporters à proximité ont décliné. Retournez à la carte pour en choisir un autre.
          </p>
          <Button onClick={() => router.push("/explorer")}>Retour à la carte</Button>
        </div>
      </div>
    );
  }

  if (activeMission.status === "confirmed" && activeMission.scheduleMode === "scheduled") {
    return (
      <div>
        <Header leftIcon="back" />
        <div className="sf-wrap" style={{ paddingTop: 60, textAlign: "center" }}>
          <div style={{ width: 60, height: 60, borderRadius: "50%", background: "rgba(23,185,120,0.12)", color: "var(--verified)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <Clock size={26} />
          </div>
          <Dateline center>Confirmé</Dateline>
          <h2 className="sf-display" style={{ fontSize: 20, marginBottom: 8 }}>Mission confirmée</h2>
          <p style={{ fontSize: 13.5, color: "var(--slate)" }}>
            {activeMission.reporterName} se rendra sur place le {activeMission.scheduledAt?.replace("T", " à ")}.
            Le live démarrera à ce moment-là — vous serez notifié.
          </p>
        </div>
      </div>
    );
  }

  // Confirmé, mode "maintenant" : le Reporter a accepté mais n'a pas
  // encore démarré le live. On affiche le délai de grâce avant no-show,
  // et l'annulation ici coûte des frais (le Reporter a bloqué du temps).
  if (activeMission.status === "confirmed" && activeMission.scheduleMode === "now") {
    return (
      <div>
        <Header leftIcon="back" />
        <div className="sf-wrap" style={{ paddingTop: 60, textAlign: "center", maxWidth: 380 }}>
          <Dateline center tone="signal">En route</Dateline>
        <div className="sf-mono" style={{ fontSize: 34, fontWeight: 600, marginBottom: 8 }}>{noShowSecondsLeft}s</div>
          <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>{activeMission.reporterName} a accepté, en route</p>
          <p style={{ fontSize: 13, color: "var(--slate)", display: "flex", alignItems: "center", justifyContent: "center", gap: 5, marginBottom: 24 }}>
            <MapPin size={12} />{activeMission.place}
          </p>
          <p style={{ fontSize: 12, color: "var(--slate-2)", marginBottom: 30 }}>
            S'il ne démarre pas le live avant la fin du délai, la mission est annulée, vous êtes intégralement
            remboursé et un signalement est enregistré sur son profil.
          </p>
          <Button
            full
            variant="secondary"
            onClick={() => { cancelMission(); router.push("/explorer"); }}
          >
            <X size={15} />Annuler (frais : {Math.round(activeMission.preAuthEstimate * 0.3 * 100) / 100} €)
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header leftIcon="back" />
      <div className="sf-wrap" style={{ paddingTop: 60, textAlign: "center", maxWidth: 380 }}>
        <Dateline center>En attente de réponse</Dateline>
        <div className="sf-mono" style={{ fontSize: 34, fontWeight: 600, marginBottom: 8 }}>{secondsLeft}s</div>
        <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>En attente de {activeMission.reporterName}</p>
        <p style={{ fontSize: 13, color: "var(--slate)", display: "flex", alignItems: "center", justifyContent: "center", gap: 5, marginBottom: 30 }}>
          <MapPin size={12} />{activeMission.place}
        </p>
        <p style={{ fontSize: 12, color: "var(--slate-2)", marginBottom: 30 }}>
          S'il n'accepte pas dans les 60 secondes, on propose automatiquement le Reporter suivant disponible.
          Annuler maintenant est gratuit — le Reporter n'a encore rien bloqué.
        </p>
        <Button full variant="secondary" onClick={() => { cancelMission(); router.push("/explorer"); }}>
          <X size={15} />Annuler la demande (gratuit)
        </Button>
      </div>
    </div>
  );
}
