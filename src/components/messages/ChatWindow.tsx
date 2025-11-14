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
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Get other participant info from first message
  const otherParticipant = messages.find((m) => m.sender_id !== user?.id)?.sender;

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Chat Header */}
      {otherParticipant && (
        <div className="px-6 py-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center gap-3">
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose} className="md:hidden">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          )}
          <Avatar className="w-10 h-10 border-2 border-primary/20">
            <AvatarImage src={otherParticipant.avatar_url || undefined} />
            <AvatarFallback className="bg-primary/10">
              {otherParticipant.full_name?.[0] || '?'}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-foreground">
              {otherParticipant.full_name || 'User'}
            </h3>
            <p className="text-xs text-muted-foreground">Active now</p>
          </div>
        </div>
      )}

      {/* Messages */}
      <ScrollArea className="flex-1 p-6" ref={scrollRef}>
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">
              <p className="text-lg font-medium mb-2">No messages yet</p>
              <p className="text-sm">Start the conversation!</p>
            </div>
          ) : (
            messages.map((message) => {
              const isOwn = message.sender_id === user?.id;
              
              return (
                <div
                  key={message.id}
                  className={cn('flex gap-3 group', isOwn && 'flex-row-reverse')}
                >
                  <Avatar className="w-8 h-8 flex-shrink-0 border border-border">
                    <AvatarImage src={message.sender?.avatar_url || undefined} />
                    <AvatarFallback className="text-xs bg-muted">
                      {message.sender?.full_name?.[0] || '?'}
                    </AvatarFallback>
                  </Avatar>

                  <div className={cn('flex flex-col gap-1 max-w-[70%]', isOwn && 'items-end')}>
                    <div
                      className={cn(
                        'rounded-2xl px-4 py-2.5 relative shadow-sm',
                        isOwn
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      )}
                    >
                      <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
                        {message.content}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2 px-2">
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                      </span>
                      {isOwn && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive"
                          onClick={() => handleDelete(message.id)}
                          disabled={deleteMessageMutation.isPending}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>

      {/* Message Input */}
      <form onSubmit={handleSend} className="p-4 border-t bg-background">
        <div className="flex gap-2">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message... (Enter to send, Shift+Enter for new line)"
            className="min-h-[60px] max-h-[200px] resize-none flex-1"
            maxLength={2000}
            disabled={sendMessageMutation.isPending}
          />
          <Button
            type="submit"
            size="icon"
            disabled={!content.trim() || sendMessageMutation.isPending}
            className="h-[60px] w-[60px] flex-shrink-0"
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
