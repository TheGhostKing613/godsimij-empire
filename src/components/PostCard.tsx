import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, Heart, Share2, HelpCircle, Megaphone, Lightbulb } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

interface PostCardProps {
  post: any;
}

const postTypeIcons = {
  discussion: MessageSquare,
  question: HelpCircle,
  announcement: Megaphone,
  idea: Lightbulb,
};

const postTypeColors = {
  discussion: 'bg-blue-500/10 text-blue-500',
  question: 'bg-purple-500/10 text-purple-500',
  announcement: 'bg-orange-500/10 text-orange-500',
  idea: 'bg-green-500/10 text-green-500',
};

export function PostCard({ post }: PostCardProps) {
  const Icon = postTypeIcons[post.post_type as keyof typeof postTypeIcons] || MessageSquare;
  const typeColor = postTypeColors[post.post_type as keyof typeof postTypeColors] || 'bg-muted text-muted-foreground';

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <Link to={`/profile/${post.profiles?.id}`}>
          <Avatar className="w-10 h-10">
            <AvatarImage src={post.profiles?.avatar_url} />
            <AvatarFallback className="bg-primary/10">
              {post.profiles?.full_name?.[0]?.toUpperCase() || post.profiles?.email?.[0]?.toUpperCase() || '?'}
            </AvatarFallback>
          </Avatar>
        </Link>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              to={`/profile/${post.profiles?.id}`}
              className="font-semibold hover:underline"
            >
              {post.profiles?.full_name || 'Anonymous'}
            </Link>
            <span className="text-sm text-muted-foreground">
              @{post.profiles?.email?.split('@')[0]}
            </span>
            <span className="text-sm text-muted-foreground">·</span>
            <span className="text-sm text-muted-foreground">
              {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
            </span>
          </div>

          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary" className={`${typeColor} gap-1`}>
              <Icon className="w-3 h-3" />
              {post.post_type}
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
      <div className="mb-4">
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

      {/* Engagement Stats */}
      <div className="flex items-center gap-6 text-sm text-muted-foreground">
        <button className="flex items-center gap-2 hover:text-primary transition-colors">
          <Heart className="w-4 h-4" />
          <span>{post.likes_count || 0}</span>
        </button>

        <button className="flex items-center gap-2 hover:text-primary transition-colors">
          <MessageSquare className="w-4 h-4" />
          <span>{post.comments_count || 0}</span>
        </button>

        <button className="flex items-center gap-2 hover:text-primary transition-colors">
          <Share2 className="w-4 h-4" />
          <span>{post.shares_count || 0}</span>
        </button>
      </div>
    </Card>
  );
}
