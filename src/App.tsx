import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import Index from "./pages/os/Index";
import ClienteForm from "./pages/clientes/Form";
import ClienteList from "./pages/clientes/Index";
import ItemForm from "./pages/itens/Form";
import ServicoForm from "./pages/servicos/Form";
import Agenda from "./pages/agenda/Index";
import Auth from "./pages/login/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route
            path="/*"
            element={
              <AppLayout>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/clientes" element={<ClienteList />} />
                  <Route path="/cadastro/cliente" element={<ClienteForm />} />
                  <Route path="/cadastro/item" element={<ItemForm />} />
                  <Route path="/cadastro/servico" element={<ServicoForm />} />
                  <Route path="/agenda" element={<Agenda />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </AppLayout>
            }
          />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
