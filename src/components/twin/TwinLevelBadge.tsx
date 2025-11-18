import { Badge } from "@/components/ui/badge";
import { Zap } from "lucide-react";

interface TwinLevelBadgeProps {
  level: number;
  xp: number;
}

const LEVEL_THRESHOLDS = [50, 100, 200, 350, 550, 800, 1100, 1500, 2000, 2600];

export const TwinLevelBadge = ({ level, xp }: TwinLevelBadgeProps) => {
  const nextThreshold = LEVEL_THRESHOLDS[level - 1] || 3000;
  const progress = (xp / nextThreshold) * 100;

  return (
    <div className="flex items-center gap-2">
      <Badge className="bg-gradient-to-r from-orange-500 to-cyan-500 text-white">
        <Zap className="h-3 w-3 mr-1" />
        Lv {level}
      </Badge>
      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-orange-500 to-cyan-500 transition-all"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
      <span className="text-xs text-muted-foreground">{xp} XP</span>
    </div>
  );
};
