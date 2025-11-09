import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Scroll, Flame } from "lucide-react";

interface ScrollCardProps {
  title: string;
  description: string;
  pages: string;
  status: string;
  onRead?: () => void;
  onDownload?: () => void;
}

const ScrollCard = ({ title, description, pages, status, onRead, onDownload }: ScrollCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
    >
      <Card className="bg-card/50 border-primary/20 hover:border-primary/60 transition-all group">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Scroll className="w-6 h-6 text-primary" />
                <CardTitle className="text-2xl">{title}</CardTitle>
              </div>
              <CardDescription className="text-base">{description}</CardDescription>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="text-sm text-muted-foreground">{pages}</span>
              <span className="text-xs px-2 py-1 rounded bg-primary/20 text-primary">
                {status}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Button 
              variant="default" 
              className="bg-primary hover:bg-primary/90"
              onClick={onRead}
            >
              <Flame className="w-4 h-4 mr-2" />
              Read Scroll
            </Button>
            <Button 
              variant="outline" 
              className="border-primary/30"
              onClick={onDownload}
            >
              Download
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ScrollCard;
