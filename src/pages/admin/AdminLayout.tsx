import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  ScrollText, 
  FolderKanban, 
  Radio, 
  Users,
  Files,
  LogOut,
  Shield,
  MessageSquare
} from 'lucide-react';

export default function AdminLayout() {
  const { user, signOut } = useAuth();

  const navItems = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/admin/scrolls', label: 'Scrolls', icon: ScrollText },
    { to: '/admin/projects', label: 'Projects', icon: FolderKanban },
    { to: '/admin/media', label: 'Media', icon: Radio },
    { to: '/admin/files', label: 'Files', icon: Files },
    { to: '/admin/users', label: 'Users', icon: Users },
    { to: '/admin/comments', label: 'Comments', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen flex w-full">
      <aside className="w-64 bg-card border-r border-primary/20 flex flex-col">
        <div className="p-6 border-b border-primary/20">
          <div className="flex items-center gap-2">
            <Shield className="w-8 h-8 text-primary animate-pulse-glow" />
            <div>
              <h2 className="font-bold text-glow-ember">Admin Portal</h2>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-primary/20">
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => signOut()}
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sign Out
          </Button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto bg-background">
        <Outlet />
      </main>
    </div>
  );
}
