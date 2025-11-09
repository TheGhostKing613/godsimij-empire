import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserPosts, useUserLikedPosts } from '@/hooks/usePosts';
import { PostCard } from '@/components/PostCard';
import { PostComposer } from '@/components/PostComposer';
import { Skeleton } from '@/components/ui/skeleton';

interface ProfileTimelineProps {
  userId: string;
  isOwnProfile: boolean;
}

export function ProfileTimeline({ userId, isOwnProfile }: ProfileTimelineProps) {
  const { data: posts, isLoading: postsLoading } = useUserPosts(userId);
  const { data: likedPosts, isLoading: likedLoading } = useUserLikedPosts(userId);

  const renderSkeletons = () => (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="p-6">
          <div className="flex items-start gap-4">
            <Skeleton className="w-12 h-12 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Show composer only on own profile */}
      {isOwnProfile && (
        <Card className="p-4">
          <PostComposer />
        </Card>
      )}

      {/* Tabs for Posts and Likes */}
      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="likes">Likes</TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="mt-4 space-y-4">
          {postsLoading ? (
            renderSkeletons()
          ) : posts && posts.length > 0 ? (
            <div className="space-y-4">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">
                {isOwnProfile
                  ? "You haven't posted anything yet. Share your first thought above!"
                  : 'No posts yet'}
              </p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="likes" className="mt-4 space-y-4">
          {likedLoading ? (
            renderSkeletons()
          ) : likedPosts && likedPosts.length > 0 ? (
            <div className="space-y-4">
              {likedPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">
                {isOwnProfile ? "You haven't liked any posts yet" : 'No liked posts'}
              </p>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
