import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { REACTION_CONFIG, DEFAULT_REACTION, ReactionType } from '@/config/reactions';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useAudio } from '@/hooks/useAudio';

interface ReactionPickerProps {
  postId: string;
  currentUserReaction?: ReactionType | null;
  reactionCounts: Record<ReactionType, number>;
  onReact: (type: ReactionType) => void;
  disabled?: boolean;
}

const ReactionPicker = ({
  currentUserReaction,
  reactionCounts,
  onReact,
  disabled,
}: ReactionPickerProps) => {
  const [showPicker, setShowPicker] = useState(false);
  const { playReaction } = useAudio();
  
  const totalReactions = Object.values(reactionCounts).reduce((a, b) => a + b, 0);

  const handleQuickReact = () => {
    if (disabled) return;
    if (currentUserReaction === DEFAULT_REACTION) {
      onReact(DEFAULT_REACTION);
    } else {
      onReact(DEFAULT_REACTION);
      playReaction();
    }
  };

  const handleReactionSelect = (type: ReactionType) => {
    onReact(type);
    playReaction();
    setShowPicker(false);
  };

  return (
    <div className="relative">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleQuickReact}
              onMouseEnter={() => setShowPicker(true)}
              onMouseLeave={() => setShowPicker(false)}
              disabled={disabled}
              className={cn(
                'gap-2 transition-all hover:scale-105',
                currentUserReaction && 'bg-primary/10'
              )}
            >
              <span className="text-lg">
                {currentUserReaction
                  ? REACTION_CONFIG[currentUserReaction].icon
                  : REACTION_CONFIG[DEFAULT_REACTION].icon}
              </span>
              {totalReactions > 0 && (
                <span className="text-sm font-semibold">{totalReactions}</span>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <div className="space-y-1">
              {Object.entries(reactionCounts).map(([type, count]) => (
                count > 0 && (
                  <div key={type} className="flex items-center gap-2 text-xs">
                    <span>{REACTION_CONFIG[type as ReactionType].icon}</span>
                    <span>{REACTION_CONFIG[type as ReactionType].label}</span>
                    <span className="font-semibold">{count}</span>
                  </div>
                )
              ))}
              {totalReactions === 0 && <p className="text-xs">Be the first to react!</p>}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <AnimatePresence>
        {showPicker && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            onMouseEnter={() => setShowPicker(true)}
            onMouseLeave={() => setShowPicker(false)}
            className="absolute bottom-full left-0 mb-2 bg-card border border-border rounded-lg shadow-lg p-2 flex gap-1 z-50"
          >
            {Object.entries(REACTION_CONFIG).map(([type, config], index) => (
              <motion.button
                key={type}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleReactionSelect(type as ReactionType)}
                disabled={disabled}
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center text-xl',
                  'hover:bg-accent transition-all hover:scale-125',
                  currentUserReaction === type && 'bg-primary/20 ring-2 ring-primary'
                )}
                title={config.label}
              >
                {config.icon}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReactionPicker;
