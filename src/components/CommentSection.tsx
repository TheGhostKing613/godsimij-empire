import { useState, useEffect } from "react";
import { MessageSquare, Send, Trash2, AlertCircle, Check, X, Flag, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { createNotification } from "@/api/notifications";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Comment {
  id: string;
  content: string;
  user_name: string | null;
  user_email: string | null;
  user_id: string | null;
  created_at: string;
  status: 'pending' | 'approved' | 'rejected' | 'flagged';
  is_hidden: boolean;
  moderation_note?: string | null;
}

interface CommentSectionProps {
  itemId: string;
  itemType: "scroll" | "project" | "media";
}

export const CommentSection = ({ itemId, itemType }: CommentSectionProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [moderationNote, setModerationNote] = useState("");
  const [showModerationDialog, setShowModerationDialog] = useState(false);
  const [selectedCommentId, setSelectedCommentId] = useState<string | null>(null);
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    loadComments();
    
    // Subscribe to real-time updates
    const channel = supabase
      .channel(`comments-${itemType}-${itemId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'comments',
          filter: `item_id=eq.${itemId}`
        },
        () => {
          loadComments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [itemId, itemType]);

  const loadComments = async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('item_id', itemId)
        .eq('item_type', itemType)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setComments((data as Comment[]) || []);
    } catch (error: any) {
      console.error('Error loading comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Please sign in to comment");
      return;
    }

    if (!newComment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    if (newComment.length > 1000) {
      toast.error("Comment must be less than 1000 characters");
      return;
    }

    setSubmitting(true);
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, email')
        .eq('id', user.id)
        .single();

      const { error } = await supabase
        .from('comments')
        .insert({
          content: newComment.trim(),
          item_id: itemId,
          item_type: itemType,
          user_id: user.id,
          user_name: profile?.full_name || user.email?.split('@')[0] || 'Anonymous',
          user_email: user.email
        });

      if (error) throw error;

      // Create notification for the item owner if it's a post
      // For scrolls/projects/media, we'd need to fetch the owner
      // This can be enhanced later when we add user ownership to those tables
      
      setNewComment("");
      toast.success("Comment posted!");
    } catch (error: any) {
      console.error('Error posting comment:', error);
      toast.error("Failed to post comment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;
      toast.success("Comment deleted");
    } catch (error: any) {
      console.error('Error deleting comment:', error);
      toast.error("Failed to delete comment");
    }
  };

  const handleModeration = async (commentId: string, action: 'approve' | 'reject' | 'flag' | 'hide') => {
    try {
      const updates: any = {
        moderated_at: new Date().toISOString(),
        moderated_by: user?.id
      };

      switch (action) {
        case 'approve':
          updates.status = 'approved';
          updates.is_hidden = false;
          break;
        case 'reject':
          updates.status = 'rejected';
          updates.is_hidden = true;
          break;
        case 'flag':
          updates.status = 'flagged';
          break;
        case 'hide':
          updates.is_hidden = true;
          break;
      }

      if (moderationNote) {
        updates.moderation_note = moderationNote;
      }

      const { error } = await supabase
        .from('comments')
        .update(updates)
        .eq('id', commentId);

      if (error) throw error;

      toast.success(`Comment ${action}ed successfully`);
      setModerationNote("");
      setShowModerationDialog(false);
      setSelectedCommentId(null);
    } catch (error: any) {
      console.error('Error moderating comment:', error);
      toast.error("Failed to moderate comment");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="outline" className="bg-green-500/20 text-green-500 border-green-500/30">Approved</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30">Pending</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-500/20 text-red-500 border-red-500/30">Rejected</Badge>;
      case 'flagged':
        return <Badge variant="outline" className="bg-orange-500/20 text-orange-500 border-orange-500/30">Flagged</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="w-5 h-5 text-primary" />
        <h3 className="text-xl font-semibold">
          Comments ({comments.length})
        </h3>
      </div>

      {/* Comment Form */}
      {user ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts..."
            className="min-h-[100px] resize-none"
            maxLength={1000}
          />
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {newComment.length}/1000
            </span>
            <Button type="submit" disabled={submitting || !newComment.trim()}>
              <Send className="w-4 h-4 mr-2" />
              Post Comment
            </Button>
          </div>
        </form>
      ) : (
        <Card className="bg-muted/50">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">
              Please sign in to leave a comment
            </p>
          </CardContent>
        </Card>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading comments...
          </div>
        ) : comments.length === 0 ? (
          <Card className="bg-muted/30">
            <CardContent className="pt-6 text-center">
              <MessageSquare className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">
                No comments yet. Be the first to share your thoughts!
              </p>
            </CardContent>
          </Card>
        ) : (
          comments.map((comment) => (
            <Card key={comment.id} className={`bg-card/50 ${comment.is_hidden ? 'opacity-60' : ''}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold">{comment.user_name || 'Anonymous'}</p>
                      {isAdmin && getStatusBadge(comment.status)}
                      {comment.is_hidden && isAdmin && (
                        <Badge variant="outline" className="bg-gray-500/20 text-gray-500">
                          <EyeOff className="w-3 h-3 mr-1" />
                          Hidden
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                    </p>
                    {isAdmin && comment.moderation_note && (
                      <p className="text-xs text-muted-foreground mt-1 italic">
                        Note: {comment.moderation_note}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex gap-1">
                    {isAdmin && (
                      <>
                        {comment.status === 'pending' && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleModeration(comment.id, 'approve')}
                              className="text-green-500 hover:text-green-600"
                              title="Approve"
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleModeration(comment.id, 'reject')}
                              className="text-red-500 hover:text-red-600"
                              title="Reject"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                        {comment.status === 'approved' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleModeration(comment.id, 'flag')}
                            className="text-orange-500 hover:text-orange-600"
                            title="Flag"
                          >
                            <Flag className="w-4 h-4" />
                          </Button>
                        )}
                        {!comment.is_hidden && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleModeration(comment.id, 'hide')}
                            className="text-gray-500 hover:text-gray-600"
                            title="Hide"
                          >
                            <EyeOff className="w-4 h-4" />
                          </Button>
                        )}
                      </>
                    )}
                    {(user?.id === comment.user_id || isAdmin) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(comment.id)}
                        className="text-destructive hover:text-destructive"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {comment.status === 'pending' && user?.id === comment.user_id && !isAdmin && (
                  <div className="mb-3 flex items-center gap-2 text-sm text-yellow-600 dark:text-yellow-500">
                    <AlertCircle className="w-4 h-4" />
                    <span>Your comment is pending moderation</span>
                  </div>
                )}
                <p className="whitespace-pre-wrap">{comment.content}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Moderation Dialog */}
      <AlertDialog open={showModerationDialog} onOpenChange={setShowModerationDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Add Moderation Note</AlertDialogTitle>
            <AlertDialogDescription>
              Add an optional note explaining this moderation action.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Textarea
            value={moderationNote}
            onChange={(e) => setModerationNote(e.target.value)}
            placeholder="Moderation note (optional)..."
            className="min-h-[100px]"
          />
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => selectedCommentId && handleModeration(selectedCommentId, 'approve')}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
