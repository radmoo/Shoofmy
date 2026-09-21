import { MoreHorizontal } from "lucide-react";
import Card from "@/components/ui/Card";
import Dateline from "@/components/ui/Dateline";
import Avatar from "@/components/ui/Avatar";
import AdminStatusBadge from "@/components/AdminStatusBadge";
import { ADMIN_USERS } from "@/lib/mock-data";

export default function AdminUsersPage() {
  return (
    <>
      <div style={{ marginBottom: 24 }}>
        <Dateline>Registre</Dateline>
        <h1 className="sf-display" style={{ fontSize: 24 }}>Utilisateurs</h1>
        <p style={{ fontSize: 13, color: "var(--slate)" }}>2 480 comptes · {ADMIN_USERS.length} affichés</p>
      </div>

      <Card padding={0}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["Utilisateur", "Rôle", "Missions", "Inscrit", "Statut", ""].map((h) => (
                <th key={h} className="sf-mono" style={{ textAlign: "left", fontSize: 10.5, textTransform: "uppercase", color: "var(--slate-2)", padding: "11px 20px", borderBottom: "1px solid var(--line)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ADMIN_USERS.map((u) => (
              <tr key={u.email}>
                <td style={{ padding: "13px 20px", borderBottom: "1px solid var(--line)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Avatar name={u.name} size={30} />
                    <div>
                      <div style={{ fontSize: 13.5 }}>{u.name}</div>
                      <div style={{ fontSize: 11.5, color: "var(--slate)" }}>{u.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: "13px 20px", borderBottom: "1px solid var(--line)", fontSize: 13.5 }}>{u.role}</td>
                <td className="sf-mono" style={{ padding: "13px 20px", borderBottom: "1px solid var(--line)", fontSize: 12.5 }}>{u.missions}</td>
                <td style={{ padding: "13px 20px", borderBottom: "1px solid var(--line)", fontSize: 11.5, color: "var(--slate)" }}>{u.joined}</td>
                <td style={{ padding: "13px 20px", borderBottom: "1px solid var(--line)" }}><AdminStatusBadge status={u.status} /></td>
                <td style={{ padding: "13px 20px", borderBottom: "1px solid var(--line)" }}><MoreHorizontal size={15} color="var(--slate)" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}
