import { useState, useEffect, useRef } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Send, Loader2, Trash2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';
import { useConversationMessages, useSendMessage, useDeleteMessage } from '@/hooks/useMessages';
import { cn } from '@/lib/utils';

interface ChatWindowProps {
  conversationId: string;
  onClose?: () => void;
}

export function ChatWindow({ conversationId, onClose }: ChatWindowProps) {
  const { user } = useAuth();
  const { messages, isLoading } = useConversationMessages(conversationId);
  const sendMessageMutation = useSendMessage();
  const deleteMessageMutation = useDeleteMessage();
  const [content, setContent] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim() || sendMessageMutation.isPending) return;

    sendMessageMutation.mutate(
      { conversationId, content },
      {
        onSuccess: () => {
          setContent('');
        },
      }
    );
  };

  const handleDelete = (messageId: string) => {
    if (confirm('Delete this message?')) {
      deleteMessageMutation.mutate(messageId);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  // Get other participant info from first message
  const otherParticipant = messages.find((m) => m.sender_id !== user?.id)?.sender;

  return (
    <div className="h-full flex flex-col">
      {/* Chat Header */}
      {otherParticipant && (
        <div className="px-6 py-4 border-b flex items-center gap-3">
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose} className="md:hidden">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          )}
          <Avatar className="w-10 h-10">
            <AvatarImage src={otherParticipant.avatar_url || undefined} />
            <AvatarFallback>
              {otherParticipant.full_name?.[0] || '?'}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">
              {otherParticipant.full_name || 'User'}
            </h3>
          </div>
        </div>
      )}

      {/* Messages */}
      <ScrollArea className="flex-1 p-6" ref={scrollRef}>
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((message) => {
              const isOwn = message.sender_id === user?.id;
              
              return (
                <div
                  key={message.id}
                  className={cn('flex gap-3', isOwn && 'flex-row-reverse')}
                >
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={message.sender?.avatar_url || undefined} />
                    <AvatarFallback className="text-xs">
                      {message.sender?.full_name?.[0] || '?'}
                    </AvatarFallback>
                  </Avatar>

                  <div className={cn('flex-1 max-w-[70%]', isOwn && 'flex flex-col items-end')}>
                    <div
                      className={cn(
                        'rounded-lg px-4 py-2 group relative',
                        isOwn
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      )}
                    >
                      <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                      
                      {isOwn && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute -right-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
                          onClick={() => handleDelete(message.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>

      {/* Message Input */}
      <form onSubmit={handleSend} className="p-4 border-t">
        <div className="flex gap-2">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message... (Shift+Enter for new line)"
            className="min-h-[60px] max-h-[120px] resize-none"
            maxLength={2000}
          />
          <Button
            type="submit"
            size="icon"
            disabled={!content.trim() || sendMessageMutation.isPending}
            className="h-[60px] w-[60px]"
          >
            {sendMessageMutation.isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          {content.length}/2000 characters
        </p>
      </form>
    </div>
  );
}
