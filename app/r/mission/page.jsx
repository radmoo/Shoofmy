"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Mic, Send, Flag } from "lucide-react";
import Button from "@/components/ui/Button";
import { useMission } from "@/lib/context/MissionContext";
import { useLiveTheme } from "@/lib/useLiveTheme";

export default function ReporterMissionPage() {
  const router = useRouter();
  const { activeMission, endMission, sendMessage, tickElapsed } = useMission();
  useLiveTheme(activeMission?.status === "live");
  const [draft, setDraft] = useState("");
  const [micOn, setMicOn] = useState(false);
  const scrollRef = useRef(null);

  // Le compteur qui alimente la facturation à la durée réelle (section 8) —
  // pas un chiffre fixe : chaque seconde vécue en "live" est comptée ici.
  useEffect(() => {
    if (!activeMission || activeMission.status !== "live") return;
    const t = setInterval(tickElapsed, 1000);
    return () => clearInterval(t);
  }, [activeMission?.status, tickElapsed]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [activeMission?.messages?.length]);

  if (!activeMission || activeMission.status !== "live") {
    return (
      <div className="sf-wrap" style={{ paddingTop: 40, textAlign: "center" }}>
        <p style={{ color: "var(--slate)", marginBottom: 16 }}>Aucun live en cours.</p>
        <Button onClick={() => router.push("/r/dashboard")}>Retour au tableau de bord</Button>
      </div>
    );
  }

  const mmss = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const send = () => {
    if (!draft.trim()) return;
    sendMessage("reporter", draft.trim());
    setDraft("");
  };

  const handleEnd = () => {
    endMission();
    router.push("/r/earnings");
  };

  return (
    <div style={{ background: "#0a0b10", color: "#fff", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div
        style={{
          position: "relative", width: "100%", aspectRatio: "3/4", flexShrink: 0, overflow: "hidden",
          background: "#000",
        }}
      >
        {/* Vidéo de démo en fond (pas un vrai flux caméra — pas de WebRTC
           à ce stade). Purement décorative : pointer-events none. */}
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
          <iframe
            src="https://www.youtube.com/embed/LSMBJxoC7rI?autoplay=1&mute=1&loop=1&playlist=LSMBJxoC7rI&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&cc_load_policy=0&disablekb=1"
            title="Fond vidéo de démo"
            allow="autoplay; encrypted-media"
            style={{
              position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
              width: "133.33%", height: "133.33%", minWidth: "100%", minHeight: "100%", border: "none",
            }}
          />
        </div>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 80, background: "linear-gradient(180deg, rgba(0,0,0,0.55), transparent)" }} />
        <div style={{ position: "absolute", top: 14, left: 14, right: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(0,0,0,0.35)", padding: "6px 12px 6px 8px", borderRadius: 999 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#ff453a", animation: "sf-live-pulse 1.8s ease-out infinite" }} />
            <span className="sf-mono" style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.04em" }}>DIRECT</span>
          </div>
          <div className="sf-mono" style={{ fontSize: 13, fontWeight: 600, background: "rgba(0,0,0,0.35)", padding: "6px 12px", borderRadius: 999 }}>
            {mmss(activeMission.elapsedSeconds)}
          </div>
        </div>
        <div style={{ position: "absolute", bottom: 12, left: 14, right: 14, background: "rgba(0,0,0,0.4)", borderRadius: 999, padding: "8px 14px", fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}>
          <MapPin size={13} />{activeMission.place}
        </div>
      </div>

      <div className="sf-wrap" style={{ maxWidth: 460, paddingTop: 18, flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <button
            onClick={() => setMicOn((v) => !v)}
            style={{
              display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 999,
              border: micOn ? "1px solid rgba(255,69,58,0.5)" : "1px solid rgba(255,255,255,0.16)",
              background: micOn ? "rgba(255,69,58,0.16)" : "rgba(255,255,255,0.08)", color: micOn ? "#ff6a5f" : "rgba(255,255,255,0.85)",
              fontSize: 12.5, fontWeight: 600,
            }}
          >
            <Mic size={14} />{micOn ? "Micro ouvert" : "Micro coupé"}
          </button>
          <span style={{ fontSize: 11.5, color: "rgba(255,255,255,0.5)" }}>{activeMission.participantName || "Le Participant"} peut vous diriger</span>
        </div>

        <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10, marginBottom: 12, minHeight: 120 }}>
          {activeMission.messages.length === 0 && (
            <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.4)", textAlign: "center", marginTop: 20 }}>
              Aucune instruction reçue pour l'instant.
            </div>
          )}
          {activeMission.messages.map((m, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: m.from === "reporter" ? "flex-end" : "flex-start" }}>
              <span className="sf-mono" style={{ fontSize: 9.5, color: "rgba(255,255,255,0.35)", marginBottom: 3, padding: "0 4px" }}>
                {m.from === "reporter" ? "Vous" : activeMission.participantName || "Participant"}
              </span>
              <div
                style={{
                  maxWidth: "78%", padding: "9px 13px", fontSize: 13.5, lineHeight: 1.4,
                  borderRadius: m.from === "reporter" ? "14px 14px 3px 14px" : "14px 14px 14px 3px",
                  background: m.from === "reporter" ? "var(--signal)" : "rgba(255,255,255,0.1)",
                  color: "#fff",
                }}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Répondre au participant…"
            className="sf-live-input"
            style={{ flex: 1, border: "1px solid rgba(255,255,255,0.18)", borderRadius: 999, padding: "11px 16px", fontSize: 13.5, background: "rgba(255,255,255,0.08)", color: "#fff", outline: "none" }}
          />
          <button
            onClick={send}
            disabled={!draft.trim()}
            style={{ width: 42, height: 42, borderRadius: "50%", border: "none", background: "#fff", color: "#0a0b10", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, opacity: draft.trim() ? 1 : 0.4 }}
          >
            <Send size={15} />
          </button>
        </div>

        <div style={{ display: "flex", gap: 10, paddingBottom: 24 }}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "10px 8px", borderRadius: 12, background: "rgba(255,69,58,0.08)", border: "1px solid rgba(255,69,58,0.28)", color: "#ff6a5f", fontSize: 11, fontWeight: 600 }}>
            <Flag size={15} />Signaler
          </div>
          <Button full onClick={handleEnd} style={{ flex: 2, background: "#fff", color: "#0a0b10" }}>
            Terminer la mission
          </Button>
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
