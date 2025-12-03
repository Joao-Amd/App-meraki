export type ServiceOrderStatus = "pending" | "in_progress" | "completed" | "cancelled";

export interface ServiceOrder {
  id: string;
  clientName: string;
  service: string;
  status: ServiceOrderStatus;
  value: number;
  date: string;
  description: string;
}
