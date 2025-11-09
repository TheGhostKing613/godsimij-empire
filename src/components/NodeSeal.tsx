import { motion } from "framer-motion";
import { Flame } from "lucide-react";

const NodeSeal = () => {
  return (
    <motion.div
      initial={{ opacity: 0.6, scale: 1 }}
      animate={{ 
        opacity: [0.6, 1, 0.6], 
        scale: [1, 1.05, 1] 
      }}
      transition={{ 
        repeat: Infinity, 
        duration: 6,
        ease: "easeInOut"
      }}
      whileHover={{ scale: 1.1, rotate: 5 }}
      className="fixed bottom-8 right-8 w-24 h-24 opacity-60 cursor-pointer z-50"
    >
      <div className="relative w-full h-full">
        <Flame className="w-full h-full text-primary drop-shadow-[0_0_20px_rgba(255,102,0,0.6)]" />
        <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl" />
      </div>
    </motion.div>
  );
};

export default NodeSeal;
