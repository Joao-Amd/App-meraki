import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import { Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react";

const statusConfig = {
  pending: {
    label: "Pendente",
    variant: "outline",
    icon: Clock,
    className: "border-warning text-warning",
  },
  in_progress: {
    label: "Em Andamento",
    variant: "outline",
    icon: AlertCircle,
    className: "border-info text-info",
  },
  completed: {
    label: "Concluído",
    variant: "outline",
    icon: CheckCircle2,
    className: "border-success text-success",
  },
  cancelled: {
    label: "Cancelado",
    variant: "outline",
    icon: XCircle,
    className: "border-destructive text-destructive",
  },
};

export const ServiceOrderTable = ({ orders }) => {
  return (
    <div className="bg-card rounded-lg shadow-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold">Número</TableHead>
            <TableHead className="font-semibold">Cliente</TableHead>
            <TableHead className="font-semibold">Serviço</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold">Valor</TableHead>
            <TableHead className="font-semibold">Data</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                Nenhuma ordem de serviço encontrada
              </TableCell>
            </TableRow>
          ) : (
            orders.map((order) => {
              const StatusIcon = statusConfig[order.status].icon;
              return (
                <TableRow key={order.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.clientName}</TableCell>
                  <TableCell>{order.service}</TableCell>
                  <TableCell>
                    <Badge
                      variant={statusConfig[order.status].variant}
                      className={statusConfig[order.status].className}
                    >
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {statusConfig[order.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(order.value)}
                  </TableCell>
                  <TableCell>
                    {new Date(order.date).toLocaleDateString("pt-BR")}
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
};
