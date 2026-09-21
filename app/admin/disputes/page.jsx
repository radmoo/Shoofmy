import { ChevronRight } from "lucide-react";
import Card from "@/components/ui/Card";
import Dateline from "@/components/ui/Dateline";
import AdminStatusBadge from "@/components/AdminStatusBadge";
import { ADMIN_DISPUTES } from "@/lib/mock-data";

export default function AdminDisputesPage() {
  return (
    <>
      <div style={{ marginBottom: 24 }}>
        <Dateline tone="signal">Contentieux</Dateline>
        <h1 className="sf-display" style={{ fontSize: 24 }}>Litiges</h1>
        <p style={{ fontSize: 13, color: "var(--slate)" }}>1 ouvert · 1 en cours · 1 résolu</p>
      </div>

      <Card padding={0}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["Litige", "Parties", "Motif", "Priorité", "Statut", ""].map((h) => (
                <th key={h} className="sf-mono" style={{ textAlign: "left", fontSize: 10.5, textTransform: "uppercase", color: "var(--slate-2)", padding: "11px 20px", borderBottom: "1px solid var(--line)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ADMIN_DISPUTES.map((d) => (
              <tr key={d.id}>
                <td className="sf-mono" style={{ padding: "13px 20px", borderBottom: "1px solid var(--line)", fontSize: 12.5 }}>{d.id}</td>
                <td style={{ padding: "13px 20px", borderBottom: "1px solid var(--line)", fontSize: 13.5 }}>{d.parties}</td>
                <td style={{ padding: "13px 20px", borderBottom: "1px solid var(--line)", fontSize: 11.5, color: "var(--slate)" }}>{d.reason}</td>
                <td style={{ padding: "13px 20px", borderBottom: "1px solid var(--line)" }}><AdminStatusBadge status={d.priority} /></td>
                <td style={{ padding: "13px 20px", borderBottom: "1px solid var(--line)" }}><AdminStatusBadge status={d.status} /></td>
                <td style={{ padding: "13px 20px", borderBottom: "1px solid var(--line)" }}><ChevronRight size={15} color="var(--slate-2)" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}
