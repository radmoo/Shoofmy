// Traduction via MyMemory (gratuite, sans clé, CORS activé — appelable
// directement depuis le navigateur, pas besoin de fonction serveur).
// Limite : ~5000 caractères/jour par IP, largement suffisant pour des
// messages courts de pilotage de mission. Pas de garantie de qualité
// professionnelle (mémoire de traduction crowdsourcée + fallback MT),
// mais correct pour des instructions courtes ("Plus près", "Vers la
// droite"...).

// Correspondance entre les libellés français utilisés dans le mock
// (Reporter.languages) et les codes ISO attendus par l'API.
const LANGUAGE_TO_ISO = {
  "Français": "fr",
  "Anglais": "en",
  "Espagnol": "es",
  "Portugais": "pt",
  "Italien": "it",
  "Allemand": "de",
  "Japonais": "ja",
  "Arabe": "ar",
  "Mandarin": "zh",
};

export function languageLabelToIso(label) {
  return LANGUAGE_TO_ISO[label] || null;
}

// Traduit `text` du français vers la langue cible (libellé français,
// ex. "Anglais"). Retourne le texte original si la langue cible est le
// français, si elle est inconnue, ou si l'appel échoue — on ne bloque
// jamais l'envoi d'un message pour une histoire de traduction.
export async function translateFromFrench(text, targetLanguageLabel) {
  const targetIso = languageLabelToIso(targetLanguageLabel);
  if (!targetIso || targetIso === "fr") return text;

  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=fr|${targetIso}`;
    const res = await fetch(url);
    if (!res.ok) return text;
    const data = await res.json();
    const translated = data?.responseData?.translatedText;
    // MyMemory renvoie parfois un texte d'erreur (quota dépassé...) à la
    // place d'une vraie traduction plutôt qu'un code HTTP en échec.
    if (!translated || /MYMEMORY WARNING/i.test(translated)) return text;
    return translated;
  } catch {
    return text;
  }
}
