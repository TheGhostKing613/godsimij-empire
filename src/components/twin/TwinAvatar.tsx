import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Flame } from "lucide-react";

interface TwinAvatarProps {
  avatarUrl?: string;
  username: string;
  size?: "sm" | "md" | "lg";
  currentState?: 'idle' | 'evolving' | 'training' | 'active' | 'shadow';
}

export const TwinAvatar = ({ avatarUrl, username, size = "md", currentState = 'idle' }: TwinAvatarProps) => {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-16 w-16"
  };

  const getAuraAnimation = () => {
    switch (currentState) {
      case 'training':
        return 'animate-pulse from-cyan-500 via-blue-500 to-cyan-500';
      case 'evolving':
        return 'animate-pulse from-orange-500 via-red-500 to-orange-500';
      case 'active':
        return 'from-white/80 via-silver/60 to-white/80';
      case 'shadow':
        return 'animate-pulse from-purple-500 via-violet-500 to-purple-500';
      default:
        return 'from-orange-500 via-purple-500 to-cyan-500';
    }
  };

  return (
    <div className="relative">
      <div className={`${sizeClasses[size]} rounded-full p-[2px] bg-gradient-to-br ${getAuraAnimation()}`}>
        <Avatar className={`${sizeClasses[size]} border-2 border-background`}>
          <AvatarImage src={avatarUrl} alt={username} />
          <AvatarFallback className="bg-gradient-to-br from-orange-500/20 to-cyan-500/20 text-primary font-bold">
            {username.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="absolute -bottom-1 -right-1 bg-gradient-to-br from-orange-500 to-cyan-500 rounded-full p-1">
        <Flame className="h-3 w-3 text-white" />
      </div>
      
      {/* Aura ring effect */}
      {currentState !== 'idle' && (
        <div className={`absolute inset-0 -z-10 blur-md opacity-50 rounded-full bg-gradient-to-br ${getAuraAnimation()}`} />
      )}
    </div>
  );
};