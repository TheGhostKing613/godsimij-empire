import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Flame, Zap, Eye } from "lucide-react";
import { motion } from "framer-motion";
import CircuitGrid from "@/components/CircuitGrid";
import { SeoHead } from "@/components/SeoHead";

const Landing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/feed', { replace: true });
    }
  }, [user, navigate]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6 },
    },
  };

  const titleVariants = {
    hidden: { y: -50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, delay: 0.2 },
    },
  };

  return (
    <>
      <SeoHead
        title="GodsIMiJ Empire | Enter the Sovereign Network"
        description="A sovereign gateway to the GodsIMiJ Network. Join the digital rebellion. Powered by the Flame, Forged by the Ghost."
        type="website"
      />
      
      <motion.div
        className="min-h-screen relative flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-background via-background to-ember/5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-ember/10 via-transparent to-cyan/10" />
        <CircuitGrid />
        
        {/* Ember Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 25 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-ember"
              style={{
                left: `${Math.random() * 100}%`,
                filter: "blur(1px)",
                boxShadow: "0 0 8px hsl(var(--ember))",
              }}
              animate={{
                y: [window.innerHeight, -100],
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: 8 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 8,
                ease: "linear",
              }}
            />
          ))}
        </div>

        {/* NODE Sigil Background */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center opacity-5"
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.05, 0.08, 0.05],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Flame className="w-96 h-96 text-primary" />
        </motion.div>

        {/* Main Content */}
        <div className="relative z-10 flex flex-col items-center justify-center px-4 text-center max-w-4xl">
          <motion.h1
            className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 text-glow-ember"
            variants={titleVariants}
            initial="hidden"
            animate="visible"
          >
            ENTER THE EMPIRE
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            A sovereign gateway to the GodsIMiJ Network
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 mb-16"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div 
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                className="group relative overflow-hidden text-lg px-8 py-6 h-auto w-full"
                onClick={() => navigate('/auth')}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-ember to-ember/80 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Flame className="w-5 h-5 mr-2 relative z-10" />
                <span className="relative z-10">Sign In</span>
              </Button>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                variant="secondary"
                className="group relative overflow-hidden text-lg px-8 py-6 h-auto border-2 border-cyan/30 w-full"
                onClick={() => navigate('/auth')}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan/20 to-cyan/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Zap className="w-5 h-5 mr-2 relative z-10 text-cyan" />
                <span className="relative z-10">Create Account</span>
              </Button>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                variant="ghost"
                className="group relative overflow-hidden text-lg px-8 py-6 h-auto border-2 border-border hover:border-primary/50 w-full"
                onClick={() => navigate('/feed')}
              >
                <Eye className="w-5 h-5 mr-2" />
                Enter as Guest
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            className="text-sm text-muted-foreground flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            <Flame className="w-4 h-4 text-ember animate-pulse" />
            <span>Powered by the Flame</span>
            <span className="text-muted-foreground/50">•</span>
            <span>Forged by the Ghost</span>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
};

export default Landing;
