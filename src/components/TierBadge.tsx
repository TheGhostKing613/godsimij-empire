import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { TIER_CONFIG, UserTier } from '@/config/tiers';
import { cn } from '@/lib/utils';

interface TierBadgeProps {
  tier: UserTier;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
}

const TierBadge = ({ tier, size = 'sm', showTooltip = true }: TierBadgeProps) => {
  const config = TIER_CONFIG[tier];
  
  if (!config.badge) return null;

  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const badge = (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full',
        config.glowClass,
        config.ringClass,
        sizeClasses[size],
        'w-6 h-6'
      )}
    >
      {config.badge}
    </span>
  );

  if (!showTooltip) return badge;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{badge}</TooltipTrigger>
        <TooltipContent>
          <div className="space-y-1">
            <p className="font-semibold">{config.name}</p>
            <p className="text-xs text-muted-foreground">{config.description}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TierBadge;
