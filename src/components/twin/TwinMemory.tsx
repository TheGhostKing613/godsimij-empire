import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Brain, Sparkles, Zap } from "lucide-react";

interface MemoryShard {
  type: string;
  content: string;
  timestamp: number;
}

interface TwinMemoryProps {
  memory: MemoryShard[];
}

const getMemoryIcon = (type: string) => {
  switch (type) {
    case 'awakening': return <Sparkles className="h-4 w-4" />;
    case 'lesson': return <Brain className="h-4 w-4" />;
    default: return <Zap className="h-4 w-4" />;
  }
};

const getMemoryColor = (type: string) => {
  switch (type) {
    case 'awakening': return 'from-cyan-500 to-blue-500';
    case 'lesson': return 'from-purple-500 to-pink-500';
    default: return 'from-orange-500 to-red-500';
  }
};

export const TwinMemory = ({ memory }: TwinMemoryProps) => {
  return (
    <ScrollArea className="h-[300px] w-full rounded-md border border-border/50 bg-background/50 p-4">
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground/80 flex items-center gap-2">
          <Brain className="h-4 w-4" />
          Memory Shards
        </h3>
        {memory.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">No memories yet...</p>
        ) : (
          memory.map((shard, index) => (
            <div
              key={index}
              className="group relative p-3 rounded-lg border border-border/30 bg-gradient-to-br from-background/50 to-muted/20 hover:border-primary/50 transition-all"
            >
              <div className="flex items-start gap-2">
                <div className={`p-1.5 rounded-full bg-gradient-to-br ${getMemoryColor(shard.type)}`}>
                  {getMemoryIcon(shard.type)}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {shard.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(shard.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-foreground/90 leading-relaxed">
                    {shard.content}
                  </p>
                </div>
              </div>
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-accent/5 transition-all" />
            </div>
          ))
        )}
      </div>
    </ScrollArea>
  );
};