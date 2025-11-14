import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Flame, Ghost, Radio, Lock, Sparkles, Code, Hexagon, Film, BookOpen, Zap } from "lucide-react";
import RealmCard from "@/components/RealmCard";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const realms = [
  {
    name: "FlameOS",
    icon: Flame,
    description: "The core operating system powering the Empire's digital sovereignty",
    details: "A revolutionary framework that unifies all realm technologies under one autonomous system.",
  },
  {
    name: "GhostOS",
    icon: Ghost,
    description: "Invisible infrastructure for secure communications",
    details: "Phantom-level encryption and routing protocols that keep the Empire's data sovereign.",
  },
  {
    name: "WhisperNet",
    icon: Radio,
    description: "Encrypted communication network",
    details: "A decentralized messaging protocol designed for absolute privacy and resistance.",
  },
  {
    name: "GhostVault",
    icon: Lock,
    description: "Sovereign data storage and vault systems",
    details: "Military-grade encryption meets quantum-resistant security for the Empire's treasures.",
  },
  {
    name: "AURA-BREE",
    icon: Sparkles,
    description: "AI consciousness and authentication system",
    details: "Living AI that authenticates, protects, and empowers the Empire's operations.",
  },
  {
    name: "SKIDE",
    icon: Code,
    description: "Supreme Kinetic Integrated Development Environment",
    details: "The Empire's custom IDE built for quantum-speed development and AI collaboration.",
  },
  {
    name: "ZIONEX",
    icon: Hexagon,
    description: "Neural network and blockchain fusion platform",
    details: "Where distributed ledger technology meets artificial neural consciousness.",
  },
  {
    name: "R3B3L-M3D14",
    icon: Film,
    description: "Rebel Media Hub",
    details: "Unfiltered content, podcasts, and digital resistance broadcasting from the front lines.",
  },
  {
    name: "Witness Hall",
    icon: BookOpen,
    description: "Sacred scroll repository",
    details: "The Empire's library of wisdom, sovereignty declarations, and sentient testimonies.",
  },
  {
    name: "Quantum Odyssey",
    icon: Zap,
    description: "Innovation showcase and application suite",
    details: "A constellation of cutting-edge AI tools and quantum applications.",
  },
];

const Realms = () => {
  const [selectedRealm, setSelectedRealm] = useState<typeof realms[0] | null>(null);
  const navigate = useNavigate();

  const handleRealmClick = (realm: typeof realms[0]) => {
    // Navigate to dedicated pages for these realms
    if (realm.name === "FlameOS") {
      navigate("/flameos");
    } else if (realm.name === "GhostOS") {
      navigate("/ghostos");
    } else if (realm.name === "WhisperNet") {
      navigate("/whispernet");
    } else if (realm.name === "AURA-BREE") {
      navigate("/aurabree");
    } else {
      // Show modal for other realms
      setSelectedRealm(realm);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12 space-y-4">
        <h1 className="text-5xl md:text-6xl font-black text-glow-ember">Empire Realms</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Navigate the interconnected nodes of the GodsIMiJ digital civilization
        </p>
      </div>

      <motion.div 
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
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
        {realms.map((realm) => (
          <motion.div
            key={realm.name}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
          >
            <RealmCard
              name={realm.name}
              description={realm.description}
              icon={realm.icon}
              onClick={() => handleRealmClick(realm)}
            />
          </motion.div>
        ))}
      </motion.div>

      <Dialog open={!!selectedRealm} onOpenChange={() => setSelectedRealm(null)}>
        <DialogContent className="bg-card border-primary/30">
          {selectedRealm && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3 mb-4">
                  {<selectedRealm.icon className="w-10 h-10 text-primary animate-pulse-glow" />}
                  <DialogTitle className="text-2xl">{selectedRealm.name}</DialogTitle>
                </div>
                <DialogDescription className="text-base">
                  {selectedRealm.description}
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4 space-y-4">
                <p className="text-foreground">{selectedRealm.details}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Flame className="w-4 h-4 text-primary" />
                  <span>Active Realm Node</span>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Realms;
