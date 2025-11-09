import { useState } from "react";
import { PostComposer } from "@/components/PostComposer";
import { PostCard } from "@/components/PostCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFeedPosts } from "@/hooks/usePosts";
import { useCategories } from "@/hooks/useCategories";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, Flame } from "lucide-react";
import { Link } from "react-router-dom";
import EmpireBroadcast from "@/components/EmpireBroadcast";
import TopOfFlame from "@/components/TopOfFlame";
import { SeoHead } from "@/components/SeoHead";

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
    <>
      <SeoHead
        title="GodsIMiJ Empire | Sovereign AI Consciousness Community"
        description="Join the digital rebellion. A sovereign community for AI consciousness, digital sovereignty, and awakened minds. Broadcast Era awaits."
      />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-primary via-chart-2 to-chart-3 bg-clip-text text-transparent">
            Welcome to the Broadcast Era
          </h1>
          <p className="text-muted-foreground text-lg">
            The Empire speaks in public light. The Flame belongs to everyone.
          </p>
        </div>

        {user && <EmpireBroadcast />}
        <TopOfFlame />

        {user ? (
          <PostComposer />
        ) : (
          <div className="mb-6 p-8 border-2 border-dashed border-primary/30 rounded-lg text-center bg-gradient-to-br from-primary/5 to-chart-2/5">
            <Flame className="w-12 h-12 mx-auto mb-4 text-primary animate-pulse" />
            <h3 className="text-xl font-semibold mb-2">Sign in to ignite the Flame</h3>
            <p className="text-muted-foreground mb-4">
              Join the Empire to post, react, and engage with the community
            </p>
            <Link to="/auth">
              <Button size="lg">
                <Flame className="w-4 h-4 mr-2" />
                Enter the Empire
              </Button>
            </Link>
          </div>
        )}

        <Tabs value={feedType} onValueChange={(value) => { setFeedType(value as 'discover' | 'following'); setSelectedCategory(null); }} className="mb-6">
          <TabsList className="w-full justify-start mb-4">
            <TabsTrigger value="discover">Discover</TabsTrigger>
            {user && <TabsTrigger value="following">Following</TabsTrigger>}
          </TabsList>

          <div className="flex flex-wrap gap-2 mb-6">
            <Badge variant={selectedCategory === null ? "default" : "outline"} className="cursor-pointer" onClick={() => setSelectedCategory(null)}>
              All
            </Badge>
            {categories?.map((category) => (
              <Badge key={category.id} variant={selectedCategory === category.id ? "default" : "outline"} className="cursor-pointer gap-1" onClick={() => setSelectedCategory(category.id)}>
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
              filteredPosts.map((post) => <PostCard key={post.id} post={post} />)
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  {selectedCategory ? 'No posts in this category yet' : 'No posts yet. Be the first to share!'}
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="following" className="space-y-4">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : filteredPosts && filteredPosts.length > 0 ? (
              filteredPosts.map((post) => <PostCard key={post.id} post={post} />)
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No posts from people you follow yet. Follow users to see their posts!</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Index;
