/** @typedef {import('./types').Reporter} Reporter */

/** @type {Reporter[]} */
const REPORTERS_BASE = [
  { id: "r1", name: "Thomas", city: "Paris", place: "Paris 11e", rating: 4.9, missionsCount: 127, verified: true, online: true, lat: 48.8589, lng: 2.3800 },
  { id: "r2", name: "Nour", city: "Paris", place: "Paris 10e", rating: 4.8, missionsCount: 64, verified: true, online: true, lat: 48.8760, lng: 2.3600 },
  { id: "r3", name: "Karim", city: "Paris", place: "Paris 11e", rating: 4.7, missionsCount: 41, verified: true, online: false, lat: 48.8630, lng: 2.3820 },
  { id: "r4", name: "Léa", city: "Paris", place: "Paris 3e", rating: 4.9, missionsCount: 58, verified: true, online: true, lat: 48.8630, lng: 2.3620 },
  { id: "r5", name: "Sarah", city: "Paris", place: "Paris", rating: 5.0, missionsCount: 100, verified: true, online: false, lat: 48.9022, lng: 2.3239 },
  { id: "r6", name: "Ines", city: "Paris", place: "Paris", rating: 4.9, missionsCount: 138, verified: true, online: false, lat: 48.8324, lng: 2.3793 },
  { id: "r7", name: "Maya", city: "Paris", place: "Paris", rating: 5.0, missionsCount: 64, verified: true, online: false, lat: 48.8290, lng: 2.3206 },
  { id: "r8", name: "Emi", city: "Paris", place: "Paris", rating: 4.8, missionsCount: 101, verified: true, online: true, lat: 48.9001, lng: 2.3653 },
  { id: "r9", name: "Jack", city: "Paris", place: "Paris", rating: 4.9, missionsCount: 19, verified: true, online: true, lat: 48.8178, lng: 2.3085 },
  { id: "r10", name: "Diego", city: "Paris", place: "Paris", rating: 4.7, missionsCount: 105, verified: true, online: false, lat: 48.8573, lng: 2.3713 },
  { id: "r11", name: "Mateus", city: "Paris", place: "Paris", rating: 4.6, missionsCount: 77, verified: true, online: true, lat: 48.8217, lng: 2.2932 },
  { id: "r12", name: "Sara", city: "Paris", place: "Paris", rating: 4.7, missionsCount: 138, verified: true, online: true, lat: 48.8958, lng: 2.3614 },
  { id: "r13", name: "Yusuf", city: "Paris", place: "Paris", rating: 4.7, missionsCount: 87, verified: true, online: true, lat: 48.8583, lng: 2.3407 },
  { id: "r14", name: "Min-jun", city: "Paris", place: "Paris", rating: 4.7, missionsCount: 60, verified: true, online: false, lat: 48.8517, lng: 2.4073 },
  { id: "r15", name: "Nina", city: "Paris", place: "Paris", rating: 4.6, missionsCount: 40, verified: true, online: false, lat: 48.8518, lng: 2.3666 },
  { id: "r16", name: "Mila", city: "Paris", place: "Paris", rating: 4.8, missionsCount: 103, verified: true, online: false, lat: 48.8491, lng: 2.3821 },
  { id: "r17", name: "Hana", city: "Paris", place: "Paris", rating: 4.8, missionsCount: 69, verified: true, online: false, lat: 48.8001, lng: 2.3387 },
  { id: "r18", name: "Arjun", city: "Paris", place: "Paris", rating: 4.8, missionsCount: 25, verified: true, online: false, lat: 48.8195, lng: 2.3407 },
  { id: "r19", name: "Nour", city: "Paris", place: "Paris", rating: 4.6, missionsCount: 87, verified: true, online: false, lat: 48.8596, lng: 2.3102 },
  { id: "r20", name: "David", city: "Paris", place: "Paris", rating: 4.6, missionsCount: 115, verified: true, online: false, lat: 48.8045, lng: 2.3184 },
  { id: "r21", name: "Hana", city: "Londres", place: "Londres", rating: 4.8, missionsCount: 91, verified: true, online: false, lat: 51.5194, lng: -0.0884 },
  { id: "r22", name: "Arjun", city: "Londres", place: "Londres", rating: 4.6, missionsCount: 23, verified: true, online: false, lat: 51.4785, lng: -0.1535 },
  { id: "r23", name: "Nour", city: "Londres", place: "Londres", rating: 4.6, missionsCount: 97, verified: true, online: false, lat: 51.5142, lng: -0.1049 },
  { id: "r24", name: "David", city: "Londres", place: "Londres", rating: 4.6, missionsCount: 127, verified: true, online: false, lat: 51.5166, lng: -0.0890 },
  { id: "r25", name: "Nadia", city: "Londres", place: "Londres", rating: 4.6, missionsCount: 81, verified: true, online: false, lat: 51.5283, lng: -0.1766 },
  { id: "r26", name: "Yanis", city: "New York", place: "New York", rating: 4.7, missionsCount: 148, verified: true, online: true, lat: 40.6558, lng: -74.0247 },
  { id: "r27", name: "Hugo", city: "New York", place: "New York", rating: 4.5, missionsCount: 32, verified: true, online: false, lat: 40.7221, lng: -74.0451 },
  { id: "r28", name: "Mateo", city: "New York", place: "New York", rating: 4.7, missionsCount: 135, verified: true, online: false, lat: 40.6781, lng: -74.0201 },
  { id: "r29", name: "Noah", city: "New York", place: "New York", rating: 4.6, missionsCount: 109, verified: true, online: false, lat: 40.7349, lng: -73.9950 },
  { id: "r30", name: "Ethan", city: "New York", place: "New York", rating: 4.7, missionsCount: 18, verified: true, online: true, lat: 40.6855, lng: -74.0242 },
  { id: "r31", name: "Maya", city: "Tokyo", place: "Tokyo", rating: 4.8, missionsCount: 37, verified: true, online: false, lat: 35.6783, lng: 139.7053 },
  { id: "r32", name: "Emi", city: "Tokyo", place: "Tokyo", rating: 4.8, missionsCount: 72, verified: true, online: true, lat: 35.6490, lng: 139.6002 },
  { id: "r33", name: "Jack", city: "Tokyo", place: "Tokyo", rating: 4.9, missionsCount: 36, verified: true, online: false, lat: 35.6736, lng: 139.6193 },
  { id: "r34", name: "Diego", city: "Tokyo", place: "Tokyo", rating: 4.6, missionsCount: 123, verified: true, online: false, lat: 35.7031, lng: 139.6156 },
  { id: "r35", name: "Mateus", city: "Tokyo", place: "Tokyo", rating: 4.6, missionsCount: 134, verified: true, online: false, lat: 35.7325, lng: 139.6924 },
  { id: "r36", name: "Camila", city: "Berlin", place: "Berlin", rating: 4.9, missionsCount: 91, verified: true, online: true, lat: 52.4977, lng: 13.3592 },
  { id: "r37", name: "Luca", city: "Berlin", place: "Berlin", rating: 4.8, missionsCount: 40, verified: true, online: true, lat: 52.5521, lng: 13.4132 },
  { id: "r38", name: "Fatima", city: "Berlin", place: "Berlin", rating: 5.0, missionsCount: 101, verified: true, online: false, lat: 52.5287, lng: 13.3811 },
  { id: "r39", name: "Ji-woo", city: "Berlin", place: "Berlin", rating: 4.7, missionsCount: 28, verified: true, online: true, lat: 52.4972, lng: 13.4053 },
  { id: "r40", name: "Ji-woo", city: "Barcelone", place: "Barcelone", rating: 4.8, missionsCount: 77, verified: true, online: false, lat: 41.4148, lng: 2.1089 },
  { id: "r41", name: "Lukas", city: "Barcelone", place: "Barcelone", rating: 4.6, missionsCount: 61, verified: true, online: false, lat: 41.3378, lng: 2.1697 },
  { id: "r42", name: "Ida", city: "Barcelone", place: "Barcelone", rating: 4.7, missionsCount: 123, verified: true, online: true, lat: 41.4414, lng: 2.1867 },
  { id: "r43", name: "Bilal", city: "Barcelone", place: "Barcelone", rating: 4.7, missionsCount: 129, verified: true, online: true, lat: 41.4342, lng: 2.2072 },
  { id: "r44", name: "Bilal", city: "Rome", place: "Rome", rating: 5.0, missionsCount: 126, verified: true, online: false, lat: 41.9265, lng: 12.4513 },
  { id: "r45", name: "Priya", city: "Rome", place: "Rome", rating: 4.9, missionsCount: 37, verified: true, online: true, lat: 41.9343, lng: 12.4607 },
  { id: "r46", name: "Thomas", city: "Rome", place: "Rome", rating: 4.8, missionsCount: 127, verified: true, online: false, lat: 41.8893, lng: 12.4475 },
  { id: "r47", name: "Manon", city: "Rome", place: "Rome", rating: 4.7, missionsCount: 110, verified: true, online: false, lat: 41.9446, lng: 12.4963 },
  { id: "r48", name: "Manon", city: "Amsterdam", place: "Amsterdam", rating: 4.9, missionsCount: 26, verified: true, online: true, lat: 52.3999, lng: 4.9024 },
  { id: "r49", name: "Yanis", city: "Amsterdam", place: "Amsterdam", rating: 4.9, missionsCount: 117, verified: true, online: true, lat: 52.3125, lng: 4.9472 },
  { id: "r50", name: "Hugo", city: "Amsterdam", place: "Amsterdam", rating: 4.8, missionsCount: 144, verified: true, online: true, lat: 52.3938, lng: 4.9310 },
  { id: "r51", name: "Mateo", city: "Amsterdam", place: "Amsterdam", rating: 4.6, missionsCount: 70, verified: true, online: false, lat: 52.3617, lng: 4.8962 },
  { id: "r52", name: "Mateo", city: "Lisbonne", place: "Lisbonne", rating: 4.7, missionsCount: 59, verified: true, online: true, lat: 38.7419, lng: -9.0810 },
  { id: "r53", name: "Noah", city: "Lisbonne", place: "Lisbonne", rating: 4.8, missionsCount: 108, verified: true, online: false, lat: 38.6790, lng: -9.0917 },
  { id: "r54", name: "Ethan", city: "Lisbonne", place: "Lisbonne", rating: 4.5, missionsCount: 41, verified: true, online: false, lat: 38.6878, lng: -9.1881 },
  { id: "r55", name: "Kenji", city: "Lisbonne", place: "Lisbonne", rating: 4.9, missionsCount: 77, verified: true, online: false, lat: 38.7588, lng: -9.1496 },
  { id: "r56", name: "Kenji", city: "Dubai", place: "Dubai", rating: 4.8, missionsCount: 122, verified: true, online: true, lat: 25.1461, lng: 55.2488 },
  { id: "r57", name: "Olivia", city: "Dubai", place: "Dubai", rating: 4.7, missionsCount: 52, verified: true, online: false, lat: 25.2643, lng: 55.2915 },
  { id: "r58", name: "Valentina", city: "Dubai", place: "Dubai", rating: 4.9, missionsCount: 57, verified: true, online: true, lat: 25.2298, lng: 55.3153 },
  { id: "r59", name: "Giulia", city: "Dubai", place: "Dubai", rating: 4.7, missionsCount: 118, verified: true, online: false, lat: 25.2126, lng: 55.2495 },
  { id: "r60", name: "Giulia", city: "Singapour", place: "Singapour", rating: 4.6, missionsCount: 60, verified: true, online: false, lat: 1.3664, lng: 103.8257 },
  { id: "r61", name: "Elena", city: "Singapour", place: "Singapour", rating: 4.7, missionsCount: 38, verified: true, online: true, lat: 1.4063, lng: 103.8054 },
  { id: "r62", name: "Layla", city: "Singapour", place: "Singapour", rating: 4.6, missionsCount: 74, verified: true, online: true, lat: 1.3164, lng: 103.8011 },
  { id: "r63", name: "So-yeon", city: "Singapour", place: "Singapour", rating: 4.7, missionsCount: 46, verified: true, online: true, lat: 1.3100, lng: 103.8242 },
  { id: "r64", name: "So-yeon", city: "Sydney", place: "Sydney", rating: 4.9, missionsCount: 139, verified: true, online: true, lat: -33.9128, lng: 151.2465 },
  { id: "r65", name: "Felix", city: "Sydney", place: "Sydney", rating: 4.9, missionsCount: 30, verified: true, online: true, lat: -33.8352, lng: 151.2322 },
  { id: "r66", name: "Noor", city: "Sydney", place: "Sydney", rating: 4.6, missionsCount: 18, verified: true, online: false, lat: -33.8356, lng: 151.1959 },
  { id: "r67", name: "Kai", city: "Sydney", place: "Sydney", rating: 4.9, missionsCount: 119, verified: true, online: false, lat: -33.8381, lng: 151.2462 },
  { id: "r68", name: "Kai", city: "Séoul", place: "Séoul", rating: 4.6, missionsCount: 125, verified: true, online: true, lat: 37.5672, lng: 126.9527 },
  { id: "r69", name: "Ravi", city: "Séoul", place: "Séoul", rating: 4.7, missionsCount: 130, verified: true, online: false, lat: 37.5691, lng: 126.9433 },
  { id: "r70", name: "Karim", city: "Séoul", place: "Séoul", rating: 4.7, missionsCount: 139, verified: true, online: true, lat: 37.5472, lng: 126.9776 },
  { id: "r71", name: "Sofia", city: "Séoul", place: "Séoul", rating: 4.7, missionsCount: 115, verified: true, online: false, lat: 37.5836, lng: 126.9938 },
  { id: "r72", name: "Sofia", city: "Bangkok", place: "Bangkok", rating: 4.5, missionsCount: 140, verified: true, online: true, lat: 13.7521, lng: 100.5605 },
  { id: "r73", name: "Julien", city: "Bangkok", place: "Bangkok", rating: 4.8, missionsCount: 78, verified: true, online: false, lat: 13.7911, lng: 100.5374 },
  { id: "r74", name: "Adam", city: "Bangkok", place: "Bangkok", rating: 4.9, missionsCount: 116, verified: true, online: true, lat: 13.7244, lng: 100.4636 },
  { id: "r75", name: "Lucas", city: "Bangkok", place: "Bangkok", rating: 4.8, missionsCount: 34, verified: true, online: true, lat: 13.7553, lng: 100.5239 },
  { id: "r76", name: "Lucas", city: "Le Caire", place: "Le Caire", rating: 4.9, missionsCount: 42, verified: true, online: true, lat: 30.0779, lng: 31.1903 },
  { id: "r77", name: "Liam", city: "Le Caire", place: "Le Caire", rating: 4.6, missionsCount: 89, verified: true, online: false, lat: 30.0226, lng: 31.1912 },
  { id: "r78", name: "Ryo", city: "Le Caire", place: "Le Caire", rating: 5.0, missionsCount: 64, verified: true, online: false, lat: 30.0430, lng: 31.2222 },
  { id: "r79", name: "Emi", city: "Le Cap", place: "Le Cap", rating: 4.8, missionsCount: 68, verified: true, online: false, lat: -33.9424, lng: 18.4454 },
  { id: "r80", name: "Jack", city: "Le Cap", place: "Le Cap", rating: 4.8, missionsCount: 104, verified: true, online: false, lat: -33.9257, lng: 18.4526 },
  { id: "r81", name: "Diego", city: "Le Cap", place: "Le Cap", rating: 4.5, missionsCount: 103, verified: true, online: true, lat: -33.9307, lng: 18.4148 },
  { id: "r82", name: "Valentina", city: "Rio de Janeiro", place: "Rio de Janeiro", rating: 4.6, missionsCount: 50, verified: true, online: true, lat: -22.8604, lng: -43.1633 },
  { id: "r83", name: "Giulia", city: "Rio de Janeiro", place: "Rio de Janeiro", rating: 4.8, missionsCount: 93, verified: true, online: true, lat: -22.9242, lng: -43.1387 },
  { id: "r84", name: "Elena", city: "Rio de Janeiro", place: "Rio de Janeiro", rating: 4.6, missionsCount: 68, verified: true, online: true, lat: -22.9638, lng: -43.1565 },
  { id: "r85", name: "Layla", city: "Rio de Janeiro", place: "Rio de Janeiro", rating: 4.7, missionsCount: 147, verified: true, online: false, lat: -22.9068, lng: -43.1973 },
  { id: "r86", name: "Layla", city: "Mexico", place: "Mexico", rating: 4.8, missionsCount: 88, verified: true, online: false, lat: 19.4293, lng: -99.0946 },
  { id: "r87", name: "So-yeon", city: "Mexico", place: "Mexico", rating: 4.9, missionsCount: 65, verified: true, online: true, lat: 19.4851, lng: -99.1397 },
  { id: "r88", name: "Felix", city: "Mexico", place: "Mexico", rating: 4.6, missionsCount: 95, verified: true, online: false, lat: 19.3853, lng: -99.0879 },
  { id: "r89", name: "Erik", city: "Toronto", place: "Toronto", rating: 4.9, missionsCount: 38, verified: true, online: true, lat: 43.7059, lng: -79.4106 },
  { id: "r90", name: "Zainab", city: "Toronto", place: "Toronto", rating: 4.9, missionsCount: 94, verified: true, online: true, lat: 43.6814, lng: -79.4117 },
  { id: "r91", name: "Tara", city: "Toronto", place: "Toronto", rating: 4.6, missionsCount: 132, verified: true, online: false, lat: 43.6539, lng: -79.3800 },
  { id: "r92", name: "Priya", city: "Istanbul", place: "Istanbul", rating: 4.5, missionsCount: 53, verified: true, online: true, lat: 40.9964, lng: 29.0130 },
  { id: "r93", name: "Thomas", city: "Istanbul", place: "Istanbul", rating: 4.7, missionsCount: 110, verified: true, online: false, lat: 40.9934, lng: 28.9679 },
  { id: "r94", name: "Manon", city: "Istanbul", place: "Istanbul", rating: 4.5, missionsCount: 127, verified: true, online: true, lat: 40.9725, lng: 29.0178 },
  { id: "r95", name: "David", city: "Marrakech", place: "Marrakech", rating: 4.7, missionsCount: 121, verified: true, online: false, lat: 31.6440, lng: -8.0086 },
  { id: "r96", name: "Nadia", city: "Marrakech", place: "Marrakech", rating: 4.6, missionsCount: 70, verified: true, online: false, lat: 31.5746, lng: -7.9320 },
  { id: "r97", name: "Chloé", city: "Marrakech", place: "Marrakech", rating: 4.9, missionsCount: 69, verified: true, online: false, lat: 31.6667, lng: -7.9482 },
];

// Langues parlées — pas encore dans le cahier des charges initial mais
// utile pour la mise en relation (et une future traduction automatique
// des messages/live). Assigné de façon déterministe à partir du nom et
// de la ville, même logique que mockParticipantReputation() dans
// SessionContext : reproductible, pas un tirage aléatoire à chaque render.
const LANGUAGE_POOL = ["Anglais", "Espagnol", "Portugais", "Italien", "Allemand", "Japonais", "Arabe", "Mandarin"];

function assignLanguages(reporter) {
  const seed = (reporter.name + reporter.city).split("").reduce((h, c) => h + c.charCodeAt(0), 0);
  const extraCount = 1 + (seed % 2); // 1 ou 2 langues en plus du français
  const languages = ["Français"];
  for (let i = 0; i < extraCount; i++) {
    const lang = LANGUAGE_POOL[(seed + i * 7) % LANGUAGE_POOL.length];
    if (!languages.includes(lang)) languages.push(lang);
  }
  return languages;
}

export const REPORTERS = REPORTERS_BASE.map((r) => ({ ...r, languages: assignLanguages(r) }));

// Posts de présence : le signal qu'un Reporter est sur place et
// disponible pour filmer MAINTENANT à cet endroit précis (section 3 du
// cahier des charges). Le Participant les découvre et choisit lui-même
// lequel solliciter — ce n'est jamais le système qui assigne.
export const PRESENCE_POSTS = [
  { id: "p1", reporterId: "r1", caption: "Terrasse animée, Oberkampf", postedAgo: "il y a 4 min", surge: 1 },
  { id: "p2", reporterId: "r2", caption: "File d'attente marché couvert", postedAgo: "il y a 11 min", surge: 1.3 },
];

export const DURATIONS = [
  { mins: "15 min", minutes: 15, price: 7 },
  { mins: "30 min", minutes: 30, price: 12 },
  { mins: "60 min", minutes: 60, price: 20 },
];

/* ---- Données Admin (centralisées ici plutôt que dupliquées par page) ---- */

export const ADMIN_USERS = [
  { name: "Manon Dupuis", email: "manon.d@mail.com", role: "Participant", missions: 5, joined: "Mars 2025", status: "active" },
  { name: "Thomas Renaud", email: "thomas.r@mail.com", role: "Reporter", missions: 127, joined: "Mars 2025", status: "active" },
  { name: "Léa Fontaine", email: "lea.f@mail.com", role: "Participant", missions: 2, joined: "Juin 2025", status: "active" },
  { name: "Karim Belkacem", email: "karim.b@mail.com", role: "Reporter", missions: 88, joined: "Avr. 2025", status: "suspended" },
  { name: "Sofia Martins", email: "sofia.m@mail.com", role: "Participant", missions: 1, joined: "Août 2026", status: "active" },
];

export const ADMIN_REPORTERS_PENDING = [
  { name: "Nadia Chergui", city: "Lyon", submitted: "Il y a 2 j" },
  { name: "Yanis Petit", city: "Marseille", submitted: "Il y a 5 h" },
];

// reporterId fait le lien exact avec REPORTERS (mock-data plus haut) —
// avant, l'admin devait deviner par prénom, fragile dès que deux
// Reporters partagent un même prénom (fréquent parmi les 97).
export const ADMIN_REPORTERS_ACTIVE = [
  { reporterId: "r1", name: "Thomas Renaud", city: "Paris", rating: "4,9", missions: 127, badge: "💎 Elite" },
  { reporterId: "r2", name: "Nour Haddad", city: "Paris", rating: "4,8", missions: 64, badge: "⚡ Réactif" },
  { reporterId: "r20", name: "David Cohen", city: "Paris", rating: "4,7", missions: 41, badge: null },
];

export const ADMIN_TRANSACTIONS = [
  { id: "TXN-9931", user: "Manon Dupuis", type: "Paiement mission", amount: "+12,00 €", date: "12 août", status: "Réussi" },
  { id: "TXN-9930", user: "Thomas Renaud", type: "Virement Reporter", amount: "-27,15 €", date: "12 août", status: "Réussi" },
  { id: "TXN-9922", user: "David Cohen", type: "Remboursement", amount: "-7,00 €", date: "10 août", status: "Traité" },
  { id: "TXN-9918", user: "Sofia Martins", type: "Paiement mission", amount: "+20,00 €", date: "9 août", status: "Échoué" },
];

export const ADMIN_DISPUTES = [
  { id: "L-142", parties: "Manon ↔ Karim", reason: "Mission écourtée sans raison", priority: "Haute", status: "Ouvert" },
  { id: "L-139", parties: "David ↔ Nour", reason: "Qualité vidéo insuffisante", priority: "Moyenne", status: "En cours" },
  { id: "L-135", parties: "Élise ↔ Thomas", reason: "Retard important", priority: "Basse", status: "Résolu" },
];

export const ADMIN_REPORTS = [
  { type: "Vidéo signalée", by: "Manon Dupuis", target: "Mission #28455", reason: "Contenu inapproprié", time: "Il y a 40 min" },
  { type: "Utilisateur signalé", by: "Karim Belkacem", target: "Participant Élise R.", reason: "Comportement irrespectueux", time: "Il y a 3 h" },
  { type: "Avis signalé", by: "Thomas Renaud", target: "Avis de David C.", reason: "Faux avis suspecté", time: "Hier" },
];

export const ADMIN_TICKETS = [
  { id: "T-3301", user: "Sofia Martins", subject: "Paiement débité deux fois", priority: "Haute", status: "Ouvert" },
  { id: "T-3298", user: "Léa Fontaine", subject: "Impossible de laisser un avis", priority: "Basse", status: "Ouvert" },
  { id: "T-3290", user: "Nour Haddad", subject: "Question sur le virement", priority: "Moyenne", status: "Résolu" },
];

/* ---- Messages (Participant <-> Reporter, hors-live) ---- */

export const THREADS = [
  { id: "t1", name: "Thomas", place: "Paris 11e", online: true },
  { id: "t2", name: "Léa", place: "Paris 3e", online: false },
  { id: "t3", name: "Karim", place: "Paris 11e", online: false },
];

export const CONVERSATIONS = {
  t1: [
    { from: "them", text: "J'ai accepté votre mission pour la terrasse 👍", time: "14:12" },
    { from: "me", text: "Top, merci !", time: "14:14" },
    { from: "them", text: "J'arrive dans 5 min", time: "14:32" },
  ],
  t2: [
    { from: "them", text: "Alors, la mission ?", time: "Hier 18:02" },
    { from: "me", text: "Parfait, merci Léa !", time: "Hier 18:10" },
  ],
  t3: [
    { from: "them", text: "On peut décaler à demain même heure ?", time: "Lun. 09:20" },
  ],
};
