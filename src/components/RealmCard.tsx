import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface RealmCardProps {
  name: string;
  description: string;
  icon: LucideIcon;
  link?: string;
  status?: string;
  onClick?: () => void;
}

const RealmCard = ({ name, description, icon: Icon, link, status, onClick }: RealmCardProps) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (link) {
      window.location.href = link;
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card
        className="bg-card/50 border-primary/20 hover:border-primary/60 transition-all cursor-pointer group h-full"
        onClick={handleClick}
      >
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <Icon className="w-8 h-8 text-primary group-hover:animate-pulse-glow" />
            <CardTitle className="text-xl">{name}</CardTitle>
          </div>
          {status && (
            <span className="text-xs px-2 py-1 rounded bg-primary/20 text-primary w-fit">
              {status}
            </span>
          )}
          <CardDescription>{description}</CardDescription>
        </CardHeader>
      </Card>
    </motion.div>
  );
};

export default RealmCard;
