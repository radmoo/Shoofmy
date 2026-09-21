"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, CheckCircle2, ArrowLeft } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Header from "@/components/Header";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const canSubmit = email.includes("@");

  if (sent) {
    return (
      <div>
        <Header variant="auth" />
        <div className="sf-wrap" style={{ maxWidth: 400, paddingTop: 70, textAlign: "center" }}>
          <div style={{ width: 60, height: 60, borderRadius: "50%", background: "var(--teal-tint)", color: "var(--teal)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <CheckCircle2 size={26} />
          </div>
          <h2 className="sf-display" style={{ fontSize: 21, marginBottom: 8 }}>Lien envoyé</h2>
          <p style={{ fontSize: 13.5, color: "var(--slate)", marginBottom: 26 }}>
            Si un compte existe pour {email}, un lien de réinitialisation vient d'être envoyé.
          </p>
          <Button onClick={() => router.push("/login")}>Retour à la connexion</Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header variant="auth" />
      <div className="sf-wrap" style={{ maxWidth: 400, paddingTop: 60, paddingBottom: 60 }}>
        <button
          onClick={() => router.push("/login")}
          style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "var(--slate)", fontSize: 12.5, cursor: "pointer", marginBottom: 20, padding: 0 }}
        >
          <ArrowLeft size={13} />Retour
        </button>

        <div className="sf-display" style={{ fontSize: 20, marginBottom: 6 }}>Mot de passe oublié</div>
        <p style={{ fontSize: 13, color: "var(--slate)", marginBottom: 26 }}>
          On vous envoie un lien de réinitialisation par email.
        </p>

        <Card style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, padding: "0 14px" }}>
          <Mail size={16} color="var(--slate)" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="vous@exemple.com"
            style={{ border: "none", outline: "none", padding: "13px 0", fontSize: 14.5, flex: 1 }}
          />
        </Card>

        <Button full disabled={!canSubmit} onClick={() => setSent(true)}>Envoyer le lien</Button>
      </div>
    </div>
  );
}
