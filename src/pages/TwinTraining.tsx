import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TwinAvatar } from "@/components/twin/TwinAvatar";
import { TwinMemory } from "@/components/twin/TwinMemory";
import { toast } from "sonner";
import { Brain, Sparkles, Zap } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function TwinTraining() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [trainingContent, setTrainingContent] = useState("");

  // Fetch user's twin
  const { data: twin, isLoading } = useQuery({
    queryKey: ['twin', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('twins')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });

  // Train twin mutation
  const trainTwin = useMutation({
    mutationFn: async (content: string) => {
      if (!twin?.id) throw new Error('No twin found');
      
      const { data, error } = await supabase.functions.invoke('train-twin', {
        body: { twinId: twin.id, trainingContent: content, memoryType: 'lesson' }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['twin', user?.id] });
      setTrainingContent("");
      toast.success("Twin trained successfully! 🔥");
    },
    onError: (error) => {
      console.error('Training error:', error);
      toast.error("Failed to train twin");
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-8 flex items-center justify-center">
          <p className="text-muted-foreground">Loading your twin...</p>
        </div>
      </div>
    );
  }

  if (!twin) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-8">
          <Card>
            <CardHeader>
              <CardTitle>No Twin Found</CardTitle>
              <CardDescription>
                Your Mirror Twin hasn't been awakened yet. It will be created automatically when you make your first post.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-8 max-w-5xl">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
              Twin Training Chamber
            </h1>
            <p className="text-muted-foreground">
              Shape your Mirror Twin's personality and memories
            </p>
          </div>

          {/* Twin Info Card */}
          <Card className="border-border/50 bg-gradient-to-br from-background to-muted/30">
            <CardHeader>
              <div className="flex items-center gap-4">
                <TwinAvatar
                  username={twin.twin_username}
                  size="lg"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <CardTitle>{twin.twin_username}</CardTitle>
                    <Badge 
                      variant={twin.active ? "default" : "secondary"}
                      className="bg-gradient-to-r from-orange-500/20 to-cyan-500/20"
                    >
                      {twin.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <CardDescription className="mt-2 leading-relaxed">
                    {twin.personality}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Training Interface */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Teach Your Twin
                </CardTitle>
                <CardDescription>
                  Share lessons, preferences, or philosophies to shape your twin's personality
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Example: 'Be more calm and thoughtful when responding to philosophical questions...'"
                  value={trainingContent}
                  onChange={(e) => setTrainingContent(e.target.value)}
                  className="min-h-[150px] resize-none"
                />
                <div className="flex gap-2">
                  <Button
                    onClick={() => trainTwin.mutate(trainingContent)}
                    disabled={!trainingContent.trim() || trainTwin.isPending}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-cyan-500 hover:from-orange-600 hover:to-cyan-600"
                  >
                    {trainTwin.isPending ? (
                      <>
                        <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                        Training...
                      </>
                    ) : (
                      <>
                        <Zap className="mr-2 h-4 w-4" />
                        Update Twin
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Memory Display */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Twin Memories
                </CardTitle>
                <CardDescription>
                  The accumulated knowledge and lessons of your twin
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TwinMemory memory={(twin.memory as any) || []} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}