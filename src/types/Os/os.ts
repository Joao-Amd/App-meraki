import { Cliente } from "@/types/clientes/cliente";

export interface OsDto{
     idCliente : string;
     previsaoEntrega : Date;
     observacao : string;
     itens : OsDto[];
     serviocs : OsServicoDto[]

}

export interface OsItemDto{
     idItem : Date;
     quantidade : number;
}

export interface OsServicoDto{
     idItem : Date;
     hora : number;
}

export type EnumStatusOs = "Digitado" | "Aberto" | "Execucao" | "Finalizado" | "Cancelado";

export const EnumStatusOsMap: Record<number, EnumStatusOs> = {
  0: "Digitado",
  1: "Aberto",
  2: "Execucao",
  3: "Finalizado",
  4: "Cancelado"
};

export interface OsItem {
  id: string;                 
  idOs: string;
  idItem: string;
  preco: number;             
  status: EnumStatusOsItem;     
  precoTotal: number;
  precoTotalConsumido: number;
  quantidade: number;
  quantidadeConsumida: number;
  descricao: string;
}

export interface OsServico {
  id: string;                 
  idServico: string;
  preco: number;               
  precoTotal: number;
  precoTotalConsumido: number;
  hora: number;                
  horaConsumida: number;       
  status: EnumStatusOsItem;
  descricao: string;
}

export type EnumStatusOsItem = "Aberto" | "Parcial" | "Finalizado";

export const EnumStatusOsItemMap: Record<number, EnumStatusOsItem> = {
  0: "Aberto",
  1: "Parcial",
  2: "Finalizado"
};

export interface Os {
  id: string;
  dataCriacao: Date;
  dataInicio: Date | null;
  dataFinalizacao: Date | null;
  previsaoEntrega: Date | null;
  observacao: string;
  idCliente: string;
  status: EnumStatusOs;
  desconto: number;
  valor: number;
  valorOriginal: number;
  valorFinal: number;
  cliente: Cliente;
  itens: OsItem[];
  servicos: OsServico[];
}


