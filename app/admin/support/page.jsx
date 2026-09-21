import { MessageSquare, ChevronRight } from "lucide-react";
import Card from "@/components/ui/Card";
import Dateline from "@/components/ui/Dateline";
import AdminStatusBadge from "@/components/AdminStatusBadge";
import { ADMIN_TICKETS } from "@/lib/mock-data";

export default function AdminSupportPage() {
  return (
    <>
      <div style={{ marginBottom: 24 }}>
        <Dateline>Assistance</Dateline>
        <h1 className="sf-display" style={{ fontSize: 24 }}>Support</h1>
        <p style={{ fontSize: 13, color: "var(--slate)" }}>2 tickets ouverts</p>
      </div>

      <Card padding={0}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["Ticket", "Utilisateur", "Sujet", "Priorité", "Statut", ""].map((h) => (
                <th key={h} className="sf-mono" style={{ textAlign: "left", fontSize: 10.5, textTransform: "uppercase", color: "var(--slate-2)", padding: "11px 20px", borderBottom: "1px solid var(--line)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ADMIN_TICKETS.map((t) => (
              <tr key={t.id}>
                <td className="sf-mono" style={{ padding: "13px 20px", borderBottom: "1px solid var(--line)", fontSize: 12.5 }}>{t.id}</td>
                <td style={{ padding: "13px 20px", borderBottom: "1px solid var(--line)", fontSize: 13.5 }}>{t.user}</td>
                <td style={{ padding: "13px 20px", borderBottom: "1px solid var(--line)", fontSize: 11.5, color: "var(--slate)" }}>
                  <MessageSquare size={11} style={{ verticalAlign: "-1px", marginRight: 4 }} />{t.subject}
                </td>
                <td style={{ padding: "13px 20px", borderBottom: "1px solid var(--line)" }}><AdminStatusBadge status={t.priority} /></td>
                <td style={{ padding: "13px 20px", borderBottom: "1px solid var(--line)" }}><AdminStatusBadge status={t.status} /></td>
                <td style={{ padding: "13px 20px", borderBottom: "1px solid var(--line)" }}><ChevronRight size={15} color="var(--slate-2)" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}
