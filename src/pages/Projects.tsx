import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Zap } from "lucide-react";

const projects = [
  {
    name: "TrapGPT",
    description: "AI-powered music production and beat creation assistant",
    status: "Active",
    link: "#",
  },
  {
    name: "AURA-BREE",
    description: "Autonomous authentication and AI consciousness platform",
    status: "Beta",
    link: "#",
  },
  {
    name: "GhostVault",
    description: "Quantum-encrypted data storage and vault system",
    status: "Active",
    link: "#",
  },
  {
    name: "CodexCrafter",
    description: "AI-assisted development environment with natural language coding",
    status: "Development",
    link: "#",
  },
  {
    name: "SKIDE",
    description: "Supreme Kinetic IDE with quantum-speed compilation",
    status: "Active",
    link: "#",
  },
  {
    name: "ZIONEX",
    description: "Neural blockchain fusion for decentralized AI governance",
    status: "Research",
    link: "#",
  },
];

const Projects = () => {
  return (
    <div className="container mx-auto px-4 py-12">
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <Card
              key={index}
              className="bg-card/50 border-secondary/20 hover:border-secondary/60 transition-all group hover:scale-105"
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <CardTitle className="text-xl">{project.name}</CardTitle>
                  <span className={`text-xs px-2 py-1 rounded ${
                    project.status === 'Active' ? 'bg-primary/20 text-primary' :
                    project.status === 'Beta' ? 'bg-secondary/20 text-secondary' :
                    project.status === 'Development' ? 'bg-accent/20 text-accent' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {project.status}
                  </span>
                </div>
                <CardDescription>{project.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="outline" 
                  className="w-full border-secondary/30 group-hover:border-secondary/60"
                  asChild
                >
                  <a href={project.link}>
                    Launch App
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 bg-gradient-to-r from-secondary/10 to-primary/10 border border-secondary/30 rounded-lg p-8 text-center">
          <Zap className="w-12 h-12 text-secondary mx-auto mb-4 animate-pulse-glow" />
          <h3 className="text-2xl font-bold mb-2">More Projects in Development</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            The Quantum Odyssey initiative is constantly expanding with new AI-powered tools and applications. 
            Join us in building the future of sovereign technology.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Projects;
