import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { SeoHead } from "@/components/SeoHead";
import { SocialShare } from "@/components/SocialShare";
import { CommentSection } from "@/components/CommentSection";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const Projects = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const { toast } = useToast();

  const itemsPerPage = 9;
  const totalPages = Math.ceil(projects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProjects = projects.slice(startIndex, endIndex);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error: any) {
      console.error("Error loading projects:", error);
      toast({
        title: "Error",
        description: "Failed to load projects",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Live':
        return 'bg-primary/20 text-primary';
      case 'Testing':
      case 'Development':
        return 'bg-secondary/20 text-secondary';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };
  return (
    <div className="container mx-auto px-4 py-12">
      <SeoHead
        title="Quantum Odyssey - Revolutionary Applications"
        description="Revolutionary applications from the Empire's innovation labs. Explore AI-powered tools and cutting-edge projects."
        url="/projects"
      />
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Zap className="w-12 h-12 text-secondary animate-pulse-glow" />
            <h1 className="text-5xl md:text-6xl font-black text-glow-cyan">Quantum Odyssey</h1>
          </div>
          <p className="text-xl text-muted-foreground">
            Revolutionary applications from the Empire's innovation labs
          </p>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12 bg-card/50 border border-secondary/20 rounded-lg">
            <Zap className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No projects yet. Check back soon!</p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentProjects.map((project) => (
                <Card
                  key={project.id}
                  className="bg-card/50 border-secondary/20 hover:border-secondary/60 transition-all group hover:scale-105 overflow-hidden"
                >
                  {project.image_url && (
                    <div className="aspect-video w-full overflow-hidden">
                      <img
                        src={project.image_url}
                        alt={project.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <CardTitle className="text-xl">{project.name}</CardTitle>
                          <span className={`text-xs px-2 py-1 rounded ${getStatusColor(project.status)}`}>
                            {project.status}
                          </span>
                        </div>
                      </div>
                      <SocialShare
                        url={`${window.location.origin}/projects#${project.id}`}
                        title={project.name}
                        description={project.description}
                      />
                    </div>
                    {project.category && (
                      <Badge variant="outline" className="w-fit mb-2">
                        {project.category}
                      </Badge>
                    )}
                    <CardDescription>{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {project.link && (
                        <Button 
                          variant="outline" 
                          className="w-full border-secondary/30 group-hover:border-secondary/60"
                          asChild
                        >
                          <a href={project.link} target="_blank" rel="noopener noreferrer">
                            Launch App
                            <ExternalLink className="w-4 h-4 ml-2" />
                          </a>
                        </Button>
                      )}
                      <Button
                        variant="secondary"
                        className="w-full"
                        onClick={() => setSelectedProject(project)}
                      >
                        View Details & Comments
                      </Button>
                    </div>
                  </CardContent>
                </Card>
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

        <div className="mt-12 bg-gradient-to-r from-secondary/10 to-primary/10 border border-secondary/30 rounded-lg p-8 text-center">
          <Zap className="w-12 h-12 text-secondary mx-auto mb-4 animate-pulse-glow" />
          <h3 className="text-2xl font-bold mb-2">More Projects in Development</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            The Quantum Odyssey initiative is constantly expanding with new AI-powered tools and applications. 
            Join us in building the future of sovereign technology.
          </p>
        </div>
      </div>

      {/* Project Details Dialog */}
      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          {selectedProject && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <DialogTitle className="text-2xl">{selectedProject.name}</DialogTitle>
                    <DialogDescription>{selectedProject.description}</DialogDescription>
                  </div>
                  <SocialShare
                    url={`${window.location.origin}/projects#${selectedProject.id}`}
                    title={selectedProject.name}
                    description={selectedProject.description}
                  />
                </div>
              </DialogHeader>

              {selectedProject.image_url && (
                <div className="aspect-video w-full overflow-hidden rounded-lg">
                  <img
                    src={selectedProject.image_url}
                    alt={selectedProject.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="space-y-4">
                <div className="flex gap-2">
                  <Badge variant="outline">{selectedProject.status}</Badge>
                  {selectedProject.category && (
                    <Badge variant="secondary">{selectedProject.category}</Badge>
                  )}
                </div>

                {selectedProject.link && (
                  <Button variant="outline" className="w-full" asChild>
                    <a href={selectedProject.link} target="_blank" rel="noopener noreferrer">
                      Launch App
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                )}
              </div>

              <Separator className="my-6" />

              <CommentSection itemId={selectedProject.id} itemType="project" />
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Projects;
