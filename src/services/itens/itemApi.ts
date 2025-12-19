import { ItemDto, Item } from "@/types/itens/item";
import { QueryParams, PagedResult } from "@/types/query";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://localhost:44360";

export class ItemApiService {
    private static getHeaders(): HeadersInit {
        return {
            "Content-Type": "application/json",
        };
    }

    //Montar um core
    static async listar(params: QueryParams): Promise<PagedResult<Item>> {
        const queryString = this.buildQueryString(params);
        const response = await fetch(`${API_BASE_URL}/Item?${queryString}`, {
            method: "GET",
            headers: this.getHeaders()
        });

        if (!response.ok) {
            throw new Error("Erro ao listar itens");

        }
        return response.json();
    }

    //Montar um core
    private static buildQueryString(params: QueryParams): string {
        const searchParams = new URLSearchParams();
        searchParams.append("pageNumber", params.pageNumber.toString());
        searchParams.append("pageSize", params.pageSize.toString());
        searchParams.append("sortDescending", params.sortDescending.toString());

        if (params.searchBy) {
            searchParams.append("searchBy", params.searchBy);
        }
        if (params.searchTerm) {
            searchParams.append("searchTerm", params.searchTerm);
        }
        if (params.sortBy) {
            searchParams.append("sortBy", params.sortBy);
        }

        return searchParams.toString();
    }
}


