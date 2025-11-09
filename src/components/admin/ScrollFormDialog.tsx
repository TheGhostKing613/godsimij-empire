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
import { RichTextEditor } from './RichTextEditor';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  pages: z.string().optional(),
  status: z.enum(['Draft', 'Published', 'Archived']),
  content: z.string().min(1, 'Content is required'),
});

interface ScrollFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scroll?: any;
  onSuccess: () => void;
}

export function ScrollFormDialog({ open, onOpenChange, scroll, onSuccess }: ScrollFormDialogProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      pages: '',
      status: 'Draft',
      content: '',
    },
  });

  useEffect(() => {
    if (scroll) {
      form.reset({
        title: scroll.title,
        description: scroll.description,
        pages: scroll.pages || '',
        status: scroll.status,
        content: scroll.content,
      });
    } else {
      form.reset({
        title: '',
        description: '',
        pages: '',
        status: 'Draft',
        content: '',
      });
    }
  }, [scroll, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (scroll) {
        const updateData = {
          title: values.title,
          description: values.description,
          pages: values.pages || null,
          status: values.status,
          content: values.content,
        };
        
        const { error } = await supabase
          .from('scrolls')
          .update(updateData)
          .eq('id', scroll.id);

        if (error) throw error;

        toast({
          title: "Scroll updated",
          description: "The scroll has been successfully updated.",
        });
      } else {
        const insertData = {
          title: values.title,
          description: values.description,
          pages: values.pages || null,
          status: values.status,
          content: values.content,
          created_by: user?.id,
        };
        
        const { error } = await supabase
          .from('scrolls')
          .insert([insertData]);

        if (error) throw error;

        toast({
          title: "Scroll created",
          description: "The scroll has been successfully created.",
        });
      }

      onSuccess();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: scroll ? "Error updating scroll" : "Error creating scroll",
        description: error.message,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{scroll ? 'Edit Scroll' : 'Create New Scroll'}</DialogTitle>
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

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={2} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="pages"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pages (optional)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., 42" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Draft">Draft</SelectItem>
                        <SelectItem value="Published">Published</SelectItem>
                        <SelectItem value="Archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <RichTextEditor
                      content={field.value}
                      onChange={field.onChange}
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
                {scroll ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
