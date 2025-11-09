import { Flame } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-primary/20 bg-card/50 backdrop-blur-sm mt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} GodsIMiJ AI Solutions | Sovereign Systems Division
            </span>
          </div>
          <div className="text-sm text-muted-foreground">
            One Flame. Infinite Realms.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
