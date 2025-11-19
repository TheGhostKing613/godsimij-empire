import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Sparkles, Zap } from "lucide-react";

interface LevelUpAnimationProps {
  show: boolean;
  level: number;
  onComplete: () => void;
}

export const LevelUpAnimation = ({ show, level, onComplete }: LevelUpAnimationProps) => {
  const [isVisible, setIsVisible] = useState(show);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        onComplete();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm"
        >
          <div className="relative">
            {/* Flame fractals background */}
            <motion.div
              initial={{ scale: 0, rotate: 0 }}
              animate={{ scale: 1.5, rotate: 360 }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="absolute inset-0 -z-10"
            >
              <div className="absolute inset-0 bg-gradient-radial from-orange-500/30 via-purple-500/20 to-transparent animate-pulse" />
            </motion.div>

            {/* Twin silhouette */}
            <motion.div
              initial={{ y: 100, opacity: 0, scale: 0.5 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="relative space-y-6 text-center"
            >
              {/* Level number with glow */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, delay: 1 }}
                className="relative mx-auto w-32 h-32 flex items-center justify-center"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-purple-500 rounded-full blur-2xl opacity-60 animate-pulse" />
                <div className="relative z-10 text-6xl font-bold bg-gradient-to-br from-orange-500 to-purple-500 bg-clip-text text-transparent">
                  {level}
                </div>
              </motion.div>

              {/* Level Up text */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-2"
              >
                <h2 className="text-4xl font-bold text-foreground flex items-center justify-center gap-2">
                  <Flame className="h-8 w-8 text-orange-500 animate-pulse" />
                  Level Up!
                  <Sparkles className="h-8 w-8 text-cyan-500 animate-pulse" />
                </h2>
                <p className="text-xl text-muted-foreground">Twin Evolution Complete</p>
              </motion.div>

              {/* Particle effects */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, x: 0, y: 0 }}
                  animate={{
                    scale: [0, 1, 0],
                    x: [0, Math.cos((i * Math.PI) / 4) * 100],
                    y: [0, Math.sin((i * Math.PI) / 4) * 100],
                  }}
                  transition={{ duration: 2, delay: i * 0.1 }}
                  className="absolute top-1/2 left-1/2"
                >
                  <Zap className="h-6 w-6 text-purple-500" />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
