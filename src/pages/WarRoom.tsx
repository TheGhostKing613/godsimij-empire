import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Flame } from "lucide-react";

export default function WarRoom() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-8">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <Target className="h-20 w-20 mx-auto text-purple-500 animate-pulse" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent">
              War Room
            </h1>
            <p className="text-xl text-muted-foreground">
              Strategic Command Center
            </p>
          </div>

          <Card className="border-purple-500/20 bg-gradient-to-br from-background to-purple-950/10">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2">
                <Flame className="h-5 w-5 text-purple-500" />
                Coming Soon
              </CardTitle>
              <CardDescription className="text-center">
                Flame Forging in Progress
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Plan your strategies, coordinate attacks, and manage your Clan's warfare operations
                from this central command hub.
              </p>
              <div className="pt-4 border-t border-border/50">
                <p className="text-sm text-muted-foreground italic">
                  "Every war is won before the first battle begins."
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}