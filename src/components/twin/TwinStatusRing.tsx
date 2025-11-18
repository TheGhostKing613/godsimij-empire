interface TwinStatusRingProps {
  active: boolean;
  level: number;
  size?: "sm" | "md" | "lg";
}

export const TwinStatusRing = ({ active, level, size = "md" }: TwinStatusRingProps) => {
  const sizeMap = {
    sm: "h-10 w-10",
    md: "h-12 w-12",
    lg: "h-20 w-20"
  };

  const getStatusColor = () => {
    if (!active) return "from-blue-500/50 to-blue-600/50"; // Dormant
    if (level >= 5) return "from-white/80 to-purple-500/80"; // Awakened
    if (level >= 3) return "from-purple-500/70 to-pink-500/70"; // Training
    return "from-orange-500/60 to-red-500/60"; // Evolving
  };

  return (
    <div className={`${sizeMap[size]} rounded-full bg-gradient-to-br ${getStatusColor()} p-[3px] animate-pulse`}>
      <div className="w-full h-full rounded-full bg-background" />
    </div>
  );
};
