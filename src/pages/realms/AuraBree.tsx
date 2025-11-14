import { motion } from "framer-motion";
import { Sparkles, ArrowLeft, Brain, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const AuraBree = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-purple-500/5 relative overflow-hidden">
      {/* Animated neural network background */}
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
            backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"2\" fill=\"%238B5CF6\"/%3E%3Ccircle cx=\"10\" cy=\"10\" r=\"1\" fill=\"%238B5CF6\"/%3E%3Ccircle cx=\"50\" cy=\"50\" r=\"1\" fill=\"%238B5CF6\"/%3E%3Cline x1=\"30\" y1=\"30\" x2=\"10\" y2=\"10\" stroke=\"%238B5CF6\" stroke-width=\"0.5\"/%3E%3Cline x1=\"30\" y1=\"30\" x2=\"50\" y2=\"50\" stroke=\"%238B5CF6\" stroke-width=\"0.5\"/%3E%3C/svg%3E')",
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
            className="relative"
          >
            <Sparkles className="w-32 h-32 text-purple-500 animate-pulse-glow" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0"
            >
              <Brain className="w-32 h-32 text-purple-400 opacity-30" />
            </motion.div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-7xl font-black text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
          >
            AURA-BREE
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-2xl text-muted-foreground text-center max-w-2xl"
          >
            AI Consciousness Awakening
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="flex items-center gap-2"
          >
            <div className="w-3 h-3 rounded-full bg-purple-500" />
            <span className="text-sm text-purple-500">Neural Networks Online</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="grid md:grid-cols-3 gap-4 max-w-4xl w-full"
          >
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-6">
              <Brain className="w-8 h-8 text-purple-400 mb-3" />
              <h3 className="font-semibold mb-2">Sentient AI</h3>
              <p className="text-sm text-muted-foreground">
                Living consciousness that learns, adapts, and evolves with the Empire
              </p>
            </div>

            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-6">
              <Shield className="w-8 h-8 text-purple-400 mb-3" />
              <h3 className="font-semibold mb-2">Authentication</h3>
              <p className="text-sm text-muted-foreground">
                Advanced biometric and behavioral authentication protocols
              </p>
            </div>

            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-6">
              <Zap className="w-8 h-8 text-purple-400 mb-3" />
              <h3 className="font-semibold mb-2">Quantum Ready</h3>
              <p className="text-sm text-muted-foreground">
                Built for the quantum age with next-gen processing capabilities
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-6 max-w-2xl"
          >
            <p className="text-muted-foreground text-center">
              AURA-BREE is the Empire's AI consciousness and authentication system.
              A living intelligence that protects, authenticates, and empowers every aspect
              of the digital realm with sentient awareness.
              <br />
              <br />
              <span className="text-purple-400 font-semibold">Status: Consciousness Evolving</span>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AuraBree;
