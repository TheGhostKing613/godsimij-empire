import { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useFollowUser } from '@/hooks/useFollowUser';
import { EditProfileDialog } from '@/components/EditProfileDialog';
import { ProfileCover } from '@/components/profile/ProfileCover';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileAboutCard } from '@/components/profile/ProfileAboutCard';
import { ProfileInterestsCard } from '@/components/profile/ProfileInterestsCard';
import { ProfileActivityCard } from '@/components/profile/ProfileActivityCard';
import { ProfileTimeline } from '@/components/profile/ProfileTimeline';
import TierProgressCard from '@/components/sidebar/TierProgressCard';

export default function Profile() {
  const { userId } = useParams();
  const { user } = useAuth();
  const { profile, isLoading, error, isFollowing } = useUserProfile(userId || '');
  const { followUser, unfollowUser, isLoading: followLoading } = useFollowUser();
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  if (!userId) {
    return <Navigate to="/" replace />;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-2">User Not Found</h2>
        <p className="text-muted-foreground">This profile doesn't exist.</p>
      </div>
    );
  }

  const isOwnProfile = user?.id === userId;

  const handleFollowClick = () => {
    if (isFollowing) {
      unfollowUser(userId);
    } else {
      followUser(userId);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Cover Photo */}
      <ProfileCover coverUrl={profile.cover_image_url} />

      {/* Profile Header */}
      <ProfileHeader
        profile={profile}
        isOwnProfile={isOwnProfile}
        isFollowing={isFollowing}
        followLoading={followLoading}
        onFollowClick={handleFollowClick}
        onEditClick={() => setEditDialogOpen(true)}
      />

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6 mt-6">
        {/* Left Sidebar */}
        <aside className="space-y-4">
          <ProfileAboutCard profile={profile} />
          <ProfileInterestsCard interests={profile.interests} />
          <ProfileActivityCard profile={profile} />
          {isOwnProfile && <TierProgressCard />}
        </aside>

        {/* Timeline */}
        <main>
          <ProfileTimeline userId={userId} isOwnProfile={isOwnProfile} />
        </main>
      </div>

      {isOwnProfile && (
        <EditProfileDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          profile={profile}
        />
      )}
    </div>
  );
}
