import { Link, useNavigate, useLocation } from "react-router-dom";
import { Flame, Shield, User, Settings, LogOut, Home, Search, Menu, Sparkles, LogIn } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { NotificationsDropdown } from "@/components/NotificationsDropdown";
import { MessagesDialog } from "@/components/messages/MessagesDialog";

const Navbar = () => {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path);

  const NavButton = ({ to, icon: Icon, label, active }: { to: string; icon: any; label: string; active?: boolean }) => (
    <Link to={to}>
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "flex flex-col items-center gap-1 h-auto py-2 px-4 hover:bg-muted relative",
          active && "text-primary"
        )}
      >
        <Icon className="w-5 h-5" />
        <span className="text-xs font-medium">{label}</span>
        {active && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
        )}
      </Button>
    </Link>
  );
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/feed" className="flex items-center gap-2 group">
            <Flame className="w-7 h-7 text-primary" />
            <span className="text-lg font-bold hidden sm:inline">GodsIMiJ</span>
          </Link>
          
          {/* Center Navigation - Desktop */}
          <div className="hidden md:flex items-center gap-1">
            <NavButton to="/feed" icon={Home} label="Feed" active={isActive('/feed')} />
            {user && (
              <NavButton to={`/profile/${user.id}`} icon={User} label="Profile" active={isActive('/profile')} />
            )}
            <NavButton to="/ai" icon={Sparkles} label="AI" active={isActive('/ai')} />
          </div>

          {/* Right Side - Actions */}
          <div className="flex items-center gap-2">
            {user ? (
              <>
                {/* Search Icon */}
                <Button variant="ghost" size="icon" className="rounded-full" onClick={() => navigate('/search')}>
                  <Search className="w-5 h-5" />
                </Button>

                {/* Notifications Dropdown */}
                <NotificationsDropdown />

                {/* Messages Dialog */}
                <MessagesDialog />

                {/* Empire Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <Menu className="w-5 h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem asChild>
                      <a href="https://thewitnesshall.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                        <span>🏛️</span>
                        <span>Witness Hall</span>
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <a href="https://quantum-odyssey.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                        <span>⚡</span>
                        <span>Quantum Odyssey</span>
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <a href="https://r3b3lm3d14.thewitnesshall.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                        <span>📻</span>
                        <span>Rebel Media</span>
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem disabled className="flex items-center gap-2">
                      <span>🕸️</span>
                      <span>GhostVault</span>
                      <span className="text-xs text-muted-foreground">(Soon)</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/empire')}>
                      View All Empire Properties
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* User Avatar Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={user.user_metadata?.avatar_url} />
                        <AvatarFallback className="text-xs bg-primary/10">
                          {user.email?.[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem onClick={() => navigate(`/profile/${user.id}`)}>
                      <User className="w-4 h-4 mr-2" />
                      View Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/settings')}>
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </DropdownMenuItem>
                    {isAdmin && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => navigate('/admin')}>
                          <Shield className="w-4 h-4 mr-2" />
                          Admin Dashboard
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut} className="text-destructive">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button variant="ghost" size="sm" onClick={() => navigate('/auth')}>
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => navigate('/feed')}>
                  <Home className="w-4 h-4 mr-2" />
                  Feed
                </DropdownMenuItem>
                {user && (
                  <DropdownMenuItem onClick={() => navigate(`/profile/${user.id}`)}>
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => navigate('/ai')}>
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
