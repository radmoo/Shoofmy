"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/context/SessionContext";

/**
 * Enveloppe une page pour exiger une session active.
 * @param {{ role?: "participant"|"reporter", children: React.ReactNode }} props
 *
 * Avant : chaque écran affichait un bouton "Se déconnecter" décoratif et
 * on "sautait direct aux dashboards" (comme listé dans les manques
 * d'origine). Maintenant : une page enveloppée par <RequireAuth> renvoie
 * réellement vers /login si personne n'est connecté, et vers l'espace
 * adapté si le rôle ne correspond pas à la route.
 */
export default function RequireAuth({ role, children }) {
  const router = useRouter();
  const { user, isAuthenticated } = useSession();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }
    if (role && user.role !== role) {
      const home = { participant: "/explorer", reporter: "/r/dashboard", admin: "/admin/users" }[user.role] || "/login";
      router.replace(home);
    }
  }, [isAuthenticated, user, role, router]);

  if (!isAuthenticated || (role && user.role !== role)) {
    return (
      <div className="sf-wrap" style={{ paddingTop: 60, textAlign: "center", color: "var(--slate)", fontSize: 13.5 }}>
        Redirection…
      </div>
    );
  }

  return children;
}
