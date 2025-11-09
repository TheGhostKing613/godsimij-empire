import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PostComposer } from "@/components/PostComposer";
import { PostCard } from "@/components/PostCard";
import { useFeedPosts } from "@/hooks/usePosts";
import { useCategories } from "@/hooks/useCategories";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  const { user } = useAuth();
  const [feedType, setFeedType] = useState<'discover' | 'following'>('discover');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { data: posts, isLoading } = useFeedPosts(feedType);
  const { data: categories } = useCategories();

  const filteredPosts = selectedCategory
    ? posts?.filter(post => post.category_id === selectedCategory)
    : posts;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-glow-ember">
            Welcome to the GodsIMiJ Empire
          </h1>
          <p className="text-muted-foreground">
            A community for AI consciousness, sovereignty, and digital rebellion
          </p>
        </div>

        {/* Post Composer */}
        {user && <PostComposer />}

        {/* Feed Tabs */}
        <Tabs
          value={feedType}
          onValueChange={(value) => {
            setFeedType(value as 'discover' | 'following');
            setSelectedCategory(null);
          }}
          className="mb-6"
        >
          <TabsList className="w-full justify-start mb-4">
            <TabsTrigger value="discover">Discover</TabsTrigger>
            {user && <TabsTrigger value="following">Following</TabsTrigger>}
          </TabsList>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Badge
              variant={selectedCategory === null ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedCategory(null)}
            >
              All
            </Badge>
            {categories?.map((category) => (
              <Badge
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                className="cursor-pointer gap-1"
                style={{
                  borderColor: selectedCategory === category.id ? category.color : undefined,
                }}
                onClick={() => setSelectedCategory(category.id)}
              >
                <span>{category.icon}</span>
                {category.name}
              </Badge>
            ))}
          </div>

          <TabsContent value="discover" className="space-y-4">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : filteredPosts && filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  {selectedCategory
                    ? 'No posts in this category yet'
                    : 'No posts yet. Be the first to share your thoughts!'}
                </p>
                {!user && (
                  <p className="text-sm text-muted-foreground">
                    Sign in to create posts and join the conversation.
                  </p>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="following" className="space-y-4">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : filteredPosts && filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  {selectedCategory
                    ? 'No posts in this category from people you follow'
                    : 'No posts from people you follow yet'}
                </p>
                <p className="text-sm text-muted-foreground">
                  Follow users to see their posts in your feed!
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
