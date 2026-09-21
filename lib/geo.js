/**
 * Avatar illustré déterministe pour un Reporter (pas de vraie photo dans
 * les mock data — on ne peut pas légitimement attacher un vrai visage de
 * personne réelle à une fausse identité commerciale sur un site en ligne
 * publiquement, cf. discussion du 25/08). Style "notionists" : traits
 * simples et éditoriaux plutôt que le rendu cartoon coloré par défaut,
 * fond neutre pour coller à la palette noir/rouge du site. DiceBear
 * génère un visuel stable à partir de l'id, donc chaque Reporter garde
 * toujours le même avatar.
 */
export function reporterPhotoUrl(reporter, size = 128) {
  return `https://i.pravatar.cc/${size}?u=${encodeURIComponent(reporter.id)}`;
}

/**
 * Petite image de carte (OpenStreetMap statique, gratuit, sans clé) centrée
 * sur le Reporter — sert de pastille "où il est" à côté de sa photo.
 */
export function reporterMapThumbUrl(reporter, size = 64, zoom = 13) {
  return `https://staticmap.openstreetmap.de/staticmap.php?center=${reporter.lat},${reporter.lng}&zoom=${zoom}&size=${size}x${size}&maptype=mapnik&markers=${reporter.lat},${reporter.lng},lightblue1`;
}

/**
 * Distance à vol d'oiseau entre deux points (km), formule de Haversine.
 * Pas besoin de service externe — un calcul mathématique suffit une fois
 * qu'on a lat/lng de chaque Reporter (déjà présents dans mock-data).
 */
export function distanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Reporter le plus proche d'un point donné, quel que soit son statut en
 * ligne — utilisé pour le fallback "personne disponible tout de suite"
 * (Explorer) : plutôt qu'un cul-de-sac, on propose de le programmer.
 * @param {Array} reporters
 * @param {{lat:number, lng:number}} from
 */
export function findNearestReporter(reporters, from) {
  if (reporters.length === 0) return null;
  return reporters.reduce((nearest, r) => {
    const d = distanceKm(from.lat, from.lng, r.lat, r.lng);
    if (!nearest || d < nearest.d) return { r, d };
    return nearest;
  }, null).r;
}

/**
 * Reporter en ligne le plus proche d'un point donné, en excluant un id
 * (celui qui vient de refuser). Utilisé pour le fallback automatique
 * (cahier des charges section 6) — un vrai calcul de proximité plutôt
 * qu'un choix arbitraire dans la liste.
 * @param {Array} reporters
 * @param {{lat:number, lng:number}} from
 * @param {string} excludeId
 */
export function findNearestOnlineReporter(reporters, from, excludeId) {
  const candidates = reporters.filter((r) => r.online && r.id !== excludeId);
  if (candidates.length === 0) return null;
  return candidates.reduce((nearest, r) => {
    const d = distanceKm(from.lat, from.lng, r.lat, r.lng);
    if (!nearest || d < nearest.d) return { r, d };
    return nearest;
  }, null).r;
}
