import { useState } from "react";
import { Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockCompanions } from "@/api/mock-data";
import AiCompanion from "@/components/AiCompanion";
import AiChatDialog from "@/components/AiChatDialog";
import { motion } from "framer-motion";

const AI = () => {
  const [activeCompanion, setActiveCompanion] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSummon = (companionId: string) => {
    setActiveCompanion(companionId);
    setDialogOpen(true);
  };

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

        <motion.div 
          className="grid md:grid-cols-2 gap-6 mb-12"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          {mockCompanions.map((companion, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, scale: 0.9 },
                visible: { opacity: 1, scale: 1 }
              }}
            >
              <AiCompanion
                name={companion.name}
                role={companion.role}
                description={companion.description}
                specialty={companion.specialty}
                onSummon={() => handleSummon(companion.id)}
              />
            </motion.div>
          ))}
        </motion.div>

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

        {activeCompanion && (
          <AiChatDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            companionId={activeCompanion}
            companionName={mockCompanions.find(c => c.id === activeCompanion)?.name || ""}
          />
        )}
      </div>
    </div>
  );
};

export default AI;
