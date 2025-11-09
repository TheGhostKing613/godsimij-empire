import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Lock, Users, Globe } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { useCreatePost } from '@/hooks/usePosts';
import { useCategories } from '@/hooks/useCategories';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { POST_TYPE_CONFIG } from '@/config/postTypes';
import { useAudio } from '@/hooks/useAudio';

const postSchema = z.object({
  content: z.string().min(1, 'Post content is required').max(5000, 'Post is too long'),
  post_type: z.enum(['discussion', 'question', 'announcement', 'idea']),
  visibility: z.enum(['public', 'followers', 'private']),
  category_id: z.string().optional(),
  is_anonymous: z.boolean(),
  display_name: z.string().optional(),
}).refine(data => !data.is_anonymous || (data.is_anonymous && data.display_name), {
  message: 'Display name is required for anonymous posts',
  path: ['display_name'],
});

type PostFormData = z.infer<typeof postSchema>;

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
  const { playFlameIgnition } = useAudio();

  const form = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      content: '',
      post_type: 'discussion',
      visibility: 'public',
      category_id: '',
      is_anonymous: false,
      display_name: '',
    },
  });

  const isAnonymous = form.watch('is_anonymous');

  const onSubmit = (data: PostFormData) => {
    createPost({
      content: data.content,
      post_type: data.post_type,
      visibility: data.visibility,
      category_id: data.category_id || undefined,
      is_anonymous: data.is_anonymous,
      display_name: data.display_name || undefined,
    } as any);
    playFlameIgnition();
    form.reset();
    setIsExpanded(false);
  };

  if (!user) return null;

  return (
    <Card className="p-4 mb-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-chart-2/5 pointer-events-none" />
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 relative z-10">
          <div className="flex gap-3">
            {isAnonymous ? (
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <span className="text-lg">👻</span>
              </div>
            ) : (
              <Avatar className="w-10 h-10">
                <AvatarImage src={user.user_metadata?.avatar_url} />
                <AvatarFallback className="bg-primary/10">
                  {user.email?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
            )}

            <div className="flex-1">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder={isAnonymous 
                          ? "Speak your truth anonymously..." 
                          : "What's igniting your consciousness today?"}
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
              {/* Anonymous Toggle */}
              <FormField
                control={form.control}
                name="is_anonymous"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Post Anonymously</FormLabel>
                      <p className="text-xs text-muted-foreground">
                        Your identity will be hidden (3 anonymous posts per 24h)
                      </p>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Display Name for Anonymous Posts */}
              {isAnonymous && (
                <FormField
                  control={form.control}
                  name="display_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g., Ghost Rebel, Anonymous Witness..."
                          maxLength={50}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}

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
                          {Object.entries(POST_TYPE_CONFIG).map(([type, config]) => (
                            <SelectItem key={type} value={type}>
                              <div className="flex items-center gap-2">
                                <span>{config.icon}</span>
                                {config.displayName}
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
                  Ignite 🔥
                </Button>
              </div>
            </div>
          )}
        </form>
      </Form>
    </Card>
  );
}
