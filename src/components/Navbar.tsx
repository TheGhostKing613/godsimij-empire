import { Link, useNavigate } from "react-router-dom";
import { Flame, Shield, LogIn, Code, User, Settings, LogOut } from "lucide-react";
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

const Navbar = () => {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-primary/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <Flame className="w-8 h-8 text-primary animate-pulse-glow" />
            <span className="text-xl font-bold text-glow-ember">GodsIMiJ Empire</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-6">
            <Link to="/realms" className="text-foreground/80 hover:text-primary transition-colors">
              Realms
            </Link>
            <Link to="/scrolls" className="text-foreground/80 hover:text-primary transition-colors">
              Scrolls
            </Link>
            <Link to="/media" className="text-foreground/80 hover:text-secondary transition-colors">
              Media
            </Link>
            <Link to="/projects" className="text-foreground/80 hover:text-primary transition-colors">
              Projects
            </Link>
            <Link to="/ai" className="text-foreground/80 hover:text-secondary transition-colors">
              AI
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-foreground/80 hover:text-primary transition-colors px-2">
                  Empire
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-56">
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
                <DropdownMenuItem disabled className="flex items-center gap-2">
                  <span>📻</span>
                  <span>Rebel Media</span>
                  <span className="text-xs text-muted-foreground">(Soon)</span>
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
            <Link to="/api-docs" className="text-foreground/80 hover:text-accent transition-colors flex items-center gap-1">
              <Code className="w-4 h-4" />
              API
            </Link>
            <Link to="/declarations" className="text-foreground/80 hover:text-primary transition-colors">
              Declarations
            </Link>
            <Link to="/contact" className="text-foreground/80 hover:text-primary transition-colors">
              Contact
            </Link>
            {isAdmin && (
              <Link to="/admin" className="text-primary hover:text-primary/80 transition-colors flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Admin
              </Link>
            )}
            {!user ? (
              <Link to="/auth">
                <Button variant="outline" size="sm">
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              </Link>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Avatar className="w-7 h-7">
                      <AvatarImage src={user.user_metadata?.avatar_url} />
                      <AvatarFallback className="text-xs bg-primary/10">
                        {user.email?.[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline">{user.email?.split('@')[0]}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => navigate(`/profile/${user.id}`)}>
                    <User className="w-4 h-4 mr-2" />
                    View Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate(`/profile/${user.id}`)}>
                    <Settings className="w-4 h-4 mr-2" />
                    Edit Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="text-destructive">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
