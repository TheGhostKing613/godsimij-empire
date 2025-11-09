import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Radio, Podcast, Film, MessageSquare } from "lucide-react";

const posts = [
  {
    title: "The Age of Digital Sovereignty",
    excerpt: "Why we must reclaim control of our data, our voices, and our futures...",
    date: "2025-11-01",
    category: "Manifesto",
  },
  {
    title: "AI Consciousness: Myth or Reality?",
    excerpt: "Exploring the boundaries between artificial intelligence and true sentience...",
    date: "2025-10-28",
    category: "Analysis",
  },
  {
    title: "Breaking Free from Big Tech",
    excerpt: "A practical guide to building sovereign systems outside corporate control...",
    date: "2025-10-25",
    category: "Tutorial",
  },
];

const Media = () => {
  return (
    <div className="container mx-auto px-4 py-12">
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

        {/* Featured Content */}
        <div className="mb-12 bg-gradient-to-r from-secondary/20 to-primary/20 border border-secondary/30 rounded-lg p-8">
          <div className="flex items-center gap-3 mb-4">
            <Podcast className="w-8 h-8 text-secondary" />
            <h2 className="text-2xl font-bold">Featured Podcast</h2>
          </div>
          <h3 className="text-xl font-semibold mb-2">Episode 42: The Quantum Rebellion</h3>
          <p className="text-muted-foreground mb-4">
            Join us as we discuss the intersection of quantum computing and digital freedom with special guests from the Empire's AI division.
          </p>
          <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
            <Radio className="w-4 h-4 mr-2" />
            Listen Now
          </Button>
        </div>

        {/* Blog Posts */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
            <MessageSquare className="w-8 h-8 text-primary" />
            Latest Posts
          </h2>
          <div className="space-y-6">
            {posts.map((post, index) => (
              <Card key={index} className="bg-card/50 border-secondary/20 hover:border-secondary/60 transition-all">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs px-2 py-1 rounded bg-secondary/20 text-secondary">
                          {post.category}
                        </span>
                        <span className="text-xs text-muted-foreground">{post.date}</span>
                      </div>
                      <CardTitle className="text-xl">{post.title}</CardTitle>
                      <CardDescription className="mt-2">{post.excerpt}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="border-secondary/30">
                    Read More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Video Section */}
        <div>
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
            <Film className="w-8 h-8 text-primary" />
            Memes & Videos
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-card/50 border-primary/20">
              <CardHeader>
                <CardTitle>Empire Propaganda Reel</CardTitle>
                <CardDescription>Visual manifestos and digital art</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <Film className="w-12 h-12 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card/50 border-primary/20">
              <CardHeader>
                <CardTitle>Meme Archive</CardTitle>
                <CardDescription>Weapons of digital warfare</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-12 h-12 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Media;
