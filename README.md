# Shoofmy — repo Next.js

Application connectée, alignée sur le cahier des charges fourni.

## Dernière passe : 5 corrections sur la version "v5 améliorée"

Une version parallèle de ce repo a été produite ailleurs, avec de bons
ajouts (clustering des markers sur la carte, réputation du Participant
visible côté Reporter, langues parlées, onboarding Reporter avec vraie
file d'attente pending/approuvé/rejeté, rebrand visuel éditorial,
`/support` et `/forgot-password`). Cette version-là a été adoptée comme
base, avec 5 corrections apportées par-dessus :

1. **Mode sombre réellement activé** — le CSS définissait tout un thème
   `[data-theme="dark"]` pour l'ambiance live, mais rien ne posait cet
   attribut sur `<body>`. Voir `lib/useLiveTheme.js`, utilisé par
   `/live` et `/r/mission`.
2. **Filtres ville/langue sur Explorer** — avec 97 Reporters mondiaux,
   le mode liste les affichait tous en vrac. Deux menus déroulants
   filtrent maintenant la carte ET la liste.
3. **Langues affichées + filtrables** — la donnée existait déjà sur
   chaque Reporter mais n'était exploitée nulle part ; elle sert
   maintenant de filtre (point 2) et s'affiche sur chaque carte Reporter
   en mode liste.
4. **Réputation du Participant visible côté Admin** — `Mission` avait
   déjà `participantName`/`participantRating`, affiché côté Reporter,
   mais invisible sur `/admin/missions`. Ajouté dans la table "session
   en cours".
5. **Strikes Reporter fiabilisés** — `ADMIN_REPORTERS_ACTIVE` référence
   maintenant un vrai `reporterId` au lieu de deviner par prénom
   (fragile, plusieurs Reporters partagent le même prénom parmi les 97).
   Un Reporter qui reçoit un strike hors de la liste de référence
   apparaît maintenant dynamiquement plutôt que de disparaître
   silencieusement.

## Installer et lancer

```bash
npm install
npm run dev
```

Puis ouvrir http://localhost:3000. La page d'accueil est la Landing
publique si tu n'es pas connecté, ou redirige vers ton espace si tu l'es.

## Ce qui a changé pour suivre le cahier des charges

**"Voir maintenant" (auto-matching) supprimé.** Le document est explicite
(section 5) : la sélection reste manuelle et visuelle, pas de matching
automatique façon VTC. La route `/see-now` a été retirée.

**Vraie carte interactive.** `/explorer` utilise maintenant Leaflet +
OpenStreetMap (gratuit, sans clé API) au lieu d'une carte décorative.
Deux modes : découverte (parcourir la carte) et recherche précise
(géocodage d'une adresse via Nominatim, gratuit aussi). Cliquer un
marker mène directement à la réservation — la sélection reste 100%
manuelle, jamais automatisée.

**Posts de présence.** Section "Sur place maintenant" en haut
d'Explorer : un Reporter peut signaler qu'il est disponible à un endroit
précis (avec un multiplicateur de tarif si forte demande). Le
Participant choisit lui-même s'il sollicite ce Reporter — ce n'est pas
un système d'assignation.

**Flux de réservation réécrit** (accepter/refuser, pas paiement direct) :

```
/reporter/[id]  → choix Maintenant / Programmé, durée estimée, description
/payment         → pré-autorisation (montant bloqué, pas prélevé)
/waiting          → attente de la réponse du Reporter (30s), avec
                    fallback automatique vers le Reporter suivant en cas
                    de refus ou de non-réponse
/r/dashboard      → le Reporter voit la demande, Accepter ou Refuser
/r/mission ou /live → le Reporter démarre le live quand il est prêt
                       (immédiatement en mode Maintenant, au jour J en
                       mode Programmé)
```

**Le direct est piloté, pas passif.** `/live` (Participant) et
`/r/mission` (Reporter) partagent maintenant un canal de messages en
temps réel (`MissionContext.messages`) + un bouton micro (visuel, pas de
vrai audio sans WebRTC). Le Participant peut envoyer des instructions
rapides ("Va voir là-bas", "Zoome un peu") ou écrire librement — c'est le
cœur du produit décrit en section 2, qui manquait complètement avant.

**Paiement en deux temps.** `/payment` ne débite plus un montant fixe :
il pré-autorise une estimation. Le montant réel (`finalPrice`) n'est
calculé qu'à la fin, à partir de la durée effective du live
(`elapsedSeconds`) × le tarif à la minute — pas le montant fixe affiché
à la réservation.

**Fallback géographique réel.** Quand un Reporter refuse ou ne répond pas
à temps, le suivant proposé est calculé par vraie distance (formule de
Haversine sur les coordonnées lat/lng, `lib/geo.js`) — plus un choix
arbitraire dans la liste.

**Politique d'annulation par paliers.** `MissionContext.cancelMission()`
applique désormais des frais selon le moment : gratuit avant acceptation
du Reporter, ~30% du montant pré-autorisé après (il a bloqué du temps).
Un no-show avéré (Reporter accepté qui ne démarre jamais le live dans le
délai de grâce) rembourse intégralement le Participant et enregistre un
strike sur le Reporter, visible sur `/admin/reporters`.

**Avertissement droit à l'image obligatoire.** Avant sa première visite
sur `/r/dashboard`, un Reporter doit reconnaître les règles de droit à
l'image (`components/ReporterWarningGate.jsx`) — bloquant tant que ce
n'est pas fait. Les CGU (`/legal`) incluent maintenant les sections
droit à l'image et annulation/no-show.

## Ce qui n'a pas changé

Auth, Admin, Messages, Profil, Notifications, Replay, Légal, Onboarding
Reporter restent connectés comme avant (voir le code — les principes ne
changent pas, seulement les champs de données côté mission ont été mis à
jour pour coller au nouveau modèle : `finalPrice` remplace `price`,
`preAuthEstimate` remplace l'ancien montant fixe).

## Architecture

```
app/
  layout.jsx                ← fonts + Providers
  globals.css                 ← tokens de design centralisés
  page.jsx                     ← Landing publique / redirection par rôle
  login/page.jsx                ← connexion/inscription
  explorer/page.jsx              ← carte réelle + recherche + posts de présence
  reporter/[id]/page.jsx        ← réservation (mode Maintenant/Programmé)
  payment/page.jsx                ← pré-autorisation
  waiting/page.jsx                 ← attente de la réponse du Reporter
  live/page.jsx                     ← direct piloté (Participant)
  history/page.jsx
  messages/page.jsx
  profile/page.jsx
  notifications/page.jsx
  legal/page.jsx
  replay/[id]/page.jsx
  r/
    dashboard/page.jsx        ← accepter/refuser une demande
    mission/page.jsx           ← direct piloté (Reporter)
    onboarding/page.jsx
    earnings/page.jsx
    stats/page.jsx
    profile/page.jsx
  admin/
    layout.jsx                 ← sidebar + protection
    users/ reporters/ missions/ payments/ disputes/ moderation/
    analytics/ support/          ← 8 sous-routes

components/
  Header.jsx, ReporterHeader.jsx, RequireAuth.jsx, AdminStatusBadge.jsx
  ExplorerMap.jsx              ← carte Leaflet, remplace la carte décorative
  ui/ Button, Badge, Card, Avatar, Toggle, Modal

lib/
  types.js, mock-data.js
  context/
    SessionContext.jsx         ← qui est connecté, quel rôle
    MissionContext.jsx          ← modèle de mission aligné sur le cahier
                                   des charges : requestBooking → accept/
                                   decline (30s + fallback) → startLive →
                                   sendMessage (canal de pilotage) →
                                   tickElapsed → endMission (facturation
                                   réelle)
```

## Ce qui n'est PAS encore fait

- **Pas de vraie vidéo live ni de vrai canal voix** — le bouton micro et
  la vidéo sont visuels ; il faudrait du WebRTC (LiveKit, Daily, Agora…)
  pour que ce soit réel.
- **Pas de backend** : tout vit en mémoire côté client, remis à zéro au
  rechargement de page. C'est le plus gros chantier restant pour que le
  produit soit réellement utilisable au-delà d'une démo.
- **L'accès Admin et l'onboarding Reporter** restent des raccourcis démo
  sans vraie vérification.
- **Les strikes Reporter (no-show) sont recoupés par prénom**, pas par
  un vrai identifiant partagé entre le compte connecté et les Reporters
  bookables (`REPORTERS` dans `mock-data.js`) — artefact du fait qu'il
  n'y a pas de vrai système de comptes Reporter derrière. Un backend
  réel réglerait ça nativement.

## Prochaines étapes suggérées

1. Backend + vrai WebRTC pour que le direct piloté et le canal voix
   soient réellement fonctionnels, pas juste un chat simulé.
2. Vrai système de comptes (au lieu du recoupement par prénom pour les
   strikes, et de l'accès démo Admin/Reporter).
3. Chiffrer précisément les paliers d'annulation avec l'équipe — les
   taux retenus ici (30% après acceptation, remboursement intégral en
   cas de no-show) sont une interprétation raisonnable du cahier des
   charges, pas des valeurs figées côté produit.
