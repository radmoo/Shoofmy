"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, CreditCard, Check } from "lucide-react";
import Header from "@/components/Header";
import Dateline from "@/components/ui/Dateline";
import RequireAuth from "@/components/RequireAuth";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useMission } from "@/lib/context/MissionContext";

export default function PaymentPage() {
  return (
    <RequireAuth role="participant">
      <PaymentContent />
    </RequireAuth>
  );
}

function PaymentContent() {
  const router = useRouter();
  const { activeMission } = useMission();
  const [status, setStatus] = useState("form"); // form | processing | done

  if (!activeMission) {
    return (
      <div>
        <Header leftIcon="back" />
        <div className="sf-wrap" style={{ paddingTop: 40, textAlign: "center" }}>
          <p style={{ color: "var(--slate)", marginBottom: 16 }}>Aucune demande de mission en cours.</p>
          <Button onClick={() => router.push("/explorer")}>Explorer les Reporters</Button>
        </div>
      </div>
    );
  }

  const handlePreAuth = () => {
    setStatus("processing");
    setTimeout(() => setStatus("done"), 1000);
  };

  if (status === "done") {
    return (
      <div>
        <div className="sf-wrap" style={{ paddingTop: 70, textAlign: "center" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(23,185,120,0.12)", color: "var(--verified)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <Check size={28} />
          </div>
          <h2 className="sf-display" style={{ fontSize: 22, marginBottom: 8 }}>Carte pré-autorisée</h2>
          <p style={{ fontSize: 14, color: "var(--slate)", marginBottom: 28 }}>
            {activeMission.preAuthEstimate} € bloqués (pas prélevés). En attente de la réponse de {activeMission.reporterName}.
          </p>
          <Button onClick={() => router.push("/waiting")}>Voir le statut de la demande</Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header leftIcon="back" />
      <div className="sf-wrap" style={{ paddingTop: 26, paddingBottom: 50 }}>
        <Dateline>Avant mission</Dateline>
        <h1 className="sf-display" style={{ fontSize: 20, marginBottom: 6 }}>Pré-autorisation</h1>
        <p style={{ fontSize: 12.5, color: "var(--slate)", marginBottom: 22 }}>
          Le montant est bloqué sur votre carte, pas prélevé. Vous ne payez réellement qu'à la fin de la mission, selon sa durée effective.
        </p>

        <Card style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5, padding: "4px 0" }}>
            <span style={{ color: "var(--slate)" }}>Reporter</span>
            <span>{activeMission.reporterName}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5, padding: "4px 0" }}>
            <span style={{ color: "var(--slate)" }}>Mode</span>
            <span>{activeMission.scheduleMode === "now" ? "Maintenant" : `Programmé · ${activeMission.scheduledAt?.replace("T", " ")}`}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5, padding: "4px 0" }}>
            <span style={{ color: "var(--slate)" }}>Durée estimée</span>
            <span>{activeMission.duration}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid var(--line)", marginTop: 8, paddingTop: 12 }}>
            <span style={{ color: "var(--slate)" }}>Montant pré-autorisé</span>
            <span className="sf-mono" style={{ fontSize: 18, fontWeight: 600 }}>{activeMission.preAuthEstimate} €</span>
          </div>
        </Card>

        <Card style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <CreditCard size={18} color="var(--slate)" />
          <div style={{ fontSize: 14 }}>Visa •••• 4242</div>
        </Card>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: 12, color: "var(--slate)", marginBottom: 18 }}>
          <Lock size={12} />Pré-autorisation sécurisée
        </div>

        <Button full disabled={status === "processing"} onClick={handlePreAuth}>
          {status === "processing" ? "Traitement…" : `Pré-autoriser ${activeMission.preAuthEstimate} €`}
        </Button>

        {/* Politique d'annulation par paliers — explicitée avant paiement
           plutôt que découverte après coup dans les CGU. */}
        <div style={{ marginTop: 20, padding: "14px 16px", borderRadius: 14, background: "var(--cloud-2)", border: "1px solid var(--line)" }}>
          <div className="sf-mono" style={{ fontSize: 10.5, color: "var(--slate)", marginBottom: 8, letterSpacing: "0.03em" }}>
            SI VOUS ANNULEZ ENSUITE
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12, color: "var(--slate)" }}>
            <div>Avant que le Reporter accepte — <strong style={{ color: "var(--ink)" }}>gratuit</strong>.</div>
            <div>Après acceptation, avant le début du live — <strong style={{ color: "var(--ink)" }}>~30 % du montant</strong> (le Reporter a bloqué du temps).</div>
            <div>S'il ne se présente pas — <strong style={{ color: "var(--ink)" }}>remboursement intégral</strong> + signalement sur son profil.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
