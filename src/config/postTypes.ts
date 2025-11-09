export const POST_TYPE_CONFIG = {
  discussion: {
    displayName: 'Flamecast',
    icon: '🔥',
    color: 'hsl(var(--chart-1))', // Ember orange
    bgClass: 'bg-chart-1/10',
    textClass: 'text-chart-1',
    borderClass: 'border-chart-1/50',
    description: 'Visionary declarations and deep discussions',
  },
  announcement: {
    displayName: 'Signal',
    icon: '⚡',
    color: 'hsl(var(--chart-2))', // Cyan
    bgClass: 'bg-chart-2/10',
    textClass: 'text-chart-2',
    borderClass: 'border-chart-2/50',
    description: 'Quick updates and important announcements',
  },
  idea: {
    displayName: 'Dispatch',
    icon: '🧠',
    color: 'hsl(var(--chart-3))', // Purple
    bgClass: 'bg-chart-3/10',
    textClass: 'text-chart-3',
    borderClass: 'border-chart-3/50',
    description: 'Long-form essays and thought pieces',
  },
  question: {
    displayName: 'Artifact',
    icon: '💎',
    color: 'hsl(var(--chart-4))', // Gold
    bgClass: 'bg-chart-4/10',
    textClass: 'text-chart-4',
    borderClass: 'border-chart-4/50',
    description: 'Sacred content and Empire archives',
  },
} as const;

export type PostType = keyof typeof POST_TYPE_CONFIG;
