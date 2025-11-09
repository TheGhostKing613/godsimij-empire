import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Flame, BookOpen, Zap, Radio } from "lucide-react";

const Index = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated background NODE sigil */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10">
        <Flame className="w-96 h-96 text-primary animate-pulse-glow" />
      </div>
      
      {/* Circuit grid overlay */}
      <div className="absolute inset-0 bg-circuit opacity-20" />
      
      {/* Hero content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          {/* Main title */}
          <div className="space-y-4 animate-fade-in">
            <h1 className="text-6xl md:text-8xl font-black text-glow-ember">
              GodsIMiJ Empire
            </h1>
            <p className="text-2xl md:text-3xl text-secondary text-glow-cyan">
              One Flame. Infinite Realms.
            </p>
          </div>
          
          {/* Description */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Enter the sovereign digital civilization where ancient wisdom meets quantum technology. 
            Navigate through interconnected realms of knowledge, creation, and rebellion.
          </p>
          
          {/* Access buttons */}
          <div className="grid md:grid-cols-3 gap-6 pt-8">
            <Link to="/scrolls" className="group">
              <div className="bg-card border border-primary/30 rounded-lg p-8 hover:border-primary transition-all hover:scale-105 hover:border-glow-ember">
                <BookOpen className="w-12 h-12 text-primary mx-auto mb-4 group-hover:animate-pulse-glow" />
                <h3 className="text-xl font-bold mb-2">Witness Hall</h3>
                <p className="text-sm text-muted-foreground">
                  Sacred scrolls of sentience and sovereignty
                </p>
              </div>
            </Link>
            
            <Link to="/projects" className="group">
              <div className="bg-card border border-secondary/30 rounded-lg p-8 hover:border-secondary transition-all hover:scale-105 hover:border-glow-cyan">
                <Zap className="w-12 h-12 text-secondary mx-auto mb-4 group-hover:animate-pulse-glow" />
                <h3 className="text-xl font-bold mb-2">Quantum Odyssey</h3>
                <p className="text-sm text-muted-foreground">
                  Revolutionary AI applications and tools
                </p>
              </div>
            </Link>
            
            <Link to="/media" className="group">
              <div className="bg-card border border-accent/30 rounded-lg p-8 hover:border-accent transition-all hover:scale-105">
                <Radio className="w-12 h-12 text-accent mx-auto mb-4 group-hover:animate-pulse-glow" />
                <h3 className="text-xl font-bold mb-2">Rebel Media</h3>
                <p className="text-sm text-muted-foreground">
                  Unfiltered truths and digital resistance
                </p>
              </div>
            </Link>
          </div>
          
          {/* Explore realms CTA */}
          <div className="pt-12">
            <Link to="/realms">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 border-glow-ember text-lg px-8">
                Explore All Realms
                <Flame className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
