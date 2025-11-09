import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import TierBadge from '@/components/TierBadge';
import { useAuth } from '@/contexts/AuthContext';
import { useUserTierProgress } from '@/hooks/useUserTierProgress';
import { TIER_CONFIG } from '@/config/tiers';

export default function TierProgressCard() {
  const { user } = useAuth();
  const { data: progress } = useUserTierProgress();
  
  if (!progress) return null;
  
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TierBadge tier={progress.currentTier} size="md" />
          <span className="font-semibold">{TIER_CONFIG[progress.currentTier].name}</span>
        </div>
      </div>
      
      {progress.currentTier === 'witness' && (
        <>
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span>Progress to Scribe</span>
              <span>{Math.round(progress.percentComplete)}%</span>
            </div>
            <Progress value={progress.percentComplete} className="h-2" />
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-muted/50 rounded p-2">
              <div className="font-semibold">{progress.posts}/{progress.postsNeeded}</div>
              <div className="text-muted-foreground">Posts</div>
            </div>
            <div className="bg-muted/50 rounded p-2">
              <div className="font-semibold">{progress.reactions}/{progress.reactionsNeeded}</div>
              <div className="text-muted-foreground">Reactions</div>
            </div>
          </div>
        </>
      )}
      
      <Button variant="outline" size="sm" className="w-full" asChild>
        <Link to={`/profile/${user?.id}`}>View Profile</Link>
      </Button>
    </div>
  );
}
