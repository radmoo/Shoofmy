"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogOut, Bell, MapPin, Smartphone, LifeBuoy, ChevronRight, Camera } from "lucide-react";
import Header from "@/components/Header";
import Dateline from "@/components/ui/Dateline";
import RequireAuth from "@/components/RequireAuth";
import Card from "@/components/ui/Card";
import Avatar from "@/components/ui/Avatar";
import Toggle from "@/components/ui/Toggle";
import Button from "@/components/ui/Button";
import { useSession } from "@/lib/context/SessionContext";

export default function ReporterProfilePage() {
  return (
    <RequireAuth role="reporter">
      <ReporterProfileContent />
    </RequireAuth>
  );
}

function ReporterProfileContent() {
  const router = useRouter();
  const { user, logout, setProfilePhoto } = useSession();
  const [notifOn, setNotifOn] = useState(true);
  const fileInputRef = useRef(null);

  const handleLogout = () => {
    // Vraie déconnexion : passe par SessionContext. On renvoie vers
    // l'accueil (pas /login) — un visiteur déconnecté doit revoir la
    // page marketing avec Connexion/Inscription, pas un formulaire imposé.
    logout();
    router.push("/");
  };

  // Upload de la propre photo du Reporter — légitime car c'est son
  // consentement (contrairement aux avatars illustrés des Reporters de
  // démo). Pas de backend de fichiers : on lit l'image en data URL,
  // donc ça ne persiste que pour la session en cours.
  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => setProfilePhoto(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <Header />
      <div className="sf-wrap" style={{ paddingTop: 26, paddingBottom: 50 }}>
        <Dateline>Espace Reporter</Dateline>
        <Card style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24, marginTop: 6 }}>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            style={{ position: "relative", border: "none", background: "none", padding: 0, cursor: "pointer" }}
            aria-label="Changer la photo de profil"
          >
            <Avatar name={user?.name || "Thomas"} size={64} online photoUrl={user?.photoUrl} />
            <span
              style={{
                position: "absolute", bottom: -2, right: -2, width: 24, height: 24, borderRadius: "50%",
                background: "var(--ink)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                border: "2px solid var(--cloud-2)",
              }}
            >
              <Camera size={12} />
            </span>
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoChange} style={{ display: "none" }} />
          <div>
            <div className="sf-display" style={{ fontSize: 18 }}>{user?.name || "Thomas"}</div>
            <div style={{ fontSize: 12.5, color: "var(--slate)" }}>Reporter · 💎 Elite</div>
          </div>
        </Card>


        <Card style={{ marginBottom: 12, display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--cloud)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <MapPin size={16} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Zone de mission</div>
            <div style={{ fontSize: 12, color: "var(--slate)" }}>Paris intra-muros · 10 km</div>
          </div>
        </Card>

        <Card style={{ marginBottom: 12, display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--cloud)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Smartphone size={16} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Équipement déclaré</div>
            <div style={{ fontSize: 12, color: "var(--slate)" }}>iPhone 15 Pro · stabilisateur</div>
          </div>
        </Card>

        <Card style={{ marginBottom: 26, display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--cloud)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Bell size={16} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Notifications de missions</div>
            <div style={{ fontSize: 12, color: "var(--slate)" }}>Push, e-mail, SMS</div>
          </div>
          <Toggle on={notifOn} onChange={setNotifOn} />
        </Card>

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

        <Button full variant="danger" onClick={handleLogout}>
          <LogOut size={15} />Se déconnecter
        </Button>
      </div>
    </div>
  );
}
