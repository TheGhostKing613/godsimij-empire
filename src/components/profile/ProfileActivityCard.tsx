import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TierBadge from '@/components/TierBadge';
import { TIER_CONFIG } from '@/config/tiers';

interface ProfileActivityCardProps {
  profile: {
    tier: 'wanderer' | 'witness' | 'scribe' | 'flamekeeper' | 'crown';
    post_count?: number;
    follower_count?: number;
    following_count?: number;
  };
}

export function ProfileActivityCard({ profile }: ProfileActivityCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Tier Display */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <TierBadge tier={profile.tier} size="md" />
            <span className="font-semibold">{TIER_CONFIG[profile.tier].name}</span>
          </div>
          <p className="text-xs text-muted-foreground">
            {TIER_CONFIG[profile.tier].description}
          </p>
        </div>

        {/* Stats */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Posts</span>
            <span className="font-semibold">{profile.post_count || 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Followers</span>
            <span className="font-semibold">{profile.follower_count || 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Following</span>
            <span className="font-semibold">{profile.following_count || 0}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
