import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Sparkles } from "lucide-react";

interface MemoryShardCardProps {
  shard: {
    id: string;
    type: string;
    value: string;
    rarity: 'common' | 'rare' | 'epic' | 'mythic';
    xp: number;
  };
}

const RARITY_COLORS = {
  common: 'from-muted to-muted-foreground/20',
  rare: 'from-cyan-500/20 to-cyan-600/20',
  epic: 'from-purple-500/20 to-purple-600/20',
  mythic: 'from-orange-500/20 to-yellow-500/20'
};

const RARITY_BORDERS = {
  common: 'border-muted',
  rare: 'border-cyan-500/30',
  epic: 'border-purple-500/30',
  mythic: 'border-orange-500/30'
};

const RARITY_GLOWS = {
  common: '',
  rare: 'shadow-cyan-500/50',
  epic: 'shadow-purple-500/50',
  mythic: 'shadow-orange-500/50 animate-pulse'
};

const XP_THRESHOLDS = {
  common: 100,
  rare: 300,
  epic: 1000,
  mythic: Infinity
};

export const MemoryShardCard = ({ shard }: MemoryShardCardProps) => {
  const maxXp = XP_THRESHOLDS[shard.rarity];
  const progress = maxXp === Infinity ? 100 : (shard.xp / maxXp) * 100;

  return (
    <Card 
      className={`relative overflow-hidden border-2 bg-gradient-to-br ${RARITY_COLORS[shard.rarity]} ${RARITY_BORDERS[shard.rarity]} ${RARITY_GLOWS[shard.rarity]} transition-all hover:scale-105`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-background/80 to-transparent pointer-events-none" />
      
      <CardContent className="relative pt-6 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold capitalize">{shard.type}</span>
          </div>
          <Badge 
            variant="outline" 
            className={`capitalize ${shard.rarity === 'mythic' ? 'text-orange-500 border-orange-500/30' : ''}`}
          >
            {shard.rarity}
          </Badge>
        </div>

        <p className="text-xs text-muted-foreground line-clamp-2">{shard.value}</p>

        {maxXp !== Infinity && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">XP Progress</span>
              <span className="font-mono">{shard.xp} / {maxXp}</span>
            </div>
            <Progress value={progress} className="h-1" />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
