"use client";

import React, { useState, useEffect, Suspense } from "react";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, MapPin, Star, List, SlidersHorizontal, Locate, X, CalendarClock, Square, CheckSquare } from "lucide-react";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import Card from "@/components/ui/Card";
import ReporterAvatar from "@/components/ui/ReporterAvatar";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { REPORTERS } from "@/lib/mock-data";
import { distanceKm, findNearestReporter } from "@/lib/geo";
import { useScrollDirection } from "@/lib/useScrollDirection";

// Leaflet a besoin de `window` — chargement dynamique sans SSR.
const ExplorerMap = dynamic(() => import("@/components/ExplorerMap"), {
  ssr: false,
  loading: () => (
    <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--slate)", fontSize: 13 }}>
      Chargement de la carte…
    </div>
  ),
});

// Pays affiché sous chaque ville dans "Destinations populaires" — les
// villes non listées ici (nouvelles, ajoutées plus tard à mock-data)
// s'affichent simplement sans sous-titre plutôt que de planter.
const CITY_COUNTRY = {
  Amsterdam: "Pays-Bas",
  Bangkok: "Thaïlande",
  Barcelone: "Espagne",
  Berlin: "Allemagne",
  Dubai: "Émirats arabes unis",
  Istanbul: "Turquie",
  "Le Caire": "Égypte",
  "Le Cap": "Afrique du Sud",
  Lisbonne: "Portugal",
  Londres: "Royaume-Uni",
  Lyon: "France",
  Marrakech: "Maroc",
  Marseille: "France",
  Mexico: "Mexique",
  "New York": "États-Unis",
  Paris: "France",
  "Rio de Janeiro": "Brésil",
  Rome: "Italie",
  Singapour: "Singapour",
  Sydney: "Australie",
  Séoul: "Corée du Sud",
  Tokyo: "Japon",
  Toronto: "Canada",
};

// Dégradés utilisés en fond des cartes "Destinations populaires" quand
// aucune photo n'est disponible pour la ville (voir CITY_PHOTO).
const DESTINATION_GRADIENTS = [
  "linear-gradient(135deg, #d9361f 0%, #8a1f10 100%)",
  "linear-gradient(135deg, #1e9e80 0%, #14171c 100%)",
  "linear-gradient(135deg, #e2a916 0%, #b8860b 100%)",
  "linear-gradient(135deg, #14171c 0%, #3c4048 100%)",
];

// Photos réelles (licence libre CC0, réutilisables sans attribution —
// Wikimedia Commons) pour les villes déjà sourcées. Les autres villes
// retombent sur un dégradé de couleur (DESTINATION_GRADIENTS) plutôt
// que d'afficher une fausse photo au hasard.
const CITY_PHOTO = {
  Paris: "https://commons.wikimedia.org/wiki/Special:FilePath/Eiffel_tower_paris_france.jpg",
  Berlin: "https://commons.wikimedia.org/wiki/Special:FilePath/Berlin-SKY.jpg",
  Tokyo: "https://commons.wikimedia.org/wiki/Special:FilePath/Sunset%20on%20cityscape%20of%20Tokyo%20(2015-01-19%20by%20calvision%20@Pixabay%20617627).jpg",
};

// Reproduit en miniature le pin utilisé sur la carte (anneau + pointe)
// pour que la légende parle visuellement le même langage que les
// marqueurs, plutôt qu'une simple pastille ronde déconnectée du reste.
function MiniPin({ color }) {
  return (
    <span style={{ position: "relative", width: 15, height: 18, display: "inline-block", flexShrink: 0 }}>
      <span
        style={{
          position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
          width: 13, height: 13, borderRadius: "50%", border: `2.5px solid ${color}`, background: "#fff",
        }}
      />
      <span
        style={{
          position: "absolute", top: 10, left: "50%", transform: "translateX(-50%)",
          width: 0, height: 0,
          borderLeft: "3.5px solid transparent", borderRight: "3.5px solid transparent",
          borderTop: `5px solid ${color}`,
        }}
      />
    </span>
  );
}

// Bandeau "Explorez le monde en direct" — texte à gauche, illustration
// à droite (image fournie par Rad : globe + pins + cards LIVE). Traitée
// comme une vignette encadrée (coins arrondis + fine bordure) plutôt que
// fondue dans le fond de la carte, car son fond blanc plein trancherait
// sinon avec le fond chaud du bandeau (var(--cloud-2)).
function WorldLiveBanner() {
  return (
    <div
      style={{
        marginBottom: 16,
        padding: "4px 0 16px",
        background: "transparent",
      }}
    >
      <div style={{ position: "relative", marginBottom: 10, minHeight: "clamp(70px, 19vw, 90px)" }}>
        <div
          className="sf-display"
          style={{
            maxWidth: "56%",
            fontSize: "clamp(19px, 6vw, 24px)",
            fontWeight: 700,
            lineHeight: 1.1,
          }}
        >
          <div>Explorez le monde</div>
          <div style={{ color: "var(--signal)" }}>en direct</div>
        </div>

        <img
          src="/explore-globe.webp"
          alt="Reporters en direct partout dans le monde"
          style={{
            position: "absolute",
            top: "50%",
            right: 0,
            transform: "translateY(-50%)",
            width: "clamp(150px, 46vw, 190px)",
            height: "clamp(150px, 46vw, 190px)",
            objectFit: "contain",
            objectPosition: "center",
            pointerEvents: "none",
          }}
        />
      </div>

      <div style={{ fontSize: 12, color: "var(--slate)", lineHeight: 1.4 }}>
        Des reporters disponibles aux quatre coins du monde. Choisissez un endroit et regardez ce qui s'y passe, en direct.
      </div>
    </div>
  );
}

// Explorer reste ouvert sans connexion — un visiteur doit pouvoir
// "goûter" le service (voir les Reporters disponibles) avant qu'on lui
// demande quoi que ce soit. La connexion n'est requise qu'au moment de
// réserver une mission (voir app/reporter/[id]/page.jsx).
// useSearchParams() exige une frontière Suspense côté Next.js (App
// Router) — sans ça, le build échoue. Le contenu réel est déporté dans
// ExplorerContent, ce wrapper ne fait que fournir cette frontière.
export default function ExplorerPage() {
  return (
    <Suspense fallback={null}>
      <ExplorerContent />
    </Suspense>
  );
}

function ExplorerContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState("map");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCenter, setSearchCenter] = useState(null);
  const [searching, setSearching] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const debounceRef = React.useRef(null);
  const [locating, setLocating] = useState(false);
  const [cityFilter, setCityFilter] = useState("all");
  const [languageFilter, setLanguageFilter] = useState("all");
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const searchInputRef = React.useRef(null);

  // Réagit à CHAQUE changement des paramètres d'URL, pas seulement au
  // premier chargement — "Explorer" et "Trouver un reporter" pointent
  // tous les deux vers /explorer, donc Next.js garde ce composant monté
  // au lieu de le recharger : sans ce useEffect (un useState suffirait
  // seulement pour la toute première visite), cliquer sur l'un puis
  // l'autre ne changeait rien après le premier chargement.
  useEffect(() => {
    const wantsList = searchParams.get("mode") === "list";
    const wantsSearchFocus = searchParams.get("search") === "1";
    setMode(wantsList ? "list" : "map");
    setFiltersOpen(wantsSearchFocus);
    if (wantsSearchFocus) {
      // Léger délai : laisse le champ (parfois masqué/animé) apparaître
      // avant de lui donner le focus, sinon le focus peut être ignoré.
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [searchParams]);

  // Masque/affiche la recherche selon la direction du scroll (mobile
  // surtout, mais inoffensif en desktop). headerH mesure la vraie
  // hauteur du header rendu (1 ou 2 rangées selon connecté/non) pour
  // que la recherche colle juste en dessous, jamais dessous ou dessus.
  const scrollDir = useScrollDirection();
  const [headerH, setHeaderH] = useState(0);
  useEffect(() => {
    const update = () => setHeaderH(document.querySelector(".sf-header")?.offsetHeight || 0);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Filtres calculés une fois — utiles maintenant que les Reporters
  // couvrent ~20 villes mondiales avec des langues variées, sinon le
  // mode liste (et la carte) affichent tout en vrac sans façon de cibler.
  const cities = Array.from(new Set(REPORTERS.map((r) => r.city))).sort();
  const languages = Array.from(new Set(REPORTERS.flatMap((r) => r.languages || []))).sort();

  const filteredReporters = REPORTERS.filter((r) => {
    if (cityFilter !== "all" && r.city !== cityFilter) return false;
    if (languageFilter !== "all" && !(r.languages || []).includes(languageFilter)) return false;
    if (onlineOnly && !r.online) return false;
    // En mode liste, la recherche filtre par nom de profil ("Trouver
    // un reporter" = chercher une personne, pas un lieu — le géocodage
    // de lieu reste réservé au mode carte, cf. handleSearch).
    if (mode === "list" && searchQuery.trim() && !r.name.toLowerCase().includes(searchQuery.trim().toLowerCase())) return false;
    return true;
  });

  const activeFilterCount = (cityFilter !== "all" ? 1 : 0) + (languageFilter !== "all" ? 1 : 0);

  // "Je ne trouve personne" : si le filtre "En ligne" vide les résultats
  // alors que des Reporters existent bien dans cette zone/langue, on
  // propose le plus proche (programmable) plutôt qu'un cul-de-sac. Ne
  // s'applique jamais à une recherche par nom infructueuse (mode liste)
  // — proposer un Reporter sans rapport avec le nom tapé serait trompeur.
  const isNameSearchActive = mode === "list" && searchQuery.trim().length > 0;
  const reportersIgnoringOnline = REPORTERS.filter((r) => {
    if (cityFilter !== "all" && r.city !== cityFilter) return false;
    if (languageFilter !== "all" && !(r.languages || []).includes(languageFilter)) return false;
    return true;
  });
  const nearestFallback =
    !isNameSearchActive && filteredReporters.length === 0 && reportersIgnoringOnline.length > 0
      ? searchCenter
        ? findNearestReporter(reportersIgnoringOnline, { lat: searchCenter[0], lng: searchCenter[1] })
        : [...reportersIgnoringOnline].sort((a, b) => b.rating - a.rating)[0]
      : null;
  const nearestFallbackDistance =
    nearestFallback && searchCenter
      ? distanceKm(searchCenter[0], searchCenter[1], nearestFallback.lat, nearestFallback.lng)
      : null;

  const goToReporter = (id) => router.push(`/reporter/${id}`);

  // Autocomplétion pendant la frappe — API MapTiler (même clé que les
  // tuiles de la carte), qui autorise explicitement l'autocomplétion
  // contrairement à Nominatim. Débounce 300ms pour ne pas déclencher un
  // appel à chaque lettre tapée.
  const fetchSuggestions = (value) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (value.trim().length < 2) {
      setSuggestions([]);
      setSuggestionsOpen(false);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://api.maptiler.com/geocoding/${encodeURIComponent(value)}.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}&autocomplete=true&limit=5`
        );
        const data = await res.json();
        setSuggestions(data?.features || []);
        setSuggestionsOpen(true);
      } catch {
        // Échec silencieux — la recherche via Entrée (Nominatim) reste
        // disponible en secours si les suggestions ne chargent pas.
        setSuggestions([]);
      }
    }, 300);
  };

  const selectSuggestion = (feature) => {
    const [lng, lat] = feature.center;
    setSearchQuery(feature.place_name || feature.text);
    setSearchCenter([lat, lng]);
    setMode("map");
    setSuggestions([]);
    setSuggestionsOpen(false);
  };

  // Recherche précise (cahier des charges section 4b) : le Participant a
  // un lieu en tête, il le tape, la carte se recentre dessus. Nominatim
  // = géocodage OpenStreetMap gratuit, aucune clé API nécessaire — reste
  // le filet de secours si l'utilisateur tape Entrée sans choisir une
  // suggestion MapTiler.
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSuggestionsOpen(false);
    setSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`
      );
      const results = await res.json();
      if (results[0]) {
        setSearchCenter([parseFloat(results[0].lat), parseFloat(results[0].lon)]);
        setMode("map");
      }
    } catch {
      // Échec de géocodage silencieux — ne bloque pas l'UI.
    } finally {
      setSearching(false);
    }
  };

  // Bouton "me géolocaliser" — recentre la carte sur la position du
  // navigateur, sans rien présélectionner : ça ne fait que déplacer la
  // vue, le choix du Reporter reste entièrement manuel ensuite.
  const handleLocate = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setSearchCenter([pos.coords.latitude, pos.coords.longitude]);
        setLocating(false);
      },
      () => setLocating(false),
      { timeout: 8000 }
    );
  };

    // "Destinations populaires" — les 4 villes couvertes par le plus de
  // Reporters en ligne, calculées depuis les vraies données plutôt
  // qu'une liste écrite en dur, pour rester cohérent si de nouveaux
  // Reporters/villes sont ajoutés à REPORTERS.
  const popularDestinations = Object.values(
    REPORTERS.reduce((acc, r) => {
      acc[r.city] = acc[r.city] || { city: r.city, country: CITY_COUNTRY[r.city] || "", online: 0, total: 0, latSum: 0, lngSum: 0 };
      acc[r.city].total += 1;
      acc[r.city].latSum += r.lat;
      acc[r.city].lngSum += r.lng;
      if (r.online) acc[r.city].online += 1;
      return acc;
    }, {})
  )
    .sort((a, b) => b.online - a.online || b.total - a.total)
    .slice(0, 4)
    .map((d, i) => ({
      ...d,
      lat: d.latSum / d.total,
      lng: d.lngSum / d.total,
      gradient: DESTINATION_GRADIENTS[i % DESTINATION_GRADIENTS.length],
      photo: CITY_PHOTO[d.city],
    }));

  return (
    <div>
      <Header />
      <div className="sf-wrap" style={{ paddingTop: 20, paddingBottom: 100, maxWidth: 720 }}>
        {/* Barre de recherche — sortie de la carte, toujours visible en
           haut de page (plutôt que flottante sur la carte), avec le
           bouton de filtres juste à côté. Colle sous le header et se
           masque en scrollant vers le bas / réapparaît vers le haut. */}
        <div
          className="sf-scroll-hide"
          style={{ top: headerH, background: "var(--cloud, var(--surface))" }}
        >
          <form onSubmit={mode === "list" ? (e) => e.preventDefault() : handleSearch} style={{ display: "flex", gap: 8, padding: "4px 0", marginBottom: filtersOpen ? 10 : 16 }}>
            <div style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", gap: 8, background: "#fff", border: "1px solid var(--line)", boxShadow: "var(--shadow-card)", borderRadius: 999, padding: "13px 16px" }}>
              <Search size={15} color="var(--slate)" style={{ flexShrink: 0 }} />
              <input
                ref={searchInputRef}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (mode !== "list") fetchSuggestions(e.target.value);
                }}
                onFocus={() => mode !== "list" && suggestions.length > 0 && setSuggestionsOpen(true)}
                onBlur={() => setTimeout(() => setSuggestionsOpen(false), 150)}
                placeholder={mode === "list" ? "Nom du Reporter" : "Où voulez-vous regarder ?"}
                style={{ border: "none", outline: "none", background: "transparent", fontSize: 13.5, fontWeight: 500, minWidth: 0, width: "100%", color: "var(--ink)" }}
              />
            </div>
            <button
              type="button"
              onClick={() => setFiltersOpen((v) => !v)}
              style={{
                flexShrink: 0, width: 46, height: 46, borderRadius: "50%", border: "1px solid var(--line)",
                background: filtersOpen || activeFilterCount > 0 ? "var(--ink)" : "#fff",
                color: filtersOpen || activeFilterCount > 0 ? "#fff" : "var(--ink)",
                display: "flex", alignItems: "center", justifyContent: "center", position: "relative",
                boxShadow: "var(--shadow-card)",
              }}
            >
              {filtersOpen ? <X size={16} /> : <SlidersHorizontal size={15} />}
              {!filtersOpen && activeFilterCount > 0 && (
                <span style={{ position: "absolute", top: -2, right: -2, width: 15, height: 15, borderRadius: "50%", background: "var(--signal)", color: "#fff", fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {activeFilterCount}
                </span>
              )}
            </button>
          </form>

          {mode !== "list" && suggestionsOpen && suggestions.length > 0 && (
            <div
              style={{
                position: "relative", zIndex: 20, marginTop: -6, marginBottom: 12,
                background: "#fff", border: "1px solid var(--line)", borderRadius: 14,
                boxShadow: "var(--shadow-card)", overflow: "hidden",
              }}
            >
              {suggestions.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => selectSuggestion(f)}
                  style={{
                    display: "flex", alignItems: "center", gap: 10, width: "100%", textAlign: "left",
                    padding: "11px 16px", border: "none", background: "none", borderBottom: "1px solid var(--line)",
                    fontSize: 13, color: "var(--ink)", cursor: "pointer",
                  }}
                >
                  <MapPin size={13} color="var(--slate)" style={{ flexShrink: 0 }} />
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {f.place_name || f.text}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Panneau de filtres ville/langue — bloc normal sous la
           recherche plutôt qu'en overlay flottant sur la carte, pour
           rester valable aussi bien en mode carte qu'en mode liste. */}
        {filtersOpen && (
          <div style={{ marginBottom: 16, background: "#fff", border: "1px solid var(--line)", borderRadius: 12, padding: 14, boxShadow: "var(--shadow-card)", display: "flex", gap: 8, flexWrap: "wrap" }}>
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              style={{ flex: "1 1 160px", fontSize: 12.5, padding: "9px 12px", borderRadius: 8, border: "1px solid var(--line)", background: "#fff", color: "var(--ink)" }}
            >
              <option value="all">Toutes les villes ({REPORTERS.length})</option>
              {cities.map((c) => (
                <option key={c} value={c}>{c} ({REPORTERS.filter((r) => r.city === c).length})</option>
              ))}
            </select>
            <select
              value={languageFilter}
              onChange={(e) => setLanguageFilter(e.target.value)}
              style={{ flex: "1 1 160px", fontSize: 12.5, padding: "9px 12px", borderRadius: 8, border: "1px solid var(--line)", background: "#fff", color: "var(--ink)" }}
            >
              <option value="all">Toutes les langues</option>
              {languages.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setOnlineOnly((v) => !v)}
              style={{ flex: "1 1 160px", display: "flex", alignItems: "center", justifyContent: "center", gap: 7, fontSize: 12.5, fontWeight: 600, padding: "9px 12px", borderRadius: 8, border: `1px solid ${onlineOnly ? "var(--signal)" : "var(--line)"}`, background: onlineOnly ? "var(--signal)" : "#fff", color: onlineOnly ? "#fff" : "var(--ink)" }}
            >
              {onlineOnly ? <CheckSquare size={16} /> : <Square size={16} color="var(--slate)" />}
              Uniquement en ligne
            </button>
          </div>
        )}

        {/* Bandeau "Explorez le monde en direct" — vrais reporters en
           ligne plutôt qu'une illustration statique, pour que le
           message reste vrai même si la liste change (pas de photo
           "en direct" d'un reporter hors ligne). */}
        <WorldLiveBanner />

        {/* Pastille stats — centrée sous le bandeau plutôt qu'alignée à
           droite du titre, pour reprendre la mise en avant de la
           maquette de référence. */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
          <div
            className="sf-mono"
            style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.02em", color: "var(--ink)", border: "1px solid var(--line)", padding: "7px 12px", borderRadius: 10 }}
          >
            <span style={{ position: "relative", width: 7, height: 7, flexShrink: 0 }}>
              <span style={{ position: "absolute", inset: -4, borderRadius: "50%", background: "var(--teal)", opacity: 0.35, filter: "blur(1px)", animation: "sfPulse 2s ease-in-out infinite" }} />
              <span style={{ position: "relative", width: 7, height: 7, borderRadius: "50%", background: "var(--teal)", display: "block" }} />
            </span>
            {filteredReporters.filter((r) => r.online).length} en ligne
            <span style={{ color: "var(--slate)", fontWeight: 500 }}>· {filteredReporters.length} reporters</span>
          </div>
        </div>

        {mode === "map" ? (
          <>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8 }}>
            <button
              type="button"
              onClick={() => { setSearchQuery(""); setMode("list"); }}
              style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: "var(--slate)", background: "none", border: "none" }}
            >
              <List size={13} />
              Voir en liste
            </button>
          </div>

          <div style={{ position: "relative", height: 360, marginBottom: 12 }}>
            <ExplorerMap reporters={filteredReporters} center={searchCenter} onSelect={goToReporter} />

            {/* Bouton géolocalisation — recentre seulement, aucune
               présélection automatique de Reporter. */}
            <button
              onClick={handleLocate}
              disabled={locating}
              style={{ position: "absolute", top: 12, right: 12, zIndex: 500, width: 38, height: 38, borderRadius: "50%", border: "1px solid var(--line)", background: "#fff", color: "var(--ink)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}
            >
              <Locate size={16} className={locating ? "sf-spin" : ""} />
            </button>

            {/* "Je ne trouve personne" — même logique qu'en mode liste,
               en overlay flottant sur la carte. */}
            {filteredReporters.length === 0 && nearestFallback && (
              <div style={{ position: "absolute", left: 12, right: 12, bottom: 12, zIndex: 500, background: "rgba(255,255,255,0.98)", border: "1px solid var(--line)", borderRadius: 12, padding: 16, boxShadow: "0 2px 10px rgba(0,0,0,0.08)" }}>
                <div style={{ fontSize: 12.5, color: "var(--slate)", marginBottom: 12 }}>
                  Personne en live tout de suite ici — mais {nearestFallback.name} peut être programmé.
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                  <ReporterAvatar reporter={nearestFallback} size={40} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 13.5 }}>{nearestFallback.name}</div>
                    <div style={{ fontSize: 11.5, color: "var(--slate)" }}>
                      {nearestFallback.place}{nearestFallbackDistance != null ? ` · à ${nearestFallbackDistance.toFixed(1)} km` : ""}
                    </div>
                  </div>
                </div>
                <Button full onClick={() => goToReporter(nearestFallback.id)}>
                  <CalendarClock size={15} />Programmer avec {nearestFallback.name}
                </Button>
              </div>
            )}
          </div>

          {/* Légende — mêmes pins (anneau coloré + pointe) que sur la
             carte. Sur 2 lignes (2 items + 1 item centré) plutôt que sur
             une seule ligne compressée à une police illisible : ça reste
             sans scroll horizontal, avec une taille de texte confortable. */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              marginBottom: 20,
              padding: "12px 16px",
              border: "1px solid var(--line)",
              borderRadius: 10,
              fontSize: 12,
              color: "var(--slate)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}>
                <MiniPin color="var(--signal)" />
                Live immédiat
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}>
                <MiniPin color="var(--amber-live)" />
                Live programmable
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}>
                <span style={{ width: 13, height: 13, borderRadius: "50%", background: "var(--ink)", display: "inline-block", flexShrink: 0 }} />
                Groupe de reporters
              </span>
            </div>
          </div>

          {/* Destinations populaires — mêmes villes que celles réellement
             couvertes par les Reporters (lib/mock-data.js), classées par
             nombre de Reporters en ligne, plutôt qu'une liste figée
             déconnectée des vraies données. */}
          <div style={{ marginBottom: 8 }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 12 }}>
              <h2 className="sf-display" style={{ fontSize: 16.5 }}>Destinations populaires</h2>
              <button
                type="button"
                onClick={() => { setSearchQuery(""); setMode("list"); }}
              >
                Explorer le monde →
              </button>
            </div>
            <div style={{ position: "relative", marginInline: -24 }}>
              <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 6, paddingInline: 24, WebkitOverflowScrolling: "touch" }}>
              {popularDestinations.map((d) => (
                <button
                  key={d.city}
                  type="button"
                  onClick={() => { setCityFilter(d.city); setSearchCenter([d.lat, d.lng]); setMode("map"); }}
                  style={{
                    position: "relative", flexShrink: 0, width: 148, height: 118, borderRadius: 14,
                    border: "none", padding: "12px", textAlign: "left", overflow: "hidden",
                    background: d.photo ? `#000 url(${d.photo}) center/cover no-repeat` : d.gradient,
                    color: "#fff", cursor: "pointer",
                  }}
                >
                  {d.photo && (
                    <span
                      style={{
                        position: "absolute", inset: 0,
                        background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.05) 55%, rgba(0,0,0,0.25) 100%)",
                      }}
                    />
                  )}
                  <span
                    className="sf-mono"
                    style={{ position: "absolute", top: 10, left: 12, zIndex: 1, display: "flex", alignItems: "center", gap: 4, fontSize: 9, fontWeight: 800, letterSpacing: "0.03em", background: "rgba(0,0,0,0.35)", padding: "3px 7px", borderRadius: 999 }}
                  >
                    <span className="sf-live-dot" style={{ width: 5, height: 5, borderRadius: "50%", background: "#fff", display: "inline-block" }} />
                    LIVE
                  </span>
                  <span
                    className="sf-mono"
                    style={{ position: "absolute", bottom: 10, right: 10, zIndex: 1, display: "flex", alignItems: "center", gap: 4, fontSize: 10, fontWeight: 700, background: "var(--teal)", padding: "3px 8px 3px 6px", borderRadius: 999 }}
                  >
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff", display: "inline-block" }} />
                    {d.online}
                  </span>
                  <span style={{ position: "absolute", left: 12, bottom: 10, right: 40, zIndex: 1 }}>
                    <span className="sf-display" style={{ display: "block", fontSize: 16, fontWeight: 700, lineHeight: 1.1 }}>{d.city}</span>
                    <span style={{ display: "block", fontSize: 10.5, opacity: 0.85, marginTop: 2 }}>{d.country}</span>
                  </span>
                </button>
              ))}
              </div>
              {popularDestinations.length > 2 && (
                <span
                  aria-hidden
                  style={{
                    position: "absolute", top: 0, right: 0, bottom: 6, width: 32,
                    background: "linear-gradient(to right, rgba(255,255,255,0) 0%, var(--cloud) 100%)",
                    pointerEvents: "none",
                  }}
                />
              )}
            </div>
          </div>
          </>
        ) : (
          <>
            {/* Pas de deuxième barre de recherche NI de deuxième rangée
               de filtres ici : les deux sont déjà gérées par le panneau
               unique en haut (recherche sticky + bouton curseurs), les
               dupliquer en vue liste créait un doublon visuel confus. */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}>
              <button
                type="button"
                onClick={() => { setSearchQuery(""); setMode("map"); }}
                style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: "var(--slate)", background: "none", border: "none" }}
              >
                <MapPin size={13} />
                Voir la carte
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14, paddingBottom: 40 }}>
              {filteredReporters.length === 0 && (
                nearestFallback ? (
                  <Card style={{ textAlign: "center", padding: "26px 20px" }}>
                    <div style={{ fontSize: 13, color: "var(--slate)", marginBottom: 14 }}>
                      Personne en live tout de suite avec ces filtres — mais {nearestFallback.name} peut être programmé.
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, textAlign: "left", marginBottom: 16 }}>
                      <ReporterAvatar reporter={nearestFallback} size={44} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{nearestFallback.name}</div>
                        <div style={{ fontSize: 12, color: "var(--slate)" }}>
                          {nearestFallback.place}{nearestFallbackDistance != null ? ` · à ${nearestFallbackDistance.toFixed(1)} km` : ""}
                        </div>
                      </div>
                    </div>
                    <Button full onClick={() => goToReporter(nearestFallback.id)}>
                      <CalendarClock size={15} />Programmer avec {nearestFallback.name}
                    </Button>
                  </Card>
                ) : (
                  <div style={{ textAlign: "center", color: "var(--slate)", fontSize: 13, padding: "30px 0" }}>
                    {isNameSearchActive ? `Aucun Reporter ne s'appelle "${searchQuery.trim()}".` : "Aucun Reporter ne correspond à ces filtres."}
                  </div>
                )
              )}
              {filteredReporters.map((r) => (
                <Card
                  key={r.id}
                  padding="16px 20px"
                  style={{
                    display: "flex",
                    gap: 16,
                    alignItems: "flex-start",
                    cursor: "pointer",
                  }}
                  onClick={() => goToReporter(r.id)}
                >
                  <ReporterAvatar reporter={r} size={50} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{r.name}</div>
                    <div style={{ fontSize: 12.5, color: "var(--slate)", display: "flex", alignItems: "center", gap: 5, marginTop: 2 }}>
                      <MapPin size={11} />{r.place}
                    </div>
                    {r.languages?.length > 0 && (
                      <div style={{ fontSize: 11, color: "var(--slate-2)", marginTop: 3 }}>{r.languages.join(" · ")}</div>
                    )}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, flexShrink: 0 }}>
                    <div
                      className="sf-mono"
                      style={{
                        fontSize: 12.5,
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        background: "var(--amber-tint, rgba(184,134,11,0.1))",
                        color: "var(--amber, #8a5c14)",
                        padding: "4px 9px",
                        borderRadius: 999,
                      }}
                    >
                      <Star size={12} fill="var(--amber, #b8860b)" color="var(--amber, #b8860b)" />{r.rating}
                    </div>
                    {r.online ? (
                      <Badge tone="signal">En ligne</Badge>
                    ) : (
                      <span
                        className="sf-mono"
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          padding: "4px 10px",
                          borderRadius: 999,
                          display: "inline-block",
                          background: "rgba(226, 169, 22, 0.16)",
                          color: "var(--amber-live, #e2a916)",
                        }}
                      >
                        Programmable
                      </span>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
