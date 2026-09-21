/**
 * Types de données partagés du produit Shoofmy.
 * En JSDoc plutôt qu'en TypeScript pour rester cohérent avec le reste du
 * code en .jsx — si le projet passe en TS plus tard, ces blocs se
 * convertissent quasi tel quel en interfaces.
 */

/**
 * @typedef {Object} Reporter
 * @property {string} id
 * @property {string} name
 * @property {string} city
 * @property {string} place
 * @property {number} rating
 * @property {number} missionsCount
 * @property {boolean} verified
 * @property {boolean} online
 * @property {string[]} [languages]
 */

/**
 * @typedef {Object} Participant
 * @property {string} id
 * @property {string} name
 * @property {string} city
 * @property {number} [rating]
 * @property {number} [missionsCount]
 */

/**
 * @typedef {Object} Mission
 * @property {string} id
 * @property {string} reporterId
 * @property {string} participantId
 * @property {string} [participantName]
 * @property {number} [participantRating]
 * @property {number} [participantMissionsCount]
 * @property {string} place
 * @property {string} description
 * @property {string} duration
 * @property {number} price
 * @property {"draft"|"paid"|"live"|"done"|"cancelled"} status
 * @property {string} [createdAt]
 */

/**
 * @typedef {Object} LiveSession
 * @property {string} missionId
 * @property {"connecting"|"live"|"ended"} state
 * @property {number} elapsedSeconds
 */

export {};
