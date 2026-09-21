"use client";

import React, { useState } from "react";
import { ChevronDown, CheckCircle2, LifeBuoy } from "lucide-react";
import Header from "@/components/Header";
import RequireAuth from "@/components/RequireAuth";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useSession } from "@/lib/context/SessionContext";

const FAQ_PARTICIPANT = [
  { q: "Que se passe-t-il si aucun Reporter n'accepte ?", a: "Vous n'êtes jamais débité tant qu'un Reporter n'a pas confirmé la mission — le montant pré-autorisé est simplement libéré." },
  { q: "Puis-je annuler après avoir payé ?", a: "Oui. Avant acceptation du Reporter, c'est gratuit. Après acceptation, des frais d'environ 30% du montant pré-autorisé s'appliquent, car le Reporter a bloqué du temps pour vous." },
  { q: "Comment le montant final est-il calculé ?", a: "Sur la durée réelle du live, pas sur le montant affiché à la réservation — vous ne payez jamais plus que ce qui a été pré-autorisé." },
];
const FAQ_REPORTER = [
  { q: "Que se passe-t-il si je ne réponds pas à une demande ?", a: "Après 60 secondes sans réponse, c'est traité comme un refus et la demande part vers le Reporter en ligne le plus proche." },
  { q: "Qu'est-ce qu'un strike ?", a: "Un strike est enregistré si vous acceptez une mission mais ne démarrez jamais le live dans le délai de grâce — visible par l'équipe Shoofmy sur votre profil." },
  { q: "Quand suis-je payé ?", a: "Le montant net (après commission) est calculé à la fin de chaque mission, sur la durée réellement filmée." },
];

export default function SupportPage() {
  return (
    <RequireAuth>
      <SupportContent />
    </RequireAuth>
  );
}

function SupportContent() {
  const { user } = useSession();
  const faq = user?.role === "reporter" ? FAQ_REPORTER : FAQ_PARTICIPANT;
  const [openIdx, setOpenIdx] = useState(0);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const canSend = subject.trim().length > 2 && message.trim().length > 5;

  const handleSend = () => {
    if (!canSend) return;
    // Pas de backend : on simule l'envoi comme le reste du produit
    // (login, réservation…) — un vrai ticket serait créé côté serveur
    // et visible sur /admin/support.
    setSent(true);
  };

  return (
    <div>
      <Header />
      <div className="sf-wrap" style={{ paddingTop: 26, paddingBottom: 50, maxWidth: 480 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22 }}>
          <LifeBuoy size={20} />
          <div className="sf-display" style={{ fontSize: 19 }}>Aide et support</div>
        </div>

        <div style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--slate)", marginBottom: 12 }}>
          QUESTIONS FRÉQUENTES
        </div>
        <Card style={{ marginBottom: 26, padding: 0 }}>
          {faq.map((item, i) => (
            <div key={item.q} style={{ borderTop: i > 0 ? "1px solid var(--line)" : "none" }}>
              <button
                onClick={() => setOpenIdx(openIdx === i ? -1 : i)}
                style={{
                  width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "14px 18px", background: "none", border: "none", textAlign: "left",
                  fontSize: 13.5, fontWeight: 600,
                }}
              >
                {item.q}
                <ChevronDown size={15} color="var(--slate-2)" style={{ transform: openIdx === i ? "rotate(180deg)" : "none", transition: "transform .15s", flexShrink: 0, marginLeft: 10 }} />
              </button>
              {openIdx === i && (
                <div style={{ padding: "0 18px 16px", fontSize: 13, color: "var(--slate)", lineHeight: 1.5 }}>{item.a}</div>
              )}
            </div>
          ))}
        </Card>

        <div style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--slate)", marginBottom: 12 }}>
          CONTACTER LE SUPPORT
        </div>

        {sent ? (
          <Card style={{ textAlign: "center", padding: "32px 20px" }}>
            <CheckCircle2 size={28} color="var(--verified)" style={{ marginBottom: 10 }} />
            <div style={{ fontWeight: 600, fontSize: 14.5, marginBottom: 4 }}>Message envoyé</div>
            <div style={{ fontSize: 12.5, color: "var(--slate)" }}>L'équipe Shoofmy vous répond généralement sous 24h.</div>
          </Card>
        ) : (
          <Card>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, color: "var(--slate)", display: "block", marginBottom: 6 }}>Sujet</label>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Ex. Remboursement d'une mission annulée"
                style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1px solid var(--line)", fontSize: 13.5, background: "var(--cloud)" }}
              />
            </div>
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontSize: 12, color: "var(--slate)", display: "block", marginBottom: 6 }}>Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                placeholder="Décrivez votre problème…"
                style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1px solid var(--line)", fontSize: 13.5, background: "var(--cloud)", resize: "none", fontFamily: "inherit" }}
              />
            </div>
            <Button full onClick={handleSend} disabled={!canSend}>Envoyer</Button>
          </Card>
        )}
      </div>
    </div>
  );
}
