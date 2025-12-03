import { ServiceOrder } from "@/types/serviceOrder";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface ServiceOrderTableProps {
  orders: ServiceOrder[];
}

const statusConfig = {
  pending: {
    label: "Pendente",
    variant: "secondary" as const,
    icon: Clock,
    className: "bg-muted text-muted-foreground",
  },
  in_progress: {
    label: "Em Andamento",
    variant: "default" as const,
    icon: AlertCircle,
    className: "bg-warning text-warning-foreground",
  },
  completed: {
    label: "Concluído",
    variant: "default" as const,
    icon: CheckCircle,
    className: "bg-success text-success-foreground",
  },
  cancelled: {
    label: "Cancelado",
    variant: "destructive" as const,
    icon: XCircle,
    className: "bg-destructive text-destructive-foreground",
  },
};

export const ServiceOrderTable = ({ orders }: ServiceOrderTableProps) => {
  if (orders.length === 0) {
    return (
      <Card className="p-12">
        <div className="text-center">
          <p className="text-muted-foreground text-lg">
            Nenhuma ordem de serviço encontrada
          </p>
          <p className="text-muted-foreground text-sm mt-2">
            Tente ajustar os filtros ou criar uma nova ordem
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">Número</TableHead>
              <TableHead className="font-semibold">Cliente</TableHead>
              <TableHead className="font-semibold">Serviço</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Valor</TableHead>
              <TableHead className="font-semibold">Data</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => {
              const config = statusConfig[order.status];
              const StatusIcon = config.icon;
              
              return (
                <TableRow
                  key={order.id}
                  className="hover:bg-accent/50 transition-colors cursor-pointer"
                >
                  <TableCell className="font-mono font-medium text-primary">
                    {order.id}
                  </TableCell>
                  <TableCell className="font-medium">{order.clientName}</TableCell>
                  <TableCell>{order.service}</TableCell>
                  <TableCell>
                    <Badge className={config.className}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {config.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-semibold text-success">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(order.value)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(order.date).toLocaleDateString("pt-BR")}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};