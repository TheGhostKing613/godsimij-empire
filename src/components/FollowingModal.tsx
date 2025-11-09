import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getFollowing } from '@/api/profiles';
import TierBadge from './TierBadge';

interface FollowingModalProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function FollowingModal({ userId, isOpen, onClose }: FollowingModalProps) {
  const { data: following, isLoading } = useQuery({
    queryKey: ['following', userId],
    queryFn: () => getFollowing(userId),
    enabled: isOpen && !!userId,
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[600px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Following</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : following && following.length > 0 ? (
          <div className="space-y-4">
            {following.map((followed: any) => (
              <div key={followed.following_id} className="flex items-center gap-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={followed.profiles?.avatar_url} />
                  <AvatarFallback className="bg-primary/10">
                    {followed.profiles?.full_name?.[0]?.toUpperCase() || '?'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/profile/${followed.profiles?.id}`}
                      className="font-semibold hover:underline truncate"
                      onClick={onClose}
                    >
                      {followed.profiles?.full_name}
                    </Link>
                    {followed.profiles?.tier && (
                      <TierBadge tier={followed.profiles.tier} size="sm" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {followed.profiles?.email}
                  </p>
                </div>
                <Button size="sm" variant="outline" asChild onClick={onClose}>
                  <Link to={`/profile/${followed.profiles?.id}`}>View</Link>
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">Not following anyone yet</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
