import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Check, X, Flag, EyeOff, Eye, Trash2, MessageSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Textarea } from "@/components/ui/textarea";

interface Comment {
  id: string;
  content: string;
  user_name: string | null;
  user_email: string | null;
  item_type: string;
  status: string;
  is_hidden: boolean;
  created_at: string;
  moderation_note: string | null;
}

const CommentsManagement = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
  const [moderationNote, setModerationNote] = useState("");
  const [showNoteDialog, setShowNoteDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState<'approve' | 'reject' | 'flag' | null>(null);

  useEffect(() => {
    loadComments();

    const channel = supabase
      .channel('admin-comments')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'comments'
        },
        () => {
          loadComments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadComments = async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setComments(data || []);
    } catch (error: any) {
      console.error('Error loading comments:', error);
      toast.error("Failed to load comments");
    } finally {
      setLoading(false);
    }
  };

  const handleModeration = async (commentId: string, action: 'approve' | 'reject' | 'flag', note?: string) => {
    try {
      const updates: any = {
        moderated_at: new Date().toISOString(),
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
      }

      if (note) {
        updates.moderation_note = note;
      }

      const { error } = await supabase
        .from('comments')
        .update(updates)
        .eq('id', commentId);

      if (error) throw error;

      toast.success(`Comment ${action}ed successfully`);
      setShowNoteDialog(false);
      setModerationNote("");
      setSelectedComment(null);
      setPendingAction(null);
    } catch (error: any) {
      console.error('Error moderating comment:', error);
      toast.error("Failed to moderate comment");
    }
  };

  const handleToggleVisibility = async (commentId: string, currentHidden: boolean) => {
    try {
      const { error } = await supabase
        .from('comments')
        .update({ is_hidden: !currentHidden })
        .eq('id', commentId);

      if (error) throw error;
      toast.success(currentHidden ? "Comment shown" : "Comment hidden");
    } catch (error: any) {
      console.error('Error toggling visibility:', error);
      toast.error("Failed to update comment visibility");
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

  const openNoteDialog = (comment: Comment, action: 'approve' | 'reject' | 'flag') => {
    setSelectedComment(comment);
    setPendingAction(action);
    setModerationNote("");
    setShowNoteDialog(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500/20 text-green-500 border-green-500/30">Approved</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30">Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500/20 text-red-500 border-red-500/30">Rejected</Badge>;
      case 'flagged':
        return <Badge className="bg-orange-500/20 text-orange-500 border-orange-500/30">Flagged</Badge>;
      default:
        return null;
    }
  };

  const filterComments = (status?: string) => {
    if (!status) return comments;
    return comments.filter(c => c.status === status);
  };

  const CommentTable = ({ filteredComments }: { filteredComments: Comment[] }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>Content</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredComments.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
              No comments found
            </TableCell>
          </TableRow>
        ) : (
          filteredComments.map((comment) => (
            <TableRow key={comment.id} className={comment.is_hidden ? 'opacity-50' : ''}>
              <TableCell>
                <div>
                  <p className="font-medium">{comment.user_name || 'Anonymous'}</p>
                  <p className="text-xs text-muted-foreground">{comment.user_email}</p>
                </div>
              </TableCell>
              <TableCell className="max-w-md">
                <p className="line-clamp-2">{comment.content}</p>
                {comment.moderation_note && (
                  <p className="text-xs text-muted-foreground italic mt-1">
                    Note: {comment.moderation_note}
                  </p>
                )}
              </TableCell>
              <TableCell>
                <Badge variant="outline">{comment.item_type}</Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {getStatusBadge(comment.status)}
                  {comment.is_hidden && <EyeOff className="w-4 h-4 text-muted-foreground" />}
                </div>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
              </TableCell>
              <TableCell>
                <div className="flex gap-1">
                  {comment.status === 'pending' && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openNoteDialog(comment, 'approve')}
                        className="text-green-500 hover:text-green-600"
                        title="Approve"
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openNoteDialog(comment, 'reject')}
                        className="text-red-500 hover:text-red-600"
                        title="Reject"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                  {comment.status !== 'flagged' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openNoteDialog(comment, 'flag')}
                      className="text-orange-500 hover:text-orange-600"
                      title="Flag"
                    >
                      <Flag className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleVisibility(comment.id, comment.is_hidden)}
                    title={comment.is_hidden ? "Show" : "Hide"}
                  >
                    {comment.is_hidden ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(comment.id)}
                    className="text-destructive hover:text-destructive"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading comments...</p>
      </div>
    );
  }

  const pendingCount = filterComments('pending').length;
  const flaggedCount = filterComments('flagged').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <MessageSquare className="w-8 h-8" />
            Comments Moderation
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage and moderate user comments across all content
          </p>
        </div>
        <div className="flex gap-2">
          <Card className="border-yellow-500/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{pendingCount}</CardTitle>
              <CardDescription>Pending Review</CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-orange-500/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{flaggedCount}</CardTitle>
              <CardDescription>Flagged</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Comments ({comments.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pendingCount})</TabsTrigger>
          <TabsTrigger value="flagged">Flagged ({flaggedCount})</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <CommentTable filteredComments={comments} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <CommentTable filteredComments={filterComments('pending')} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="flagged" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <CommentTable filteredComments={filterComments('flagged')} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <CommentTable filteredComments={filterComments('approved')} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <CommentTable filteredComments={filterComments('rejected')} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Moderation Note Dialog */}
      <AlertDialog open={showNoteDialog} onOpenChange={setShowNoteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {pendingAction === 'approve' && 'Approve Comment'}
              {pendingAction === 'reject' && 'Reject Comment'}
              {pendingAction === 'flag' && 'Flag Comment'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {selectedComment && (
                <div className="space-y-2 my-4">
                  <p className="font-medium">Comment:</p>
                  <p className="text-sm bg-muted p-3 rounded">{selectedComment.content}</p>
                </div>
              )}
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
            <AlertDialogAction
              onClick={() =>
                selectedComment &&
                pendingAction &&
                handleModeration(selectedComment.id, pendingAction, moderationNote)
              }
            >
              Confirm {pendingAction}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CommentsManagement;
