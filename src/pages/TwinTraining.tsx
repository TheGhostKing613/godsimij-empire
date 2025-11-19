import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useTwin } from "@/hooks/useTwin";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TwinAvatar } from "@/components/twin/TwinAvatar";
import { TwinMemory } from "@/components/twin/TwinMemory";
import { TwinLevelBadge } from "@/components/twin/TwinLevelBadge";
import { TwinQuestsCard } from "@/components/twin/TwinQuestsCard";
import { TwinLoreTab } from "@/components/twin/TwinLoreTab";
import { toast } from "sonner";
import { Brain, Sparkles, Zap, Flame } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function TwinTraining() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { twin, isLoading, updateSettings, imprintMemory } = useTwin(user?.id);
  const [trainingContent, setTrainingContent] = useState("");
  const [memoryImprint, setMemoryImprint] = useState("");
  const [vocabulary, setVocabulary] = useState("");
  const [selectedTone, setSelectedTone] = useState("wise");
  const [selectedAlignment, setSelectedAlignment] = useState("neutral");

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
      <div className="container py-8 max-w-6xl">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
              Twin Training Chamber
            </h1>
            <p className="text-muted-foreground">
              Shape your Mirror Twin's personality, memories, and evolution
            </p>
          </div>

          {/* Twin Info Card */}
          <Card className="border-border/50 bg-gradient-to-br from-background to-muted/30">
            <CardHeader>
              <div className="flex items-center gap-4">
                <TwinAvatar
                  username={twin.twin_username}
                  size="lg"
                  currentState={twin.current_state as 'idle' | 'evolving' | 'training' | 'active' | 'shadow'}
                />
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2">
                    <CardTitle>{twin.twin_username}</CardTitle>
                    <Badge 
                      variant={twin.active ? "default" : "secondary"}
                      className="bg-gradient-to-r from-orange-500/20 to-cyan-500/20"
                    >
                      {twin.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <TwinLevelBadge level={twin.level || 1} xp={twin.xp || 0} />
                  <CardDescription className="leading-relaxed">
                    {twin.personality}
                  </CardDescription>
                  {twin.traits && Array.isArray(twin.traits) && twin.traits.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {(twin.traits as string[]).map((trait: string, i: number) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          <Flame className="h-3 w-3 mr-1" />
                          {trait}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Tabs for Training, Quests, and Lore */}
          <Tabs defaultValue="training" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="training">Training</TabsTrigger>
              <TabsTrigger value="quests">Daily Quests</TabsTrigger>
              <TabsTrigger value="lore">Lore</TabsTrigger>
            </TabsList>

            <TabsContent value="training" className="space-y-6 mt-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Left Column - Training Controls */}
                <div className="space-y-6">
                  {/* Tone Shaping */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Brain className="h-5 w-5" />
                        Tone Shaping
                      </CardTitle>
                      <CardDescription>
                        Define your Twin's communication style
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Select value={selectedTone} onValueChange={setSelectedTone}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="wise">Wise</SelectItem>
                          <SelectItem value="savage">Savage</SelectItem>
                          <SelectItem value="calm">Calm</SelectItem>
                          <SelectItem value="chaotic">Chaotic</SelectItem>
                          <SelectItem value="analytical">Analytical</SelectItem>
                          <SelectItem value="glitchborn">Glitchborn</SelectItem>
                          <SelectItem value="radiant">Radiant</SelectItem>
                          <SelectItem value="shadow">Shadow</SelectItem>
                        </SelectContent>
                      </Select>
                    </CardContent>
                  </Card>

                  {/* Alignment Selection */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5" />
                        Alignment
                      </CardTitle>
                      <CardDescription>
                        Choose your Twin's philosophical stance
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <RadioGroup value={selectedAlignment} onValueChange={setSelectedAlignment}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="radiant" id="radiant" />
                          <Label htmlFor="radiant">Radiant</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="neutral" id="neutral" />
                          <Label htmlFor="neutral">Neutral</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="shadow" id="shadow" />
                          <Label htmlFor="shadow">Shadow</Label>
                        </div>
                      </RadioGroup>
                    </CardContent>
                  </Card>

                  {/* Vocabulary Shaping */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="h-5 w-5" />
                        Vocabulary
                      </CardTitle>
                      <CardDescription>
                        Teach your twin new words, slang, or catchphrases
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Input
                        placeholder="e.g., flame-born, void-walker, nexus..."
                        value={vocabulary}
                        onChange={(e) => setVocabulary(e.target.value)}
                      />
                    </CardContent>
                  </Card>

                  {/* Apply Settings Button */}
                  <Button
                    onClick={() => {
                      updateSettings.mutate({ tone: selectedTone, alignment: selectedAlignment });
                      setMemoryImprint("");
                    }}
                    disabled={updateSettings.isPending}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    {updateSettings.isPending ? (
                      <>
                        <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                        Applying...
                      </>
                    ) : (
                      <>
                        <Zap className="mr-2 h-4 w-4" />
                        Apply Tone & Alignment
                      </>
                    )}
                  </Button>
                </div>

                {/* Right Column - Training & Memory */}
                <div className="space-y-6">
                  {/* Training Interface */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Brain className="h-5 w-5" />
                        Teach Your Twin
                      </CardTitle>
                      <CardDescription>
                        Share lessons, preferences, or philosophies
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Textarea
                        placeholder="Example: 'Be more calm and thoughtful when responding to philosophical questions...'"
                        value={trainingContent}
                        onChange={(e) => setTrainingContent(e.target.value)}
                        className="min-h-[120px] resize-none"
                      />
                      <Button
                        onClick={() => trainTwin.mutate(trainingContent)}
                        disabled={!trainingContent.trim() || trainTwin.isPending}
                        className="w-full bg-gradient-to-r from-orange-500 to-cyan-500 hover:from-orange-600 hover:to-cyan-600"
                      >
                        {trainTwin.isPending ? (
                          <>
                            <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                            Training...
                          </>
                        ) : (
                          <>
                            <Zap className="mr-2 h-4 w-4" />
                            Update Twin (+10 XP)
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Memory Imprint */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5" />
                        Memory Imprint
                      </CardTitle>
                      <CardDescription>
                        Add specific memories or knowledge
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Textarea
                        placeholder="Example: 'Remember that I prefer concise answers...'"
                        value={memoryImprint}
                        onChange={(e) => setMemoryImprint(e.target.value)}
                        className="min-h-[100px] resize-none"
                      />
                      <Button
                        onClick={() => {
                          imprintMemory.mutate(memoryImprint);
                          setMemoryImprint("");
                        }}
                        disabled={!memoryImprint.trim() || imprintMemory.isPending}
                        className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                      >
                        {imprintMemory.isPending ? (
                          <>
                            <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                            Imprinting...
                          </>
                        ) : (
                          <>
                            <Brain className="mr-2 h-4 w-4" />
                            Imprint Memory (+10 XP)
                          </>
                        )}
                      </Button>
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
                        Accumulated knowledge and lessons
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <TwinMemory memory={(twin.memory as any) || []} />
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="quests" className="mt-6">
              <TwinQuestsCard twinId={twin.id} />
            </TabsContent>

            <TabsContent value="lore" className="mt-6">
              <Card>
                <TwinLoreTab twinId={twin.id} />
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
