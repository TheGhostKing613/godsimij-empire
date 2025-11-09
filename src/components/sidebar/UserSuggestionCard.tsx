import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import TierBadge from '@/components/TierBadge';
import { useFollowUser } from '@/hooks/useFollowUser';
import { UserTier } from '@/config/tiers';

interface UserSuggestionCardProps {
  user: {
    id: string;
    full_name: string | null;
    email: string;
    avatar_url: string | null;
    tier: UserTier;
    follower_count: number;
  };
}

export default function UserSuggestionCard({ user }: UserSuggestionCardProps) {
  const { followUser, isLoading } = useFollowUser();
  
  return (
    <div className="flex items-center justify-between gap-3">
      <Link to={`/profile/${user.id}`} className="flex items-center gap-3 flex-1 min-w-0">
        <Avatar className="h-10 w-10 ring-2 ring-offset-2 ring-offset-background ring-primary/20">
          <AvatarImage src={user.avatar_url || undefined} />
          <AvatarFallback className="bg-primary/10">
            {user.full_name?.[0]?.toUpperCase() || user.email[0]?.toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <p className="font-semibold text-sm truncate">{user.full_name || 'Anonymous'}</p>
            <TierBadge tier={user.tier} size="sm" />
          </div>
          <p className="text-xs text-muted-foreground">
            {user.follower_count} followers
          </p>
        </div>
      </Link>
      <Button
        size="sm"
        variant="outline"
        onClick={() => followUser(user.id)}
        disabled={isLoading}
        className="shrink-0"
      >
        Follow
      </Button>
    </div>
  );
}
