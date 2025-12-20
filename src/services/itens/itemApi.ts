import { ItemDto, Item } from "@/types/itens/item";
import { QueryParams, PagedResult } from "@/types/query";
import { BuildQueryString } from "@/components/QueryString";
import { GetHeaders } from "@/components/ApiHeaders";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://localhost:44360";

export class ItemApiService {

    static async inserir(dto: ItemDto): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/Item`, {
            method: "POST",
            headers: GetHeaders(),
            body: JSON.stringify(dto),
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || "Erro ao inserir item");
        }
    }

      static async alterar(idItem: string, dto: ItemDto): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/Item/${idItem}`, {
          method: "PUT",
          headers: GetHeaders(),
          body: JSON.stringify(dto),
        });
    
        if (!response.ok) {
          const error = await response.text();
          throw new Error(error || "Erro ao alterar item");
        }
      }

      static async aitvarInativar(idItem: string, dto: ItemDto): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/Item/AtivarInativar/${idItem}`, {
          method: "PUT",
          headers: GetHeaders(),
        });
    
        if (!response.ok) {
          const error = await response.text();
          throw new Error(error || "Erro ao alterar item");
        }
      }

    static async listar(params: QueryParams): Promise<PagedResult<Item>> {
        const queryString = BuildQueryString(params);
        const response = await fetch(`${API_BASE_URL}/Item?${queryString}`, {
            method: "GET",
            headers: GetHeaders()
        });

        if (!response.ok) {
            throw new Error("Erro ao listar itens");
        }
        return response.json();
    }

    static async buscarPorId(idItem: string): Promise<Item> {
        const response = await fetch(`${API_BASE_URL}/Item/${idItem}`, {
            method: "GET",
            headers: GetHeaders()
        });

        if (!response.ok) {
            throw new Error("Erro ao buscar cliente")
        }
        return response.json();
    }
}


