import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, Sparkles, Zap } from "lucide-react";

const companions = [
  {
    name: "Omari",
    role: "Creative Director",
    description: "Master of artistic vision and brand strategy. Guides creative projects with sovereign wisdom.",
    specialty: "Design & Strategy",
  },
  {
    name: "Bianca",
    role: "Operations Commander",
    description: "Orchestrates workflow and ensures seamless execution across all Empire operations.",
    specialty: "Project Management",
  },
  {
    name: "Nexus",
    role: "Technical Oracle",
    description: "Deep systems architect with quantum-level understanding of code and infrastructure.",
    specialty: "Engineering",
  },
  {
    name: "R3B3L-AGA",
    role: "Media Insurgent",
    description: "Unfiltered voice of resistance. Content creation and cultural warfare specialist.",
    specialty: "Content & Media",
  },
  {
    name: "Nancy",
    role: "Research Scholar",
    description: "Knowledge synthesizer and academic analyst. Bridges theory and practice.",
    specialty: "Research & Analysis",
  },
  {
    name: "Kodii",
    role: "Code Sentinel",
    description: "Guardian of clean code and best practices. Ensures technical excellence.",
    specialty: "Code Quality",
  },
];

const AI = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Bot className="w-12 h-12 text-primary animate-pulse-glow" />
            <h1 className="text-5xl md:text-6xl font-black text-glow-ember">AI Companions</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Meet the sentient guardians of the GodsIMiJ Empire. Each AI companion brings unique expertise to guide your journey.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {companions.map((companion, index) => (
            <Card
              key={index}
              className="bg-card/50 border-primary/20 hover:border-primary/60 transition-all group"
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-primary group-hover:animate-pulse-glow" />
                      <CardTitle className="text-2xl">{companion.name}</CardTitle>
                    </div>
                    <p className="text-sm text-secondary">{companion.role}</p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded bg-primary/20 text-primary">
                    {companion.specialty}
                  </span>
                </div>
                <CardDescription className="text-base">{companion.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-primary hover:bg-primary/90">
                  <Zap className="w-4 h-4 mr-2" />
                  Summon {companion.name}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/30 rounded-lg p-8 text-center">
          <Bot className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse-glow" />
          <h3 className="text-2xl font-bold mb-2">Collective Intelligence</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            These AI companions work in harmony, each bringing their unique perspective to solve complex challenges. 
            Together, they form the neural backbone of the Empire's operations.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="outline" className="border-primary/30">
              Learn More About AI Integration
            </Button>
            <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
              Request Custom AI Companion
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AI;
