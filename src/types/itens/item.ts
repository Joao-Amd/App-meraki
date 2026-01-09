import { Unidade } from "@/types/unidades/unidade";


export interface ItemDto{
    descricao : string;
    idUnidade : string;
    preco : number;
    ativo : boolean;
}

export interface Item{
    id : string;
    identificacao : number;
    descricao : string;
    preco : number;
    idUnidade : string;
    ativo : boolean;
    unidade : Unidade;
}