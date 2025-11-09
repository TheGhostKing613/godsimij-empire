import { TrendingUp } from 'lucide-react';

interface TrendingCategoryCardProps {
  category: {
    id: string;
    name: string;
    icon: string;
    color: string;
    count: number;
  };
}

export default function TrendingCategoryCard({ category }: TrendingCategoryCardProps) {
  return (
    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
      <div className="flex items-center gap-2">
        <span className="text-lg">{category.icon}</span>
        <div>
          <p className="font-medium text-sm">{category.name}</p>
          <p className="text-xs text-muted-foreground">{category.count} posts this week</p>
        </div>
      </div>
      <TrendingUp className="w-4 h-4 text-primary" />
    </div>
  );
}
