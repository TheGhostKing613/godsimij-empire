import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { PostCard } from './PostCard';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const EmpireBroadcast = () => {
  const { data: posts, isLoading } = useQuery({
    queryKey: ['empire-broadcast'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles:user_id (id, full_name, email, avatar_url, tier),
          categories (id, name, slug, icon, color)
        `)
        .or('is_pinned.eq.true,is_featured.eq.true')
        .eq('visibility', 'public')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!posts || posts.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl">🔥</span>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
          Empire Broadcast
        </h2>
      </div>
      
      <div className="space-y-4">
        {posts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-chart-2/20 rounded-lg blur-xl" />
            <div className="relative border-2 border-primary/50 rounded-lg overflow-hidden">
              <PostCard post={post} />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default EmpireBroadcast;
