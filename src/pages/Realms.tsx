import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Flame, Ghost, Radio, Lock, Sparkles, Code, Hexagon, Film, BookOpen, Zap } from "lucide-react";
import RealmCard from "@/components/RealmCard";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { PortalRuneButton } from "@/components/twin/PortalRuneButton";
import { useTwin } from "@/hooks/useTwin";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

const portals = [
  { name: "Flame Sanctum", level_required: 3 },
  { name: "Veil Garden", level_required: 5 },
  { name: "Echo Arena", level_required: 7 },
  { name: "Starforge", level_required: 9 },
];

const Realms = () => {
  const { user } = useAuth();
  const { twin } = useTwin(user?.id);
  const [selectedRealm, setSelectedRealm] = useState<typeof realms[0] | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch user unlocks
  const { data: unlocks } = useQuery({
    queryKey: ['user-unlocks', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('user_unlocks')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  // Unlock portal mutation
  const unlockPortal = useMutation({
    mutationFn: async (portal: string) => {
      const { data, error } = await supabase.functions.invoke('unlock-portal', {
        body: { userId: user?.id, portal },
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message);
        queryClient.invalidateQueries({ queryKey: ['user-unlocks', user?.id] });
      } else {
        toast.error(data.reason || 'Portal requirements not met');
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to unlock portal');
    },
  });

  const handleRealmClick = (realm: typeof realms[0]) => {
    if (realm.name === "FlameOS") {
      navigate("/flameos");
    } else if (realm.name === "GhostOS") {
      navigate("/ghostos");
    } else if (realm.name === "WhisperNet") {
      navigate("/whispernet");
    } else if (realm.name === "AURA-BREE") {
      navigate("/aurabree");
    } else {
      setSelectedRealm(realm);
    }
  };

  const handlePortalClick = (portal: typeof portals[0]) => {
    if (!user) {
      toast.error("Sign in to unlock portals");
      return;
    }
    unlockPortal.mutate(portal.name);
  };

  const portalsWithStatus = portals.map(portal => {
    const unlock = unlocks?.find(u => u.portal === portal.name);
    return {
      ...portal,
      unlocked: unlock?.unlocked || false,
    };
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12 space-y-4">
        <h1 className="text-5xl md:text-6xl font-black text-glow-ember">Empire Realms</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Navigate the interconnected nodes of the GodsIMiJ digital civilization
        </p>
      </div>

      {/* Portal Unlock Section */}
      {user && twin && (
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-primary">
            Realm Portals
          </h2>
          <p className="text-center text-muted-foreground mb-8">
            Level up your Twin to unlock mystical gateways
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {portalsWithStatus.map((portal) => (
              <PortalRuneButton
                key={portal.name}
                portal={portal}
                onClick={() => handlePortalClick(portal)}
              />
            ))}
          </div>
        </div>
      )}

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
