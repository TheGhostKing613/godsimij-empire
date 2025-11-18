import { Badge } from "@/components/ui/badge";
import { Flame, Snowflake, Circle } from "lucide-react";

interface TwinRelationBadgeProps {
  relationType: 'ally' | 'rival' | 'neutral';
  strength?: number;
  size?: "sm" | "md";
}

export const TwinRelationBadge = ({ relationType, strength, size = "sm" }: TwinRelationBadgeProps) => {
  const iconSize = size === "sm" ? "h-3 w-3" : "h-4 w-4";
  
  const getConfig = () => {
    switch (relationType) {
      case 'ally':
        return {
          icon: <Flame className={iconSize} />,
          label: 'Ally',
          className: 'bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-500 border-orange-500/50'
        };
      case 'rival':
        return {
          icon: <Snowflake className={iconSize} />,
          label: 'Rival',
          className: 'bg-gradient-to-r from-purple-500/20 to-violet-500/20 text-violet-500 border-violet-500/50'
        };
      default:
        return {
          icon: <Circle className={iconSize} />,
          label: 'Neutral',
          className: 'bg-muted/50 text-muted-foreground border-muted'
        };
    }
  };

  const config = getConfig();

  return (
    <Badge 
      variant="outline" 
      className={`${config.className} ${size === "sm" ? "text-xs" : ""} gap-1`}
    >
      {config.icon}
      {config.label}
      {strength !== undefined && size === "md" && (
        <span className="ml-1 opacity-70">({strength})</span>
      )}
    </Badge>
  );
};