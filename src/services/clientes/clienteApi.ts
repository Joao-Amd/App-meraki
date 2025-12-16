import { ClienteDto, Cliente } from "@/types/Clientes/cliente";
import { QueryParams, PagedResult } from "@/types/query";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://localhost:44360";

export class ClienteApiService {
  private static getHeaders(): HeadersInit {
    return {
      "Content-Type": "application/json",
      // Adicione token de autenticação aqui se necessário
      // "Authorization": `Bearer ${token}`
    };
  }

  static async inserir(dto: ClienteDto): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/Cadastros/Cliente`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(dto),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || "Erro ao inserir cliente");
    }
  }

  static async alterar(idCliente: string, dto: ClienteDto): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/Cadastros/Cliente/${idCliente}`, {
      method: "PUT",
      headers: this.getHeaders(),
      body: JSON.stringify(dto),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || "Erro ao alterar cliente");
    }
  }

  static async listar(params: QueryParams): Promise<PagedResult<Cliente>> {
    const queryString = this.buildQueryString(params);
    const response = await fetch(`${API_BASE_URL}/Cadastros/Cliente?${queryString}`, {
      method: "GET",
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error("Erro ao listar clientes");
    }

    return response.json();
  }

  static async buscarPorId(idCliente: string): Promise<Cliente> {
    const response = await fetch(`${API_BASE_URL}/Cadastros/Cliente/${idCliente}`, {
      method: "GET",
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error("Erro ao buscar cliente");
    }

    return response.json();
  }

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