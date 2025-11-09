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
import { ScrollFormDialog } from '@/components/admin/ScrollFormDialog';

interface Scroll {
  id: string;
  title: string;
  description: string;
  pages: string | null;
  status: string;
  content: string;
  created_at: string;
}

export default function ScrollsManagement() {
  const [scrolls, setScrolls] = useState<Scroll[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editScroll, setEditScroll] = useState<Scroll | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadScrolls();
  }, []);

  const loadScrolls = async () => {
    try {
      const { data, error } = await supabase
        .from('scrolls')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setScrolls(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error loading scrolls",
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
        .from('scrolls')
        .delete()
        .eq('id', deleteId);

      if (error) throw error;

      toast({
        title: "Scroll deleted",
        description: "The scroll has been successfully deleted.",
      });

      loadScrolls();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error deleting scroll",
        description: error.message,
      });
    } finally {
      setDeleteId(null);
    }
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditScroll(null);
    loadScrolls();
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-glow-ember mb-2">Scrolls Management</h1>
          <p className="text-muted-foreground">Manage the ancient scrolls of the Empire</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Scroll
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading scrolls...</div>
      ) : scrolls.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No scrolls yet. Create your first scroll to get started.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {scrolls.map((scroll) => (
            <Card key={scroll.id}>
              <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <div className="flex-1">
                  <CardTitle className="text-xl mb-2">{scroll.title}</CardTitle>
                  <p className="text-sm text-muted-foreground mb-2">{scroll.description}</p>
                  <div className="flex gap-2 items-center">
                    <Badge variant={scroll.status === 'Published' ? 'default' : 'secondary'}>
                      {scroll.status}
                    </Badge>
                    {scroll.pages && <span className="text-xs text-muted-foreground">{scroll.pages} pages</span>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setEditScroll(scroll);
                      setShowForm(true);
                    }}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setDeleteId(scroll.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      <ScrollFormDialog
        open={showForm}
        onOpenChange={(open) => {
          setShowForm(open);
          if (!open) setEditScroll(null);
        }}
        scroll={editScroll}
        onSuccess={handleSuccess}
      />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Scroll?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the scroll.
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
