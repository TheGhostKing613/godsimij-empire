import { useState } from 'react';
import { Search as SearchIcon, User, FileText, Tag } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PostCard } from '@/components/PostCard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import TierBadge from '@/components/TierBadge';
import { useSearchPosts, useSearchUsers, useSearchCategories } from '@/hooks/useSearch';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

const Search = () => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  const { data: posts, isLoading: postsLoading } = useSearchPosts(debouncedQuery);
  const { data: users, isLoading: usersLoading } = useSearchUsers(debouncedQuery);
  const { data: categories, isLoading: categoriesLoading } = useSearchCategories(debouncedQuery);

  // Debounce search
  const handleSearch = (value: string) => {
    setQuery(value);
    const timeout = setTimeout(() => {
      setDebouncedQuery(value);
    }, 300);
    return () => clearTimeout(timeout);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-black mb-4 text-glow-ember">Search the Empire</h1>
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search posts, users, or categories..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 text-lg h-12"
          />
        </div>
      </div>

      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="posts">
            <FileText className="w-4 h-4 mr-2" />
            Posts
          </TabsTrigger>
          <TabsTrigger value="users">
            <User className="w-4 h-4 mr-2" />
            Users
          </TabsTrigger>
          <TabsTrigger value="categories">
            <Tag className="w-4 h-4 mr-2" />
            Categories
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="space-y-4 mt-6">
          {postsLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-6">
                  <Skeleton className="h-24 w-full" />
                </Card>
              ))}
            </div>
          ) : posts && posts.length > 0 ? (
            <div className="space-y-4">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : debouncedQuery ? (
            <Card className="p-12 text-center">
              <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No posts found for "{debouncedQuery}"</p>
            </Card>
          ) : (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">Enter a search query to find posts</p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="users" className="space-y-4 mt-6">
          {usersLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-6">
                  <Skeleton className="h-16 w-full" />
                </Card>
              ))}
            </div>
          ) : users && users.length > 0 ? (
            <div className="space-y-4">
              {users.map((user) => (
                <Card key={user.id} className="p-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={user.avatar_url} />
                      <AvatarFallback className="bg-primary/10">
                        {user.full_name?.[0]?.toUpperCase() || '?'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/profile/${user.id}`}
                          className="font-semibold hover:underline"
                        >
                          {user.full_name}
                        </Link>
                        <TierBadge tier={user.tier} size="sm" />
                      </div>
                      {user.bio && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                          {user.bio}
                        </p>
                      )}
                      <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                        <span>{user.follower_count} followers</span>
                        <span>{user.post_count} posts</span>
                      </div>
                    </div>
                    <Button asChild>
                      <Link to={`/profile/${user.id}`}>View Profile</Link>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : debouncedQuery ? (
            <Card className="p-12 text-center">
              <User className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No users found for "{debouncedQuery}"</p>
            </Card>
          ) : (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">Enter a search query to find users</p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="categories" className="space-y-4 mt-6">
          {categoriesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="p-6">
                  <Skeleton className="h-20 w-full" />
                </Card>
              ))}
            </div>
          ) : categories && categories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories.map((category) => (
                <Card key={category.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">{category.icon}</div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg mb-1">{category.name}</h3>
                      {category.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                          {category.description}
                        </p>
                      )}
                      <Badge variant="secondary">{category.post_count} posts</Badge>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : debouncedQuery ? (
            <Card className="p-12 text-center">
              <Tag className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No categories found for "{debouncedQuery}"</p>
            </Card>
          ) : (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">Enter a search query to find categories</p>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Search;
