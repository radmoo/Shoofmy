import { TrendingUp, TrendingDown } from "lucide-react";
import Card from "@/components/ui/Card";
import Dateline from "@/components/ui/Dateline";
import AdminStatusBadge from "@/components/AdminStatusBadge";
import { ADMIN_TRANSACTIONS } from "@/lib/mock-data";

const KPIS = [
  { label: "Volume traité", val: "18 240 €", delta: "+12%", up: true },
  { label: "Commissions", val: "3 648 €", delta: "+9%", up: true },
  { label: "Remboursements", val: "214 €", delta: "-4%", up: false },
  { label: "Taux d'échec", val: "1,8%", delta: "-0,3pt", up: false },
];

export default function AdminPaymentsPage() {
  return (
    <>
      <div style={{ marginBottom: 24 }}>
        <Dateline>Registre</Dateline>
        <h1 className="sf-display" style={{ fontSize: 24 }}>Paiements</h1>
        <p style={{ fontSize: 13, color: "var(--slate)" }}>Transactions des 7 derniers jours</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 28 }}>
        {KPIS.map((k) => (
          <Card key={k.label}>
            <div style={{ fontSize: 12, color: "var(--slate)", marginBottom: 8 }}>{k.label}</div>
            <div className="sf-mono" style={{ fontSize: 22, fontWeight: 600, marginBottom: 4 }}>{k.val}</div>
            <div className="sf-mono" style={{ fontSize: 11.5, display: "flex", alignItems: "center", gap: 4, color: k.up ? "var(--verified)" : "var(--signal)" }}>
              {k.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}{k.delta}
            </div>
          </Card>
        ))}
      </div>

      <Card padding={0}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["Transaction", "Utilisateur", "Type", "Date", "Montant", "Statut"].map((h) => (
                <th key={h} className="sf-mono" style={{ textAlign: "left", fontSize: 10.5, textTransform: "uppercase", color: "var(--slate-2)", padding: "11px 20px", borderBottom: "1px solid var(--line)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ADMIN_TRANSACTIONS.map((t) => (
              <tr key={t.id}>
                <td className="sf-mono" style={{ padding: "13px 20px", borderBottom: "1px solid var(--line)", fontSize: 12.5 }}>{t.id}</td>
                <td style={{ padding: "13px 20px", borderBottom: "1px solid var(--line)", fontSize: 13.5 }}>{t.user}</td>
                <td style={{ padding: "13px 20px", borderBottom: "1px solid var(--line)", fontSize: 11.5, color: "var(--slate)" }}>{t.type}</td>
                <td style={{ padding: "13px 20px", borderBottom: "1px solid var(--line)", fontSize: 11.5, color: "var(--slate)" }}>{t.date}</td>
                <td className="sf-mono" style={{ padding: "13px 20px", borderBottom: "1px solid var(--line)", fontSize: 12.5 }}>{t.amount}</td>
                <td style={{ padding: "13px 20px", borderBottom: "1px solid var(--line)" }}><AdminStatusBadge status={t.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}
