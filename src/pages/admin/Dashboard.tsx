import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollText, FolderKanban, Radio, TrendingUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function Dashboard() {
  const [stats, setStats] = useState({
    scrolls: 0,
    projects: 0,
    media: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [scrollsRes, projectsRes, mediaRes] = await Promise.all([
        supabase.from('scrolls').select('id', { count: 'exact', head: true }),
        supabase.from('projects').select('id', { count: 'exact', head: true }),
        supabase.from('media').select('id', { count: 'exact', head: true }),
      ]);

      setStats({
        scrolls: scrollsRes.count || 0,
        projects: projectsRes.count || 0,
        media: mediaRes.count || 0,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Total Scrolls', value: stats.scrolls, icon: ScrollText, color: 'text-blue-500' },
    { label: 'Active Projects', value: stats.projects, icon: FolderKanban, color: 'text-green-500' },
    { label: 'Media Items', value: stats.media, icon: Radio, color: 'text-purple-500' },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-glow-ember mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage your Empire's content and systems</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        {statCards.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-3xl font-bold">{stat.value}</div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Quick Stats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Your Empire is growing. Use the sidebar to manage scrolls, projects, media, and users.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
