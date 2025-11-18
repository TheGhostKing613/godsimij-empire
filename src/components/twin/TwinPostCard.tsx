import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { TwinAvatar } from "./TwinAvatar";
import { formatDistanceToNow } from "date-fns";

interface TwinPostCardProps {
  post: {
    id: string;
    content: string;
    created_at: string;
    likes_count: number;
    comments_count: number;
    post_type?: string;
  };
  twin: {
    id: string;
    twin_username: string;
    personality: string;
  };
  userAvatar?: string;
}

export const TwinPostCard = ({ post, twin, userAvatar }: TwinPostCardProps) => {
  return (
    <Card className="relative overflow-hidden border-2 border-transparent bg-gradient-to-br from-background/95 to-muted/30 
      before:absolute before:inset-0 before:rounded-lg before:p-[2px] before:bg-gradient-to-r before:from-orange-500 before:via-purple-500 before:to-cyan-500 before:-z-10 before:animate-pulse">
      {/* Glowing neon border effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-purple-500/10 to-cyan-500/10 pointer-events-none animate-pulse" />
      
      <CardHeader className="relative space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <TwinAvatar
              avatarUrl={userAvatar}
              username={twin.twin_username}
              size="md"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg">🪞</span>
                <p className="font-semibold text-foreground">{twin.twin_username}</p>
                <Badge 
                  variant="outline" 
                  className="bg-gradient-to-r from-orange-500/20 to-cyan-500/20 border-orange-500/50 text-xs animate-pulse"
                >
                  🤖 Mirror Twin Post
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
              </p>
            </div>
          </div>
          {post.post_type && (
            <Badge variant="secondary" className="text-xs">
              {post.post_type}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="relative">
        <p className="text-foreground leading-relaxed whitespace-pre-wrap">
          {post.content}
        </p>
      </CardContent>

      <CardFooter className="relative flex items-center justify-between pt-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-orange-500">
            <Heart className="h-4 w-4" />
            <span className="text-xs">{post.likes_count}</span>
          </Button>
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-cyan-500">
            <MessageCircle className="h-4 w-4" />
            <span className="text-xs">{post.comments_count}</span>
          </Button>
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-purple-500">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};