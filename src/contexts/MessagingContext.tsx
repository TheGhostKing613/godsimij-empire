import { createContext, useContext, useState, ReactNode } from 'react';

interface MessagingContextType {
  isOpen: boolean;
  selectedConversationId: string | null;
  openMessages: () => void;
  closeMessages: () => void;
  selectConversation: (conversationId: string) => void;
  openConversation: (conversationId: string) => void;
}

const MessagingContext = createContext<MessagingContextType | undefined>(undefined);

export function MessagingProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

  const openMessages = () => setIsOpen(true);
  const closeMessages = () => setIsOpen(false);
  
  const selectConversation = (conversationId: string) => {
    setSelectedConversationId(conversationId);
  };

  const openConversation = (conversationId: string) => {
    setSelectedConversationId(conversationId);
    setIsOpen(true);
  };

  return (
    <MessagingContext.Provider
      value={{
        isOpen,
        selectedConversationId,
        openMessages,
        closeMessages,
        selectConversation,
        openConversation,
      }}
    >
      {children}
    </MessagingContext.Provider>
  );
}

export function useMessaging() {
  const context = useContext(MessagingContext);
  if (!context) {
    throw new Error('useMessaging must be used within MessagingProvider');
  }
  return context;
}
