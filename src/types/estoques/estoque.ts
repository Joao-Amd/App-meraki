import {Item } from "@/types/itens/item"

export interface EstoqueDto{
    saldo : number;
}

export interface Estoque{
    id : string;
    saldo : number;
    precoTotal : number;
    item : Item;
}