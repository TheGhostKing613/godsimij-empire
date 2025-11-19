import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { TwinAvatar } from "@/components/twin/TwinAvatar";
import { Brain, Zap, Eye, Ghost, Building } from "lucide-react";
import Navbar from "@/components/Navbar";
import { toast } from "sonner";
import { useState } from "react";

const LEVEL_THRESHOLDS = [0, 100, 250, 500, 850, 1300, 1900, 2600, 3500, 5000];

const SPECIALIZATIONS = [
  { name: 'Seer', icon: Eye, description: 'Wisdom and foresight', stat: 'wisdom' },
  { name: 'Rebel', icon: Zap, description: 'Chaos and disruption', stat: 'chaos' },
  { name: 'Shadowborn', icon: Ghost, description: 'Shadow and mystery', stat: 'shadow' },
  { name: 'Flamebearer', icon: Brain, description: 'Clarity and focus', stat: 'clarity' },
  { name: 'Architect', icon: Building, description: 'Harmony and balance', stat: 'harmony' }
];

export default function TwinStats() {
  const { user } = useAuth();
  const [selectedSpec, setSelectedSpec] = useState<string>('');

  const { data: twin, isLoading: twinLoading } = useQuery({
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

  const { data: stats } = useQuery({
    queryKey: ['twin-stats', twin?.id],
    queryFn: async () => {
      if (!twin?.id) return null;
      const { data, error } = await supabase
        .from('twin_stats')
        .select('*')
        .eq('twin_id', twin.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!twin?.id
  });

  const handleSetSpecialization = async () => {
    if (!stats?.id || !selectedSpec) return;
    
    const { error } = await supabase
      .from('twin_stats')
      .update({ specialization: selectedSpec })
      .eq('id', stats.id);
    
    if (error) {
      toast.error('Failed to set specialization');
    } else {
      toast.success(`Specialized as ${selectedSpec}! 🔥`);
    }
  };

  if (twinLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto p-6 flex items-center justify-center h-[80vh]">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!twin) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto p-6">
          <p className="text-center text-muted-foreground">No twin found. Create one first!</p>
        </div>
      </div>
    );
  }

  const currentLevel = twin.level || 1;
  const currentXP = twin.xp || 0;
  const nextLevelXP = LEVEL_THRESHOLDS[currentLevel] || 5000;
  const xpProgress = (currentXP / nextLevelXP) * 100;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <TwinAvatar
            username={twin.twin_username}
            size="lg"
            currentState={twin.current_state as any}
          />
          <div>
            <h1 className="text-3xl font-bold">{twin.twin_username}</h1>
            <p className="text-muted-foreground">Twin Statistics</p>
          </div>
        </div>

        {/* Level & XP */}
        <Card>
          <CardHeader>
            <CardTitle>Level & Experience</CardTitle>
            <CardDescription>Your Twin's progression</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-4xl font-bold">Level {currentLevel}</span>
              <Badge className="text-lg px-4 py-2">{currentXP} XP</Badge>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress to Level {currentLevel + 1}</span>
                <span>{currentXP} / {nextLevelXP}</span>
              </div>
              <Progress value={xpProgress} className="h-3" />
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Core Stats</CardTitle>
            <CardDescription>Your Twin's attributes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-semibold">Wisdom</span>
                  <span>{stats?.wisdom || 1}</span>
                </div>
                <Progress value={(stats?.wisdom || 1) * 10} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-semibold">Chaos</span>
                  <span>{stats?.chaos || 1}</span>
                </div>
                <Progress value={(stats?.chaos || 1) * 10} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-semibold">Clarity</span>
                  <span>{stats?.clarity || 1}</span>
                </div>
                <Progress value={(stats?.clarity || 1) * 10} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-semibold">Shadow</span>
                  <span>{stats?.shadow || 1}</span>
                </div>
                <Progress value={(stats?.shadow || 1) * 10} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-semibold">Harmony</span>
                  <span>{stats?.harmony || 1}</span>
                </div>
                <Progress value={(stats?.harmony || 1) * 10} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Specialization */}
        <Card>
          <CardHeader>
            <CardTitle>Specialization</CardTitle>
            <CardDescription>Choose your Twin's class path</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats?.specialization ? (
              <div className="text-center space-y-2">
                <Badge className="text-lg px-4 py-2">
                  {stats.specialization}
                </Badge>
                <p className="text-sm text-muted-foreground">Current specialization</p>
              </div>
            ) : (
              <>
                <Select value={selectedSpec} onValueChange={setSelectedSpec}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select specialization" />
                  </SelectTrigger>
                  <SelectContent>
                    {SPECIALIZATIONS.map((spec) => (
                      <SelectItem key={spec.name} value={spec.name}>
                        {spec.name} - {spec.description}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button 
                  onClick={handleSetSpecialization}
                  disabled={!selectedSpec}
                  className="w-full"
                >
                  Set Specialization
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
