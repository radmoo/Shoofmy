"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Play, Pause, MapPin, Star } from "lucide-react";
import Header from "@/components/Header";
import Dateline from "@/components/ui/Dateline";
import RequireAuth from "@/components/RequireAuth";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { useMission } from "@/lib/context/MissionContext";
import { REPORTERS } from "@/lib/mock-data";

export default function ReplayPage({ params }) {
  return (
    <RequireAuth role="participant">
      <ReplayContent params={params} />
    </RequireAuth>
  );
}

function ReplayContent({ params }) {
  const router = useRouter();
  const { history } = useMission();
  const [playing, setPlaying] = useState(false);

  // Le replay n'existe QUE pour une mission réellement présente dans
  // l'historique du contexte — pas de vidéo fictive pour un id inventé.
  // C'est /history qui doit fournir ce lien avec le bon m.id.
  const mission = history.find((m) => m.id === params.id);

  if (!mission) {
    return (
      <div>
        <Header leftIcon="back" />
        <div className="sf-wrap" style={{ paddingTop: 40, textAlign: "center", color: "var(--slate)" }}>
          Aucun replay trouvé pour cette mission (id introuvable dans l'historique de cette session).
        </div>
      </div>
    );
  }

  // Fiche Reporter (note, langues...) — la mission ne stocke que le nom,
  // le reste vient du mock via l'id, comme /history le fait déjà pour
  // d'autres écrans.
  const reporter = REPORTERS.find((r) => r.id === mission.reporterId);
  const filmedMinutes = Math.max(1, Math.round((mission.elapsedSeconds || 0) / 60));

  return (
    <div>
      <Header leftIcon="back" />
      <div className="sf-wrap" style={{ paddingTop: 26, paddingBottom: 50, maxWidth: 640 }}>
        <Dateline>Replay · Mission terminée</Dateline>
        <h1 className="sf-display" style={{ fontSize: 22, marginBottom: 18 }}>{mission.description || "Mission"}</h1>

        <div
          onClick={() => setPlaying((p) => !p)}
          style={{
            aspectRatio: "16/9", borderRadius: "var(--radius-l)", marginBottom: 20, cursor: "pointer", position: "relative",
            background: "linear-gradient(160deg, var(--surface-2), var(--ink))",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "var(--shadow-lift)", overflow: "hidden",
          }}
        >
          <div style={{ position: "absolute", top: 14, left: 14 }}>
            <Badge tone="slate">REPLAY</Badge>
          </div>
          <div style={{ width: 60, height: 60, borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {playing ? <Pause size={24} color="#fff" /> : <Play size={24} color="#fff" style={{ marginLeft: 3 }} />}
          </div>
        </div>

        {/* Identité du Reporter — la vidéo seule ne dit pas qui a filmé */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15.5 }}>{mission.reporterName}</div>
            <div style={{ fontSize: 12.5, color: "var(--slate)", display: "flex", alignItems: "center", gap: 5, marginTop: 2 }}>
              <MapPin size={12} />{mission.place}
            </div>
          </div>
          {reporter?.rating && (
            <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, fontWeight: 600 }}>
              <Star size={13} style={{ color: "var(--amber)" }} fill="var(--amber)" />{reporter.rating}
            </div>
          )}
        </div>

        {/* Résumé chiffré honnête — écho direct à la promesse de
           l'accueil ("vous payez le temps réellement filmé") : on montre
           la durée réservée à côté de la durée vraiment filmée, pas
           qu'un prix isolé qui laisserait planer le doute. */}
        <Card style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <div className="sf-mono" style={{ fontSize: 10.5, color: "var(--slate)", textTransform: "uppercase", marginBottom: 4 }}>Réservé</div>
            <div style={{ fontSize: 15, fontWeight: 600 }}>{mission.duration}</div>
          </div>
          <div>
            <div className="sf-mono" style={{ fontSize: 10.5, color: "var(--slate)", textTransform: "uppercase", marginBottom: 4 }}>Filmé</div>
            <div style={{ fontSize: 15, fontWeight: 600 }}>{filmedMinutes} min</div>
          </div>
          <div>
            <div className="sf-mono" style={{ fontSize: 10.5, color: "var(--slate)", textTransform: "uppercase", marginBottom: 4 }}>Payé</div>
            <div style={{ fontSize: 15, fontWeight: 600 }}>{mission.finalPrice} €</div>
          </div>
        </Card>

        {/* Le pilotage du direct (instructions envoyées) est le coeur
           différenciant du produit, mais restait invisible en replay
           alors que mission.messages existe déjà — on l'expose ici
           comme un vrai transcript, pas juste une vidéo passive. */}
        {mission.messages?.length > 0 && (
          <>
            <Dateline>Instructions pendant le direct</Dateline>
            <Card style={{ marginBottom: 24, display: "flex", flexDirection: "column", gap: 10 }}>
              {mission.messages.map((m, i) => (
                <div key={i} style={{ fontSize: 13, lineHeight: 1.4 }}>
                  <span style={{ fontWeight: 700, color: m.from === "participant" ? "var(--signal)" : "var(--ink)" }}>
                    {m.from === "participant" ? "Vous" : mission.reporterName}
                  </span>
                  <span style={{ color: "var(--slate)" }}> — {m.text}</span>
                </div>
              ))}
            </Card>
          </>
        )}

        {/* Petit mot de fermeture — le produit vend un moment vécu, pas
           juste un transcript ; une ligne discrète suffit, pas besoin
           d'une section à part qui alourdirait la page. */}
        <p style={{ fontSize: 13, fontStyle: "italic", color: "var(--slate)", textAlign: "center", marginBottom: 24 }}>
          Merci d'avoir utilisé Shoofmy — on espère que ce moment vous a plu.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {mission.reporterId && (
            <Button full onClick={() => router.push(`/reporter/${mission.reporterId}`)}>
              Réserver à nouveau ce Reporter
            </Button>
          )}
          <Button full variant="secondary" onClick={() => router.push("/history")}>
            Retour à l'historique
          </Button>
        </div>
      </div>
    </div>
  );
}
