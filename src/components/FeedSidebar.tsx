import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, TrendingUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useSuggestedUsers } from '@/hooks/useSuggestedUsers';
import { useTrendingCategories } from '@/hooks/usePosts';
import UserSuggestionCard from './sidebar/UserSuggestionCard';
import TrendingCategoryCard from './sidebar/TrendingCategoryCard';
import TierProgressCard from './sidebar/TierProgressCard';
import EmpireQuickLinks from './sidebar/EmpireQuickLinks';

export default function FeedSidebar() {
  const { user } = useAuth();
  const { data: suggestedUsers } = useSuggestedUsers(5);
  const { data: trendingCategories } = useTrendingCategories(5);
  
  return (
    <div className="space-y-6 sticky top-24">
      {/* Who to Follow */}
      {suggestedUsers && suggestedUsers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="w-5 h-5" />
              Who to Follow
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {suggestedUsers.map((suggestedUser: any) => (
              <UserSuggestionCard key={suggestedUser.id} user={suggestedUser} />
            ))}
          </CardContent>
        </Card>
      )}
      
      {/* Trending Topics */}
      {trendingCategories && trendingCategories.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Trending Topics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {trendingCategories.map((category: any) => (
              <TrendingCategoryCard key={category.id} category={category} />
            ))}
          </CardContent>
        </Card>
      )}
      
      {/* Your Stats (if logged in) */}
      {user && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your Journey</CardTitle>
          </CardHeader>
          <CardContent>
            <TierProgressCard />
          </CardContent>
        </Card>
      )}
      
      {/* Empire Quick Links */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Explore the Empire</CardTitle>
        </CardHeader>
        <CardContent>
          <EmpireQuickLinks />
        </CardContent>
      </Card>
    </div>
  );
}
