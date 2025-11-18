import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle, Zap } from "lucide-react";
import { toast } from "sonner";

interface TwinQuestsCardProps {
  twinId: string;
}

export const TwinQuestsCard = ({ twinId }: TwinQuestsCardProps) => {
  const queryClient = useQueryClient();

  const { data: quests, isLoading } = useQuery({
    queryKey: ['twin-quests', twinId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('twin_quests')
        .select('*')
        .eq('twin_id', twinId)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!twinId
  });

  const assignQuests = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('assign-daily-quests', {
        body: { twinId }
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['twin-quests', twinId] });
      toast.success('Daily quests assigned! 🔥');
    },
    onError: (error) => {
      console.error('Failed to assign quests:', error);
      toast.error('Failed to assign quests');
    }
  });

  const completeQuest = useMutation({
    mutationFn: async (questId: string) => {
      const { error } = await supabase
        .from('twin_quests')
        .update({ completed: true })
        .eq('id', questId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['twin-quests', twinId] });
      toast.success('Quest completed! +XP 🔥');
    },
    onError: (error) => {
      console.error('Failed to complete quest:', error);
      toast.error('Failed to complete quest');
    }
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Daily Quests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Loading quests...</p>
        </CardContent>
      </Card>
    );
  }

  const totalQuests = quests?.length || 0;
  const completedQuests = quests?.filter(q => q.completed).length || 0;
  const progressPercent = totalQuests > 0 ? (completedQuests / totalQuests) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-orange-500" />
              Daily Quests
            </CardTitle>
            <CardDescription>
              Complete quests to earn XP and unlock traits
            </CardDescription>
          </div>
          {(!quests || quests.length === 0) && (
            <Button
              onClick={() => assignQuests.mutate()}
              disabled={assignQuests.isPending}
              size="sm"
            >
              Generate Quests
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {totalQuests > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{completedQuests}/{totalQuests}</span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>
        )}

        <div className="space-y-3">
          {quests?.map((quest) => (
            <div
              key={quest.id}
              className={`p-3 rounded-lg border ${
                quest.completed 
                  ? 'bg-muted/50 border-muted opacity-60' 
                  : 'bg-background border-border'
              }`}
            >
              <div className="flex items-start gap-3">
                {quest.completed ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                )}
                <div className="flex-1 space-y-1">
                  <p className={`text-sm ${quest.completed ? 'line-through text-muted-foreground' : ''}`}>
                    {quest.quest}
                  </p>
                  <Badge 
                    variant="outline" 
                    className="text-xs bg-gradient-to-r from-orange-500/20 to-cyan-500/20"
                  >
                    +{quest.xp_reward} XP
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>

        {totalQuests === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No active quests. Generate new daily quests to earn XP!
          </p>
        )}
      </CardContent>
    </Card>
  );
};