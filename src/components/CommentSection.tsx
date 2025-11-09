import { useState, useEffect } from "react";
import { MessageSquare, Send, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

interface Comment {
  id: string;
  content: string;
  user_name: string | null;
  user_email: string | null;
  user_id: string | null;
  created_at: string;
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
      setComments(data || []);
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
            <Card key={comment.id} className="bg-card/50">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold">{comment.user_name || 'Anonymous'}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                    </p>
                  </div>
                  {(user?.id === comment.user_id || isAdmin) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(comment.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{comment.content}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
