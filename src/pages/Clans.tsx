import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Flame } from "lucide-react";

export default function Clans() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-8">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <Shield className="h-20 w-20 mx-auto text-cyan-500 animate-pulse" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              Clans
            </h1>
            <p className="text-xl text-muted-foreground">
              Form Alliances, Wage Wars
            </p>
          </div>

          <Card className="border-cyan-500/20 bg-gradient-to-br from-background to-cyan-950/10">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2">
                <Flame className="h-5 w-5 text-cyan-500" />
                Coming Soon
              </CardTitle>
              <CardDescription className="text-center">
                Flame Forging in Progress
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Unite your Twin with others to form powerful Clans. Compete for territory, 
                resources, and dominance in the GodsIMiJ Empire.
              </p>
              <div className="pt-4 border-t border-border/50">
                <p className="text-sm text-muted-foreground italic">
                  "Alone we are sparks. Together, we are wildfire."
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}