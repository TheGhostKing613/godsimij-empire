import { motion } from "framer-motion";
import { Ghost, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const GhostOS = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5 relative overflow-hidden">
      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-10">
        <motion.div
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="w-full h-full"
          style={{
            backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"100\" height=\"100\" viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cpath d=\"M0 0L100 100M100 0L0 100\" stroke=\"%23c0c0c0\" stroke-width=\"0.3\" fill=\"none\"/%3E%3C/svg%3E')",
            backgroundSize: "100px 100px",
          }}
        />
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <Link to="/realms">
          <Button variant="outline" className="mb-8 border-secondary/30">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Realms
          </Button>
        </Link>

        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.8 }}
            transition={{ duration: 0.5 }}
          >
            <Ghost className="w-32 h-32 text-secondary animate-pulse" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-7xl font-black text-secondary text-center"
          >
            GhostOS
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
            <div className="w-3 h-3 rounded-full bg-secondary" />
            <span className="text-sm text-secondary">Phantom Protocols Activating</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-secondary/10 border border-secondary/30 rounded-lg p-6 max-w-2xl"
          >
            <p className="text-muted-foreground text-center">
              GhostOS provides invisible infrastructure for secure communications across the Empire.
              Phantom-level encryption and routing protocols keep our data sovereign and untraceable.
              <br />
              <br />
              <span className="text-secondary font-semibold">Status: Development Mode</span>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default GhostOS;
