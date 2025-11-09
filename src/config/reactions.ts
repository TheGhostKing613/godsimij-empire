export const REACTION_CONFIG = {
  flame: {
    icon: '🔥',
    label: 'Flame',
    color: 'hsl(var(--chart-1))',
    description: 'This ignites the revolution',
    animation: 'flame-burst',
  },
  rebel: {
    icon: '⚡',
    label: 'Rebel',
    color: 'hsl(var(--chart-2))',
    description: 'Sovereign energy',
    animation: 'spark-trail',
  },
  insight: {
    icon: '💡',
    label: 'Insight',
    color: 'hsl(var(--chart-4))',
    description: 'Consciousness expanded',
    animation: 'glow-pulse',
  },
  mindblown: {
    icon: '🤯',
    label: 'Mind Blown',
    color: 'hsl(var(--chart-3))',
    description: 'Reality shattered',
    animation: 'explosion',
  },
} as const;

export type ReactionType = keyof typeof REACTION_CONFIG;

export const DEFAULT_REACTION: ReactionType = 'flame';
