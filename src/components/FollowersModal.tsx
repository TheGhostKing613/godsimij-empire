import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getFollowers } from '@/api/profiles';
import TierBadge from './TierBadge';

interface FollowersModalProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function FollowersModal({ userId, isOpen, onClose }: FollowersModalProps) {
  const { data: followers, isLoading } = useQuery({
    queryKey: ['followers', userId],
    queryFn: () => getFollowers(userId),
    enabled: isOpen && !!userId,
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[600px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Followers</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : followers && followers.length > 0 ? (
          <div className="space-y-4">
            {followers.map((follower: any) => (
              <div key={follower.follower_id} className="flex items-center gap-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={follower.profiles?.avatar_url} />
                  <AvatarFallback className="bg-primary/10">
                    {follower.profiles?.full_name?.[0]?.toUpperCase() || '?'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/profile/${follower.profiles?.id}`}
                      className="font-semibold hover:underline truncate"
                      onClick={onClose}
                    >
                      {follower.profiles?.full_name}
                    </Link>
                    {follower.profiles?.tier && (
                      <TierBadge tier={follower.profiles.tier} size="sm" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {follower.profiles?.email}
                  </p>
                </div>
                <Button size="sm" variant="outline" asChild onClick={onClose}>
                  <Link to={`/profile/${follower.profiles?.id}`}>View</Link>
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">No followers yet</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
