import { useState, useEffect } from "react";
import { BookOpen, Flame, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import ScrollCard from "@/components/ScrollCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

const Scrolls = () => {
  const [scrolls, setScrolls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedScroll, setSelectedScroll] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();
  
  const itemsPerPage = 6;
  const totalPages = Math.ceil(scrolls.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentScrolls = scrolls.slice(startIndex, endIndex);

  useEffect(() => {
    loadScrolls();
  }, []);

  const loadScrolls = async () => {
    try {
      const { data, error } = await supabase
        .from('scrolls')
        .select('*')
        .eq('status', 'Published')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setScrolls(data || []);
    } catch (error: any) {
      console.error("Error loading scrolls:", error);
      toast({
        title: "Error",
        description: "Failed to load scrolls from the database",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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
        ) : scrolls.length === 0 ? (
          <div className="text-center py-12 bg-card/30 border border-primary/20 rounded-lg">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No published scrolls yet. Check back soon!</p>
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {currentScrolls.map((scroll) => (
                <ScrollCard
                  key={scroll.id}
                  title={scroll.title}
                  description={scroll.description}
                  pages={scroll.pages}
                  status={scroll.status}
                  onRead={() => setSelectedScroll(scroll)}
                  onDownload={() => {
                    if (scroll.file_url) {
                      window.open(scroll.file_url, '_blank');
                      toast({
                        title: "Download Started",
                        description: `Downloading ${scroll.title}...`,
                      });
                    } else {
                      toast({
                        title: "No file available",
                        description: "This scroll doesn't have a downloadable file.",
                      });
                    }
                  }}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setCurrentPage(page)}
                          isActive={currentPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
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
              {selectedScroll.file_url && (
                <div className="mb-4">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => window.open(selectedScroll.file_url, '_blank')}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF Version
                  </Button>
                </div>
              )}
              <div className="prose prose-invert max-w-none mt-4 dark:prose-invert">
                <div dangerouslySetInnerHTML={{ __html: selectedScroll.content }} />
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Scrolls;
