"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Users, Camera, Briefcase, CreditCard, AlertTriangle, ShieldAlert,
  BarChart3, LifeBuoy, LogOut,
} from "lucide-react";
import RequireAuth from "@/components/RequireAuth";
import { useSession } from "@/lib/context/SessionContext";

const NAV = [
  { href: "/admin/users", label: "Utilisateurs", icon: Users },
  { href: "/admin/reporters", label: "Reporters", icon: Camera },
  { href: "/admin/missions", label: "Missions", icon: Briefcase },
  { href: "/admin/payments", label: "Paiements", icon: CreditCard },
  { href: "/admin/disputes", label: "Litiges", icon: AlertTriangle },
  { href: "/admin/moderation", label: "Modération", icon: ShieldAlert },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/support", label: "Support", icon: LifeBuoy },
];

// Layout Next.js : ce fichier enveloppe automatiquement TOUTES les
// sous-routes /admin/* (users, reporters, missions...). La sidebar et la
// protection par rôle sont écrites une seule fois ici, contrairement à
// l'artifact d'origine où les 8 sections vivaient dans un seul fichier
// avec un state de navigation interne (pas de vraies URLs).
export default function AdminLayout({ children }) {
  return (
    <RequireAuth role="admin">
      <AdminShell>{children}</AdminShell>
    </RequireAuth>
  );
}

function AdminShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useSession();

  return (
    <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", minHeight: "100vh" }}>
      <aside style={{ background: "var(--ink)", color: "#fff", padding: "22px 14px", display: "flex", flexDirection: "column" }}>
        <div className="sf-display" style={{ fontSize: 18, padding: "8px 10px 22px", display: "flex", alignItems: "center", gap: 8 }}>
          Shoofmy
          <span className="sf-mono" style={{ fontSize: 9.5, background: "rgba(255,255,255,0.1)", padding: "2px 6px", borderRadius: 5, color: "var(--slate-2)" }}>
            ADMIN
          </span>
        </div>
        {NAV.map((n) => {
          const active = pathname === n.href;
          return (
            <Link
              key={n.href}
              href={n.href}
              style={{
                display: "flex", alignItems: "center", gap: 12, padding: "11px 12px", borderRadius: 10,
                fontSize: 13.5, fontWeight: 500, marginBottom: 2,
                background: active ? "rgba(255,255,255,0.1)" : "transparent",
                color: active ? "#fff" : "var(--slate-2)",
              }}
            >
              <n.icon size={17} />
              {n.label}
            </Link>
          );
        })}

        <div style={{ marginTop: "auto", paddingTop: 14, borderTop: "1px solid var(--line-dark)" }}>
          <div style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 2 }}>{user?.name}</div>
          <div style={{ fontSize: 11, color: "var(--slate-2)", marginBottom: 10 }}>Admin support</div>
          <button
            onClick={() => { logout(); router.push("/"); }}
            style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "var(--slate-2)", fontSize: 12, cursor: "pointer" }}
          >
            <LogOut size={13} />Se déconnecter
          </button>
        </div>
      </aside>

      <main style={{ padding: "28px 36px 60px" }}>{children}</main>
    </div>
  );
}
