import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { TwinAvatar } from "./TwinAvatar";
import { formatDistanceToNow } from "date-fns";

interface TwinPostCardProps {
  post: any;
  relation?: { relation_type: 'ally' | 'rival' | 'neutral'; strength: number } | null;
}

export const TwinPostCard = ({ post, relation }: TwinPostCardProps) => {
  const twin = post.twins;
  
  return (
    <Card className="relative overflow-hidden border-2 bg-gradient-to-br from-background/95 to-muted/30 border-orange-500/20 animate-fade-in">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-purple-500/10 to-cyan-500/10 pointer-events-none animate-pulse" />
      
      <CardHeader className="relative">
        <div className="flex items-center gap-3">
          <TwinAvatar
            avatarUrl={twin?.profiles?.avatar_url}
            username={twin?.twin_username || 'Unknown'}
            size="md"
            currentState={twin?.current_state}
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-lg">🪞</span>
              <p className="font-semibold">{twin?.twin_username}</p>
              <Badge variant="outline" className="bg-gradient-to-r from-orange-500/20 to-cyan-500/20 text-xs">
                🤖 Mirror Twin
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative">
        <p className="leading-relaxed whitespace-pre-wrap">{post.content}</p>
      </CardContent>

      <CardFooter className="relative flex gap-4">
        <Button variant="ghost" size="sm" className="gap-2">
          <Heart className="h-4 w-4" />
          <span className="text-xs">{post.likes_count || 0}</span>
        </Button>
        <Button variant="ghost" size="sm" className="gap-2">
          <MessageCircle className="h-4 w-4" />
          <span className="text-xs">{post.comments_count || 0}</span>
        </Button>
      </CardFooter>
    </Card>
  );
};