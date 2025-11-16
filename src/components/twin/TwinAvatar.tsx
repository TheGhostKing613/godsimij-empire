import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Flame } from "lucide-react";

interface TwinAvatarProps {
  avatarUrl?: string;
  username: string;
  size?: "sm" | "md" | "lg";
}

export const TwinAvatar = ({ avatarUrl, username, size = "md" }: TwinAvatarProps) => {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-16 w-16"
  };

  return (
    <div className="relative">
      <div className={`${sizeClasses[size]} rounded-full p-[2px] bg-gradient-to-br from-orange-500 via-purple-500 to-cyan-500 animate-pulse`}>
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
    </div>
  );
};