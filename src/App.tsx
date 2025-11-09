import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Realms from "./pages/Realms";
import Scrolls from "./pages/Scrolls";
import Media from "./pages/Media";
import Projects from "./pages/Projects";
import AI from "./pages/AI";
import ApiDocs from "./pages/ApiDocs";
import Declarations from "./pages/Declarations";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import FlameOS from "./pages/realms/FlameOS";
import GhostOS from "./pages/realms/GhostOS";
import WhisperNet from "./pages/realms/WhisperNet";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import ScrollsManagement from "./pages/admin/ScrollsManagement";
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
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminLayout /></ProtectedRoute>}>
              <Route index element={<Dashboard />} />
              <Route path="scrolls" element={<ScrollsManagement />} />
              <Route path="projects" element={<ProjectsManagement />} />
              <Route path="media" element={<MediaManagement />} />
              <Route path="files" element={<FilesManagement />} />
              <Route path="users" element={<UsersManagement />} />
              <Route path="comments" element={<CommentsManagement />} />
            </Route>
            <Route path="*" element={
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
                    <Route path="/api-docs" element={<ApiDocs />} />
                    <Route path="/declarations" element={<Declarations />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            } />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
