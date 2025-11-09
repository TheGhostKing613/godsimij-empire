import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Radio, Podcast, Film, MessageSquare, FileText, Music, Video, Image as ImageIcon, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { SeoHead } from "@/components/SeoHead";
import { SocialShare } from "@/components/SocialShare";
import { CommentSection } from "@/components/CommentSection";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const Media = () => {
  const [mediaItems, setMediaItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMedia, setSelectedMedia] = useState<any>(null);
  const { toast } = useToast();

  const itemsPerPage = 12;
  const totalPages = Math.ceil(mediaItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentMediaItems = mediaItems.slice(startIndex, endIndex);

  useEffect(() => {
    loadMedia();
  }, []);

  const loadMedia = async () => {
    try {
      const { data, error } = await supabase
        .from('media')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      setMediaItems(data || []);
    } catch (error: any) {
      console.error("Error loading media:", error);
      toast({
        title: "Error",
        description: "Failed to load media items",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getMediaIcon = (type: string) => {
    switch (type) {
      case 'blog':
        return <FileText className="w-5 h-5" />;
      case 'podcast':
        return <Music className="w-5 h-5" />;
      case 'video':
        return <Video className="w-5 h-5" />;
      case 'meme':
        return <ImageIcon className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (type: string) => {
    switch (type) {
      case 'blog':
        return 'bg-blue-500/20 text-blue-500';
      case 'podcast':
        return 'bg-purple-500/20 text-purple-500';
      case 'video':
        return 'bg-red-500/20 text-red-500';
      case 'meme':
        return 'bg-green-500/20 text-green-500';
      default:
        return 'bg-secondary/20 text-secondary';
    }
  };
  return (
    <div className="container mx-auto px-4 py-12">
      <SeoHead
        title="Rebel Media Hub - Unfiltered Voices"
        description="Unfiltered voices from the digital resistance. Explore blogs, podcasts, videos, and memes from independent creators."
        url="/media"
      />
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12 space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Radio className="w-12 h-12 text-secondary animate-pulse-glow" />
            <h1 className="text-5xl md:text-6xl font-black text-glow-cyan">Rebel Media Hub</h1>
          </div>
          <p className="text-xl text-muted-foreground">
            Unfiltered voices from the digital resistance
          </p>
        </div>

        {loading ? (
          <div className="space-y-8">
            <Skeleton className="h-64" />
            <div className="grid md:grid-cols-2 gap-6">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-48" />
              ))}
            </div>
          </div>
        ) : mediaItems.length === 0 ? (
          <div className="text-center py-12 bg-card/50 border border-secondary/20 rounded-lg">
            <Radio className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No media content yet. Check back soon!</p>
          </div>
        ) : (
          <>
            {/* Featured Content */}
            {currentMediaItems.some(item => item.type === 'podcast' || item.type === 'video') && (
              <div className="mb-12 bg-gradient-to-r from-secondary/20 to-primary/20 border border-secondary/30 rounded-lg p-8">
                {(() => {
                  const featured = currentMediaItems.find(item => item.type === 'podcast' || item.type === 'video');
                  return featured ? (
                    <>
                      <div className="flex items-center gap-3 mb-4">
                        {getMediaIcon(featured.type)}
                        <h2 className="text-2xl font-bold">Featured {featured.type}</h2>
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{featured.title}</h3>
                      <p className="text-muted-foreground mb-4">
                        {featured.content.substring(0, 200)}...
                      </p>
                      {featured.file_url && featured.type === 'video' && (
                        <video src={featured.file_url} controls className="w-full rounded-lg mb-4" />
                      )}
                      {(featured.embed_url || featured.file_url) && (
                        <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90" asChild>
                          <a href={featured.embed_url || featured.file_url} target="_blank" rel="noopener noreferrer">
                            <Radio className="w-4 h-4 mr-2" />
                            {featured.type === 'podcast' ? 'Listen Now' : 'Watch Now'}
                          </a>
                        </Button>
                      )}
                    </>
                  ) : null;
                })()}
              </div>
            )}

            {/* Blog Posts */}
            {currentMediaItems.some(item => item.type === 'blog') && (
              <div className="mb-12">
                <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
                  <MessageSquare className="w-8 h-8 text-primary" />
                  Latest Posts
                </h2>
                <div className="space-y-6">
                  {currentMediaItems.filter(item => item.type === 'blog').map((post) => (
                    <Card key={post.id} className="bg-card/50 border-secondary/20 hover:border-secondary/60 transition-all">
                      {post.file_url && (
                        <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                          <img src={post.file_url} alt={post.title} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`text-xs px-2 py-1 rounded ${getCategoryColor(post.type)}`}>
                                Blog
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(post.date).toLocaleDateString()}
                              </span>
                            </div>
                            <CardTitle className="text-xl">{post.title}</CardTitle>
                            {post.author && (
                              <p className="text-sm text-muted-foreground mt-1">by {post.author}</p>
                            )}
                            <CardDescription className="mt-2">
                              {post.content.substring(0, 150)}...
                            </CardDescription>
                          </div>
                          <SocialShare
                            url={`${window.location.origin}/media#${post.id}`}
                            title={post.title}
                            description={post.content.substring(0, 150)}
                          />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex gap-2">
                          {post.embed_url && (
                            <Button variant="outline" className="border-secondary/30 flex-1" asChild>
                              <a href={post.embed_url} target="_blank" rel="noopener noreferrer">
                                Read More
                              </a>
                            </Button>
                          )}
                          <Button
                            variant="secondary"
                            className="flex-1"
                            onClick={() => setSelectedMedia(post)}
                          >
                            Comments
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Video Section */}
            {currentMediaItems.some(item => item.type === 'meme' || item.type === 'video') && (
              <div>
                <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
                  <Film className="w-8 h-8 text-primary" />
                  Memes & Videos
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {currentMediaItems.filter(item => item.type === 'meme' || item.type === 'video').map((item) => (
                    <Card key={item.id} className="bg-card/50 border-primary/20 overflow-hidden group hover:border-primary/40 transition-colors">
                      {item.file_url ? (
                        <div className="aspect-square bg-muted overflow-hidden">
                          <img
                            src={item.file_url}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                      ) : (
                        <div className="aspect-square bg-muted flex items-center justify-center">
                          {getMediaIcon(item.type)}
                        </div>
                      )}
                      <CardContent className="p-4">
                        <h3 className="font-medium text-sm mb-2 line-clamp-2">{item.title}</h3>
                        <div className="space-y-2">
                          {(item.embed_url || item.file_url) && (
                            <Button variant="ghost" size="sm" className="w-full" asChild>
                              <a href={item.embed_url || item.file_url} target="_blank" rel="noopener noreferrer">
                                View
                              </a>
                            </Button>
                          )}
                          <Button
                            variant="secondary"
                            size="sm"
                            className="w-full"
                            onClick={() => setSelectedMedia(item)}
                          >
                            Comments
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {totalPages > 1 && (
              <div className="mt-12">
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
      </div>

      {/* Media Details Dialog */}
      <Dialog open={!!selectedMedia} onOpenChange={() => setSelectedMedia(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          {selectedMedia && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <DialogTitle className="text-2xl">{selectedMedia.title}</DialogTitle>
                    <DialogDescription>
                      {selectedMedia.author && `by ${selectedMedia.author} • `}
                      {new Date(selectedMedia.date).toLocaleDateString()}
                    </DialogDescription>
                  </div>
                  <SocialShare
                    url={`${window.location.origin}/media#${selectedMedia.id}`}
                    title={selectedMedia.title}
                    description={selectedMedia.content.substring(0, 150)}
                  />
                </div>
              </DialogHeader>

              {selectedMedia.file_url && (
                <div className="w-full overflow-hidden rounded-lg">
                  {selectedMedia.type === 'video' ? (
                    <video src={selectedMedia.file_url} controls className="w-full" />
                  ) : (
                    <img
                      src={selectedMedia.file_url}
                      alt={selectedMedia.title}
                      className="w-full object-cover"
                    />
                  )}
                </div>
              )}

              <div className="prose prose-invert max-w-none">
                <p>{selectedMedia.content}</p>
              </div>

              {(selectedMedia.embed_url || selectedMedia.file_url) && (
                <Button variant="outline" className="w-full" asChild>
                  <a href={selectedMedia.embed_url || selectedMedia.file_url} target="_blank" rel="noopener noreferrer">
                    {selectedMedia.type === 'blog' ? 'Read Full Article' : 'View Original'}
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </Button>
              )}

              <Separator className="my-6" />

              <CommentSection itemId={selectedMedia.id} itemType="media" />
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Media;
