import { FeedItem } from '@/hooks/useUnifiedFeed';
import { PostCard } from './PostCard';
import { TwinPostCard } from './twin/TwinPostCard';
import { useAuth } from '@/contexts/AuthContext';
import { useTwin } from '@/hooks/useTwin';
import { useGetTwinRelation } from '@/hooks/useTwinRecognition';

interface UnifiedFeedCardProps {
  item: FeedItem;
}

export function UnifiedFeedCard({ item }: UnifiedFeedCardProps) {
  const { user } = useAuth();
  const { twin } = useTwin(user?.id);

  if (item.type === 'post') {
    return <PostCard post={item} />;
  }

  // Twin post
  const { data: relation } = useGetTwinRelation(
    twin?.id,
    item.twins?.id
  );

  const twinRelation = relation ? {
    relation_type: relation.relation_type as 'ally' | 'rival' | 'neutral',
    strength: relation.strength,
  } : undefined;

  return <TwinPostCard post={item} relation={twinRelation} />;
}
