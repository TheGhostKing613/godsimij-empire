import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TwinLoreTabProps {
  twinId: string;
}

export const TwinLoreTab = ({ twinId }: TwinLoreTabProps) => {
  const { data: loreEntries, isLoading } = useQuery({
    queryKey: ['twin-lore', twinId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('twin_lore')
        .select('*')
        .eq('twin_id', twinId)
        .order('level', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!twinId
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <p className="text-sm text-muted-foreground">Loading lore...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 px-6 pt-6">
        <Sparkles className="h-5 w-5 text-purple-500" />
        <h3 className="text-lg font-semibold">Twin Lore</h3>
      </div>
      <p className="text-sm text-muted-foreground px-6">
        Fragments of your Twin's awakening and evolution across the realms.
      </p>

      <ScrollArea className="h-[500px] px-6 pb-6">
        <div className="space-y-4">
          {loreEntries && loreEntries.length > 0 ? (
            loreEntries.map((entry, index) => (
              <Card 
                key={entry.id}
                className="border-border/50 bg-gradient-to-br from-background to-muted/30"
              >
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline"
                      className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-500 border-purple-500/50"
                    >
                      Level {entry.level}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(entry.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed italic text-foreground/90">
                    "{entry.lore_entry}"
                  </p>
                  <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="border-dashed">
              <CardContent className="p-8 text-center">
                <Sparkles className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-sm text-muted-foreground">
                  No lore fragments yet. Your Twin's story unfolds as they level up...
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};