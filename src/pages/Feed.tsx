import { useState, useMemo } from 'react';
import { PostComposer } from '@/components/PostComposer';
import EmpireBroadcast from '@/components/EmpireBroadcast';
import TopOfFlame from '@/components/TopOfFlame';
import { SeoHead } from '@/components/SeoHead';
import FeedSidebar from '@/components/FeedSidebar';
import { useAuth } from '@/contexts/AuthContext';
import { useCategories } from '@/hooks/useCategories';
import { NearbyTwinsCarousel } from '@/components/twin/NearbyTwinsCarousel';
import { UnifiedFeedCard } from '@/components/UnifiedFeedCard';
import { useUnifiedFeed } from '@/hooks/useUnifiedFeed';
import { useTwinRecognition } from '@/hooks/useTwinRecognition';
import { useTwin } from '@/hooks/useTwin';
import { Loader2, Compass, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Index = () => {
  const { user } = useAuth();
  const [feedType, setFeedType] = useState<'discover' | 'following'>('discover');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { data: feedItems, isLoading } = useUnifiedFeed(feedType, user?.id);
  const { data: categories } = useCategories();
  const { twin } = useTwin(user?.id);

  // Extract visible twin IDs from feed for recognition
  const visibleTwinIds = useMemo(() => {
    return feedItems
      ?.filter(item => item.type === 'twin_post' && item.twins?.id)
      .map(item => item.twins.id) || [];
  }, [feedItems]);

  // Auto-recognize nearby twins
  useTwinRecognition(twin?.id, visibleTwinIds);

  const filteredItems = selectedCategory
    ? feedItems?.filter(item => item.category_id === selectedCategory)
    : feedItems;

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <SeoHead
        title="Broadcast Era | GodsIMiJ Empire"
        description="The sovereign social feed of the GodsIMiJ Empire"
      />
      
      {user && <EmpireBroadcast />}
      <TopOfFlame />
      
      {user && <NearbyTwinsCarousel currentUserId={user.id} />}
      
      {user && <PostComposer />}
      
      <div className="grid grid-cols-1 lg:grid-cols-[1fr,320px] gap-6">
        {/* Main Feed Column */}
        <div>
          <Tabs value={feedType} onValueChange={(value) => setFeedType(value as 'discover' | 'following')} className="mb-6">
            <TabsList className="w-full">
              <TabsTrigger value="discover" className="flex-1">
                <Compass className="w-4 h-4 mr-2" />
                Discover
              </TabsTrigger>
              {user && (
                <TabsTrigger value="following" className="flex-1">
                  <Users className="w-4 h-4 mr-2" />
                  Following
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="discover" className="mt-6">
              {/* Category Filter */}
              {categories && categories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  <Badge
                    variant={selectedCategory === null ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => setSelectedCategory(null)}
                  >
                    All
                  </Badge>
                  {categories.map((category) => (
                    <Badge
                      key={category.id}
                      variant={selectedCategory === category.id ? 'default' : 'outline'}
                      className="cursor-pointer gap-1"
                      onClick={() => setSelectedCategory(category.id)}
                      style={
                        selectedCategory === category.id
                          ? { backgroundColor: category.color, borderColor: category.color }
                          : { borderColor: category.color }
                      }
                    >
                      <span>{category.icon}</span>
                      {category.name}
                    </Badge>
                  ))}
                </div>
              )}

              {isLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
              ) : filteredItems && filteredItems.length > 0 ? (
                <div className="space-y-4">
                  {filteredItems.map((item) => (
                    <UnifiedFeedCard key={`${item.type}-${item.id}`} item={item} />
                  ))}
                </div>
              ) : (
                <Card className="p-12 text-center">
                  <p className="text-muted-foreground">No posts yet. Be the first to share!</p>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="following" className="mt-6">
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
              ) : filteredItems && filteredItems.length > 0 ? (
                <div className="space-y-4">
                  {filteredItems.map((item) => (
                    <UnifiedFeedCard key={`${item.type}-${item.id}`} item={item} />
                  ))}
                </div>
              ) : (
                <Card className="p-12 text-center">
                  <p className="text-muted-foreground">
                    Follow users to see their posts here
                  </p>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar Column */}
        <aside className="hidden lg:block">
          <FeedSidebar />
        </aside>
      </div>
    </div>
  );
};

export default Index;
