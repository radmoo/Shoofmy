"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { ArrowLeft, Menu, Bell, Globe, X } from "lucide-react";
import { useSession } from "@/lib/context/SessionContext";

const PARTICIPANT_NAV = [
  { href: "/explorer", label: "Explorer" },
  { href: "/history", label: "Historique" },
  { href: "/messages", label: "Messages" },
  { href: "/profile", label: "Profil" },
];

const REPORTER_NAV = [
  { href: "/r/dashboard", label: "Tableau de bord" },
  { href: "/r/earnings", label: "Revenus" },
  { href: "/r/stats", label: "Statistiques" },
  { href: "/r/profile", label: "Profil" },
];

// Liens du menu latéral (hamburger) — reprend les mêmes destinations que
// la nav basse d'Explorer, pour que le menu reste utile même en dehors
// de cette page plutôt que de dupliquer une nav qui n'existe qu'ici.
const PARTICIPANT_MENU_LINKS = [
  { href: "/explorer", label: "Explorer" },
  { href: "/r/onboarding", label: "Devenir Reporter" },
  { href: "/history", label: "Historique" },
  { href: "/messages", label: "Messages" },
  { href: "/profile", label: "Profil" },
  { href: "/support", label: "Aide" },
];

// Menu latéral côté Reporter — mêmes destinations que sa propre nav du
// header (Tableau de bord/Revenus/Statistiques/Profil) + Aide, pour
// rester cohérent avec le menu Participant plutôt que de garder un
// header sans aucun menu comme c'était le cas avant.
const REPORTER_MENU_LINKS = [
  { href: "/r/dashboard", label: "Tableau de bord" },
  { href: "/r/earnings", label: "Revenus" },
  { href: "/r/stats", label: "Statistiques" },
  { href: "/r/profile", label: "Profil" },
  { href: "/support", label: "Aide" },
];

/**
 * Header unique de l'app entière : une seule structure (menu + logo +
 * zone d'actions, puis une rangée d'onglets si connecté) qui s'adapte
 * au contexte plutôt que d'avoir un header différent codé par page.
 *
 * Variantes, déterminées automatiquement (pas besoin de props par page) :
 *  - connecté (participant) : logo + cloche, onglets Explorer / Historique
 *                             / Messages / Profil
 *  - connecté (reporter)    : logo + badge "REPORTER" + cloche, onglets
 *                             Tableau de bord / Revenus / Statistiques / Profil
 *                             — remplace l'ancien ReporterHeader.jsx, qui
 *                             était un composant à part (pas de menu, pas
 *                             de cloche, style différent) : les deux
 *                             espaces du site partagent maintenant le
 *                             même header, seuls le badge et les onglets
 *                             changent selon le rôle.
 *  - non connecté ("/")     : logo + langue + bouton "Se connecter"
 *  - variant="auth"         : logo seul (login/inscription), sans action
 *
 * Mobile vs desktop (>= 820px, seuil déjà utilisé ailleurs sur le site) :
 *  - logo centré sur mobile, aligné à gauche après le menu sur desktop
 *  - le header (fond + contenu) occupe toute la largeur de l'écran en
 *    desktop, plafonnée à 1440px en interne pour rester lisible sur
 *    très grands écrans — indépendamment de la largeur du contenu des
 *    pages, qui reste pour l'instant en colonne étroite (voir globals.css)
 *  - même hauteur, mêmes espacements, même style à toutes les tailles
 *
 * @param {{ showBack?: boolean, variant?: "default" | "auth" }} props
 */
export default function Header({ leftIcon = "menu", variant = "default" }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  const isAuthVariant = variant === "auth";
  const isReporter = user?.role === "reporter";
  const NAV = isReporter ? REPORTER_NAV : PARTICIPANT_NAV;
  const MENU_LINKS = isReporter ? REPORTER_MENU_LINKS : PARTICIPANT_MENU_LINKS;
  // La landing ("/") non connectée a son propre contenu plafonné à
  // 1180px (.sf-landing-wrap) — on aligne le header sur cette même
  // largeur uniquement ici pour que logo/menu retombent exactement
  // au-dessus du titre de la landing. Ailleurs (app connectée, login),
  // il n'y a pas de contenu large auquel s'aligner, donc le header
  // garde son plafond généreux de 1440px pour occuper l'écran.
  const isLandingPublic = pathname === "/" && !isAuthenticated;

  return (
    <>
      <header className="sf-header">
        <div className={`sf-header-inner${isLandingPublic ? " sf-header-inner--landing" : ""}`}>
          <div className="sf-header-row1">
            {!isAuthVariant && (
              leftIcon === "back" ? (
                <button
                  type="button"
                  onClick={() => router.back()}
                  aria-label="Retour"
                  className="sf-header-menu-btn"
                >
                  <ArrowLeft size={16} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setMenuOpen(true)}
                  aria-label="Ouvrir le menu"
                  className="sf-header-menu-btn"
                >
                  <Menu size={16} />
                </button>
              )
            )}

            <Link href="/" className="sf-header-logo">
              <img src="/shoofmy-icon.webp" alt="" width={20} height={20} style={{ display: "block" }} />
              <span className="sf-display" style={{ fontWeight: 700, fontSize: 19 }}>
                Shoof<span style={{ color: "var(--signal)" }}>my</span>
              </span>
              {isReporter && (
                <span className="sf-mono" style={{ fontSize: 10, color: "var(--slate)", letterSpacing: "0.03em" }}>
                  REPORTER
                </span>
              )}
            </Link>

            {!isAuthVariant && (
              <div className="sf-header-actions">
                {isAuthenticated ? (
                  <Link href="/notifications" aria-label="Notifications" className="sf-header-icon-btn">
                    <Bell size={15} />
                  </Link>
                ) : (
                  <>
                    <Globe size={18} className="sf-header-lang" aria-hidden />
                    <Link href="/login" className="sf-header-cta">
                      Se connecter
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          {isAuthenticated && !isAuthVariant && (
            <nav className="sf-header-tabs">
              {NAV.map((n) => {
                const active = pathname === n.href;
                return (
                  <Link key={n.href} href={n.href} className={`sf-header-tab${active ? " active" : ""}`}>
                    {n.label}
                  </Link>
                );
              })}
            </nav>
          )}
        </div>
      </header>

      {/* Volet latéral — rendu en dehors de <header> exprès : le header
         a un fond opaque et (auparavant) un backdrop-filter, qui créent
         tous les deux un "containing block" pour les descendants en
         position:fixed. Un enfant fixed piégé dans un ancêtre avec
         backdrop-filter ne couvre plus l'écran mais seulement la boîte
         du header — c'était la cause du volet qui se superposait mal
         au contenu au lieu de l'occuper en plein écran. */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(20,23,28,0.4)", display: "flex" }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ width: "min(78vw, 300px)", height: "100%", background: "var(--surface)", padding: "20px", boxShadow: "var(--shadow-lift)", display: "flex", flexDirection: "column", gap: 4 }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <span className="sf-display" style={{ fontWeight: 700, fontSize: 17 }}>Menu</span>
              <button
                onClick={() => setMenuOpen(false)}
                aria-label="Fermer le menu"
                style={{ width: 30, height: 30, borderRadius: 8, border: "1px solid var(--line)", background: "none", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ink)" }}
              >
                <X size={15} />
              </button>
            </div>
            {MENU_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                style={{ fontSize: 14.5, fontWeight: 600, color: "var(--ink)", padding: "12px 6px", borderBottom: "1px solid var(--line)" }}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
