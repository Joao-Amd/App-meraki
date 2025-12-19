export interface ItemDto{
    descricao : string;
    idUnidade : string;
    preco : number
}

export interface Item{
    id : string;
    identificacao : number;
    descricao : string;
    preco : number;
    idUnidade : string;
    ativo : boolean;
}