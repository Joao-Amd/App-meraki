export interface ServicoDto{
    ativo: boolean;
    descricao : string;
    preco : number
}

export interface Servico{
    id : string;
    identificacao : number;
    descricao : string;
    preco : number;
    ativo : boolean;
}