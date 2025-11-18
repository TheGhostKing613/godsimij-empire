import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { TwinAvatar } from "./TwinAvatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Flame } from "lucide-react";

interface NearbyTwinsCarouselProps {
  currentUserId?: string;
}

export const NearbyTwinsCarousel = ({ currentUserId }: NearbyTwinsCarouselProps) => {
  const { data: nearbyTwins, isLoading } = useQuery({
    queryKey: ['nearby-twins', currentUserId],
    queryFn: async () => {
      // Fetch recently active twins (posted in last hour)
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
      
      const { data, error } = await supabase
        .from('twin_posts')
        .select(`
          twin_id,
          created_at,
          twins:twin_id (
            id,
            twin_username,
            level,
            alignment,
            active,
            user_id,
            profiles:user_id (
              avatar_url
            )
          )
        `)
        .gte('created_at', oneHourAgo)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      
      // Deduplicate by twin_id
      const uniqueTwins = Array.from(
        new Map(data?.map(item => [item.twins?.id, item])).values()
      ).filter(item => item.twins && item.twins.user_id !== currentUserId);
      
      return uniqueTwins.map(item => item.twins).slice(0, 8);
    },
    enabled: !!currentUserId
  });

  if (isLoading || !nearbyTwins || nearbyTwins.length === 0) {
    return null;
  }

  const getAlignmentColor = (alignment: string) => {
    switch (alignment) {
      case 'radiant': return 'text-cyan-500';
      case 'shadow': return 'text-violet-500';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <Card className="p-4 mb-6 bg-gradient-to-br from-background to-muted/20 border-border/50">
      <div className="flex items-center gap-2 mb-4">
        <Flame className="h-5 w-5 text-orange-500" />
        <h3 className="text-sm font-semibold">Twins Present in This Realm</h3>
        <Badge variant="outline" className="ml-auto">
          {nearbyTwins.length} Active
        </Badge>
      </div>

      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-3">
          {nearbyTwins.map((twin: any) => (
            <Card
              key={twin.id}
              className="flex-shrink-0 p-3 w-[140px] bg-background/50 hover:bg-background/80 transition-colors cursor-pointer"
            >
              <div className="flex flex-col items-center gap-2">
                <TwinAvatar
                  avatarUrl={twin.profiles?.avatar_url}
                  username={twin.twin_username}
                  size="md"
                />
                <div className="text-center space-y-1">
                  <p className="text-xs font-medium truncate w-full">
                    {twin.twin_username}
                  </p>
                  <div className="flex items-center justify-center gap-1">
                    <Badge 
                      variant="outline" 
                      className="text-xs bg-gradient-to-r from-orange-500/20 to-cyan-500/20"
                    >
                      Lv {twin.level || 1}
                    </Badge>
                  </div>
                  <p className={`text-xs ${getAlignmentColor(twin.alignment)}`}>
                    {twin.alignment || 'neutral'}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </Card>
  );
};