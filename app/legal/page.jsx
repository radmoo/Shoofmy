"use client";

import React, { useState } from "react";
import Header from "@/components/Header";

const TABS = [
  { id: "cgu", label: "Conditions d'utilisation" },
  { id: "privacy", label: "Confidentialité" },
];

const CGU = [
  { title: "1. Objet", text: "Les présentes Conditions Générales d'Utilisation régissent l'accès et l'usage de la plateforme Shoofmy." },
  { title: "2. Comptes utilisateurs", text: "Chaque utilisateur est responsable de l'exactitude des informations fournies lors de son inscription." },
  { title: "3. Statut des Reporters", text: "Les Reporters interviennent en tant que prestataires indépendants." },
  { title: "4. Paiement et frais", text: "À la réservation, le montant estimé de la mission est pré-autorisé sur votre moyen de paiement (bloqué, non prélevé). Le montant réellement facturé est calculé à la fin de la mission, selon sa durée effective, dans la limite du montant pré-autorisé." },
  { title: "5. Annulation et no-show", text: "Une annulation avant l'acceptation du Reporter est gratuite. Une annulation après acceptation entraîne des frais correspondant à une partie du montant pré-autorisé, pour compenser le temps bloqué par le Reporter. Si le Reporter accepté ne démarre pas la mission dans le délai imparti (no-show), celle-ci est automatiquement annulée, le Participant est intégralement remboursé et un signalement est enregistré sur le profil du Reporter." },
  { title: "6. Droit à l'image et responsabilité du contenu filmé", text: "Le Reporter s'engage à respecter le droit à l'image et la vie privée des personnes filmées, à obtenir leur consentement lorsque nécessaire, et à ne filmer que dans des lieux où il est autorisé à le faire. Shoofmy agit comme intermédiaire technique et n'est pas responsable du contenu diffusé pendant une session live ; le Reporter en reste seul responsable. Tout manquement signalé peut entraîner la suspension du compte concerné." },
];

const PRIVACY = [
  { title: "1. Données collectées", text: "Shoofmy collecte les informations fournies à l'inscription et les données de localisation nécessaires au service." },
  { title: "2. Usage des données", text: "Les données sont utilisées pour fournir le service et assurer la sécurité de la plateforme." },
  { title: "3. Vos droits", text: "Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression de vos données." },
];

export default function LegalPage() {
  const [tab, setTab] = useState("cgu");
  const sections = tab === "cgu" ? CGU : PRIVACY;

  return (
    <div>
      <Header variant="auth" />
      <div className="sf-wrap" style={{ maxWidth: 640, paddingTop: 26, paddingBottom: 50 }}>
        <h1 className="sf-display" style={{ fontSize: 24, marginBottom: 20 }}>Informations légales</h1>

      <div style={{ display: "flex", gap: 8, marginBottom: 26 }}>
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              fontSize: 13, fontWeight: 600, padding: "9px 16px", borderRadius: 999,
              border: `1px solid ${tab === t.id ? "var(--ink)" : "var(--line)"}`,
              background: tab === t.id ? "var(--ink)" : "var(--cloud-2)",
              color: tab === t.id ? "#fff" : "var(--slate)",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {sections.map((s) => (
        <div key={s.title} style={{ marginBottom: 26 }}>
          <div className="sf-display" style={{ fontSize: 16, marginBottom: 8 }}>{s.title}</div>
          <div style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.65 }}>{s.text}</div>
        </div>
      ))}
      </div>
    </div>
  );
}
