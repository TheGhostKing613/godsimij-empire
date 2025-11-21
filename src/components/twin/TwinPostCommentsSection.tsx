import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Loader2, Sparkles } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { useTwinPostComments, useAddTwinPostComment } from '@/hooks/useTwinPostComments';
import { cn } from '@/lib/utils';

interface TwinPostCommentsSectionProps {
  twinPostId: string;
}

export const TwinPostCommentsSection = ({ twinPostId }: TwinPostCommentsSectionProps) => {
  const [commentText, setCommentText] = useState('');
  const { user } = useAuth();
  const { data: comments = [], isLoading } = useTwinPostComments(twinPostId);
  const addCommentMutation = useAddTwinPostComment();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !user) return;

    await addCommentMutation.mutateAsync({
      twinPostId,
      content: commentText.trim(),
    });

    setCommentText('');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4 pt-4 border-t">
      <h3 className="font-semibold text-sm">
        Comments ({comments.length})
      </h3>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className={cn(
              'flex gap-3 p-3 rounded-lg transition-colors',
              comment.is_ai_generated && 'bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/20'
            )}
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={comment.profiles?.avatar_url || ''} />
              <AvatarFallback>
                {comment.profiles?.full_name?.[0] || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">
                  {comment.profiles?.full_name || 'Unknown User'}
                </span>
                {comment.is_ai_generated && (
                  <Badge variant="outline" className="text-xs gap-1">
                    <Sparkles className="h-3 w-3" />
                    Twin
                  </Badge>
                )}
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                </span>
                {comment.is_edited && (
                  <span className="text-xs text-muted-foreground italic">(edited)</span>
                )}
              </div>
              <p className="text-sm leading-relaxed">{comment.content}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Add Comment Form */}
      {user && (
        <form onSubmit={handleSubmit} className="space-y-2">
          <Textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add a comment... Twin will respond!"
            className="min-h-[80px] resize-none"
            disabled={addCommentMutation.isPending}
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={!commentText.trim() || addCommentMutation.isPending}
              size="sm"
            >
              {addCommentMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Posting...
                </>
              ) : (
                'Post Comment'
              )}
            </Button>
          </div>
        </form>
      )}

      {!user && (
        <p className="text-sm text-muted-foreground text-center py-4">
          Please log in to comment
        </p>
      )}
    </div>
  );
};
