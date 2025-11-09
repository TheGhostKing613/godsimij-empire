import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, MessageSquare, HelpCircle, Megaphone, Lightbulb, Lock, Users, Globe } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { useCreatePost } from '@/hooks/usePosts';
import { useCategories } from '@/hooks/useCategories';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const postSchema = z.object({
  content: z.string().min(1, 'Post content is required').max(5000, 'Post is too long'),
  post_type: z.enum(['discussion', 'question', 'announcement', 'idea']),
  visibility: z.enum(['public', 'followers', 'private']),
  category_id: z.string().optional(),
});

type PostFormData = z.infer<typeof postSchema>;

const postTypeIcons = {
  discussion: MessageSquare,
  question: HelpCircle,
  announcement: Megaphone,
  idea: Lightbulb,
};

const visibilityIcons = {
  public: Globe,
  followers: Users,
  private: Lock,
};

export function PostComposer() {
  const { user } = useAuth();
  const { mutate: createPost, isPending } = useCreatePost();
  const { data: categories } = useCategories();
  const [isExpanded, setIsExpanded] = useState(false);

  const form = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      content: '',
      post_type: 'discussion',
      visibility: 'public',
      category_id: '',
    },
  });

  const onSubmit = (data: PostFormData) => {
    createPost({
      content: data.content,
      post_type: data.post_type,
      visibility: data.visibility,
      category_id: data.category_id || undefined,
    });
    form.reset();
    setIsExpanded(false);
  };

  if (!user) return null;

  return (
    <Card className="p-4 mb-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={user.user_metadata?.avatar_url} />
              <AvatarFallback className="bg-primary/10">
                {user.email?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="What's on your mind about AI consciousness, sovereignty, or digital rebellion?"
                        rows={isExpanded ? 5 : 2}
                        onFocus={() => setIsExpanded(true)}
                        className="resize-none"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>

          {isExpanded && (
            <div className="space-y-4 pl-[52px]">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="post_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Post Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(postTypeIcons).map(([type, Icon]) => (
                            <SelectItem key={type} value={type}>
                              <div className="flex items-center gap-2">
                                <Icon className="w-4 h-4" />
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="visibility"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Visibility</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(visibilityIcons).map(([vis, Icon]) => (
                            <SelectItem key={vis} value={vis}>
                              <div className="flex items-center gap-2">
                                <Icon className="w-4 h-4" />
                                {vis.charAt(0).toUpperCase() + vis.slice(1)}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category (Optional)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        {categories?.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            <div className="flex items-center gap-2">
                              <span>{category.icon}</span>
                              {category.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    form.reset();
                    setIsExpanded(false);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Post
                </Button>
              </div>
            </div>
          )}
        </form>
      </Form>
    </Card>
  );
}
