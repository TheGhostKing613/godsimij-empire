export const TIER_CONFIG = {
  wanderer: {
    name: 'Wanderer',
    badge: null,
    icon: '👁️‍🗨️',
    description: 'Exploring the Flame',
    glowClass: '',
    ringClass: '',
    restrictions: ['Read-only access'],
  },
  witness: {
    name: 'Witness',
    badge: '👁️',
    icon: '👁️',
    description: 'Bearer of the Flame',
    glowClass: 'shadow-sm shadow-white/10',
    ringClass: 'ring-1 ring-white/20',
    abilities: ['Create posts', 'React to content', 'Comment'],
  },
  scribe: {
    name: 'Scribe',
    badge: '✍️',
    icon: '✍️',
    description: 'Keeper of Knowledge',
    glowClass: 'shadow-md shadow-cyan-500/20',
    ringClass: 'ring-2 ring-cyan-500/50',
    abilities: ['All Witness abilities', 'Advanced post formatting', 'Pin personal posts'],
  },
  flamekeeper: {
    name: 'Flamekeeper',
    badge: '🔥',
    icon: '🔥',
    description: 'Guardian of the Community',
    glowClass: 'shadow-lg shadow-orange-500/30',
    ringClass: 'ring-2 ring-orange-500/50',
    abilities: ['All Scribe abilities', 'Moderate content', 'Feature posts'],
  },
  crown: {
    name: 'Crown Citizen',
    badge: '👑',
    icon: '👑',
    description: 'Inner Circle of the Empire',
    glowClass: 'shadow-xl shadow-purple-500/40 animate-pulse',
    ringClass: 'ring-2 ring-purple-500/50',
    abilities: ['All Flamekeeper abilities', 'Access to Sanctum', 'Beta features'],
  },
} as const;

export type UserTier = keyof typeof TIER_CONFIG;

export const TIER_THRESHOLDS = {
  scribe: {
    posts: 10,
    reactions: 50,
  },
};
