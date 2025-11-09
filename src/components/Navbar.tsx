import { Link } from "react-router-dom";
import { Flame } from "lucide-react";

const Navbar = () => {
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
            <Link to="/declarations" className="text-foreground/80 hover:text-primary transition-colors">
              Declarations
            </Link>
            <Link to="/contact" className="text-foreground/80 hover:text-primary transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
