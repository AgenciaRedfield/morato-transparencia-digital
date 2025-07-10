
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
import AdminMesaDiretora from "./pages/AdminMesaDiretora";
import AdminLegislaturas from "./pages/AdminLegislaturas";
import AdminUsuarios from "./pages/AdminUsuarios";
import AdminVereadores from "./pages/AdminVereadores";
import AdminTransparencia from "./pages/AdminTransparencia";
import AdminSimbolos from "./pages/AdminSimbolos";
import AdminOuvidoria from "./pages/AdminOuvidoria";
import AdminFormularios from "./pages/AdminFormularios";
import AdminConfiguracoes from "./pages/AdminConfiguracoes";
import AdminAgenda from "./pages/AdminAgenda";
import AdminAgendaForm from "./pages/AdminAgendaForm";
import AdminVereadoresForm from "./pages/AdminVereadoresForm";
import AdminTransparenciaForm from "./pages/AdminTransparenciaForm";
import AdminSimbolosForm from "./pages/AdminSimbolosForm";
import AdminFormulariosForm from "./pages/AdminFormulariosForm";

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
          <Route path="/admin/agenda" element={<AdminAgenda />} />
          <Route path="/admin/agenda/novo" element={<AdminAgendaForm />} />
          <Route path="/admin/agenda/:id/editar" element={<AdminAgendaForm />} />
          
          <Route path="/admin/proposicoes" element={<AdminProposicoes />} />
          
          {/* Admin routes for people management */}
          <Route path="/admin/vereadores" element={<AdminVereadores />} />
          <Route path="/admin/vereadores/novo" element={<AdminVereadoresForm />} />
          <Route path="/admin/vereadores/:id/editar" element={<AdminVereadoresForm />} />
          <Route path="/admin/mesa-diretora" element={<AdminMesaDiretora />} />
          <Route path="/admin/legislaturas" element={<AdminLegislaturas />} />
          <Route path="/admin/usuarios" element={<AdminUsuarios />} />
          
          {/* Admin routes for transparency and forms */}
          <Route path="/admin/transparencia" element={<AdminTransparencia />} />
          <Route path="/admin/transparencia/novo" element={<AdminTransparenciaForm />} />
          <Route path="/admin/transparencia/:id/editar" element={<AdminTransparenciaForm />} />
          <Route path="/admin/simbolos" element={<AdminSimbolos />} />
          <Route path="/admin/simbolos/novo" element={<AdminSimbolosForm />} />
          <Route path="/admin/simbolos/:id/editar" element={<AdminSimbolosForm />} />
          <Route path="/admin/ouvidoria" element={<AdminOuvidoria />} />
          <Route path="/admin/formularios" element={<AdminFormularios />} />
          <Route path="/admin/formularios/novo" element={<AdminFormulariosForm />} />
          <Route path="/admin/formularios/:id/editar" element={<AdminFormulariosForm />} />
          <Route path="/admin/configuracoes" element={<AdminConfiguracoes />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
