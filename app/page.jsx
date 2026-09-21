"use client";

import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search,
  Globe,
  MapPin,
  Star,
  Zap,
  Camera,
  ShieldCheck,
  ArrowRight,
  Home,
  UtensilsCrossed,
  CalendarClock,
  Radio,
  Users,
  MessageCircle,
  CreditCard,
  Clock,
  Headphones,
  UserPlus,
  Video,
  Glasses,
  Check,
} from "lucide-react";
import Header from "@/components/Header";
import { useSession } from "@/lib/context/SessionContext";
import { REPORTERS, DURATIONS } from "@/lib/mock-data";
import { useReveal } from "@/lib/useReveal";

// Catégories de vitrine pour la nav desktop — reflètent les 6 cas
// d'usage de la section "Vous voulez voir quoi ?" plus bas sur la même
// page, pas une vraie taxonomie de filtrage (pas de route dédiée à ce stade).
const CATEGORIES = [
  "Tout",
  "Logement",
  "Restaurants",
  "Produits",
  "Événements",
  "Situations en direct",
  "Lieux à distance",
];

// Landing publique — inspirée du mockup desktop (recherche, cards LIVE
// empilées, stats en bandeau) + du cahier des charges mobile-first
// (CTA sticky, animations légères, nav catégories desktop uniquement).
// Les 4 stats sont calculées dynamiquement depuis les vraies données
// mock (REPORTERS) — aucun chiffre de vitrine tapé en dur. Si le mock
// évolue (plus de reporters, plus de villes), l'accueil suit sans
// retouche manuelle.
export default function RootPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useSession();
  const pageRef = useRef(null);
  useReveal(pageRef);

  if (isAuthenticated) {
    const home = { participant: "/explorer", reporter: "/r/dashboard", admin: "/admin/users" }[user.role] || "/login";
    router.replace(home);
    return null;
  }

  const onlineCount = REPORTERS.filter((r) => r.online).length;
  const totalReportersCount = REPORTERS.length;
  const citiesCoveredCount = new Set(REPORTERS.map((r) => r.city)).size;
  const verifiedPercent = Math.round((REPORTERS.filter((r) => r.verified).length / totalReportersCount) * 100);

  // Reporter mis en avant dans le hero — vraie entrée du mock, pas un
  // nom inventé façon "Lucas / Lisbonne" du mockup.
  const heroReporter = REPORTERS.find((r) => r.city === "Lisbonne" && r.online) || REPORTERS[0];

  // Rotation des 3 cartes empilées du hero : chaque carte occupe une des
  // 3 positions fixes (avant-plan large + légende / milieu tournée / fond
  // tournée), et le contenu qui occupe chaque position change au fil du
  // temps — la carte en avant-plan "part" vers l'arrière, celle du milieu
  // passe devant, etc. Seul l'index de rotation change ; les 3 positions
  // elles-mêmes (top/right/left/rotate/zIndex) restent identiques à
  // avant, donc l'agencement visuel general du hero n'est pas modifié.
  const heroVisuals = [
    {
      id: "mateo",
      // Carte vidéo : "video" prend le pas sur "photo" au rendu (voir plus bas).
      // "photo" reste en fallback/poster tant que la vidéo n'a pas chargé.
      video: "/hero-videos/dubai-marina.mp4",
      // Poster = image extraite de la vidéo elle-même (au lieu de l'ancienne
      // photo Lisbonne) : cohérence visuelle pendant le court instant de chargement.
      photo: "/hero-videos/dubai-marina-poster.jpg",
      name: heroReporter?.name || "Mateo",
      rating: heroReporter?.rating?.toFixed(1) || "4.7",
      // La légende suit désormais la vidéo (Dubaï), plus le reporter mock
      // "Lisbonne" utilisé avant — les deux n'ont plus de raison de coïncider.
      place: "Dubaï Marina",
      country: "Émirats arabes unis",
    },
    {
      id: "luca",
      video: "/hero-videos/canton-fair.mp4",
      photo: "/hero-videos/canton-fair-poster.jpg",
      name: "Luca",
      rating: "4.8",
      place: "Foire de Canton",
      country: "Chine",
    },
    {
      id: "camila",
      video: "/hero-videos/chefchaouen.mp4",
      photo: "/hero-videos/chefchaouen-poster.jpg",
      name: "Camila",
      rating: "4.9",
      place: "Chefchaouen",
      country: "Maroc",
    },
  ];
  const [heroOffset, setHeroOffset] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroOffset((o) => (o + 1) % heroVisuals.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Style de chaque position (0 = avant-plan, 1 = milieu, 2 = fond) —
  // valeurs identiques à l'agencement statique précédent, mais exprimées
  // uniquement en "left" (jamais "right") : passer d'une valeur "right"
  // à "auto" (ou l'inverse) n'est pas animable en CSS, ce qui causait le
  // saut brusque au lieu d'un glissement fluide entre les positions.
  const HERO_SLOT_STYLE = [
    { top: 32, left: "0%", width: "60%", height: "78%", zIndex: 3, transform: "rotate(0deg)" },
    { top: 16, left: "34%", width: "54%", height: "72%", zIndex: 2, transform: "rotate(-5deg)" },
    { top: 0, left: "54%", width: "50%", height: "66%", zIndex: 1, transform: "rotate(7deg)" },
  ];

  return (
    <div ref={pageRef}>
      {/* Précharge la vidéo hero en priorité maximale, avant même que le
          navigateur atteigne la balise <video> plus bas dans la page —
          Next.js App Router remonte automatiquement ce <link> dans le <head>. */}
      <link rel="preload" as="video" href="/hero-videos/dubai-marina.mp4" type="video/mp4" />
      <link rel="preload" as="video" href="/hero-videos/canton-fair.mp4" type="video/mp4" />
      <link rel="preload" as="video" href="/hero-videos/chefchaouen.mp4" type="video/mp4" />
      <Header />

      <div className="sf-landing-wrap">
        {/* Navigation par catégories — desktop uniquement (cf. globals.css) */}
        <nav className="sf-category-nav">
          {CATEGORIES.map((c, i) => (
            <span key={c} className={`sf-category-pill${i === 0 ? " active" : ""}`}>{c}</span>
          ))}
        </nav>

        {/* Barre de recherche */}
        <div className="sf-landing-search">
          <Search size={18} style={{ color: "var(--slate)", flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Que cherchez-vous aujourd'hui ?"
            style={{ border: "none", outline: "none", background: "transparent", flex: 1, fontSize: 14.5, color: "var(--ink)" }}
          />
          <MapPin size={18} style={{ color: "var(--slate)", flexShrink: 0 }} />
        </div>

        {/* Hero */}
        <div className="sf-hero-grid">
          <div>
            <h1 className="sf-display" style={{ fontSize: "clamp(28px, 8vw, 54px)", lineHeight: 0.98, marginBottom: 10, textTransform: "uppercase" }}>
              Quelqu'un,<br />sur place.<br /><span style={{ color: "var(--signal)" }}>Pour vous.</span>
            </h1>
            <p style={{ fontSize: 12.5, color: "var(--slate)", maxWidth: 440, marginBottom: 6, lineHeight: 1.4 }}>
              Vous voulez voir quelque chose qui est loin ? Un Reporter Shoofmy se rend sur place et vous le montre en direct.
            </p>
            <p className="sf-display" style={{ fontSize: 12.5, marginBottom: 14, lineHeight: 1.3, textTransform: "uppercase" }}>
              Un besoin. Une curiosité. Une envie.<br />Vous choisissez. Le Reporter filme.
            </p>
            {/* Prix : donnée réelle (lib/mock-data DURATIONS), pas un chiffre inventé —
                affiche le palier le moins cher, le reste est expliqué dans "Comment ça marche". */}
            <p style={{ fontSize: 11, color: "var(--slate)", marginBottom: 14 }}>
              À partir de <strong style={{ color: "var(--ink)" }}>{DURATIONS[0].price} €</strong> · le prix dépend de la durée, vous ne payez que le temps réellement filmé.
            </p>
            {/* CTA empilées verticalement, comme dans le design de référence */}
            <div className="sf-hero-ctas" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <Link href="/explorer">
                <span className="sf-btn" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "12px 16px", borderRadius: 10, background: "var(--ink)", color: "#fff", fontWeight: 600, fontSize: 12.5, whiteSpace: "nowrap" }}>
                  <Zap size={13} />Trouver un reporter<ArrowRight size={13} />
                </span>
              </Link>
              <Link href="/r/onboarding">
                <span className="sf-btn" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "12px 16px", borderRadius: 10, background: "var(--surface)", border: "1px solid var(--line)", color: "var(--ink)", fontWeight: 600, fontSize: 12.5, whiteSpace: "nowrap" }}>
                  <UserPlus size={13} />Devenir Reporter
                </span>
              </Link>
            </div>
          </div>

          {/* Cards LIVE empilées */}
          <div className="sf-hero-visual">
            {/* Pin de localisation + trajectoire pointillée — décor du mockup */}
            <div style={{ position: "absolute", top: -20, right: 2, zIndex: 5, color: "var(--signal)" }}>
              <MapPin size={24} fill="var(--signal)" style={{ color: "var(--signal)" }} />
            </div>
            {/* Petite bulle avatar + chat — décor du mockup, bas-droite de la pile */}
            <div style={{ position: "absolute", bottom: -14, right: -6, zIndex: 6, display: "flex", alignItems: "flex-end", gap: 5 }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  border: "2px solid var(--surface)",
                  boxShadow: "var(--shadow-card)",
                  backgroundImage: "url(https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&w=100&h=100&q=60)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <div
                style={{
                  background: "#fff",
                  borderRadius: 999,
                  padding: "7px 11px",
                  boxShadow: "var(--shadow-card)",
                  display: "flex",
                  gap: 3,
                  alignItems: "center",
                }}
              >
                <span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--slate)" }} />
                <span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--slate)" }} />
                <span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--slate)" }} />
              </div>
            </div>
            {/* card-c — arrière-plan, en haut à droite */}
            {heroVisuals.map((item, idx) => {
              const slot = (idx - heroOffset + heroVisuals.length) % heroVisuals.length;
              const s = HERO_SLOT_STYLE[slot];
              return (
                <div
                  key={item.id}
                  style={{
                    position: "absolute",
                    top: s.top,
                    left: s.left,
                    width: s.width,
                    height: s.height,
                    zIndex: s.zIndex,
                    borderRadius: 16,
                    overflow: "hidden",
                    transform: s.transform,
                    boxShadow: "var(--shadow-lift)",
                    // Le fond image reste en place (poster/fallback) même quand une
                    // vidéo est présente : elle s'affiche pendant le chargement,
                    // et sert de secours si la vidéo échoue à se charger.
                    backgroundImage: `url(${item.photo})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    transition: "top 0.7s cubic-bezier(.4,0,.2,1), left 0.7s cubic-bezier(.4,0,.2,1), width 0.7s cubic-bezier(.4,0,.2,1), height 0.7s cubic-bezier(.4,0,.2,1), transform 0.7s cubic-bezier(.4,0,.2,1)",
                  }}
                >
                  {item.video && (
                    <video
                      key={item.video}
                      src={item.video}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="auto"
                      poster={item.photo}
                      style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  )}
                  <span style={{ position: "absolute", top: 9, left: 9, display: "flex", alignItems: "center", gap: 4, background: "var(--signal)", color: "#fff", fontSize: 9, fontWeight: 700, padding: "3px 7px", borderRadius: 999 }}>
                    <span className="sf-live-dot" style={{ width: 4, height: 4, borderRadius: "50%", background: "#fff" }} />LIVE
                  </span>
                  <div
                    style={{
                      position: "absolute", bottom: 0, left: 0, right: 0, padding: "20px 10px 10px",
                      background: "linear-gradient(to top, rgba(0,0,0,0.75), transparent)", color: "#fff",
                      opacity: slot === 0 ? 1 : 0,
                      transition: "opacity 0.4s ease",
                      pointerEvents: "none",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 600 }}>
                      {item.name}
                      <span style={{ display: "flex", alignItems: "center", gap: 3, fontWeight: 500, fontSize: 10 }}>
                        <Star size={10} fill="currentColor" />{item.rating}
                      </span>
                    </div>
                    <div style={{ fontSize: 9.5, opacity: 0.85, marginTop: 2 }}>{item.place}, {item.country}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats */}
        <div className="sf-stats-grid sf-reveal">
          <StatItem icon={<span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--signal)", display: "inline-block" }} />} value={onlineCount} label="Reporters en ligne maintenant" />
          <StatItem icon={<Users size={14} style={{ color: "var(--signal)" }} />} value={totalReportersCount} label="Reporters au total" />
          <StatItem icon={<Globe size={14} style={{ color: "var(--signal)" }} />} value={citiesCoveredCount} label="Villes couvertes" />
          <StatItem icon={<ShieldCheck size={14} style={{ color: "var(--signal)" }} />} value={`${verifiedPercent}%`} label="Reporters vérifiés" />
        </div>

        {/* Signature secondaire */}
        <div className="sf-reveal" style={{ marginBottom: 4, textAlign: "center" }}>
          <h2 className="sf-display" style={{ fontSize: "clamp(20px, 6vw, 32px)", lineHeight: 1.05, textTransform: "uppercase" }}>
            Vous voulez voir ?<br /><span style={{ color: "var(--signal)" }}>Quelqu'un y va.</span>
          </h2>
        </div>

        {/* Comment ça marche */}
        <div style={{ marginBottom: 8 }}>
          <h2 className="sf-display" style={{ fontSize: 24, marginBottom: 20, textTransform: "uppercase" }}>Comment ça marche</h2>
          <div className="sf-steps-grid">
            {[
              { n: "1", icon: MessageCircle, title: "Indiquez ce que vous voulez voir", desc: "Un lieu, une adresse, un événement... dites simplement ce que vous voulez voir." },
              { n: "2", icon: UserPlus, title: "Un Reporter accepte", desc: "Un Reporter disponible à proximité accepte votre demande et se rend sur place." },
              { n: "3", icon: Video, title: "Regardez en direct", desc: "Vous êtes connecté en vidéo. Vous guidez le Reporter et lui dites quoi regarder." },
            ].map((s) => (
              <div key={s.n} className="sf-reveal">
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 6, marginBottom: 8 }}>
                  <div className="sf-display" style={{ width: 26, height: 26, borderRadius: 999, background: "var(--ink)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, flexShrink: 0 }}>
                    {s.n}
                  </div>
                  <s.icon size={16} style={{ color: "var(--signal)" }} />
                </div>
                <div style={{ fontSize: 11.5, fontWeight: 700, marginBottom: 4, lineHeight: 1.25 }}>{s.title}</div>
                <div style={{ fontSize: 9.5, color: "var(--slate)", lineHeight: 1.4 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Vous voulez voir quoi ? — anciennement "À quoi ça sert" : le titre
            précédent laissait croire que ces 6 cartes définissaient Shoofmy.
            Reformulé pour que ce soit clairement lu comme des exemples parmi
            d'autres, pas comme une liste fermée de fonctionnalités. */}
        <div>
          <h2 className="sf-display" style={{ fontSize: 24, marginBottom: 8, textTransform: "uppercase" }}>Vous voulez voir quoi ?</h2>
          <p style={{ fontSize: 13.5, color: "var(--slate)", margin: "0 0 22px" }}>
            Un besoin, une curiosité, une envie. Ou simplement l'envie de voir ce qui se passe là-bas.
          </p>
          <div className="sf-usecases-grid">
            {[
              { icon: Home, title: "Vérifier un logement", desc: "Je veux voir l'appartement avant de faire 600 km.", photo: "photo-1583847268964-b28dc8f51f92" },
              { icon: UtensilsCrossed, title: "Choisir un restaurant", desc: "Montre-moi l'ambiance avant que je réserve.", photo: "photo-1744561249162-c597c1670032" },
              { icon: Camera, title: "Faire vérifier un produit", desc: "Peux-tu me montrer l'état exact de cet objet ?", photo: "photo-1741061964577-3d4f0a021666" },
              { icon: CalendarClock, title: "Suivre un événement", desc: "Vivez-le à distance, en direct, comme si vous y étiez.", photo: "photo-1767289394567-b5e4b5986c88" },
              { icon: Radio, title: "Voir une situation en direct", desc: "Ce qui se passe là-bas, maintenant, par quelqu'un qui y est.", photo: "photo-1592331669171-e266b8cb89ff" },
              { icon: MapPin, title: "Découvrir un endroit à distance", desc: "Une rue, un quartier, un lieu — vu par quelqu'un sur place.", photo: "photo-1750196995049-d9019c34271e" },
            ].map((u) => (
              <div key={u.title} className="sf-usecase-card sf-reveal" style={{ borderRadius: 12, border: "1px solid var(--line)", background: "var(--surface)", overflow: "hidden" }}>
                <div style={{ height: 80, backgroundImage: `url(https://images.unsplash.com/${u.photo}?auto=format&fit=crop&w=500&h=300&q=60)`, backgroundSize: "cover", backgroundPosition: "center", position: "relative" }}>
                  <div style={{ position: "absolute", top: 8, left: 8, width: 24, height: 24, borderRadius: 999, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <u.icon size={11} style={{ color: "var(--signal)" }} />
                  </div>
                </div>
                <div style={{ padding: "10px 9px 12px" }}>
                  <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 3, lineHeight: 1.25 }}>{u.title}</div>
                  <div style={{ fontSize: 10, color: "var(--slate)", lineHeight: 1.35 }}>{u.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 11.5, color: "var(--slate)", fontStyle: "italic", margin: "14px 0 0", textAlign: "center" }}>
            Ce ne sont que quelques exemples — Shoofmy peut vous montrer bien plus encore.
          </p>
        </div>

        {/* Des Reporters vérifiés — renforce la confiance et explique le
            terme "Reporter" une seule fois, comme demandé. Placée avant
            "Devenir Reporter" pour rassurer d'abord, convertir ensuite. */}
        <div className="sf-reveal" style={{ marginBottom: 18 }}>
          <h2 className="sf-display" style={{ fontSize: 20, marginBottom: 6, textTransform: "uppercase" }}>Des Reporters vérifiés</h2>
          <p style={{ fontSize: 12.5, color: "var(--slate)", marginBottom: 12, lineHeight: 1.4, maxWidth: 460 }}>
            Un Reporter Shoofmy est une personne vérifiée qui se rend sur place pour vous.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 18px" }}>
            {["Identité vérifiée", "Profils évalués", "Paiement sécurisé", "Mission en direct"].map((c) => (
              <span key={c} style={{ fontSize: 11.5, fontWeight: 600, display: "flex", alignItems: "center", gap: 5 }}>
                <Check size={13} style={{ color: "var(--signal)" }} />{c}
              </span>
            ))}
          </div>
        </div>

        {/* Bandeau rémunération */}
        <div className="sf-reveal" style={{ display: "flex", gap: 16, flexWrap: "wrap", fontSize: 11, color: "var(--slate)", marginBottom: 8 }}>
          <span><strong style={{ color: "var(--ink)" }}>Vous</strong> — "Je veux voir quelque chose."</span>
          <span><strong style={{ color: "var(--ink)" }}>Reporter</strong> — "Je peux aller le filmer."</span>
        </div>
        <div className="sf-reward-banner sf-reveal">
          <div>
            <div className="sf-mono" style={{ fontSize: 8, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--signal)", fontWeight: 700, marginBottom: 6 }}>
              Rémunéré · à chaque mission
            </div>
            <h2 className="sf-display" style={{ fontSize: 16, marginBottom: 6, lineHeight: 1.05, textTransform: "uppercase" }}>
              Gagnez de l'argent<br />avec votre téléphone.
            </h2>
            <p style={{ fontSize: 10, color: "var(--slate)", maxWidth: 420, lineHeight: 1.4, margin: 0 }}>
              Montrez ce qu'on vous demande, là où vous êtes, et soyez rémunéré pour chaque live.
            </p>
          </div>
          <Link href="/r/onboarding">
            <span className="sf-btn" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px 12px", borderRadius: 10, background: "var(--ink)", color: "#fff", fontWeight: 600, fontSize: 10.5, whiteSpace: "nowrap", flexShrink: 0, alignSelf: "flex-start" }}>
              Devenir Reporter<ArrowRight size={13} />
            </span>
          </Link>
        </div>

        {/* Bandeau de confiance */}
        <div className="sf-trust-grid">
          {[
            { icon: CreditCard, title: "Paiement sécurisé", desc: "Rapide et fiable" },
            { icon: Clock, title: "Disponible 24/7", desc: "Partout dans le monde" },
            { icon: Globe, title: "Communauté mondiale", desc: "Des milliers de reporters" },
            { icon: Headphones, title: "Support 24/7", desc: "Nous sommes là" },
          ].map((t) => (
            <div key={t.title} className="sf-reveal" style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <t.icon size={18} style={{ color: "var(--ink)", flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 700 }}>{t.title}</div>
                <div style={{ fontSize: 11, color: "var(--slate)" }}>{t.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Partenariat lunettes caméra */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "18px 16px", borderRadius: 12, border: "1px solid var(--line)", marginBottom: 24 }}>
          <div style={{ width: 40, height: 40, flexShrink: 0, borderRadius: 10, background: "var(--surface-2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Glasses size={19} style={{ color: "var(--slate)" }} />
          </div>
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 2 }}>Partenaire officiel — Nova Vision</div>
            <div style={{ fontSize: 11.5, color: "var(--slate)", lineHeight: 1.4 }}>
              Un live plus stable, mains libres, directement depuis les lunettes caméra de vos reporters.
            </div>
          </div>
        </div>

        <div style={{ textAlign: "center", fontSize: 12, color: "var(--slate)", paddingTop: 20, borderTop: "1px solid var(--line)" }}>
          <Link href="/legal">CGU · Confidentialité</Link>
        </div>
      </div>
    </div>
  );
}

function StatItem({ icon, value, label }) {
  return (
    <div style={{ display: "flex", flexDirection: "row", alignItems: "flex-start", gap: 5, flex: 1, minWidth: 0 }}>
      <div style={{ width: 14, height: 14, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
        {icon}
      </div>
      <div>
        <div className="sf-display" style={{ fontSize: 15, lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 7, color: "var(--slate)", textTransform: "uppercase", letterSpacing: "0.01em", marginTop: 2, lineHeight: 1.2 }}>{label}</div>
      </div>
    </div>
  );
}
