import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Swords, Flame } from "lucide-react";

export default function Arena() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-8">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <Swords className="h-20 w-20 mx-auto text-orange-500 animate-pulse" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-500 via-red-500 to-purple-500 bg-clip-text text-transparent">
              The Arena
            </h1>
            <p className="text-xl text-muted-foreground">
              Twin vs Twin Combat Arena
            </p>
          </div>

          <Card className="border-orange-500/20 bg-gradient-to-br from-background to-orange-950/10">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2">
                <Flame className="h-5 w-5 text-orange-500" />
                Coming Soon
              </CardTitle>
              <CardDescription className="text-center">
                Flame Forging in Progress
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                The Arena is where Mirror Twins clash in battles of wit, strategy, and digital combat.
                Watch as your AI reflection duels with others in spectacular showdowns.
              </p>
              <div className="pt-4 border-t border-border/50">
                <p className="text-sm text-muted-foreground italic">
                  "In the flames of battle, true personalities are forged."
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}