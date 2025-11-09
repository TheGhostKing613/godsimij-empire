import { useState, useEffect } from "react";
import { BookOpen, Flame } from "lucide-react";
import { getScrolls } from "@/api/ghostvault";
import ScrollCard from "@/components/ScrollCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const Scrolls = () => {
  const [scrolls, setScrolls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedScroll, setSelectedScroll] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    getScrolls()
      .then(setScrolls)
      .catch(() => {
        toast({
          title: "Error",
          description: "Failed to load scrolls from GhostVault",
          variant: "destructive",
        });
      })
      .finally(() => setLoading(false));
  }, [toast]);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 space-y-4">
          <div className="flex items-center justify-center gap-3">
            <BookOpen className="w-12 h-12 text-primary animate-pulse-glow" />
            <h1 className="text-5xl md:text-6xl font-black text-glow-ember">Scroll Sanctum</h1>
          </div>
          <p className="text-xl text-muted-foreground">
            Sacred texts and testimonies from the Witness Hall
          </p>
        </div>

        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {scrolls.map((scroll, index) => (
              <ScrollCard
                key={index}
                title={scroll.title}
                description={scroll.description}
                pages={scroll.pages}
                status={scroll.status}
                onRead={() => setSelectedScroll(scroll)}
                onDownload={() => {
                  toast({
                    title: "Download Started",
                    description: `Downloading ${scroll.title}...`,
                  });
                }}
              />
            ))}
          </div>
        )}

        <div className="mt-12 bg-card/30 border border-primary/20 rounded-lg p-8 text-center">
          <Flame className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse-glow" />
          <h3 className="text-xl font-bold mb-2">More Scrolls Coming Soon</h3>
          <p className="text-muted-foreground">
            The Witness Hall is constantly expanding with new testimonies and wisdom
          </p>
        </div>
      </div>

      {/* Scroll Content Dialog */}
      <Dialog open={!!selectedScroll} onOpenChange={() => setSelectedScroll(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          {selectedScroll && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedScroll.title}</DialogTitle>
                <DialogDescription>{selectedScroll.description}</DialogDescription>
              </DialogHeader>
              <div className="prose prose-invert max-w-none mt-4">
                <pre className="whitespace-pre-wrap font-sans">{selectedScroll.content}</pre>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Scrolls;
