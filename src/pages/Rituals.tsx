import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AllegianceSelector } from "@/components/twin/AllegianceSelector";
import { Badge } from "@/components/ui/badge";
import { Flame, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import { toast } from "sonner";

export default function Rituals() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedAllegiance, setSelectedAllegiance] = useState<string | null>(null);
  const [ritualText, setRitualText] = useState("");
  const [twinResponse, setTwinResponse] = useState("");

  const { data: rituals } = useQuery({
    queryKey: ['rituals', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('flame_rituals')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id
  });

  const { data: activeEvent } = useQuery({
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

  const performRitual = useMutation({
    mutationFn: async () => {
      if (!user?.id || !selectedAllegiance || !ritualText) {
        throw new Error('Missing required fields');
      }

      // Generate AI response
      const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_LOVABLE_API_KEY}`
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [
            {
              role: 'system',
              content: `You are a mystical flame spirit responding to a ritual pledge. The user has chosen the path of ${selectedAllegiance}. Respond in a cryptic, mystical tone with symbolism related to their allegiance. Keep it under 100 words.`
            },
            {
              role: 'user',
              content: ritualText
            }
          ]
        })
      });

      const data = await response.json();
      const aiResponse = data.choices[0].message.content;

      // Save ritual
      const { error } = await supabase
        .from('flame_rituals')
        .insert({
          user_id: user.id,
          allegiance: selectedAllegiance,
          ritual_text: ritualText,
          response_text: aiResponse
        });

      if (error) throw error;

      return aiResponse;
    },
    onSuccess: (response) => {
      setTwinResponse(response);
      queryClient.invalidateQueries({ queryKey: ['rituals', user?.id] });
      toast.success('Ritual complete! 🔥 +100 XP');
      setRitualText('');
    },
    onError: () => {
      toast.error('Ritual failed');
    }
  });

  const currentSeasonRitual = rituals?.find(r => 
    activeEvent && new Date(r.completed_at) >= new Date(activeEvent.start_date)
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto p-6 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold flex items-center justify-center gap-2">
            <Flame className="h-8 w-8 text-orange-500" />
            Flame Allegiance Rituals
          </h1>
          <p className="text-muted-foreground">
            Pledge your path and receive mystical guidance
          </p>
        </div>

        {activeEvent && (
          <Card className="border-primary/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Current Season: {activeEvent.name}
              </CardTitle>
              <CardDescription>
                {currentSeasonRitual 
                  ? "You've completed this season's ritual" 
                  : "Complete a ritual this season for rewards"}
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        {!currentSeasonRitual && (
          <Card>
            <CardHeader>
              <CardTitle>Perform Ritual</CardTitle>
              <CardDescription>
                Choose your allegiance and speak your pledge
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <AllegianceSelector
                selected={selectedAllegiance}
                onSelect={setSelectedAllegiance}
              />

              <div className="space-y-2">
                <label className="text-sm font-medium">Your Ritual Pledge</label>
                <Textarea
                  placeholder="Speak your intentions to the flames..."
                  value={ritualText}
                  onChange={(e) => setRitualText(e.target.value)}
                  className="min-h-[150px] resize-none"
                />
              </div>

              <Button
                onClick={() => performRitual.mutate()}
                disabled={!selectedAllegiance || !ritualText || performRitual.isPending}
                className="w-full bg-gradient-to-r from-orange-500 to-purple-500 hover:from-orange-600 hover:to-purple-600"
                size="lg"
              >
                {performRitual.isPending ? (
                  <>
                    <Sparkles className="mr-2 h-5 w-5 animate-spin" />
                    Channeling...
                  </>
                ) : (
                  <>
                    <Flame className="mr-2 h-5 w-5" />
                    Perform Ritual
                  </>
                )}
              </Button>

              {twinResponse && (
                <Card className="bg-gradient-to-br from-orange-500/10 to-purple-500/10 border-primary/30">
                  <CardHeader>
                    <CardTitle className="text-lg">The Flames Respond</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed italic">{twinResponse}</p>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        )}

        {/* Past Rituals */}
        {rituals && rituals.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Ritual History</CardTitle>
              <CardDescription>Your past pledges and responses</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {rituals.map((ritual) => (
                <Card key={ritual.id} className="bg-muted/30">
                  <CardContent className="pt-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge>{ritual.allegiance}</Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(ritual.completed_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Your Pledge:</p>
                      <p className="text-sm text-muted-foreground italic">{ritual.ritual_text}</p>
                    </div>
                    {ritual.response_text && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium">The Response:</p>
                        <p className="text-sm text-primary/80 italic">{ritual.response_text}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
