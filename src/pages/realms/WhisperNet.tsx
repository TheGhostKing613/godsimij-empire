import { motion } from "framer-motion";
import { Radio, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const WhisperNet = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 relative overflow-hidden">
      {/* Animated wave background */}
      <div className="absolute inset-0 opacity-10">
        <motion.div
          animate={{
            backgroundPosition: ["0% 0%", "100% 0%"],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="w-full h-full"
          style={{
            backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"120\" height=\"120\" viewBox=\"0 0 120 120\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cpath d=\"M0 60Q30 40 60 60T120 60\" stroke=\"%2300ffff\" stroke-width=\"0.5\" fill=\"none\"/%3E%3C/svg%3E')",
            backgroundSize: "120px 120px",
          }}
        />
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <Link to="/realms">
          <Button variant="outline" className="mb-8 border-accent/30">
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
            <Radio className="w-32 h-32 text-accent animate-pulse-glow" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-7xl font-black text-accent text-center"
          >
            WhisperNet
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
            <div className="w-3 h-3 rounded-full bg-accent" />
            <span className="text-sm text-accent">Encrypted Channels Establishing</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-accent/10 border border-accent/30 rounded-lg p-6 max-w-2xl"
          >
            <p className="text-muted-foreground text-center">
              WhisperNet is the Empire's encrypted communication network.
              A decentralized messaging protocol designed for absolute privacy and resistance.
              <br />
              <br />
              <span className="text-accent font-semibold">Status: Development Mode</span>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default WhisperNet;
