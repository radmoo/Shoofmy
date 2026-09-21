import { Flag, CheckCircle2, XCircle } from "lucide-react";
import Card from "@/components/ui/Card";
import Dateline from "@/components/ui/Dateline";
import { ADMIN_REPORTS } from "@/lib/mock-data";

export default function AdminModerationPage() {
  return (
    <>
      <div style={{ marginBottom: 24 }}>
        <Dateline tone="signal">Contrôle</Dateline>
        <h1 className="sf-display" style={{ fontSize: 24 }}>Modération</h1>
        <p style={{ fontSize: 13, color: "var(--slate)" }}>{ADMIN_REPORTS.length} signalements en attente</p>
      </div>

      <Card padding={0}>
        {ADMIN_REPORTS.map((r, i) => (
          <div
            key={i}
            style={{
              display: "flex", gap: 14, padding: "15px 20px",
              borderBottom: i < ADMIN_REPORTS.length - 1 ? "1px solid var(--line)" : "none",
              alignItems: "flex-start",
            }}
          >
            <div style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(255,59,48,0.1)", color: "var(--signal)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Flag size={16} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13.5, fontWeight: 600 }}>{r.type} — {r.target}</div>
              <div style={{ fontSize: 12.5, color: "var(--slate)", marginTop: 2 }}>{r.reason} · signalé par {r.by}</div>
              <div className="sf-mono" style={{ fontSize: 11, color: "var(--slate-2)", marginTop: 4 }}>{r.time}</div>
            </div>
            <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
              <button style={{ width: 28, height: 28, borderRadius: 8, border: "1px solid rgba(23,185,120,0.3)", background: "var(--cloud-2)", color: "var(--verified)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <CheckCircle2 size={14} />
              </button>
              <button style={{ width: 28, height: 28, borderRadius: 8, border: "1px solid rgba(255,59,48,0.3)", background: "var(--cloud-2)", color: "var(--signal)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <XCircle size={14} />
              </button>
            </div>
          </div>
        ))}
      </Card>
    </>
  );
}
