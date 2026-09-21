"use client";

import React, { createContext, useContext, useState } from "react";

/**
 * @typedef {Object} Mission
 * @property {string} id
 * @property {string} reporterId
 * @property {string} reporterName
 * @property {string} place
 * @property {string} description
 * @property {string} [instructions] - consignes particulières facultatives, distinctes du besoin principal
 * @property {string} [language] - langue souhaitée pour la mission, choisie parmi celles du Reporter
 * @property {string} duration - libellé de la durée ESTIMÉE choisie à la réservation (ex. "30 min")
 * @property {"now"|"scheduled"} scheduleMode
 * @property {string} [scheduledAt] - ISO datetime, uniquement si scheduleMode==="scheduled"
 * @property {number} pricePerMinute
 * @property {number} preAuthEstimate - montant pré-autorisé (bloqué, pas prélevé) à la réservation
 * @property {number} [finalPrice] - montant réellement facturé, connu seulement à la fin
 * @property {"requested"|"confirmed"|"live"|"done"|"cancelled"|"no_reporter_available"} status
 * @property {"no_show"|"participant"} [cancelReason]
 * @property {number} elapsedSeconds
 * @property {Array<{from:"participant"|"reporter", text:string, time:string}>} messages
 */

const MissionContext = createContext(null);

const ACCEPT_WINDOW_SECONDS = 60;

// DÉMO UNIQUEMENT : en solo, personne n'est sur /r/dashboard pour cliquer
// "Accepter", donc la demande resterait bloquée jusqu'à expiration des
// 60s. Ce délai simule une acceptation + démarrage du live automatique
// à la 10e seconde, pour pouvoir tester /live rapidement sans un second
// appareil. À retirer (ou désactiver) une fois le vrai flux à deux
// personnes testé.
const DEMO_AUTO_ACCEPT_SECONDS = 10;
// Grâce laissée à un Reporter "confirmed" en mode Maintenant pour
// démarrer le live avant d'être considéré en no-show (section 10).
// Valeur courte ici pour que ce soit démontrable dans une démo ; en
// production ce serait plutôt de l'ordre de 10-15 minutes.
const NO_SHOW_GRACE_SECONDS = 90;

// Paliers d'annulation participant (section 10 — non chiffrés dans le
// document, interprétation retenue ici, à valider avec l'équipe) :
// - avant acceptation du Reporter : gratuit, aucune capture
// - après acceptation mais avant le début du live : le Reporter a bloqué
//   du temps, une partie de la pré-autorisation lui est due
const CANCELLATION_FEE_RATE_AFTER_ACCEPT = 0.3;

export function MissionProvider({ children }) {
  const [activeMission, setActiveMission] = useState(/** @type {Mission|null} */ (null));
  const [history, setHistory] = useState(/** @type {Mission[]} */ ([]));
  const [acceptDeadline, setAcceptDeadline] = useState(null); // timestamp ms
  const [noShowDeadline, setNoShowDeadline] = useState(null); // timestamp ms
  // Strikes par Reporter — en mémoire, pas de backend. Visible côté
  // Admin (reporters) et côté Reporter (son propre profil).
  const [reporterStrikes, setReporterStrikes] = useState({});

  // Cahier des charges section 6 : le paiement est une PRÉ-AUTORISATION à
  // la réservation, jamais un montant fixe débité tout de suite. Le
  // montant réel n'est connu qu'à la fin (durée réelle × tarif/minute).
  const requestBooking = (reporter, details) => {
    const missionId = `m_${Date.now()}`;
    setActiveMission({
      id: missionId,
      reporterId: reporter.id,
      lat: reporter.lat,
      lng: reporter.lng,
      reporterName: reporter.name,
      participantName: details.participantName,
      participantRating: details.participantRating,
      participantMissionsCount: details.participantMissionsCount,
      place: reporter.place,
      description: details.description,
      instructions: details.instructions || null,
      language: details.language || null,
      duration: details.duration,
      scheduleMode: details.scheduleMode || "now",
      scheduledAt: details.scheduledAt || null,
      pricePerMinute: details.pricePerMinute,
      preAuthEstimate: details.preAuthEstimate,
      status: "requested",
      elapsedSeconds: 0,
      messages: [],
    });
    // Fenêtre d'acceptation ~30s (section 6, point non tranché mais
    // recommandation retenue). Si le Reporter ne répond pas, on traite
    // comme un refus et on tente le suivant.
    setAcceptDeadline(Date.now() + ACCEPT_WINDOW_SECONDS * 1000);

    // DÉMO UNIQUEMENT : voir le commentaire sur DEMO_AUTO_ACCEPT_SECONDS
    // plus haut. Ne fait rien si la mission a déjà changé de statut
    // entre-temps (acceptée/déclinée manuellement, annulée, etc.).
    setTimeout(() => {
      setActiveMission((m) => {
        if (!m || m.id !== missionId || m.status !== "requested") return m;
        return { ...m, status: "live" };
      });
      setAcceptDeadline(null);
      setNoShowDeadline(null);
    }, DEMO_AUTO_ACCEPT_SECONDS * 1000);
  };

  const acceptMission = () => {
    setAcceptDeadline(null);
    // "confirmed" = le Reporter a accepté mais ne filme pas encore. Pour
    // le mode "maintenant" il démarre généralement tout de suite après ;
    // pour le mode "programmé", ce statut reste jusqu'au jour J (section 6).
    setActiveMission((m) => (m ? { ...m, status: "confirmed" } : m));
    setActiveMission((m) => {
      if (m && m.scheduleMode === "now") {
        setNoShowDeadline(Date.now() + NO_SHOW_GRACE_SECONDS * 1000);
      }
      return m;
    });
  };

  // Le jour J (ou immédiatement en mode "maintenant") : le Reporter est en
  // place et démarre réellement le tournage. C'est à partir d'ici que le
  // Participant peut le diriger en direct (section 2).
  const startLive = () => {
    setNoShowDeadline(null);
    setActiveMission((m) => (m ? { ...m, status: "live" } : m));
  };

  // Si le délai de grâce expire sans que le Reporter ait démarré le
  // live : no-show avéré. Participant intégralement remboursé (aucune
  // capture n'a eu lieu), Reporter reçoit un strike (section 10).
  const recordNoShow = () => {
    setNoShowDeadline(null);
    setActiveMission((m) => {
      if (!m) return m;
      setReporterStrikes((s) => ({ ...s, [m.reporterId]: (s[m.reporterId] || 0) + 1 }));
      setHistory((h) => [{ ...m, status: "cancelled", finalPrice: 0, cancelReason: "no_show" }, ...h]);
      return null;
    });
  };

  // Point tranché section 6 : si le Reporter refuse, l'app propose
  // automatiquement le Reporter suivant le plus proche — jamais annulé
  // silencieusement. `nextReporter` est fourni par l'appelant (qui a
  // accès à la liste et sait qui est le suivant disponible).
  const declineMission = (nextReporter) => {
    setAcceptDeadline(null);
    setActiveMission((m) => {
      if (!m) return m;
      if (!nextReporter) return { ...m, status: "no_reporter_available" };
      setAcceptDeadline(Date.now() + ACCEPT_WINDOW_SECONDS * 1000);
      return { ...m, reporterId: nextReporter.id, reporterName: nextReporter.name, lat: nextReporter.lat, lng: nextReporter.lng, status: "requested" };
    });
  };

  const sendMessage = (from, text) => {
    setActiveMission((m) => {
      if (!m) return m;
      return { ...m, messages: [...m.messages, { from, text, time: "à l'instant" }] };
    });
  };

  const tickElapsed = () => {
    setActiveMission((m) => (m && m.status === "live" ? { ...m, elapsedSeconds: m.elapsedSeconds + 1 } : m));
  };

  const endMission = () => {
    setActiveMission((m) => {
      if (!m) return m;
      // Facturation réelle à la fin, basée sur la durée effective — pas
      // le montant pré-autorisé fixe (section 8).
      const minutes = Math.max(1, Math.ceil(m.elapsedSeconds / 60));
      const finalPrice = Math.min(m.preAuthEstimate, minutes * m.pricePerMinute);
      const finished = { ...m, status: "done", finalPrice };
      setHistory((h) => [finished, ...h]);
      return null;
    });
  };

  const cancelMission = () => {
    setAcceptDeadline(null);
    setNoShowDeadline(null);
    setActiveMission((m) => {
      if (!m) return m;
      // Palier 0 : pas encore accepté par le Reporter -> gratuit.
      // Palier 1 : déjà accepté (Reporter a bloqué du temps) -> frais
      // proportionnels retenus sur la pré-autorisation, le reste est libéré.
      const feeRate = m.status === "confirmed" ? CANCELLATION_FEE_RATE_AFTER_ACCEPT : 0;
      const finalPrice = Math.round(m.preAuthEstimate * feeRate * 100) / 100;
      setHistory((h) => [{ ...m, status: "cancelled", finalPrice, cancelReason: "participant" }, ...h]);
      return null;
    });
  };

  return (
    <MissionContext.Provider
      value={{
        activeMission,
        history,
        acceptDeadline,
        noShowDeadline,
        reporterStrikes,
        requestBooking,
        acceptMission,
        startLive,
        declineMission,
        recordNoShow,
        sendMessage,
        tickElapsed,
        endMission,
        cancelMission,
      }}
    >
      {children}
    </MissionContext.Provider>
  );
}

export function useMission() {
  const ctx = useContext(MissionContext);
  if (!ctx) throw new Error("useMission() doit être utilisé sous <MissionProvider>");
  return ctx;
}
