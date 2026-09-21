"use client";

import React, { useState } from "react";
import { Send } from "lucide-react";
import Header from "@/components/Header";
import Dateline from "@/components/ui/Dateline";
import RequireAuth from "@/components/RequireAuth";
import Card from "@/components/ui/Card";
import Avatar from "@/components/ui/Avatar";
import { THREADS, CONVERSATIONS } from "@/lib/mock-data";
import { useMission } from "@/lib/context/MissionContext";

export default function MessagesPage() {
  return (
    <RequireAuth role="participant">
      <MessagesContent />
    </RequireAuth>
  );
}

function MessagesContent() {
  const { activeMission } = useMission();
  const [activeId, setActiveId] = useState(THREADS[0].id);
  const [messages, setMessages] = useState(CONVERSATIONS);
  const [draft, setDraft] = useState("");

  const active = THREADS.find((t) => t.id === activeId);

  // Repère utile : si une mission est en cours, on le signale dans le fil
  // du Reporter concerné — encore une fois via le même MissionContext que
  // /payment, /live et /history, pas une donnée séparée.
  const isActiveMissionReporter = activeMission && activeMission.reporterName === active?.name;

  const send = () => {
    if (!draft.trim()) return;
    setMessages((prev) => ({
      ...prev,
      [activeId]: [...(prev[activeId] || []), { from: "me", text: draft.trim(), time: "à l'instant" }],
    }));
    setDraft("");
  };

  return (
    <div>
      <Header />
      <div className="sf-wrap" style={{ paddingTop: 26, paddingBottom: 50, maxWidth: 620 }}>
        <Dateline>Correspondances</Dateline>
        <h1 className="sf-display" style={{ fontSize: 22, marginBottom: 16 }}>Messages</h1>

        <div style={{ display: "flex", gap: 8, marginBottom: 20, overflowX: "auto" }}>
          {THREADS.map((t) => (
            <div
              key={t.id}
              onClick={() => setActiveId(t.id)}
              style={{
                display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 999,
                border: `1px solid ${activeId === t.id ? "var(--ink)" : "var(--line)"}`,
                background: activeId === t.id ? "var(--ink)" : "var(--cloud-2)",
                color: activeId === t.id ? "#fff" : "var(--ink)",
                cursor: "pointer", flexShrink: 0, fontSize: 13,
              }}
            >
              <Avatar name={t.name} size={22} online={t.online} />
              {t.name}
            </div>
          ))}
        </div>

        {isActiveMissionReporter && (
          <div style={{ fontSize: 12, color: "var(--verified)", marginBottom: 12, fontFamily: "var(--font-mono)" }}>
            ● Mission en cours avec {active.name} — {activeMission.place}
          </div>
        )}

        <Card padding={0} style={{ display: "flex", flexDirection: "column", height: 420 }}>
          <div style={{ flex: 1, overflowY: "auto", padding: 18, display: "flex", flexDirection: "column", gap: 10 }}>
            {(messages[activeId] || []).map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: m.from === "me" ? "flex-end" : "flex-start" }}>
                <div
                  style={{
                    maxWidth: "70%", padding: "10px 14px", fontSize: 13.5, lineHeight: 1.4,
                    borderRadius: m.from === "me" ? "16px 4px 16px 16px" : "4px 16px 16px 16px",
                    background: m.from === "me" ? "var(--ink)" : "var(--cloud)",
                    color: m.from === "me" ? "#fff" : "var(--ink)",
                  }}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 10, padding: 14, borderTop: "1px solid var(--line)" }}>
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Écrire un message…"
              style={{ flex: 1, border: "1px solid var(--line)", borderRadius: 999, padding: "10px 16px", fontSize: 13.5, outline: "none" }}
            />
            <button
              onClick={send}
              disabled={!draft.trim()}
              style={{
                width: 38, height: 38, borderRadius: "50%", border: "none", flexShrink: 0,
                background: "var(--ink)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                opacity: draft.trim() ? 1 : 0.4, cursor: draft.trim() ? "pointer" : "default",
              }}
            >
              <Send size={15} />
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
