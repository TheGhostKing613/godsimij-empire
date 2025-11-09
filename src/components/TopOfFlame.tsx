import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from './ui/card';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { POST_TYPE_CONFIG } from '@/config/postTypes';

const TopOfFlame = () => {
  const { data: posts, isLoading } = useQuery({
    queryKey: ['top-of-flame'],
    queryFn: async () => {
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles:user_id (id, full_name, email, avatar_url, tier),
          categories (id, name, slug, icon, color)
        `)
        .eq('visibility', 'public')
        .gte('created_at', twentyFourHoursAgo)
        .order('likes_count', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      
      const scored = data.map(post => {
        const hoursSince = (Date.now() - new Date(post.created_at).getTime()) / (1000 * 60 * 60);
        const score = (post.likes_count + post.comments_count * 2 + post.shares_count * 3) / Math.max(hoursSince, 1);
        return { ...post, engagementScore: score };
      });
      
      return scored.sort((a, b) => b.engagementScore - a.engagementScore).slice(0, 5);
    },
    refetchInterval: 5 * 60 * 1000, // Refresh every 5 minutes
  });

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="w-4 h-4 animate-spin text-primary" />
      </div>
    );
  }

  if (!posts || posts.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mb-6"
    >
      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
        <span className="text-xl">🔥</span>
        Top of the Flame
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {posts.map((post, index) => {
          const postType = post.post_type as keyof typeof POST_TYPE_CONFIG;
          const config = POST_TYPE_CONFIG[postType] || POST_TYPE_CONFIG.discussion;
          
          return (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link to={`/profile/${post.profiles?.id}`}>
                <Card className="hover:border-primary/50 transition-all group cursor-pointer h-full">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{config.icon}</span>
                      <span className={`text-xs font-semibold ${config.textClass}`}>
                        {config.displayName}
                      </span>
                    </div>
                    <p className="text-sm line-clamp-3 mb-2 group-hover:text-primary transition-colors">
                      {post.content}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>🔥 {post.likes_count}</span>
                      <span>💬 {post.comments_count}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
};

export default TopOfFlame;
