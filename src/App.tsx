import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Index from "./pages/Index";
import Realms from "./pages/Realms";
import Scrolls from "./pages/Scrolls";
import Media from "./pages/Media";
import Projects from "./pages/Projects";
import AI from "./pages/AI";
import Declarations from "./pages/Declarations";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import FlameOS from "./pages/realms/FlameOS";
import GhostOS from "./pages/realms/GhostOS";
import WhisperNet from "./pages/realms/WhisperNet";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1 pt-20">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/realms" element={<Realms />} />
              <Route path="/flameos" element={<FlameOS />} />
              <Route path="/ghostos" element={<GhostOS />} />
              <Route path="/whispernet" element={<WhisperNet />} />
              <Route path="/scrolls" element={<Scrolls />} />
              <Route path="/media" element={<Media />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/ai" element={<AI />} />
              <Route path="/declarations" element={<Declarations />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
