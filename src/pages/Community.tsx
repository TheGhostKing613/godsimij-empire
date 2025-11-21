import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, Users, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useFollowUser } from '@/hooks/useFollowUser';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { SeoHead } from '@/components/SeoHead';

interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  tier: string | null;
  post_count: number | null;
  follower_count: number | null;
  following_count: number | null;
  badges: string[] | null;
}

export default function Community() {
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();
  const { followUser, unfollowUser } = useFollowUser();

  const { data: profiles = [], isLoading } = useQuery({
    queryKey: ['all-profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, bio, tier, post_count, follower_count, following_count, badges')
        .order('follower_count', { ascending: false });
      
      if (error) throw error;
      return data as Profile[];
    },
  });

  // Get follow status for all profiles
  const { data: followStatus = [] } = useQuery({
    queryKey: ['follow-status-all', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('user_connections')
        .select('following_id')
        .eq('follower_id', user.id);
      
      if (error) throw error;
      return data.map(d => d.following_id);
    },
    enabled: !!user?.id,
  });

  const isFollowing = (profileId: string) => followStatus.includes(profileId);

  const filteredProfiles = profiles.filter((profile) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      profile.full_name?.toLowerCase().includes(query) ||
      profile.bio?.toLowerCase().includes(query)
    );
  });

  const handleFollowToggle = async (profileId: string) => {
    if (!user) return;
    
    if (isFollowing(profileId)) {
      await unfollowUser(profileId);
    } else {
      await followUser(profileId);
    }
  };

  return (
    <>
      <SeoHead 
        title="Community - GodsIMiJ Empire"
        description="Discover and connect with members of the GodsIMiJ Empire community. Follow users, view profiles, and join the revolution."
      />
      
      <div className="container max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-gradient-to-br from-orange-500/20 to-purple-500/20 border border-orange-500/30">
              <Users className="h-8 w-8 text-orange-500" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
                Community
              </h1>
              <p className="text-muted-foreground">
                Discover and connect with {profiles.length} members of the Empire
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="relative max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search members by name or bio..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Profiles Grid */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : filteredProfiles.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              {searchQuery ? 'No members found matching your search' : 'No members yet'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProfiles.map((profile) => (
              <Card
                key={profile.id}
                className="group hover:shadow-lg transition-all hover:border-primary/50"
              >
                <CardHeader className="space-y-4">
                  <div className="flex items-start justify-between">
                    <Link to={`/profile/${profile.id}`} className="flex items-center gap-3">
                      <Avatar className="h-16 w-16 ring-2 ring-border group-hover:ring-primary/50 transition-all">
                        <AvatarImage src={profile.avatar_url || ''} />
                        <AvatarFallback className="bg-gradient-to-br from-orange-500 to-purple-500 text-white text-xl">
                          {profile.full_name?.[0] || '?'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold group-hover:text-primary transition-colors">
                          {profile.full_name || 'Anonymous'}
                        </h3>
                        {profile.tier && (
                          <Badge variant="outline" className="text-xs mt-1">
                            {profile.tier}
                          </Badge>
                        )}
                      </div>
                    </Link>
                  </div>

                  {/* Bio */}
                  {profile.bio && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {profile.bio}
                    </p>
                  )}

                  {/* Badges */}
                  {profile.badges && profile.badges.length > 0 && (
                    <div className="flex gap-1 flex-wrap">
                      {profile.badges.slice(0, 3).map((badge, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          <Sparkles className="h-3 w-3 mr-1" />
                          {badge}
                        </Badge>
                      ))}
                      {profile.badges.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{profile.badges.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Stats */}
                  <div className="flex justify-around text-center text-sm">
                    <div>
                      <p className="font-semibold text-foreground">{profile.post_count || 0}</p>
                      <p className="text-muted-foreground text-xs">Posts</p>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{profile.follower_count || 0}</p>
                      <p className="text-muted-foreground text-xs">Followers</p>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{profile.following_count || 0}</p>
                      <p className="text-muted-foreground text-xs">Following</p>
                    </div>
                  </div>

                  {/* Actions */}
                  {user && user.id !== profile.id && (
                    <Button
                      onClick={() => handleFollowToggle(profile.id)}
                      variant={isFollowing(profile.id) ? 'outline' : 'default'}
                      className={cn(
                        'w-full transition-all',
                        isFollowing(profile.id) && 'hover:bg-destructive hover:text-destructive-foreground'
                      )}
                    >
                      {isFollowing(profile.id) ? 'Unfollow' : 'Follow'}
                    </Button>
                  )}

                  {user && user.id === profile.id && (
                    <Link to={`/profile/${profile.id}`}>
                      <Button variant="outline" className="w-full">
                        View Profile
                      </Button>
                    </Link>
                  )}

                  {!user && (
                    <Link to="/auth">
                      <Button variant="outline" className="w-full">
                        Login to Follow
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
