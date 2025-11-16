import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { MessagingProvider } from "./contexts/MessagingContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Landing from "./pages/Landing";
import Feed from "./pages/Feed";
import Settings from "./pages/Settings";
import Auth from "./pages/Auth";
import Realms from "./pages/Realms";
import Media from "./pages/Media";
import Projects from "./pages/Projects";
import Empire from "./pages/Empire";
import Search from "./pages/Search";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import FlameOS from "./pages/realms/FlameOS";
import GhostOS from "./pages/realms/GhostOS";
import WhisperNet from "./pages/realms/WhisperNet";
import AuraBree from "./pages/realms/AuraBree";
import TwinTraining from "./pages/TwinTraining";
import Arena from "./pages/Arena";
import Clans from "./pages/Clans";
import WarRoom from "./pages/WarRoom";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import ProjectsManagement from "./pages/admin/ProjectsManagement";
import MediaManagement from "./pages/admin/MediaManagement";
import FilesManagement from "./pages/admin/FilesManagement";
import UsersManagement from "./pages/admin/UsersManagement";
import CommentsManagement from "./pages/admin/CommentsManagement";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <MessagingProvider>
          <Routes>
            {/* Landing - no navbar/footer */}
            <Route path="/" element={<Landing />} />
            
            {/* Auth - no navbar/footer */}
            <Route path="/auth" element={<Auth />} />
            
            {/* Admin - protected with own layout */}
            <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminLayout /></ProtectedRoute>}>
              <Route index element={<Dashboard />} />
              <Route path="projects" element={<ProjectsManagement />} />
              <Route path="media" element={<MediaManagement />} />
              <Route path="files" element={<FilesManagement />} />
              <Route path="users" element={<UsersManagement />} />
              <Route path="comments" element={<CommentsManagement />} />
            </Route>
            
            {/* Main app routes - WITH navbar/footer */}
            <Route path="*" element={
              <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-1 pt-20">
                  <Routes>
                    <Route path="/feed" element={<Feed />} />
                    <Route path="/empire" element={<Empire />} />
                    <Route path="/profile/:userId" element={<Profile />} />
                    <Route path="/notifications" element={<Notifications />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/search" element={<Search />} />
                    
                    {/* Twin System */}
                    <Route path="/twin/training" element={<TwinTraining />} />
                    <Route path="/arena" element={<Arena />} />
                    <Route path="/clans" element={<Clans />} />
                    <Route path="/war-room" element={<WarRoom />} />
                    
                    {/* Legacy routes - kept but hidden from navbar */}
                    <Route path="/realms" element={<Realms />} />
                    <Route path="/flameos" element={<FlameOS />} />
                    <Route path="/ghostos" element={<GhostOS />} />
                    <Route path="/whispernet" element={<WhisperNet />} />
                    <Route path="/ai" element={<AuraBree />} />
                    <Route path="/aurabree" element={<AuraBree />} />
                    <Route path="/media" element={<Media />} />
                    <Route path="/projects" element={<Projects />} />
                    
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            } />
          </Routes>
          </MessagingProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
