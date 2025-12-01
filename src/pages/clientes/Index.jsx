import { useState } from "react";
import { Plus, Search, Filter, FileText, Users } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { ServiceOrderTable } from "../../components/ServiceOrderTable";
import { NewOrderDialog } from "../../components/NewOrderDialog"; 

const Index = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [orders, setOrders] = useState([
    {
      id: "OS-001",
      clientName: "João Silva",
      service: "Manutenção Preventiva",
      status: "pending",
      value: 1500.0,
      date: "2025-01-15",
      description: "Manutenção preventiva completa do equipamento",
    },
    {
      id: "OS-002",
      clientName: "Maria Santos",
      service: "Reparo de Emergência",
      status: "in_progress",
      value: 2800.0,
      date: "2025-01-10",
      description: "Reparo urgente no sistema elétrico",
    },
    {
      id: "OS-003",
      clientName: "Pedro Oliveira",
      service: "Instalação",
      status: "completed",
      value: 3500.0,
      date: "2025-01-05",
      description: "Instalação de novo equipamento",
    },
    {
      id: "OS-004",
      clientName: "Ana Costa",
      service: "Consultoria Técnica",
      status: "cancelled",
      value: 800.0,
      date: "2025-01-08",
      description: "Consultoria técnica especializada",
    },
  ]);

  const handleAddOrder = (order) => {
    const newOrder = {
      ...order,
      id: `OS-${String(orders.length + 1).padStart(3, "0")}`,
    };
    setOrders([newOrder, ...orders]);
    setIsDialogOpen(false);
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.service.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Ordens de Serviço</h1>
          </div>
          <p className="text-muted-foreground">
            Gerencie todas as ordens de serviço da sua empresa
          </p>
        </div>

        {/* Filters and Actions */}
        <div className="bg-card rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por cliente, número ou serviço..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="in_progress">Em Andamento</SelectItem>
                  <SelectItem value="completed">Concluído</SelectItem>
                  <SelectItem value="cancelled">Cancelado</SelectItem>
                </SelectContent>
              </Select>

              <Button 
                variant="outline" 
                onClick={() => navigate("/cadastro/cliente")}
              >
                <Users className="h-4 w-4 mr-2" />
                Clientes
              </Button>

              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Nova Ordem
              </Button>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <ServiceOrderTable orders={filteredOrders} />

        {/* New Order Dialog */}
        <NewOrderDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSubmit={handleAddOrder}
        />
      </div>
    </div>
  );
};

export default Index;