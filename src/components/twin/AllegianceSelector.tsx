import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame, Zap, Wind, Ghost } from "lucide-react";
import { cn } from "@/lib/utils";

interface AllegianceSelectorProps {
  selected: string | null;
  onSelect: (allegiance: string) => void;
}

const ALLEGIANCES = [
  {
    name: 'Solar Flame',
    icon: Flame,
    color: 'from-orange-500 to-yellow-500',
    borderColor: 'border-orange-500/30',
    description: 'Path of radiance and purification'
  },
  {
    name: 'Voidflame',
    icon: Ghost,
    color: 'from-purple-500 to-black',
    borderColor: 'border-purple-500/30',
    description: 'Path of shadow and mystery'
  },
  {
    name: 'Stormflame',
    icon: Zap,
    color: 'from-cyan-500 to-blue-500',
    borderColor: 'border-cyan-500/30',
    description: 'Path of chaos and transformation'
  },
  {
    name: 'Whisperflame',
    icon: Wind,
    color: 'from-green-500 to-teal-500',
    borderColor: 'border-green-500/30',
    description: 'Path of wisdom and harmony'
  }
];

export const AllegianceSelector = ({ selected, onSelect }: AllegianceSelectorProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {ALLEGIANCES.map((allegiance) => {
        const Icon = allegiance.icon;
        const isSelected = selected === allegiance.name;
        
        return (
          <Card
            key={allegiance.name}
            className={cn(
              "relative overflow-hidden border-2 cursor-pointer transition-all hover:scale-105",
              allegiance.borderColor,
              isSelected ? "ring-2 ring-primary shadow-lg" : ""
            )}
            onClick={() => onSelect(allegiance.name)}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${allegiance.color} opacity-10`} />
            
            <CardContent className="relative pt-6 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${allegiance.color}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{allegiance.name}</h3>
                    <p className="text-xs text-muted-foreground">{allegiance.description}</p>
                  </div>
                </div>
                {isSelected && (
                  <Badge className="bg-gradient-to-r from-orange-500 to-purple-500">
                    Selected
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
