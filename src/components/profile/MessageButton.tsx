import { useState } from 'react';
import { MessageCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStartConversation } from '@/hooks/useMessages';
import { useMessaging } from '@/contexts/MessagingContext';
import { toast } from '@/hooks/use-toast';

interface MessageButtonProps {
  userId: string;
}

export function MessageButton({ userId }: MessageButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const startConversationMutation = useStartConversation();
  const { openConversation } = useMessaging();

  const handleMessage = async () => {
    setIsLoading(true);
    startConversationMutation.mutate(userId, {
      onSuccess: (conversationId) => {
        // Open the conversation in the messages dialog
        openConversation(conversationId);
        toast({
          title: 'Success',
          description: 'Conversation opened',
        });
      },
      onError: (error: Error) => {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
      },
      onSettled: () => {
        setIsLoading(false);
      },
    });
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleMessage}
      disabled={isLoading}
      className="gap-2"
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <MessageCircle className="w-4 h-4" />
      )}
      Message
    </Button>
  );
}
