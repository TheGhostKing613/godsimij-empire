import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Zap } from "lucide-react";

interface AiCompanionProps {
  name: string;
  role: string;
  description: string;
  specialty: string;
  onSummon: () => void;
  isLoading?: boolean;
}

const AiCompanion = ({ name, role, description, specialty, onSummon, isLoading }: AiCompanionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-card/50 border-primary/20 hover:border-primary/60 transition-all group h-full">
        <CardHeader>
          <div className="flex items-start justify-between mb-2">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary group-hover:animate-pulse-glow" />
                <CardTitle className="text-2xl">{name}</CardTitle>
              </div>
              <p className="text-sm text-secondary">{role}</p>
            </div>
            <span className="text-xs px-2 py-1 rounded bg-primary/20 text-primary">
              {specialty}
            </span>
          </div>
          <CardDescription className="text-base">{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            className="w-full bg-primary hover:bg-primary/90"
            onClick={onSummon}
            disabled={isLoading}
          >
            <Zap className="w-4 h-4 mr-2" />
            {isLoading ? "Connecting..." : `Summon ${name}`}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AiCompanion;
