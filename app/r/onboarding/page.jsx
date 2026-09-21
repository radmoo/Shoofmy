"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Smartphone, Upload, CheckCircle2, Clock, XCircle, Star, ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Dateline from "@/components/ui/Dateline";
import Header from "@/components/Header";
import { useSession } from "@/lib/context/SessionContext";

const STEPS = ["Profil", "Équipement", "Vérification"];

export default function ReporterOnboardingPage() {
  const router = useRouter();
  const { login } = useSession();
  const [step, setStep] = useState(0);
  // Écran d'introduction avant le formulaire — évite l'effet "formulaire
  // d'inscription sorti de nulle part" en expliquant d'abord le rôle,
  // le déroulé, et ce que le Reporter garde comme contrôle.
  const [introSeen, setIntroSeen] = useState(false);
  const [city, setCity] = useState("");
  const [device, setDevice] = useState("");
  const [idUploaded, setIdUploaded] = useState(false);
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  // "pending" | "approved" | "rejected" — simule une vraie file de
  // vérification (cahier des charges section 12) au lieu de connecter
  // le Reporter immédiatement. Pas de vrai backend de modération, donc
  // deux boutons de démo permettent de voir les deux issues possibles.
  const [reviewStatus, setReviewStatus] = useState(null);
  const REJECTION_REASON = "Photo de la pièce d'identité floue ou illisible. Merci de reprendre la photo dans un endroit bien éclairé.";

  const canNext = [city.trim().length > 1, device.trim().length > 1, idUploaded][step];

  const handleSubmit = () => {
    // On ne connecte plus immédiatement : la candidature passe d'abord
    // par un état "en attente", comme une vraie file de modération le
    // ferait. login() n'est appelé qu'après une approbation (simulée).
    setSubmitted(true);
    setReviewStatus("pending");
  };

  const handleApprove = () => {
    login(name.trim() || "Nouveau Reporter", "reporter");
    setReviewStatus("approved");
  };

  const handleReject = () => setReviewStatus("rejected");

  const retryUpload = () => {
    setIdUploaded(false);
    setSubmitted(false);
    setReviewStatus(null);
    setStep(2);
  };

  if (submitted && reviewStatus === "pending") {
    return (
      <div>
        <Header />
        <div className="sf-wrap" style={{ maxWidth: 420, paddingTop: 70, textAlign: "center" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--amber-tint)", color: "var(--amber)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <Clock size={26} />
          </div>
          <h2 className="sf-display" style={{ fontSize: 22, marginBottom: 8 }}>Vérification en cours</h2>
          <p style={{ fontSize: 14, color: "var(--slate)", marginBottom: 28 }}>
            On examine vos documents. Ça prend généralement moins de 24h — vous recevrez une notification.
          </p>
          <div style={{ display: "flex", gap: 10 }}>
            <Button full onClick={handleApprove}>Simuler l'approbation (démo)</Button>
            <Button full variant="ghost" onClick={handleReject}>Simuler un refus (démo)</Button>
          </div>
        </div>
      </div>
    );
  }

  if (submitted && reviewStatus === "rejected") {
    return (
      <div>
        <Header />
        <div className="sf-wrap" style={{ maxWidth: 420, paddingTop: 70, textAlign: "center" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--signal-tint)", color: "var(--signal)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <XCircle size={26} />
          </div>
          <h2 className="sf-display" style={{ fontSize: 22, marginBottom: 8 }}>Vérification refusée</h2>
          <p style={{ fontSize: 14, color: "var(--slate)", marginBottom: 18 }}>
            Un ou plusieurs documents n'ont pas pu être validés.
          </p>
          <div style={{ background: "var(--signal-tint)", border: "1px solid rgba(217,54,31,0.2)", borderRadius: "var(--radius-s)", padding: "14px 16px", fontSize: 13, textAlign: "left", lineHeight: 1.5, marginBottom: 26 }}>
            <div className="sf-mono" style={{ fontSize: 10.5, color: "var(--signal)", fontWeight: 600, marginBottom: 6 }}>MOTIF</div>
            {REJECTION_REASON}
          </div>
          <Button full onClick={retryUpload}>Réessayer</Button>
        </div>
      </div>
    );
  }

  if (submitted && reviewStatus === "approved") {
    return (
      <div>
        <Header />
        <div className="sf-wrap" style={{ maxWidth: 420, paddingTop: 70, textAlign: "center" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(23,185,120,0.12)", color: "var(--verified)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <CheckCircle2 size={28} />
          </div>
          <h2 className="sf-display" style={{ fontSize: 22, marginBottom: 8 }}>Vérification approuvée</h2>
          <p style={{ fontSize: 14, color: "var(--slate)", marginBottom: 28 }}>
            Votre identité est vérifiée. Votre profil Reporter est actif — en production, l'approbation viendrait d'une vraie équipe de modération.
          </p>
          <Button onClick={() => router.push("/r/dashboard")}>Aller au tableau de bord</Button>
        </div>
      </div>
    );
  }

  if (!introSeen) {
    return (
      <div>
        <Header />
        <div className="sf-wrap" style={{ maxWidth: 420, paddingTop: 40, paddingBottom: 50 }}>
          <Dateline>Devenir Reporter</Dateline>
          <h1 className="sf-display" style={{ fontSize: 24, marginBottom: 14, lineHeight: 1.15 }}>
            Devenez les yeux de quelqu'un, sur place.
          </h1>
          <p style={{ fontSize: 14, color: "var(--slate)", lineHeight: 1.55, marginBottom: 30 }}>
            Vous êtes à Paris, Amsterdam, Tokyo, Barcelone… ? Avec Shoofmy, des personnes peuvent vous demander de leur montrer un lieu, un produit, un événement ou une situation en direct.
          </p>

          <h2 className="sf-mono" style={{ fontSize: 12, color: "var(--slate)", textTransform: "uppercase", marginBottom: 14 }}>
            Comment ça fonctionne ?
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 30 }}>
            {[
              { n: "1", title: "Vous indiquez où vous êtes", desc: "Votre ville et votre profil permettent aux participants de vous trouver." },
              { n: "2", title: "Vous acceptez une mission", desc: "Vous recevez une demande et décidez si vous souhaitez l'accepter." },
              { n: "3", title: "Vous faites le live", desc: "Vous vous rendez sur place, lancez la caméra et guidez le participant." },
            ].map((s) => (
              <div key={s.n} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <div className="sf-display" style={{ width: 32, height: 32, flexShrink: 0, borderRadius: 999, background: "var(--ink)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13.5 }}>
                  {s.n}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{s.title}</div>
                  <div style={{ fontSize: 12.5, color: "var(--slate)", lineHeight: 1.4 }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <Card style={{ marginBottom: 30 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Vous gardez le contrôle</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                "Vous choisissez vos disponibilités",
                "Vous acceptez ou refusez chaque demande",
                "Vous êtes payé pour le temps réalisé",
                "Les participants vous évaluent après la mission",
              ].map((t, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: "var(--slate)" }}>
                  <Star size={12} color="var(--ember)" fill="var(--ember)" style={{ flexShrink: 0 }} />
                  {t}
                </div>
              ))}
            </div>
          </Card>

          <Button full onClick={() => setIntroSeen(true)}>
            Commencer mon profil<ArrowRight size={15} />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="sf-wrap" style={{ maxWidth: 420, paddingTop: 40, paddingBottom: 50 }}>
        <div style={{ display: "flex", gap: 6, marginBottom: 22 }}>
          {STEPS.map((_, i) => (
            <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= step ? "var(--ink)" : "var(--line)" }} />
          ))}
        </div>
        <div className="sf-mono" style={{ fontSize: 12, color: "var(--slate)", marginBottom: 20 }}>
          Étape {step + 1} sur {STEPS.length} · {STEPS[step]}
        </div>

        {step === 0 && (
          <>
            <Dateline>Étape 1 / 3</Dateline>
            <h1 className="sf-display" style={{ fontSize: 22, marginBottom: 20 }}>Votre profil</h1>
            <Card style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, padding: "0 14px" }}>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Votre nom" style={{ border: "none", outline: "none", padding: "13px 0", fontSize: 14.5, flex: 1 }} />
            </Card>
            <Card style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 14px" }}>
              <MapPin size={16} color="var(--slate)" />
              <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Ville" style={{ border: "none", outline: "none", padding: "13px 0", fontSize: 14.5, flex: 1 }} />
            </Card>
          </>
        )}

        {step === 1 && (
          <>
            <Dateline>Étape 2 / 3</Dateline>
            <h1 className="sf-display" style={{ fontSize: 22, marginBottom: 20 }}>Votre équipement</h1>
            <Card style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 14px" }}>
              <Smartphone size={16} color="var(--slate)" />
              <input value={device} onChange={(e) => setDevice(e.target.value)} placeholder="iPhone 15 Pro" style={{ border: "none", outline: "none", padding: "13px 0", fontSize: 14.5, flex: 1 }} />
            </Card>
          </>
        )}

        {step === 2 && (
          <>
            <Dateline>Étape 3 / 3</Dateline>
            <h1 className="sf-display" style={{ fontSize: 22, marginBottom: 20 }}>Vérification d'identité</h1>
            <div
              onClick={() => setIdUploaded(true)}
              style={{
                border: `1.5px ${idUploaded ? "solid var(--verified)" : "dashed var(--line)"}`,
                background: idUploaded ? "rgba(23,185,120,0.05)" : "var(--cloud-2)",
                borderRadius: 16, padding: "26px 18px", textAlign: "center", cursor: "pointer",
              }}
            >
              <div style={{ width: 42, height: 42, borderRadius: "50%", background: idUploaded ? "rgba(23,185,120,0.15)" : "var(--cloud)", color: idUploaded ? "var(--verified)" : "var(--slate)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                {idUploaded ? <CheckCircle2 size={20} /> : <Upload size={18} />}
              </div>
              <div style={{ fontSize: 13.5, fontWeight: 600 }}>{idUploaded ? "Pièce d'identité ajoutée" : "Ajouter une pièce d'identité"}</div>
            </div>
          </>
        )}

        <div style={{ marginTop: 26 }}>
          <Button
            full
            disabled={!canNext}
            onClick={step === STEPS.length - 1 ? handleSubmit : () => setStep((s) => s + 1)}
          >
            {step === STEPS.length - 1 ? "Envoyer ma candidature" : "Continuer"}
          </Button>
        </div>
      </div>
    </div>
  );
}
