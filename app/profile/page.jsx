"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogOut, Bell, CreditCard, MapPin, ChevronRight, LifeBuoy } from "lucide-react";
import Header from "@/components/Header";
import Dateline from "@/components/ui/Dateline";
import RequireAuth from "@/components/RequireAuth";
import Card from "@/components/ui/Card";
import Avatar from "@/components/ui/Avatar";
import Toggle from "@/components/ui/Toggle";
import Button from "@/components/ui/Button";
import { useSession } from "@/lib/context/SessionContext";
import { useMission } from "@/lib/context/MissionContext";

export default function ProfilePage() {
  return (
    <RequireAuth role="participant">
      <ProfileContent />
    </RequireAuth>
  );
}

function ProfileContent() {
  const router = useRouter();
  const { user, logout } = useSession();
  const { history } = useMission();
  const [notifOn, setNotifOn] = useState(true);

  const handleLogout = () => {
    logout();
    router.push("/"); // retour à l'accueil, pas direct sur un formulaire de connexion
  };

  return (
    <div>
      <Header />
      <div className="sf-wrap" style={{ paddingTop: 26, paddingBottom: 50 }}>
        <Dateline>Espace Participant</Dateline>
        <Card style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24, marginTop: 6 }}>
          <Avatar name={user?.name || "Manon"} size={64} />
          <div>
            <div className="sf-display" style={{ fontSize: 18 }}>{user?.name || "Manon"}</div>
            <div style={{ fontSize: 12.5, color: "var(--slate)" }}>
              {/* Compteur réel, pas un chiffre en dur : vient du même historique
                 que /history, alimenté par les missions terminées cette session. */}
              {history.length} mission{history.length !== 1 ? "s" : ""} cette session
            </div>
          </div>
        </Card>

        <Link href="/history" style={{ display: "block", marginBottom: 12 }}>
          <Card style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--cloud)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <MapPin size={16} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>Historique des missions</div>
              <div style={{ fontSize: 12, color: "var(--slate)" }}>Voir toutes vos missions</div>
            </div>
            <ChevronRight size={16} color="var(--slate-2)" />
          </Card>
        </Link>

        <Link href="/support" style={{ display: "block", marginBottom: 12 }}>
          <Card style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--cloud)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <LifeBuoy size={16} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>Aide et support</div>
              <div style={{ fontSize: 12, color: "var(--slate)" }}>FAQ, contacter le support</div>
            </div>
            <ChevronRight size={16} color="var(--slate-2)" />
          </Card>
        </Link>

        <Card style={{ marginBottom: 12, display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--cloud)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <CreditCard size={16} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Moyens de paiement</div>
            <div style={{ fontSize: 12, color: "var(--slate)" }}>Visa •••• 4242</div>
          </div>
        </Card>

        <Card style={{ marginBottom: 26, display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--cloud)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Bell size={16} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Notifications</div>
            <div style={{ fontSize: 12, color: "var(--slate)" }}>Push, e-mail, SMS</div>
          </div>
          <Toggle on={notifOn} onChange={setNotifOn} />
        </Card>

        <Button full variant="danger" onClick={handleLogout}>
          <LogOut size={15} />Se déconnecter
        </Button>
      </div>
    </div>
  );
}
