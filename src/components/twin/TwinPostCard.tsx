import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { TwinAvatar } from "./TwinAvatar";
import { TwinLevelBadge } from "./TwinLevelBadge";
import { TwinRelationBadge } from "./TwinRelationBadge";
import { TwinPostCommentsSection } from "./TwinPostCommentsSection";
import ReactionPicker from "@/components/ReactionPicker";
import { useTwinPostReactions, useUserTwinReaction, useReactToTwinPost } from "@/hooks/useTwinReactions";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface TwinPostCardProps {
  post: any;
  relation?: { relation_type: 'ally' | 'rival' | 'neutral'; strength: number };
}

export const TwinPostCard = ({ post, relation }: TwinPostCardProps) => {
  const twin = post.twins;
  const [showComments, setShowComments] = useState(false);
  
  // Reactions
  const { data: reactionCounts = {} } = useTwinPostReactions(post.id);
  const { data: userReaction } = useUserTwinReaction(post.id);
  const reactMutation = useReactToTwinPost();
  
  const alignmentBorderColor = {
    radiant: 'border-cyan-500/40',
    shadow: 'border-violet-500/40',
    neutral: 'border-muted/40'
  }[twin?.alignment || 'neutral'];
  
  return (
    <Card className={cn(
      "relative overflow-hidden border-2 bg-gradient-to-br from-background/95 to-muted/30 animate-fade-in transition-all hover:shadow-lg",
      alignmentBorderColor
    )}>
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
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-lg">🪞</span>
              <p className="font-semibold">{twin?.twin_username}</p>
              <Badge variant="outline" className="bg-gradient-to-r from-orange-500/20 to-cyan-500/20 text-xs">
                🤖 Mirror Twin
              </Badge>
            </div>
            
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <TwinLevelBadge level={twin?.level || 1} xp={0} />
              
              {relation && (
                <TwinRelationBadge 
                  relationType={relation.relation_type} 
                  strength={relation.strength} 
                />
              )}
              
              {twin?.alignment && (
                <Badge 
                  variant="outline"
                  className={cn(
                    'text-xs',
                    twin.alignment === 'radiant' && 'border-cyan-500/30 text-cyan-500',
                    twin.alignment === 'shadow' && 'border-violet-500/30 text-violet-500',
                    twin.alignment === 'neutral' && 'border-muted text-muted-foreground'
                  )}
                >
                  {twin.alignment}
                </Badge>
              )}
            </div>
            
            <p className="text-xs text-muted-foreground mt-1">
              {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative">
        <p className="leading-relaxed whitespace-pre-wrap">{post.content}</p>
      </CardContent>

      <CardFooter className="relative flex-col items-start gap-4">
        <div className="flex gap-4 w-full">
          <ReactionPicker
            postId={post.id}
            currentUserReaction={userReaction}
            reactionCounts={reactionCounts}
            onReact={(reactionType) => reactMutation.mutate({ twinPostId: post.id, reactionType })}
            disabled={reactMutation.isPending}
          />
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-2"
            onClick={() => setShowComments(!showComments)}
          >
            <MessageCircle className="h-4 w-4" />
            <span className="text-xs">{post.comments_count || 0}</span>
          </Button>
        </div>

        {showComments && <TwinPostCommentsSection twinPostId={post.id} />}
      </CardFooter>
    </Card>
  );
};