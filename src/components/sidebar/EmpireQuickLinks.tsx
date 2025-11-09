import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

const EMPIRE_LINKS = [
  { name: 'Witness Hall', url: 'https://thewitnesshall.com', icon: '🏛️' },
  { name: 'Quantum Odyssey', url: 'https://quantum-odyssey.com', icon: '⚡' },
  { name: 'GhostVault', url: '#', icon: '🕸️', soon: true },
  { name: 'Rebel Media', url: '#', icon: '📻', soon: true },
];

export default function EmpireQuickLinks() {
  return (
    <div className="grid grid-cols-4 gap-2">
      {EMPIRE_LINKS.map(link => (
        <Tooltip key={link.name}>
          <TooltipTrigger asChild>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "flex flex-col items-center justify-center gap-1 p-2 rounded-lg hover:bg-muted/50 transition-colors aspect-square",
                link.soon && "opacity-50 cursor-not-allowed"
              )}
              onClick={link.soon ? (e) => e.preventDefault() : undefined}
            >
              <span className="text-2xl">{link.icon}</span>
            </a>
          </TooltipTrigger>
          <TooltipContent>
            <p>{link.name}</p>
            {link.soon && <p className="text-xs text-muted-foreground">Coming Soon</p>}
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}
