"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Star, MapPin, Zap, CalendarClock, ShieldCheck, Phone, Lock } from "lucide-react";
import Header from "@/components/Header";
import Card from "@/components/ui/Card";
import ReporterAvatar from "@/components/ui/ReporterAvatar";
import Button from "@/components/ui/Button";
import { REPORTERS, DURATIONS } from "@/lib/mock-data";
import { useMission } from "@/lib/context/MissionContext";
import { useSession } from "@/lib/context/SessionContext";

// La fiche Reporter reste ouverte sans connexion — un visiteur peut voir
// le profil, les tarifs et les badges de confiance avant de s'engager.
// La connexion n'est demandée qu'au clic sur "Réserver" (voir
// handleContinue plus bas), pas à l'arrivée sur la page.
export default function ReporterBookingPage({ params }) {
  return <ReporterBookingContent params={params} />;
}

function ReporterBookingContent({ params }) {
  const router = useRouter();
  const { requestBooking } = useMission();
  const { user, isAuthenticated } = useSession();
  const reporter = REPORTERS.find((r) => r.id === params.id);
  const [scheduleMode, setScheduleMode] = useState(reporter?.online ? "now" : "scheduled");
  const [durationIdx, setDurationIdx] = useState(1);
  const [description, setDescription] = useState("");
  const [instructions, setInstructions] = useState("");
  const [language, setLanguage] = useState(reporter?.languages?.[0] || "");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");

  if (!reporter) {
    return (
      <div>
        <Header leftIcon="back" />
        <div className="sf-wrap" style={{ paddingTop: 40 }}>Reporter introuvable.</div>
      </div>
    );
  }

  const selected = DURATIONS[durationIdx];
  const canSubmit = scheduleMode === "now" ? reporter.online : scheduledDate && scheduledTime;

  const handleContinue = () => {
    if (!canSubmit) return;
    // Pas connecté : on n'essaie pas de réserver "à vide" — on renvoie
    // vers la connexion, avec un retour direct sur cette fiche une fois
    // fait (voir app/login/page.jsx, lecture du paramètre ?redirect=).
    if (!isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent(`/reporter/${reporter.id}`)}`);
      return;
    }
    requestBooking(reporter, {
      duration: selected.mins,
      pricePerMinute: +(selected.price / selected.minutes).toFixed(2),
      preAuthEstimate: selected.price,
      description,
      instructions,
      language,
      scheduleMode,
      scheduledAt: scheduleMode === "scheduled" ? `${scheduledDate}T${scheduledTime}` : null,
      participantName: user?.name,
      participantRating: user?.rating,
      participantMissionsCount: user?.missionsCount,
    });
    router.push("/payment");
  };

  return (
    <div>
      <Header leftIcon="back" />
      <div className="sf-wrap" style={{ paddingTop: 26, paddingBottom: 50 }}>
        <Card style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 22 }}>
          <ReporterAvatar reporter={reporter} size={56} />
          <div>
            <div className="sf-display" style={{ fontSize: 18 }}>{reporter.name}</div>
            <div style={{ fontSize: 12.5, color: "var(--slate)", display: "flex", gap: 12, marginTop: 3 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <Star size={12} fill="var(--ember)" color="var(--ember)" />{reporter.rating}
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <MapPin size={12} />{reporter.place}
              </span>
            </div>
            {reporter.languages?.length > 0 && (
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
                {reporter.languages.map((lang) => (
                  <span
                    key={lang}
                    className="sf-mono"
                    style={{ fontSize: 10.5, background: "var(--cloud)", color: "var(--slate)", padding: "3px 8px", borderRadius: 999 }}
                  >
                    {lang}
                  </span>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Confiance — le Participant confie de l'argent + une mission à
           quelqu'un qu'il ne connaît pas, ça doit se voir avant tout le reste. */}
        {reporter.verified && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 22 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11.5, fontWeight: 600, color: "var(--verified)", background: "rgba(23,185,120,0.1)", padding: "6px 11px", borderRadius: 999 }}>
              <ShieldCheck size={13} />Identité vérifiée
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11.5, fontWeight: 600, color: "var(--verified)", background: "rgba(23,185,120,0.1)", padding: "6px 11px", borderRadius: 999 }}>
              <Phone size={13} />Téléphone vérifié
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11.5, fontWeight: 600, color: "var(--slate)", background: "var(--cloud-2)", padding: "6px 11px", borderRadius: 999 }}>
              {reporter.missionsCount} missions réalisées
            </span>
          </div>
        )}

        {/* Mode maintenant vs programmé — section 6 du cahier des charges,
           deux comportements distincts, pas un simple bouton parmi d'autres. */}
        <div style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--slate)", marginBottom: 10 }}>MODE</div>
        <div style={{ display: "flex", gap: 10, marginBottom: 22 }}>
          <div
            onClick={() => reporter.online && setScheduleMode("now")}
            style={{
              flex: 1, padding: "14px 14px", borderRadius: "var(--radius-m)", cursor: reporter.online ? "pointer" : "not-allowed",
              opacity: reporter.online ? 1 : 0.4,
              border: `1.5px solid ${scheduleMode === "now" ? "var(--ink)" : "var(--line)"}`,
              background: scheduleMode === "now" ? "var(--ink)" : "var(--cloud-2)",
              color: scheduleMode === "now" ? "#fff" : "var(--ink)",
            }}
          >
            <Zap size={16} style={{ marginBottom: 6 }} />
            <div style={{ fontSize: 13.5, fontWeight: 600 }}>Maintenant</div>
            <div style={{ fontSize: 11, opacity: 0.75 }}>{reporter.online ? "Reporter en ligne" : "Indisponible tout de suite"}</div>
          </div>
          <div
            onClick={() => setScheduleMode("scheduled")}
            style={{
              flex: 1, padding: "14px 14px", borderRadius: "var(--radius-m)", cursor: "pointer",
              border: `1.5px solid ${scheduleMode === "scheduled" ? "var(--ink)" : "var(--line)"}`,
              background: scheduleMode === "scheduled" ? "var(--ink)" : "var(--cloud-2)",
              color: scheduleMode === "scheduled" ? "#fff" : "var(--ink)",
            }}
          >
            <CalendarClock size={16} style={{ marginBottom: 6 }} />
            <div style={{ fontSize: 13.5, fontWeight: 600 }}>Programmé</div>
            <div style={{ fontSize: 11, opacity: 0.75 }}>Choisir une date/heure</div>
          </div>
        </div>

        {scheduleMode === "scheduled" && (
          <div style={{ display: "flex", gap: 10, marginBottom: 22 }}>
            <Card style={{ flex: 1, padding: "0 14px" }}>
              <input type="date" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} style={{ border: "none", outline: "none", padding: "13px 0", fontSize: 14, width: "100%" }} />
            </Card>
            <Card style={{ flex: 1, padding: "0 14px" }}>
              <input type="time" value={scheduledTime} onChange={(e) => setScheduledTime(e.target.value)} style={{ border: "none", outline: "none", padding: "13px 0", fontSize: 14, width: "100%" }} />
            </Card>
          </div>
        )}

        <div style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--slate)", marginBottom: 12 }}>DURÉE ESTIMÉE</div>
        <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
          {DURATIONS.map((d, i) => (
            <div
              key={d.mins}
              onClick={() => setDurationIdx(i)}
              style={{
                flex: 1, textAlign: "center", padding: "14px 8px", borderRadius: "var(--radius-m)",
                border: `1.5px solid ${i === durationIdx ? "var(--ink)" : "var(--line)"}`,
                background: i === durationIdx ? "var(--ink)" : "var(--cloud-2)",
                color: i === durationIdx ? "#fff" : "var(--ink)", cursor: "pointer",
              }}
            >
              <div style={{ fontWeight: 600, fontSize: 14 }}>{d.mins}</div>
              <div className="sf-mono" style={{ fontSize: 12, opacity: 0.75 }}>~{d.price} €</div>
            </div>
          ))}
        </div>

        <div style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--slate)", marginBottom: 8 }}>CE QUE VOUS VOULEZ VOIR</div>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ex. montrez-moi l'ambiance en terrasse, chaque pièce de l'appartement…"
          style={{ width: "100%", height: 70, border: "1px solid var(--line)", borderRadius: "var(--radius-s)", padding: 14, fontSize: 14, marginBottom: 16, resize: "none" }}
        />

        {reporter.languages?.length > 0 && (
          <>
            <div style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--slate)", marginBottom: 8 }}>LANGUE SOUHAITÉE</div>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              style={{ width: "100%", fontSize: 14, padding: "12px 14px", borderRadius: "var(--radius-s)", border: "1px solid var(--line)", background: "#fff", color: "var(--ink)", marginBottom: 16 }}
            >
              {reporter.languages.map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </>
        )}

        <div style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--slate)", marginBottom: 8 }}>INSTRUCTIONS PARTICULIÈRES (FACULTATIF)</div>
        <textarea
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder="Ex. sonnez à l'interphone nom DUPONT, évitez de filmer les visages"
          style={{ width: "100%", height: 60, border: "1px solid var(--line)", borderRadius: "var(--radius-s)", padding: 14, fontSize: 14, marginBottom: 8, resize: "none" }}
        />
        <p style={{ fontSize: 11.5, color: "var(--slate-2)", marginBottom: 10 }}>
          {selected.price} € maximum seront réservés. Vous ne payez que la durée réellement effectuée.
        </p>
        <p style={{ fontSize: 11.5, color: "var(--slate)", display: "flex", alignItems: "center", gap: 6, marginBottom: 26 }}>
          <Lock size={12} />Shoofmy protège votre paiement jusqu'à la fin de la mission.
        </p>

        <Button full disabled={!canSubmit} onClick={handleContinue}>
          {isAuthenticated ? `Réserver la mission · ~${selected.price} €` : "Se connecter pour réserver"}
        </Button>
      </div>
    </div>
  );
}
