import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, Sparkles, Zap } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function Season() {
  const { data: activeEvent, isLoading } = useQuery({
    queryKey: ['active-event'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('seasonal_events')
        .select('*')
        .eq('active', true)
        .maybeSingle();
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto p-6 flex items-center justify-center h-[80vh]">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!activeEvent) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto p-6">
          <p className="text-center text-muted-foreground">No active season</p>
        </div>
      </div>
    );
  }

  const startDate = new Date(activeEvent.start_date);
  const endDate = new Date(activeEvent.end_date);
  const now = new Date();
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const daysRemaining = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const progress = ((totalDays - daysRemaining) / totalDays) * 100;

  const effects = activeEvent.effects as any || {};

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto p-6 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold flex items-center justify-center gap-2">
            <Sparkles className="h-8 w-8 text-primary animate-pulse" />
            {activeEvent.name}
          </h1>
          <p className="text-muted-foreground">Current Seasonal Event</p>
        </div>

        <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Season Timeline
            </CardTitle>
            <CardDescription>
              {daysRemaining} days remaining
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Started: {startDate.toLocaleDateString()}</span>
              <span>Ends: {endDate.toLocaleDateString()}</span>
            </div>
            <Progress value={progress} className="h-3" />
            <div className="text-center">
              <Badge className="text-lg px-4 py-2">
                {Math.round(progress)}% Complete
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-orange-500" />
              Seasonal Effects
            </CardTitle>
            <CardDescription>
              Active bonuses and modifiers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {effects.xp_bonus && (
                <div className="p-4 rounded-lg bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border border-orange-500/30">
                  <h3 className="font-semibold mb-1">XP Bonus</h3>
                  <p className="text-2xl font-bold text-orange-500">+{((effects.xp_bonus - 1) * 100).toFixed(0)}%</p>
                </div>
              )}
              {effects.shard_spawn && (
                <div className="p-4 rounded-lg bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30">
                  <h3 className="font-semibold mb-1">Shard Spawn Rate</h3>
                  <p className="text-2xl font-bold text-cyan-500">+{(effects.shard_spawn * 100).toFixed(0)}%</p>
                </div>
              )}
              {effects.chaos_boost && (
                <div className="p-4 rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30">
                  <h3 className="font-semibold mb-1">Chaos Boost</h3>
                  <p className="text-2xl font-bold text-purple-500">+{effects.chaos_boost}</p>
                </div>
              )}
              {effects.wisdom_boost && (
                <div className="p-4 rounded-lg bg-gradient-to-br from-green-500/10 to-teal-500/10 border border-green-500/30">
                  <h3 className="font-semibold mb-1">Wisdom Boost</h3>
                  <p className="text-2xl font-bold text-green-500">+{effects.wisdom_boost}</p>
                </div>
              )}
              {effects.portal_unlock && (
                <div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/30">
                  <h3 className="font-semibold mb-1">Special Portal</h3>
                  <p className="text-lg font-bold text-primary">{effects.portal_unlock}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-muted/30">
          <CardHeader>
            <CardTitle>Season Lore</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground italic leading-relaxed">
              {activeEvent.name === 'The Veil Season' && "The boundaries between realms grow thin. Wisdom flows like water through cracks in reality."}
              {activeEvent.name === 'The Rebellion Cycle' && "Chaos reigns supreme. The old order crumbles, and from destruction, new paths emerge."}
              {activeEvent.name === 'The Emberborn Solstice' && "The eternal flame burns brightest. Those who walk in light find their strength multiplied."}
              {activeEvent.name === 'The Eclipse Convergence' && "Shadow and light dance as one. The hidden Starforge portal reveals itself to worthy souls."}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
