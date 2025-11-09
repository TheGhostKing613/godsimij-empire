import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import type { Conversation } from '@/api/messages';

interface ConversationsListProps {
  conversations: Conversation[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function ConversationsList({ conversations, selectedId, onSelect }: ConversationsListProps) {
  const { user } = useAuth();

  const getOtherParticipant = (conv: Conversation) => {
    return conv.participants.find((p) => p.user_id !== user?.id);
  };

  if (conversations.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <p>No conversations yet</p>
        <p className="text-sm mt-2">Start a conversation from a user's profile</p>
      </div>
    );
  }

  return (
    <div className="divide-y">
      {conversations.map((conv) => {
        const otherParticipant = getOtherParticipant(conv);
        const profile = otherParticipant?.profiles;
        
        if (!profile) return null;

        const isSelected = conv.id === selectedId;
        const hasUnread = (conv.unread_count || 0) > 0;

        return (
          <button
            key={conv.id}
            onClick={() => onSelect(conv.id)}
            className={cn(
              'w-full p-4 text-left hover:bg-muted/50 transition-colors',
              isSelected && 'bg-muted',
              hasUnread && 'bg-muted/30'
            )}
          >
            <div className="flex items-start gap-3">
              <Avatar className="w-12 h-12">
                <AvatarImage src={profile.avatar_url || undefined} />
                <AvatarFallback>
                  {profile.full_name?.[0] || profile.email[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className={cn('font-semibold truncate', hasUnread && 'text-primary')}>
                    {profile.full_name || profile.email.split('@')[0]}
                  </h4>
                  {conv.last_message && (
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(conv.last_message.created_at), {
                        addSuffix: true,
                      })}
                    </span>
                  )}
                </div>

                {conv.last_message && (
                  <p
                    className={cn(
                      'text-sm truncate',
                      hasUnread ? 'text-foreground font-medium' : 'text-muted-foreground'
                    )}
                  >
                    {conv.last_message.sender_id === user?.id && 'You: '}
                    {conv.last_message.content}
                  </p>
                )}

                {hasUnread && (
                  <Badge variant="default" className="mt-1 h-5 px-2">
                    {conv.unread_count}
                  </Badge>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
