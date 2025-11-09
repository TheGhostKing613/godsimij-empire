import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FileUpload } from './FileUpload';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  type: z.enum(['blog', 'podcast', 'video', 'meme']),
  content: z.string().min(1, 'Content is required'),
  date: z.string(),
  author: z.string().optional(),
  embed_url: z.string().url().optional().or(z.literal('')),
  file_url: z.string().optional(),
});

interface MediaFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  media?: any;
  onSuccess: () => void;
}

export function MediaFormDialog({ open, onOpenChange, media, onSuccess }: MediaFormDialogProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      type: 'blog',
      content: '',
      date: new Date().toISOString().split('T')[0],
      author: '',
      embed_url: '',
      file_url: '',
    },
  });

  useEffect(() => {
    if (media) {
      form.reset({
        title: media.title,
        type: media.type,
        content: media.content,
        date: media.date,
        author: media.author || '',
        embed_url: media.embed_url || '',
        file_url: media.file_url || '',
      });
    } else {
      form.reset({
        title: '',
        type: 'blog',
        content: '',
        date: new Date().toISOString().split('T')[0],
        author: '',
        embed_url: '',
        file_url: '',
      });
    }
  }, [media, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (media) {
        const updateData = {
          title: values.title,
          type: values.type,
          content: values.content,
          date: values.date,
          author: values.author || null,
          embed_url: values.embed_url || null,
          file_url: values.file_url || null,
        };
        
        const { error } = await supabase
          .from('media')
          .update(updateData)
          .eq('id', media.id);

        if (error) throw error;

        toast({
          title: "Media updated",
          description: "The media item has been successfully updated.",
        });
      } else {
        const insertData = {
          title: values.title,
          type: values.type,
          content: values.content,
          date: values.date,
          author: values.author || null,
          embed_url: values.embed_url || null,
          file_url: values.file_url || null,
          created_by: user?.id,
        };
        
        const { error } = await supabase
          .from('media')
          .insert([insertData]);

        if (error) throw error;

        toast({
          title: "Media created",
          description: "The media item has been successfully created.",
        });
      }

      onSuccess();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: media ? "Error updating media" : "Error creating media",
        description: error.message,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{media ? 'Edit Media' : 'Create New Media'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="blog">Blog Post</SelectItem>
                        <SelectItem value="podcast">Podcast</SelectItem>
                        <SelectItem value="video">Video</SelectItem>
                        <SelectItem value="meme">Meme</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input {...field} type="date" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Author (optional)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={5} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="embed_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Embed URL (optional)</FormLabel>
                  <FormControl>
                    <Input {...field} type="url" placeholder="https://..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="file_url"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FileUpload
                      bucket="media"
                      accept="image/*,video/*,audio/*"
                      value={field.value}
                      onChange={(url) => field.onChange(url || '')}
                      label="Media File (optional)"
                      description="Upload an image, video, or audio file"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {media ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
