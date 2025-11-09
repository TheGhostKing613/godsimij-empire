import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import TierBadge from '@/components/TierBadge';
import { MessageButton } from './MessageButton';
import { FollowersModal } from '@/components/FollowersModal';
import { FollowingModal } from '@/components/FollowingModal';

interface ProfileHeaderProps {
  profile: {
    id: string;
    avatar_url?: string | null;
    full_name?: string | null;
    email: string;
    tier: 'wanderer' | 'witness' | 'scribe' | 'flamekeeper' | 'crown';
    bio?: string | null;
    post_count?: number;
    follower_count?: number;
    following_count?: number;
  };
  isOwnProfile: boolean;
  isFollowing: boolean;
  followLoading: boolean;
  onFollowClick: () => void;
  onEditClick: () => void;
}

export function ProfileHeader({
  profile,
  isOwnProfile,
  isFollowing,
  followLoading,
  onFollowClick,
  onEditClick,
}: ProfileHeaderProps) {
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);

  return (
    <>
      <FollowersModal
        userId={profile.id}
        isOpen={showFollowersModal}
        onClose={() => setShowFollowersModal(false)}
      />
      <FollowingModal
        userId={profile.id}
        isOpen={showFollowingModal}
        onClose={() => setShowFollowingModal(false)}
      />
      <Card className="p-6 -mt-20 relative z-10">
      <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
        {/* Avatar with white border */}
        <Avatar className="w-40 h-40 border-4 border-background shadow-xl">
          <AvatarImage src={profile.avatar_url || undefined} />
          <AvatarFallback className="text-3xl">
            {profile.full_name?.[0] || profile.email[0]}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 pb-2">
          {/* Name + Tier */}
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-bold">{profile.full_name || 'Anonymous'}</h1>
            <TierBadge tier={profile.tier} size="lg" showTooltip />
          </div>

          {/* Brief bio (one line) */}
          {profile.bio && (
            <p className="text-muted-foreground mb-3 line-clamp-2">
              {profile.bio}
            </p>
          )}

          {/* Stats inline */}
          <div className="flex gap-6 text-sm">
            <button
              onClick={() => setShowFollowersModal(true)}
              className="hover:underline cursor-pointer"
            >
              <b className="font-bold">{profile.follower_count || 0}</b> followers
            </button>
            <button
              onClick={() => setShowFollowingModal(true)}
              className="hover:underline cursor-pointer"
            >
              <b className="font-bold">{profile.following_count || 0}</b> following
            </button>
            <span>
              <b className="font-bold">{profile.post_count || 0}</b> posts
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="pb-2 flex gap-2">
          {isOwnProfile ? (
            <Button onClick={onEditClick}>Edit Profile</Button>
          ) : (
            <>
              <Button
                onClick={onFollowClick}
                disabled={followLoading}
                variant={isFollowing ? 'secondary' : 'default'}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </Button>
              <MessageButton userId={profile.id} />
            </>
          )}
        </div>
      </div>
    </Card>
    </>
  );
}
