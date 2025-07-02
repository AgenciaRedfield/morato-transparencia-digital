
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Vereadores from "./pages/Vereadores";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

// Import admin pages
import AdminNoticias from "./pages/AdminNoticias";
import AdminNoticiaForm from "./pages/AdminNoticiaForm";
import AdminPaginas from "./pages/AdminPaginas";
import AdminProposicoes from "./pages/AdminProposicoes";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/vereadores" element={<Vereadores />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
          
          {/* Admin routes for content management */}
          <Route path="/admin/noticias" element={<AdminNoticias />} />
          <Route path="/admin/noticias/nova" element={<AdminNoticiaForm />} />
          <Route path="/admin/noticias/:id/editar" element={<AdminNoticiaForm />} />
          
          <Route path="/admin/paginas" element={<AdminPaginas />} />
          
          <Route path="/admin/proposicoes" element={<AdminProposicoes />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
