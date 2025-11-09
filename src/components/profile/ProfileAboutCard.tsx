import { formatDistanceToNow } from 'date-fns';
import { MapPin, Link as LinkIcon, Twitter, Github, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ProfileAboutCardProps {
  profile: {
    bio?: string | null;
    location?: string | null;
    website?: string | null;
    twitter_handle?: string | null;
    github_handle?: string | null;
    created_at: string;
  };
}

export function ProfileAboutCard({ profile }: ProfileAboutCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">About</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {profile.bio && <p className="text-sm">{profile.bio}</p>}

        <div className="space-y-2 text-sm">
          {profile.location && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span>{profile.location}</span>
            </div>
          )}

          {profile.website && (
            <div className="flex items-center gap-2">
              <LinkIcon className="w-4 h-4 flex-shrink-0 text-muted-foreground" />
              <a
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary truncate"
              >
                {new URL(profile.website).hostname}
              </a>
            </div>
          )}

          {profile.twitter_handle && (
            <div className="flex items-center gap-2">
              <Twitter className="w-4 h-4 flex-shrink-0 text-muted-foreground" />
              <a
                href={`https://twitter.com/${profile.twitter_handle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary"
              >
                @{profile.twitter_handle}
              </a>
            </div>
          )}

          {profile.github_handle && (
            <div className="flex items-center gap-2">
              <Github className="w-4 h-4 flex-shrink-0 text-muted-foreground" />
              <a
                href={`https://github.com/${profile.github_handle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary"
              >
                {profile.github_handle}
              </a>
            </div>
          )}

          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-4 h-4 flex-shrink-0" />
            <span>
              Joined {formatDistanceToNow(new Date(profile.created_at), { addSuffix: true })}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
