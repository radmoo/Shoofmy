"use client";

import React, { useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import { Star, MapPin } from "lucide-react";
import ReporterAvatar from "@/components/ui/ReporterAvatar";
import Badge from "@/components/ui/Badge";
import { reporterPhotoUrl } from "@/lib/geo";

// Icônes personnalisées en divIcon — pin "photo dans un cercle" (anneau
// coloré + pointe), calé sur la maquette de référence Explorer plutôt
// que sur l'ancien pictogramme plat. Rouge signal pour un Reporter en
// ligne (disponible tout de suite), ambre pour programmable — mêmes
// couleurs que le reste du site, juste un habillage différent. Halo
// animé sur les en ligne pour signaler la disponibilité en un coup d'œil.
function makeIcon(reporter) {
  const online = reporter.online;
  const color = online ? "var(--signal, #d9361f)" : "var(--amber-live, #e2a916)";
  const photo = reporterPhotoUrl(reporter, 96);
  const pulse = online
    ? `<span style="position:absolute;left:50%;top:21px;width:44px;height:44px;transform:translate(-50%,-50%);border-radius:50%;background:${color};opacity:0.25;filter:blur(3px);animation:sfPulse 2s ease-in-out infinite;"></span>`
    : "";
  return L.divIcon({
    className: "",
    html: `<div style="position:relative;width:44px;height:56px;">
      ${pulse}
      <div style="position:relative;width:40px;height:40px;margin:0 auto;border-radius:50%;border:3px solid ${color};background:#fff;box-shadow:0 2px 8px rgba(0,0,0,0.28);overflow:hidden;">
        <img src="${photo}" style="width:100%;height:100%;object-fit:cover;display:block;" />
      </div>
      ${online ? `<span style="position:absolute;left:50%;top:32px;margin-left:9px;width:11px;height:11px;border-radius:50%;background:var(--teal,#1e9e80);border:2px solid #fff;"></span>` : ""}
      <div style="position:absolute;left:50%;top:38px;transform:translateX(-50%);width:0;height:0;border-left:6px solid transparent;border-right:6px solid transparent;border-top:10px solid ${color};"></div>
    </div>`,
    iconSize: [44, 56],
    iconAnchor: [22, 52],
  });
}

// Grappe de markers — pastille ronde noire avec le nombre, calée sur la
// maquette de référence (cluster simple, sans sous-texte) plutôt que
// l'ancien badge rectangulaire avec libellé "Reporters".
function makeClusterIcon(cluster) {
  const count = cluster.getChildCount();
  const size = count < 10 ? 34 : count < 50 ? 40 : 46;
  const numSize = count < 50 ? 14 : 12;
  return L.divIcon({
    html: `<div style="
      width:${size}px;height:${size}px;border-radius:50%;
      background:var(--ink, #14171c);color:#fff;
      display:flex;align-items:center;justify-content:center;
      box-shadow:0 2px 8px rgba(0,0,0,0.3);
    ">
      <span style="font-family:'Big Shoulders Display',sans-serif;font-weight:800;font-size:${numSize}px;line-height:1;">${count}</span>
    </div>`,
    className: "",
    iconSize: [size, size],
  });
}

function RecenterOnChange({ center }) {
  const map = useMap();
  React.useEffect(() => {
    if (center) map.flyTo(center, 14, { duration: 0.6 });
  }, [center, map]);
  return null;
}

/**
 * La carte est l'outil CENTRAL de sélection (cahier des charges section
 * 4) — pas un accessoire décoratif. Cliquer un marker mène directement
 * vers la réservation de ce Reporter précis : la sélection reste
 * manuelle et visuelle de bout en bout, jamais automatique.
 *
 * @param {{ reporters: Array, center?: [number, number], onSelect: (id:string)=>void }} props
 */
export default function ExplorerMap({ reporters, center, onSelect }) {
  // Vue mondiale par défaut : les Reporters sont répartis sur ~20 villes,
  // pas seulement Paris. Zoom niveau ville uniquement quand une recherche
  // précise recentre la carte (voir RecenterOnChange).
  const defaultCenter = useMemo(() => [25, 10], []);
  // Bornes reelles de la carte (-90/-180 a 90/180). Sans ca, dezoomer
  // completement puis glisser vers la droite/gauche fait apparaitre une
  // "nouvelle Terre" vide au-dela de la couverture des tuiles — Leaflet
  // ne bloque pas nativement le panoramique hors des limites du monde.
  const worldBounds = useMemo(() => [[-90, -180], [90, 180]], []);

  return (
    <div style={{ height: "100%", width: "100%", clipPath: "inset(0 round var(--radius-m))", WebkitClipPath: "inset(0 round var(--radius-m))" }}>
      <MapContainer
        center={defaultCenter}
        zoom={2}
        minZoom={2}
        scrollWheelZoom
        worldCopyJump
        maxBounds={worldBounds}
        maxBoundsViscosity={1.0}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.maptiler.com/copyright/" target="_blank">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors'
          url={`https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`}
          tileSize={512}
          zoomOffset={-1}
          maxZoom={19}
          noWrap={false}
        />
        {center && <RecenterOnChange center={center} />}
        <MarkerClusterGroup
          iconCreateFunction={makeClusterIcon}
          maxClusterRadius={46}
          spiderfyOnMaxZoom
          showCoverageOnHover={false}
        >
          {reporters.map((r) => (
            <Marker key={r.id} position={[r.lat, r.lng]} icon={makeIcon(r)}>
              <Popup minWidth={220} maxWidth={240} closeButton>
                <div style={{ fontFamily: "var(--font-body)", padding: "14px 14px 12px" }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }}>
                    <ReporterAvatar reporter={r} size={44} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="sf-display" style={{ fontSize: 15.5, lineHeight: 1.1 }}>{r.name}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11.5, color: "var(--slate)", marginTop: 2 }}>
                        <MapPin size={10} style={{ flexShrink: 0 }} />
                        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.place}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 10 }}>
                    <span className="sf-mono" style={{ fontSize: 12.5, display: "flex", alignItems: "center", gap: 4, color: "var(--ink)" }}>
                      <Star size={11} fill="var(--ember)" color="var(--ember)" />{r.rating}
                    </span>
                    {r.online ? <Badge tone="signal">En ligne</Badge> : <Badge tone="ember">Programmable</Badge>}
                  </div>

                  {r.languages?.length > 0 && (
                    <div style={{ fontSize: 11, color: "var(--slate-2)", marginBottom: 12 }}>
                      {r.languages.join(" · ")}
                    </div>
                  )}

                  <button
                    onClick={() => onSelect(r.id)}
                    style={{ width: "100%", fontSize: 12.5, fontWeight: 600, background: "var(--ink)", color: "#fff", border: "none", borderRadius: 8, padding: "10px 12px", cursor: "pointer" }}
                  >
                    {r.online ? "Voir son profil" : "Proposer un créneau"}
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
}
