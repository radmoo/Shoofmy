"use client";

import React, { createContext, useContext, useState } from "react";

/**
 * @typedef {"participant" | "reporter" | "admin" | null} Role
 * @typedef {{ id: string, name: string, role: Role, acceptedReporterWarning?: boolean, rating?: number, missionsCount?: number } | null} User
 */

const SessionContext = createContext(null);

// Réputation agrégée d'un Participant — comme un chauffeur Uber voit la
// note du passager avant d'accepter la course. Pas de vraie collecte
// d'avis en direct (pas de backend), donc générée de façon déterministe
// à partir du nom saisi : la même personne obtient toujours le même
// score en re-testant, plutôt qu'un chiffre aléatoire à chaque connexion.
function mockParticipantReputation(name) {
  const hash = name.split("").reduce((h, c) => h + c.charCodeAt(0), 0);
  const rating = Math.max(3.6, Math.min(5.0, 4.9 - ((hash % 14) / 10)));
  const missionsCount = 1 + (hash % 45);
  return { rating: +rating.toFixed(1), missionsCount };
}

export function SessionProvider({ children }) {
  // Pas de backend : l'état vit en mémoire côté client pour l'instant.
  // Le jour où l'auth réelle arrive, seul ce fichier change — aucun
  // écran n'a besoin d'être retouché puisqu'ils passent tous par useSession().
  const [user, setUser] = useState(/** @type {User} */ (null));

  const login = (name, role) => {
    const reputation = role === "participant" ? mockParticipantReputation(name) : {};
    setUser({ id: `u_${Date.now()}`, name, role, acceptedReporterWarning: false, ...reputation });
  };
  const loginAsAdmin = () => setUser({ id: `admin_${Date.now()}`, name: "Agathe M.", role: "admin" });
  const logout = () => setUser(null);
  // Acquittement de l'avertissement droit à l'image (cahier des charges
  // section 12) — obligatoire avant la première mission d'un Reporter.
  const acceptReporterWarning = () => setUser((u) => (u ? { ...u, acceptedReporterWarning: true } : u));
  // Photo de profil : uploadée par l'utilisateur lui-même (donc son
  // propre consentement, contrairement aux avatars illustrés générés
  // pour les Reporters de démo) — stockée en data URL faute de backend
  // de fichiers, ne survit donc qu'à la session en cours.
  const setProfilePhoto = (dataUrl) => setUser((u) => (u ? { ...u, photoUrl: dataUrl } : u));

  return (
    <SessionContext.Provider value={{ user, login, loginAsAdmin, logout, acceptReporterWarning, setProfilePhoto, isAuthenticated: !!user }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession() doit être utilisé sous <SessionProvider>");
  return ctx;
}
