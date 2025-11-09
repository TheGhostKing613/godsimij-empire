import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const IntroSequence = ({ onComplete }: { onComplete: () => void }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const hasSeenIntro = localStorage.getItem("empireIntroSeen");
    
    if (hasSeenIntro) {
      setShow(false);
      onComplete();
      return;
    }

    const timer = setTimeout(() => {
      setShow(false);
      localStorage.setItem("empireIntroSeen", "true");
      onComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
        >
          <motion.h1
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 1.5 }}
            className="text-4xl md:text-6xl font-black text-glow-ember text-center px-4"
          >
            The Empire Has Awakened
          </motion.h1>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IntroSequence;
