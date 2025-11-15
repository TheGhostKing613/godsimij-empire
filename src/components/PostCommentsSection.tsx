import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Loader2, Trash2, Edit2, Send } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { usePostComments, useCreatePostComment, useDeletePostComment } from '@/hooks/usePostComments';
import { cn } from '@/lib/utils';
import TierBadge from './TierBadge';

interface PostCommentsSectionProps {
  postId: string;
  postOwnerId: string;
  isExpanded?: boolean;
}

export function PostCommentsSection({ postId, postOwnerId, isExpanded = false }: PostCommentsSectionProps) {
  const { user } = useAuth();
  const [newComment, setNewComment] = useState('');
  const { data: comments, isLoading } = usePostComments(postId);
  const { mutate: createComment, isPending: isCreating } = useCreatePostComment();
  const { mutate: deleteComment } = useDeletePostComment();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    createComment(
      { postId, content: newComment.trim(), postOwnerId },
      {
        onSuccess: () => {
          setNewComment('');
        },
      }
    );
  };

  if (!isExpanded) return null;

  return (
    <div className="mt-4 space-y-4">
      <Separator />
      
      {/* Comment Input */}
      {user && (
        <form onSubmit={handleSubmit} className="flex gap-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src={user.user_metadata?.avatar_url} />
            <AvatarFallback className="bg-primary/10">
              {user.user_metadata?.full_name?.[0]?.toUpperCase() || '?'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 flex gap-2">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="resize-none min-h-[60px]"
              disabled={isCreating}
            />
            <Button
              type="submit"
              size="icon"
              disabled={!newComment.trim() || isCreating}
              className="shrink-0"
            >
              {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </Button>
          </div>
        </form>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : comments && comments.length > 0 ? (
          comments.map((comment) => {
            const isAIComment = comment.is_ai_generated;
            
            return (
              <div key={comment.id} className={cn(
                "flex gap-3",
                isAIComment && "bg-gradient-to-r from-purple-500/5 to-transparent p-3 rounded-lg -mx-3"
              )}>
                <Avatar className={cn(
                  "w-8 h-8",
                  isAIComment && "ring-2 ring-purple-500/50"
                )}>
                  <AvatarImage src={comment.profiles?.avatar_url} />
                  <AvatarFallback className={cn(
                    "bg-primary/10",
                    isAIComment && "bg-purple-500/20"
                  )}>
                    {comment.profiles?.full_name?.[0]?.toUpperCase() || '?'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm">{comment.profiles?.full_name}</span>
                    {isAIComment && (
                      <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        🤖 AI
                      </span>
                    )}
                    {comment.profiles?.tier && <TierBadge tier={comment.profiles.tier} size="sm" />}
                    <span className="text-muted-foreground text-xs">
                      {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                    </span>
                    {comment.is_edited && (
                      <span className="text-muted-foreground text-xs italic">(edited)</span>
                    )}
                  </div>
                  <p className="text-sm mt-1 whitespace-pre-wrap break-words">{comment.content}</p>
                  
                  {user?.id === comment.user_id && !isAIComment && (
                    <div className="flex gap-2 mt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto py-1 px-2 text-xs"
                        onClick={() => deleteComment(comment.id)}
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center text-muted-foreground text-sm py-4">
            No comments yet. Be the first to comment!
          </p>
        )}
      </div>
    </div>
  );
}
