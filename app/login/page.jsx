"use client";

import React, { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, User, Camera, Eye, EyeOff, ArrowRight, ShieldCheck, ChevronRight, LogIn, UserPlus } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Header from "@/components/Header";
import { useSession } from "@/lib/context/SessionContext";

// useSearchParams() exige une frontière Suspense côté Next.js (App
// Router) — sans ça, le build échoue. Le contenu réel est déporté dans
// LoginContent, ce wrapper ne fait que fournir cette frontière.
export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  );
}

// Petits logos de marque (Google / Apple / Facebook) — non fournis par
// lucide-react, donc SVG inline minimal. Boutons décoratifs uniquement :
// pas de vrai OAuth branché pour l'instant, cf. handleSocial ci-dessous.
function GoogleMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48">
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.9 2.4 30.4 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.1 17.7 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.6c-.5 3-2.2 5.5-4.7 7.2l7.4 5.7c4.3-4 6.8-9.9 6.8-17.4z"/>
      <path fill="#FBBC05" d="M10.5 19.3c-.5 1.5-.8 3.1-.8 4.7s.3 3.2.8 4.7l-7.9 6.1C1 31.4 0 27.8 0 24s1-7.4 2.6-10.8l7.9 6.1z"/>
      <path fill="#34A853" d="M24 48c6.4 0 11.9-2.1 15.8-5.8l-7.4-5.7c-2.1 1.4-4.9 2.3-8.4 2.3-6.3 0-11.6-3.6-13.5-8.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z"/>
    </svg>
  );
}
function AppleMark() {
  return (
    <svg width="15" height="15" viewBox="0 0 384 512" fill="#14171c">
      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141 0 184.8 0 273.5c0 26.2 4.8 53.3 14.4 81.2 12.8 37.5 59 129.3 107.2 127.8 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-84.1 102.6-121.7-65.2-30.7-57.7-90-57.7-92.1zM256.8 76.6c26.9-32 24.4-61.1 23.6-71.6-23.7 1.4-51.1 16.4-66.8 34.9-17.3 19.8-27.5 44.3-25.3 71.9 25.9 2 49.5-11.4 68.5-35.2z"/>
    </svg>
  );
}
function FacebookMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#1877F2">
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46H15.2c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.91h-2.34V22c4.78-.79 8.44-4.94 8.44-9.94Z"/>
    </svg>
  );
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const { login, loginAsAdmin } = useSession();
  const [mode, setMode] = useState("login"); // login | signup
  const [role, setRole] = useState("participant");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const canSubmit = mode === "login"
    ? email.includes("@") && password.length >= 6
    : email.includes("@") && password.length >= 6 && name.trim().length > 1;

  const handleSubmit = () => {
    if (!canSubmit) return;
    // Pas de backend : on simule la création/connexion en écrivant
    // directement dans SessionContext. Le jour où une vraie API existe,
    // seul ce handler change — RequireAuth et le reste de l'app n'ont
    // rien à savoir de la différence.
    const displayName = mode === "signup" ? name : email.split("@")[0];
    login(displayName, role);
    // Priorité au retour vers la page d'origine (ex. la fiche Reporter
    // qu'on regardait avant de devoir se connecter pour réserver) —
    // sinon comportement par défaut selon le rôle.
    router.push(redirect || (role === "reporter" ? "/r/dashboard" : "/explorer"));
  };

  // Connexion sociale : pas encore de vrai OAuth branché derrière, ces
  // boutons sont volontairement décoratifs pour l'instant (maquette).
  const handleSocial = (_provider) => {};

  return (
    <div>
      <Header variant="auth" />
      <div className="sf-wrap" style={{ maxWidth: 440, paddingTop: 28, paddingBottom: 60 }}>
      {/* Bloc d'accroche + visuel — côte à côte comme la V2, image
          agrandie et non rognée (contain), sans cadre/ombre. */}
      <div style={{ display: "flex", flexWrap: "nowrap", alignItems: "center", gap: 12, marginBottom: 26 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 className="sf-display" style={{ fontSize: 25, lineHeight: 1.05, margin: 0 }}>
            Bienvenue<br />sur <span style={{ color: "var(--signal)" }}>Shoofmy</span>
          </h1>
          <p style={{ fontSize: 12.5, color: "var(--slate)", marginTop: 10, marginBottom: 0, lineHeight: 1.4 }}>
            Connectez-vous pour continuer à explorer le monde en direct.
          </p>
        </div>
        <img
          src="/login-globe.webp"
          alt="Reporters en direct partout dans le monde"
          style={{
            width: "58%", maxWidth: 250, height: "auto", flexShrink: 0,
            objectFit: "contain",
          }}
        />
      </div>

      {/* Tabs Connexion / Inscription */}
      <div style={{ display: "flex", background: "var(--line)", borderRadius: 999, padding: 3, marginBottom: 18 }}>
        {["login", "signup"].map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              padding: 10, borderRadius: 999, fontSize: 13.5, fontWeight: 600, border: "none",
              background: mode === m ? "var(--cloud-2)" : "transparent",
              color: mode === m ? "var(--ink)" : "var(--slate)",
              boxShadow: mode === m ? "var(--shadow-card)" : "none",
            }}
          >
            {m === "login" ? <LogIn size={14} /> : <UserPlus size={14} />}
            {m === "login" ? "Connexion" : "Inscription"}
          </button>
        ))}
      </div>

      {mode === "signup" && (
        <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
          {[
            { id: "participant", icon: User, label: "Participant" },
            { id: "reporter", icon: Camera, label: "Reporter" },
          ].map((r) => (
            <div
              key={r.id}
              onClick={() => setRole(r.id)}
              style={{
                flex: 1, textAlign: "center", padding: 14, borderRadius: "var(--radius-m)", cursor: "pointer",
                border: `1.5px solid ${role === r.id ? "var(--ink)" : "var(--line)"}`,
                background: role === r.id ? "var(--ink)" : "var(--cloud-2)",
                color: role === r.id ? "#fff" : "var(--ink)",
              }}
            >
              <r.icon size={18} style={{ marginBottom: 6 }} />
              <div style={{ fontSize: 12.5, fontWeight: 600 }}>{r.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Connexion sociale — décoratif pour l'instant, cf. handleSocial */}
      <div style={{ display: "flex", flexWrap: "nowrap", gap: 8, marginBottom: 16 }}>
        {[
          { id: "google", mark: <GoogleMark />, label: "Google" },
          { id: "apple", mark: <AppleMark />, label: "Apple" },
          { id: "facebook", mark: <FacebookMark />, label: "Facebook" },
        ].map((p) => (
          <button
            key={p.id}
            onClick={() => handleSocial(p.id)}
            style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              minWidth: 0, padding: "12px 6px", borderRadius: "var(--radius-m)",
              background: "var(--cloud-2)", border: "1px solid var(--line)",
              boxShadow: "var(--shadow-card)", fontSize: 11, fontWeight: 600, color: "var(--ink)",
            }}
          >
            {p.mark}
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.label}</span>
          </button>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <div style={{ flex: 1, height: 1, background: "var(--line)" }} />
        <span style={{ fontSize: 11.5, color: "var(--slate-2)", whiteSpace: "nowrap" }}>ou continuer avec</span>
        <div style={{ flex: 1, height: 1, background: "var(--line)" }} />
      </div>

      {mode === "signup" && (
        <Card style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, padding: "0 14px" }}>
          <User size={16} color="var(--slate)" />
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nom complet"
            style={{ border: "none", outline: "none", padding: "13px 0", fontSize: 14.5, flex: 1 }}
          />
        </Card>
      )}

      <Card style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, padding: "0 14px" }}>
        <Mail size={16} color="var(--slate)" />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Votre adresse e-mail"
          style={{ border: "none", outline: "none", padding: "13px 0", fontSize: 14.5, flex: 1 }}
        />
      </Card>

      <Card style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, padding: "0 14px" }}>
        <Lock size={16} color="var(--slate)" />
        <input
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Votre mot de passe"
          style={{ border: "none", outline: "none", padding: "13px 0", fontSize: 14.5, flex: 1 }}
        />
        <button
          type="button"
          onClick={() => setShowPassword((v) => !v)}
          style={{ background: "none", border: "none", padding: 4, display: "flex", cursor: "pointer", color: "var(--slate)" }}
          aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
        >
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </Card>

      {mode === "login" && (
        <button
          onClick={() => router.push("/forgot-password")}
          style={{ display: "block", marginLeft: "auto", background: "none", border: "none", fontSize: 12.5, color: "var(--signal)", cursor: "pointer", padding: 0, marginBottom: 22, fontWeight: 600 }}
        >
          Mot de passe oublié ?
        </button>
      )}

      <Button
        full
        disabled={!canSubmit}
        onClick={handleSubmit}
        style={{ background: "var(--signal)", color: "#fff", gap: 8 }}
      >
        {mode === "login" ? "Se connecter" : "Créer mon compte"}
        <ArrowRight size={16} />
      </Button>

      <Card
        onClick={() => { loginAsAdmin(); router.push("/admin/users"); }}
        style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 18, padding: 14 }}
      >
        <div style={{
          width: 38, height: 38, borderRadius: "50%", flexShrink: 0,
          background: "var(--signal-tint)", color: "var(--signal)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <ShieldCheck size={18} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700 }}>Accès démo Admin</div>
          <div style={{ fontSize: 11.5, color: "var(--slate)", lineHeight: 1.3 }}>
            Accès de démonstration (pas de vrai contrôle d'accès pour l'instant)
          </div>
        </div>
        <ChevronRight size={16} color="var(--signal)" style={{ flexShrink: 0 }} />
      </Card>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 20 }}>
        <ShieldCheck size={13} color="var(--slate-2)" />
        <span style={{ fontSize: 11, color: "var(--slate-2)" }}>Vos données sont sécurisées et confidentielles.</span>
      </div>
      </div>
    </div>
  );
}
