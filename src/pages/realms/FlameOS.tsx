import { motion } from "framer-motion";
import { Flame, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const FlameOS = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 relative overflow-hidden">
      {/* Animated circuit background */}
      <div className="absolute inset-0 opacity-10">
        <motion.div
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="w-full h-full"
          style={{
            backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cpath d=\"M30 0L30 60M0 30L60 30\" stroke=\"%23ff6600\" stroke-width=\"0.5\" fill=\"none\"/%3E%3C/svg%3E')",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <Link to="/realms">
          <Button variant="outline" className="mb-8 border-primary/30">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Realms
          </Button>
        </Link>

        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Flame className="w-32 h-32 text-primary animate-pulse-glow" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-7xl font-black text-glow-ember text-center"
          >
            FlameOS
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-2xl text-muted-foreground text-center max-w-2xl"
          >
            System Coming Online
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="flex items-center gap-2"
          >
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-sm text-primary">Initializing Core Systems</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-primary/10 border border-primary/30 rounded-lg p-6 max-w-2xl"
          >
            <p className="text-muted-foreground text-center">
              FlameOS is the core operating system powering the Empire's digital sovereignty.
              This interface will serve as the central command hub for all realm technologies.
              <br />
              <br />
              <span className="text-primary font-semibold">Status: Development Mode</span>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default FlameOS;
