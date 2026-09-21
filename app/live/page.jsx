"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Mic, Send, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, X } from "lucide-react";
import Header from "@/components/Header";
import Dateline from "@/components/ui/Dateline";
import RequireAuth from "@/components/RequireAuth";
import Button from "@/components/ui/Button";
import { useMission } from "@/lib/context/MissionContext";
import { useLiveTheme } from "@/lib/useLiveTheme";
import { translateFromFrench } from "@/lib/translate";

// Le D-pad remplace les quick instructions textuelles : 4 directions
// (Avance / Recule / Gauche / Droite) envoyées comme messages du
// Participant, plus lisibles et plus rapides à taper au pouce qu'une
// rangée de pills à faire défiler.

export default function LivePage() {
  return (
    <RequireAuth role="participant">
      <LiveContent />
    </RequireAuth>
  );
}

function LiveVideoBackground() {
  // Vidéo de démo en fond (pas un vrai flux caméra — pas de WebRTC à ce
  // stade). muted+autoplay+loop obligatoires pour la lecture auto sur
  // mobile. pointer-events none : la vidéo est purement décorative, les
  // clics passent à travers vers les contrôles superposés.
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      <iframe
        src="https://www.youtube.com/embed/LSMBJxoC7rI?autoplay=1&mute=1&loop=1&playlist=LSMBJxoC7rI&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&cc_load_policy=0&disablekb=1"
        title="Fond vidéo de démo"
        allow="autoplay; encrypted-media"
        style={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          width: "177.78vh", height: "100vh", minWidth: "100%", minHeight: "177.78vw", border: "none",
        }}
      />
    </div>
  );
}

function DPadButton({ area, active, onClick, radius, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        gridArea: area,
        border: "1px solid rgba(255,255,255,0.2)",
        borderRadius: radius,
        background: active ? "var(--signal)" : "rgba(255,255,255,0.08)",
        color: "#fff",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "background 0.15s ease",
      }}
    >
      {children}
    </button>
  );
}

function LiveContent() {
  const router = useRouter();
  const { activeMission, sendMessage, tickElapsed, endMission } = useMission();
  useLiveTheme(activeMission?.status === "live");
  const [draft, setDraft] = useState("");
  const [micOn, setMicOn] = useState(false);
  const [micSupported, setMicSupported] = useState(true);
  const [translating, setTranslating] = useState(false);
  const [pressedDir, setPressedDir] = useState(null); // flash bref au tap ("up"/"down"/"left"/"right")
  const [confirmEnd, setConfirmEnd] = useState(false);
  const scrollRef = useRef(null);
  const recognitionRef = useRef(null);
  const activeMissionRef = useRef(activeMission);
  const sendMessageRef = useRef(sendMessage);
  useEffect(() => {
    activeMissionRef.current = activeMission;
    sendMessageRef.current = sendMessage;
  }, [activeMission, sendMessage]);

  // Garde l'id de la mission tant qu'elle est "live" — quand le Reporter
  // raccroche (endMission), activeMission repasse à null et on perdrait
  // l'id juste au moment où on en a besoin pour retrouver son replay.
  const liveMissionIdRef = useRef(null);
  useEffect(() => {
    if (activeMission?.status === "live") {
      liveMissionIdRef.current = activeMission.id;
    }
  }, [activeMission?.status, activeMission?.id]);

  useEffect(() => {
    // La mission qu'on suivait vient de se terminer côté Reporter :
    // direction le replay, plutôt que de laisser le Participant sur un
    // écran générique "rien en cours" qui donne l'impression d'un plantage.
    if (!activeMission && liveMissionIdRef.current) {
      const id = liveMissionIdRef.current;
      liveMissionIdRef.current = null;
      router.replace(`/replay/${id}`);
    }
  }, [activeMission, router]);

  // Même logique que côté Reporter (r/mission) : le compteur doit
  // avancer aussi sur l'écran du Participant, indépendamment de si
  // l'autre page est ouverte ou non.
  useEffect(() => {
    if (!activeMission || activeMission.status !== "live") return;
    const t = setInterval(tickElapsed, 1000);
    return () => clearInterval(t);
  }, [activeMission?.status, tickElapsed]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [activeMission?.messages?.length]);

  // Reconnaissance vocale (Web Speech API) : le micro transcrit le
  // français en direct dans le champ texte, puis à la fin de la phrase
  // (silence détecté par le navigateur) le message est traduit vers la
  // langue commune convenue à la réservation (activeMission.language)
  // avant d'être envoyé — le Reporter voit sa langue, pas le français.
  // Support navigateur : bon sur Chrome/Edge desktop + Android, très
  // limité voire absent sur Safari iOS.
  useEffect(() => {
    const SpeechRecognitionImpl = typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition);
    if (!SpeechRecognitionImpl) {
      setMicSupported(false);
      return;
    }

    const recognition = new SpeechRecognitionImpl();
    recognition.lang = "fr-FR";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let interim = "";
      let final = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) final += transcript;
        else interim += transcript;
      }
      if (final.trim()) {
        setDraft("");
        (async () => {
          setTranslating(true);
          const targetLang = activeMissionRef.current?.language;
          const translated = await translateFromFrench(final.trim(), targetLang);
          sendMessageRef.current("participant", translated);
          setTranslating(false);
        })();
      } else {
        setDraft(interim);
      }
    };

    recognition.onerror = () => setMicOn(false);
    recognition.onend = () => setMicOn(false);

    recognitionRef.current = recognition;
    return () => recognition.stop();
    // activeMission.language peut changer une fois par mission, pas besoin
    // de le suivre en dépendance : sendMessage/activeMission sont lus au
    // moment de l'appel via les refs de closure de la fonction du dessus.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleMic = () => {
    if (!micSupported) return;
    if (micOn) {
      recognitionRef.current?.stop();
      setMicOn(false);
    } else {
      try {
        recognitionRef.current?.start();
        setMicOn(true);
      } catch {
        // start() jette si déjà démarré — on ignore, l'état micOn suffit.
      }
    }
  };

  if (!activeMission || activeMission.status !== "live") {
    // On sait qu'une redirection vers le replay est en cours (voir
    // l'effet ci-dessus) : éviter d'afficher l'écran "rien en cours"
    // pendant la fraction de seconde où router.replace() s'exécute.
    if (liveMissionIdRef.current) {
      return (
        <div>
          <Header leftIcon="back" />
          <div className="sf-wrap" style={{ paddingTop: 40, textAlign: "center", color: "var(--slate)" }}>
            Redirection vers le replay…
          </div>
        </div>
      );
    }
    return (
      <div>
        <Header leftIcon="back" />
        <div className="sf-wrap" style={{ paddingTop: 40, textAlign: "center" }}>
          <Dateline center>Statut</Dateline>
          <p style={{ color: "var(--slate)", marginBottom: 16 }}>Aucun live en cours pour l'instant.</p>
          <Button onClick={() => router.push("/explorer")}>Explorer les Reporters</Button>
        </div>
      </div>
    );
  }

  const mmss = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const send = (text) => {
    if (!text.trim()) return;
    sendMessage("participant", text.trim());
    setDraft("");
  };

  const pressDir = (dir, label) => {
    setPressedDir(dir);
    send(label);
    setTimeout(() => setPressedDir(null), 220);
  };

  // Les 6 derniers messages seulement — comme un live TikTok, les plus
  // anciens ne sont pas censés rester consultables ici, juste défiler.
  const recentMessages = activeMission.messages.slice(-6);

  return (
    // 100dvh + overflow hidden : tout tient sur l'écran, rien ne pousse
    // vers le bas. Chaque contrôle est superposé à la vidéo (position
    // absolute), pas empilé en dessous.
    <div style={{ height: "100dvh", position: "relative", overflow: "hidden", background: "#000", color: "#fff" }}>
      <LiveVideoBackground />
      {/* Voile haut, pour le badge + chrono */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 100, background: "linear-gradient(180deg, rgba(0,0,0,0.6), transparent)" }} />
      <div style={{ position: "absolute", top: 14, left: 14, right: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(0,0,0,0.35)", padding: "6px 12px 6px 8px", borderRadius: 999 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#ff453a", animation: "sf-live-pulse 1.8s ease-out infinite" }} />
          <span className="sf-mono" style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.04em" }}>DIRECT</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {confirmEnd ? (
            <>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.8)" }}>Terminer ?</span>
              <button
                onClick={endMission}
                className="sf-mono"
                style={{ fontSize: 11, fontWeight: 700, padding: "6px 12px", borderRadius: 999, border: "1px solid var(--signal)", background: "var(--signal)", color: "#fff" }}
              >
                Oui
              </button>
              <button
                onClick={() => setConfirmEnd(false)}
                style={{ width: 30, height: 30, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.25)", background: "rgba(0,0,0,0.35)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <X size={14} />
              </button>
            </>
          ) : (
            <button
              onClick={() => setConfirmEnd(true)}
              className="sf-mono"
              style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 600, padding: "6px 12px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.2)", background: "rgba(0,0,0,0.35)", color: "rgba(255,255,255,0.9)" }}
            >
              <X size={12} /> Terminer
            </button>
          )}
          <div className="sf-mono" style={{ fontSize: 13, fontWeight: 600, background: "rgba(0,0,0,0.35)", padding: "6px 12px", borderRadius: 999 }}>
            {mmss(activeMission.elapsedSeconds)}
          </div>
        </div>
      </div>

      {/* Identité du Reporter, juste au-dessus de la zone de contrôle */}
      <div style={{ position: "absolute", left: 14, right: 14, bottom: 218 }}>
        <div className="sf-display" style={{ fontSize: 17, fontWeight: 700, marginBottom: 2, textShadow: "0 1px 6px rgba(0,0,0,0.6)" }}>{activeMission.reporterName}</div>
        <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.85)", display: "flex", alignItems: "center", gap: 5, textShadow: "0 1px 6px rgba(0,0,0,0.6)" }}>
          <MapPin size={11} />{activeMission.place}
        </div>
      </div>

      {/* Chat façon live TikTok : les messages flottent en bas à gauche,
         remontent au fur et à mesure, s'estompent vers le haut — pas un
         panneau séparé qui pousse le reste de l'écran. */}
      <div
        ref={scrollRef}
        style={{
          position: "absolute", left: 14, bottom: 128, width: "72%", maxHeight: 150,
          display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 6,
          overflow: "hidden", maskImage: "linear-gradient(0deg, black 60%, transparent 100%)", WebkitMaskImage: "linear-gradient(0deg, black 60%, transparent 100%)",
        }}
      >
        {recentMessages.map((m, i) => (
          <div
            key={i}
            style={{
              alignSelf: "flex-start", maxWidth: "100%", padding: "6px 12px", borderRadius: 999,
              background: "rgba(0,0,0,0.4)", fontSize: 12.5, lineHeight: 1.3,
            }}
          >
            <span style={{ fontWeight: 700, color: m.from === "participant" ? "var(--signal)" : "#fff" }}>
              {m.from === "participant" ? "Vous" : activeMission.reporterName}
            </span>
            <span style={{ color: "rgba(255,255,255,0.9)" }}> {m.text}</span>
          </div>
        ))}
      </div>

      {/* Zone de contrôle fixée en bas : micro + suggestions + saisie,
         tout tient dans une hauteur constante quel que soit l'écran. */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "10px 14px calc(14px + env(safe-area-inset-bottom))", background: "linear-gradient(0deg, rgba(0,0,0,0.75) 40%, transparent 100%)" }}>
        <div style={{ display: "flex", justifyContent: "flex-end", paddingRight: 6, marginBottom: 10 }}>
          {/* D-pad directionnel : croix compacte, cohérente avec le
             cercle du micro/envoyer. Chaque tap envoie l'instruction ET
             flashe brièvement en --signal pour confirmer la prise en
             compte, avant de revenir à l'état neutre. */}
          <div
            style={{
              position: "relative", width: 116, height: 116,
              display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gridTemplateRows: "repeat(3, 1fr)",
              gap: 3,
            }}
          >
            <DPadButton area="2 / 1 / 3 / 2" active={pressedDir === "left"} onClick={() => pressDir("left", "Vers la gauche")} radius="14px 4px 4px 14px">
              <ChevronLeft size={19} />
            </DPadButton>
            <DPadButton area="1 / 2 / 2 / 3" active={pressedDir === "up"} onClick={() => pressDir("up", "Plus près")} radius="14px 14px 4px 4px">
              <ChevronUp size={19} />
            </DPadButton>
            <DPadButton area="3 / 2 / 4 / 3" active={pressedDir === "down"} onClick={() => pressDir("down", "Recule / vue d'ensemble")} radius="4px 4px 14px 14px">
              <ChevronDown size={19} />
            </DPadButton>
            <DPadButton area="2 / 3 / 3 / 4" active={pressedDir === "right"} onClick={() => pressDir("right", "Vers la droite")} radius="4px 14px 14px 4px">
              <ChevronRight size={19} />
            </DPadButton>

            {/* Centre : micro, action principale donc seul bouton plein/blanc.
               Reconnaissance vocale française → traduction automatique
               vers la langue commune de la mission avant envoi (voir
               lib/translate.js). Non supporté sur Safari iOS : le bouton
               reste alors visuellement présent mais désactivé. */}
            <button
              onClick={toggleMic}
              disabled={!micSupported}
              style={{
                gridArea: "2 / 2 / 3 / 3",
                borderRadius: "50%", border: micOn ? "1px solid rgba(255,69,58,0.5)" : "none",
                background: micOn ? "rgba(255,69,58,0.9)" : "#fff",
                color: micOn ? "#fff" : "#0a0b10",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
                opacity: micSupported ? 1 : 0.35,
              }}
            >
              <Mic size={18} />
            </button>
          </div>
        </div>

        {!micSupported && (
          <div style={{ textAlign: "center", fontSize: 10.5, color: "rgba(255,255,255,0.6)", marginBottom: 6 }}>
            Micro non pris en charge par ce navigateur — utilisez le champ texte.
          </div>
        )}
        {translating && (
          <div style={{ textAlign: "center", fontSize: 10.5, color: "rgba(255,255,255,0.75)", marginBottom: 6 }}>
            Traduction en cours…
          </div>
        )}

        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send(draft)}
            placeholder="Écrire une instruction…"
            className="sf-live-input"
            style={{ flex: 1, border: "1px solid rgba(255,255,255,0.2)", borderRadius: 999, padding: "10px 16px", fontSize: 13.5, background: "rgba(255,255,255,0.1)", color: "#fff", outline: "none", minWidth: 0 }}
          />
          <button
            onClick={() => send(draft)}
            disabled={!draft.trim()}
            style={{ flexShrink: 0, width: 42, height: 42, borderRadius: "50%", border: "none", background: "#fff", color: "#0a0b10", display: "flex", alignItems: "center", justifyContent: "center", opacity: draft.trim() ? 1 : 0.4 }}
          >
            <Send size={15} />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes sf-live-pulse {
          0% { box-shadow: 0 0 0 0 rgba(255,69,58,0.55); }
          70% { box-shadow: 0 0 0 7px rgba(255,69,58,0); }
          100% { box-shadow: 0 0 0 0 rgba(255,69,58,0); }
        }
      `}</style>
    </div>
  );
}
