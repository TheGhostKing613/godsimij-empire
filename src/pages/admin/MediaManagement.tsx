import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import { MediaFormDialog } from '@/components/admin/MediaFormDialog';

interface Media {
  id: string;
  title: string;
  type: string;
  content: string;
  date: string;
  author: string | null;
  embed_url: string | null;
  created_at: string;
}

export default function MediaManagement() {
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editMedia, setEditMedia] = useState<Media | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadMedia();
  }, []);

  const loadMedia = async () => {
    try {
      const { data, error } = await supabase
        .from('media')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMedia(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error loading media",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const { error } = await supabase
        .from('media')
        .delete()
        .eq('id', deleteId);

      if (error) throw error;

      toast({
        title: "Media deleted",
        description: "The media item has been successfully deleted.",
      });

      loadMedia();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error deleting media",
        description: error.message,
      });
    } finally {
      setDeleteId(null);
    }
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditMedia(null);
    loadMedia();
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-glow-ember mb-2">Media Management</h1>
          <p className="text-muted-foreground">Manage blog posts, podcasts, videos, and memes</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Media
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading media...</div>
      ) : media.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No media yet. Create your first media item to get started.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {media.map((item) => (
            <Card key={item.id}>
              <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <div className="flex-1">
                  <CardTitle className="text-xl mb-2">{item.title}</CardTitle>
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{item.content}</p>
                  <div className="flex gap-2 items-center">
                    <Badge>{item.type}</Badge>
                    {item.author && <span className="text-xs text-muted-foreground">by {item.author}</span>}
                    <span className="text-xs text-muted-foreground">
                      {new Date(item.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setEditMedia(item);
                      setShowForm(true);
                    }}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setDeleteId(item.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      <MediaFormDialog
        open={showForm}
        onOpenChange={(open) => {
          setShowForm(open);
          if (!open) setEditMedia(null);
        }}
        media={editMedia}
        onSuccess={handleSuccess}
      />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Media?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the media item.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
