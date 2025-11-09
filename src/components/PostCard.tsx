import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, Share2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { POST_TYPE_CONFIG, PostType } from '@/config/postTypes';
import { UserTier } from '@/config/tiers';
import TierBadge from './TierBadge';
import ReactionPicker from './ReactionPicker';
import CircuitGrid from './CircuitGrid';
import { usePostReactions, useUserReaction, useReactToPost } from '@/hooks/useReactions';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface PostCardProps {
  post: any;
}

export function PostCard({ post }: PostCardProps) {
  const { user } = useAuth();
  const postType = post.post_type as PostType;
  const config = POST_TYPE_CONFIG[postType] || POST_TYPE_CONFIG.discussion;
  
  const { data: reactionCounts } = usePostReactions(post.id);
  const { data: userReaction } = useUserReaction(post.id);
  const { mutate: reactToPost } = useReactToPost();

  const isAnonymous = post.is_anonymous;
  const displayName = isAnonymous ? post.display_name : post.profiles?.full_name;
  const avatarUrl = isAnonymous ? null : post.profiles?.avatar_url;
  const userTier = post.profiles?.tier as UserTier;

  return (
    <Card className="relative p-6 hover:shadow-lg transition-all group overflow-hidden">
      <CircuitGrid />
      
      {/* Post Type Color Bar */}
      <div 
        className={cn('absolute left-0 top-0 bottom-0 w-1 transition-all group-hover:w-2', config.bgClass)}
        style={{ background: config.color }}
      />

      {/* Header */}
      <div className="flex items-start gap-3 mb-4 relative z-10">
        {isAnonymous ? (
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
            <span className="text-lg">👻</span>
          </div>
        ) : (
          <Link to={`/profile/${post.profiles?.id}`}>
            <Avatar className={cn('w-10 h-10 transition-all', userTier && `ring-2 ring-offset-2 ring-offset-background`)}>
              <AvatarImage src={avatarUrl} />
              <AvatarFallback className="bg-primary/10">
                {displayName?.[0]?.toUpperCase() || '?'}
              </AvatarFallback>
            </Avatar>
          </Link>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            {isAnonymous ? (
              <span className="font-semibold text-muted-foreground">{displayName}</span>
            ) : (
              <>
                <Link
                  to={`/profile/${post.profiles?.id}`}
                  className="font-semibold hover:underline"
                >
                  {displayName || 'Anonymous'}
                </Link>
                {userTier && <TierBadge tier={userTier} size="sm" />}
              </>
            )}
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground text-sm">
              {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
            </span>
          </div>

          {/* Post Type Badge */}
          <div className="flex items-center gap-2 mt-1">
            <Badge className={`${config.bgClass} ${config.textClass} border-0 gap-1`} variant="secondary">
              <span>{config.icon}</span>
              {config.displayName}
            </Badge>

            {post.categories && (
              <Badge
                variant="outline"
                style={{ borderColor: post.categories.color }}
              >
                <span className="mr-1">{post.categories.icon}</span>
                {post.categories.name}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mb-4 relative z-10">
        <p className="whitespace-pre-wrap break-words">
          {post.content.length > 500
            ? `${post.content.substring(0, 500)}...`
            : post.content}
        </p>
        {post.content.length > 500 && (
          <Button variant="link" className="p-0 h-auto mt-2">
            Read more
          </Button>
        )}
      </div>

      {/* Footer - Interactions */}
      <div className="flex items-center gap-4 pt-4 border-t relative z-10">
        <ReactionPicker
          postId={post.id}
          currentUserReaction={userReaction}
          reactionCounts={reactionCounts || { flame: 0, rebel: 0, insight: 0, mindblown: 0 }}
          onReact={(type) => reactToPost({ postId: post.id, reactionType: type })}
          disabled={!user}
        />

        <Button variant="ghost" size="sm" className="gap-2">
          <MessageSquare className="w-4 h-4" />
          <span>{post.comments_count || 0}</span>
        </Button>

        <Button variant="ghost" size="sm" className="gap-2">
          <Share2 className="w-4 h-4" />
          <span>{post.shares_count || 0}</span>
        </Button>
      </div>
    </Card>
  );
}
