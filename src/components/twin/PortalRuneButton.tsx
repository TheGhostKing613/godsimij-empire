import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, Unlock, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface PortalRuneButtonProps {
  portal: {
    name: string;
    unlocked: boolean;
    level_required: number;
  };
  onClick: () => void;
}

export const PortalRuneButton = ({ portal, onClick }: PortalRuneButtonProps) => {
  const isUnlocked = portal.unlocked;

  return (
    <motion.div
      whileHover={{ scale: isUnlocked ? 1.05 : 1.02 }}
      whileTap={{ scale: 0.95 }}
    >
      <Card
        className={cn(
          "relative overflow-hidden border-2 cursor-pointer transition-all",
          isUnlocked
            ? "border-primary/50 shadow-lg shadow-primary/20"
            : "border-muted opacity-60"
        )}
        onClick={onClick}
      >
        {/* Animated background for unlocked portals */}
        {isUnlocked && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-purple-500/10 to-cyan-500/10"
            animate={{
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}

        {/* Cracked rune pattern for locked */}
        {!isUnlocked && (
          <div className="absolute inset-0 opacity-20">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <path
                d="M50,10 L90,30 L90,70 L50,90 L10,70 L10,30 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="5,5"
              />
            </svg>
          </div>
        )}

        {/* Glowing gateway for unlocked */}
        {isUnlocked && (
          <motion.div
            className="absolute inset-0"
            animate={{
              boxShadow: [
                "inset 0 0 20px rgba(249, 115, 22, 0.3)",
                "inset 0 0 40px rgba(168, 85, 247, 0.3)",
                "inset 0 0 20px rgba(249, 115, 22, 0.3)",
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}

        <CardContent className="relative pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold">{portal.name}</h3>
            {isUnlocked ? (
              <Unlock className="h-5 w-5 text-primary animate-pulse" />
            ) : (
              <Lock className="h-5 w-5 text-muted-foreground" />
            )}
          </div>

          <div className="flex items-center gap-2">
            <Badge variant={isUnlocked ? "default" : "secondary"}>
              {isUnlocked ? (
                <>
                  <Sparkles className="mr-1 h-3 w-3" />
                  Unlocked
                </>
              ) : (
                <>
                  <Lock className="mr-1 h-3 w-3" />
                  Requires Lv. {portal.level_required}
                </>
              )}
            </Badge>
          </div>

          {isUnlocked && (
            <motion.div
              className="text-xs text-primary"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ✦ Portal Active ✦
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
