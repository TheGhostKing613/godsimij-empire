import { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Calendar, MapPin, Link as LinkIcon, Twitter, Github, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useFollowUser } from '@/hooks/useFollowUser';
import { useUserPosts, useUserLikedPosts } from '@/hooks/usePosts';
import { EditProfileDialog } from '@/components/EditProfileDialog';
import { PostCard } from '@/components/PostCard';
import TierBadge from '@/components/TierBadge';
import { TIER_CONFIG } from '@/config/tiers';

export default function Profile() {
  const { userId } = useParams();
  const { user } = useAuth();
  const { profile, isLoading, error, isFollowing, refetch } = useUserProfile(userId || '');
  const { followUser, unfollowUser, isLoading: followLoading } = useFollowUser();
  const { data: posts, isLoading: postsLoading } = useUserPosts(userId || '');
  const { data: likedPosts, isLoading: likesLoading } = useUserLikedPosts(userId || '');
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
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      {/* Cover Image */}
      <div className="h-48 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-lg mb-4 relative overflow-hidden">
        {profile.cover_image_url && (
          <img
            src={profile.cover_image_url}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Profile Header */}
      <Card className="p-6 -mt-16 relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-end gap-4">
          <Avatar className="w-32 h-32 border-4 border-background">
            <AvatarImage src={profile.avatar_url || undefined} />
            <AvatarFallback className="text-2xl">
              {profile.full_name?.[0] || profile.email[0]}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-4">
              <h1 className="text-3xl font-bold">{profile.full_name || 'Anonymous'}</h1>
              <TierBadge tier={profile.tier} size="lg" showTooltip />
            </div>

            {/* Stats */}
            <div className="flex gap-6 mb-4">
              <div>
                <div className="font-bold">{profile.post_count || 0}</div>
                <div className="text-sm text-muted-foreground">Posts</div>
              </div>
              <div>
                <div className="font-bold">{profile.follower_count || 0}</div>
                <div className="text-sm text-muted-foreground">Followers</div>
              </div>
              <div>
                <div className="font-bold">{profile.following_count || 0}</div>
                <div className="text-sm text-muted-foreground">Following</div>
              </div>
            </div>

            {/* Action Button */}
            {isOwnProfile ? (
              <Button onClick={() => setEditDialogOpen(true)}>Edit Profile</Button>
            ) : (
              <Button
                onClick={handleFollowClick}
                disabled={followLoading}
                variant={isFollowing ? 'secondary' : 'default'}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </Button>
            )}
          </div>
        </div>

        {/* Bio & Details */}
        <div className="mt-6 space-y-3">
          {profile.bio && <p>{profile.bio}</p>}

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
              Joined {formatDistanceToNow(new Date(profile.created_at), { addSuffix: true })}
            </div>
          </div>

          {profile.interests && profile.interests.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((interest: string) => (
                <Badge key={interest} variant="secondary">{interest}</Badge>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="posts" className="mt-8">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
          <TabsTrigger value="likes">Likes</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="mt-6">
          {postsLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : posts && posts.length > 0 ? (
            <div className="space-y-4">
              {posts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">
                {isOwnProfile ? "You haven't posted anything yet" : "No posts yet"}
              </p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="comments" className="mt-6">
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">Comments coming soon</p>
          </Card>
        </TabsContent>

        <TabsContent value="likes" className="mt-6">
          {likesLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : likedPosts && likedPosts.length > 0 ? (
            <div className="space-y-4">
              {likedPosts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">
                {isOwnProfile ? "You haven't liked anything yet" : "No liked posts yet"}
              </p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="about" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">About</h3>
              <p className="text-muted-foreground">{profile.bio || 'No bio yet'}</p>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Tier</h3>
              <div className="flex items-center gap-3">
                <TierBadge tier={profile.tier} size="lg" />
                <div>
                  <p className="font-semibold">{TIER_CONFIG[profile.tier].name}</p>
                  <p className="text-sm text-muted-foreground">{TIER_CONFIG[profile.tier].description}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Interests</h3>
              <div className="flex flex-wrap gap-2">
                {profile.interests && profile.interests.length > 0 ? (
                  profile.interests.map((interest: string) => (
                    <Badge key={interest} variant="secondary">
                      {interest}
                    </Badge>
                  ))
                ) : (
                  <p className="text-muted-foreground">No interests yet</p>
                )}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Activity</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Posts</span>
                  <span className="font-semibold">{profile.post_count || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Member since</span>
                  <span className="font-semibold">
                    {formatDistanceToNow(new Date(profile.created_at), { addSuffix: true })}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

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
