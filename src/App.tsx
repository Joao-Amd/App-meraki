import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import Index from "./pages/os/OsList";
import ClienteForm from "./pages/clientes/ClienteForm";
import ClienteList from "./pages/clientes/ClienteList";
import ClienteUpdate from "./pages/clientes/ClienteUpdate";
import ItemList from "./pages/itens/ItemList";
import ItemForm from "./pages/itens/ItemForm";
import ItemUpdate from "./pages/itens/ItemUpdate";
import ServicoForm from "./pages/servicos/ServicoForm";
import ServicoUpdate from "./pages/servicos/ServicoUpdate";
import EstoqueList from "./pages/estoques/estoqueList";
import EstoqueUpdate from "./pages/estoques/estoqueUpdate";
// import Agenda from "./pages/agenda/Index";
import Auth from "./pages/login/Auth";
import NotFound from "./pages/NotFound";
import ServicoList from "./pages/servicos/ServicoList";

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
                  <Route path="/cliente" element={<ClienteList />} />
                  <Route path="/cadastro/cliente" element={<ClienteForm />} />
                  <Route path="/alterar/cliente" element={<ClienteUpdate />} />
                  <Route path="/item" element={<ItemList />} />
                  <Route path="/cadastro/item" element={<ItemForm />} />
                  <Route path="/alterar/item" element={<ItemUpdate />} />
                  <Route path="/servico" element={<ServicoList />} />
                  <Route path="/cadastro/servico" element={<ServicoForm />} />
                  <Route path="/alterar/servico" element={<ServicoUpdate />} />
                  <Route path="/estoque" element={<EstoqueList />} />
                  <Route path="/alterar/estoque" element={<EstoqueUpdate />} />
                  {/* <Route path="/agenda" element={<Agenda />} /> */}
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
