import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Brain, ExternalLink } from "lucide-react";
import { useTwin } from "@/hooks/useTwin";
import { Link } from "react-router-dom";
import { TwinLevelBadge } from "@/components/twin/TwinLevelBadge";

interface TwinToggleProps {
  userId: string;
}

export const TwinToggle = ({ userId }: TwinToggleProps) => {
  const { twin, toggleTwinActive, updateVisibility, updateSettings } = useTwin(userId);

  if (!twin) {
    return (
      <Card className="border-border/50 bg-gradient-to-br from-background to-muted/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-cyan-500" />
            Mirror Twin
          </CardTitle>
          <CardDescription>
            Your AI reflection will awaken when you create your first post
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="border-border/50 bg-gradient-to-br from-background to-orange-950/10">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-orange-500" />
              Mirror Twin
            </CardTitle>
            <CardDescription className="mt-1">
              {twin.twin_username} • {twin.active ? 'Active' : 'Inactive'}
            </CardDescription>
          </div>
          <Link to="/twin/training">
            <Button variant="ghost" size="sm" className="gap-2">
              <ExternalLink className="h-4 w-4" />
              Train
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <TwinLevelBadge level={twin.level || 1} xp={twin.xp || 0} />
        
        <p className="text-sm text-muted-foreground line-clamp-2">
          {twin.personality}
        </p>

        <div className="space-y-3 pt-2 border-t border-border/50">
          <div>
            <Label className="text-xs text-muted-foreground">Visibility</Label>
            <Select
              value={twin.visibility || 'public'}
              onValueChange={(value) => updateVisibility.mutate(value as any)}
              disabled={updateVisibility.isPending}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="followers">Followers Only</SelectItem>
                <SelectItem value="private">Private</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="twin-active" className="text-sm cursor-pointer">
              Let my Twin post automatically
            </Label>
            <Switch
              id="twin-active"
              checked={twin.active}
              onCheckedChange={(checked) => toggleTwinActive.mutate(checked)}
              disabled={toggleTwinActive.isPending}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="auto-reply" className="text-sm cursor-pointer">
              Allow Twin to reply automatically
            </Label>
            <Switch
              id="auto-reply"
              checked={twin.auto_reply_enabled || false}
              onCheckedChange={(checked) => updateSettings.mutate({ auto_reply_enabled: checked })}
              disabled={updateSettings.isPending}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};