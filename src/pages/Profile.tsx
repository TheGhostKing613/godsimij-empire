import { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Loader2, MapPin, Link as LinkIcon, Twitter, Github, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useFollowUser } from '@/hooks/useFollowUser';
import { useAuth } from '@/contexts/AuthContext';
import { EditProfileDialog } from '@/components/EditProfileDialog';
import { format } from 'date-fns';

export default function Profile() {
  const { userId } = useParams<{ userId: string }>();
  const { user } = useAuth();
  const { profile, isLoading, error, isFollowing } = useUserProfile(userId!);
  const { followUser, unfollowUser, isLoading: followLoading } = useFollowUser();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [isHoveringFollow, setIsHoveringFollow] = useState(false);

  if (!userId) {
    return <Navigate to="/" replace />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">User Not Found</h2>
          <p className="text-muted-foreground">This profile doesn't exist or has been removed.</p>
        </div>
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
    <div className="min-h-screen bg-background">
      {/* Cover Image */}
      <div className="h-48 md:h-64 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 relative">
        {profile.cover_image_url && (
          <img
            src={profile.cover_image_url}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Profile Header */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-16 sm:-mt-20 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
            {/* Avatar */}
            <div className="w-32 h-32 rounded-full border-4 border-background bg-muted overflow-hidden">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl font-bold bg-primary/10">
                  {profile.full_name?.[0]?.toUpperCase() || profile.email?.[0]?.toUpperCase() || '?'}
                </div>
              )}
            </div>

            {/* Profile Info & Actions */}
            <div className="flex-1 sm:ml-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h1 className="text-3xl font-bold">{profile.full_name || 'Anonymous'}</h1>
                  <p className="text-muted-foreground">@{profile.email?.split('@')[0]}</p>
                </div>

                <div>
                  {isOwnProfile ? (
                    <Button onClick={() => setEditDialogOpen(true)}>Edit Profile</Button>
                  ) : (
                    <Button
                      onClick={handleFollowClick}
                      disabled={followLoading}
                      variant={isFollowing ? 'secondary' : 'default'}
                      onMouseEnter={() => setIsHoveringFollow(true)}
                      onMouseLeave={() => setIsHoveringFollow(false)}
                    >
                      {followLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {isFollowing ? (isHoveringFollow ? 'Unfollow' : 'Following') : 'Follow'}
                    </Button>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="flex gap-6 mt-4">
                <div className="text-center">
                  <div className="font-bold text-lg">{profile.post_count || 0}</div>
                  <div className="text-sm text-muted-foreground">Posts</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg">{profile.follower_count || 0}</div>
                  <div className="text-sm text-muted-foreground">Followers</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg">{profile.following_count || 0}</div>
                  <div className="text-sm text-muted-foreground">Following</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bio & Details */}
          <div className="mt-6 space-y-3">
            {profile.bio && <p className="text-foreground">{profile.bio}</p>}

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              {profile.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {profile.location}
                </div>
              )}
              {profile.website && (
                <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-primary">
                  <LinkIcon className="w-4 h-4" />
                  {new URL(profile.website).hostname}
                </a>
              )}
              {profile.twitter_handle && (
                <a href={`https://twitter.com/${profile.twitter_handle}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-primary">
                  <Twitter className="w-4 h-4" />
                  @{profile.twitter_handle}
                </a>
              )}
              {profile.github_handle && (
                <a href={`https://github.com/${profile.github_handle}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-primary">
                  <Github className="w-4 h-4" />
                  {profile.github_handle}
                </a>
              )}
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Joined {format(new Date(profile.created_at), 'MMMM yyyy')}
              </div>
            </div>

            {profile.interests && profile.interests.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest: string, idx: number) => (
                  <Badge key={idx} variant="secondary">{interest}</Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="posts" className="mt-8">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
            <TabsTrigger value="likes">Likes</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="mt-6">
            <div className="text-center py-12 text-muted-foreground">
              <p>No posts yet</p>
              <p className="text-sm mt-2">Posts will appear here in Sprint 2</p>
            </div>
          </TabsContent>

          <TabsContent value="comments" className="mt-6">
            <div className="text-center py-12 text-muted-foreground">
              <p>No comments yet</p>
            </div>
          </TabsContent>

          <TabsContent value="likes" className="mt-6">
            <div className="text-center py-12 text-muted-foreground">
              <p>No liked posts yet</p>
              <p className="text-sm mt-2">Likes will appear here in Sprint 3</p>
            </div>
          </TabsContent>

          <TabsContent value="about" className="mt-6">
            <div className="space-y-6">
              {profile.bio && (
                <div>
                  <h3 className="font-semibold mb-2">Bio</h3>
                  <p className="text-muted-foreground">{profile.bio}</p>
                </div>
              )}

              {profile.interests && profile.interests.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.interests.map((interest: string, idx: number) => (
                      <Badge key={idx} variant="secondary">{interest}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {profile.badges && profile.badges.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Badges</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.badges.map((badge: string, idx: number) => (
                      <Badge key={idx} variant="outline">{badge}</Badge>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="font-semibold mb-2">Activity Stats</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-2xl font-bold">{profile.post_count || 0}</div>
                    <div className="text-sm text-muted-foreground">Total Posts</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{profile.follower_count || 0}</div>
                    <div className="text-sm text-muted-foreground">Followers</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{profile.following_count || 0}</div>
                    <div className="text-sm text-muted-foreground">Following</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Member Since</h3>
                <p className="text-muted-foreground">
                  {format(new Date(profile.created_at), 'MMMM d, yyyy')}
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
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
