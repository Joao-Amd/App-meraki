import { EstoqueDto, Estoque } from "@/types/estoques/estoque";
import { QueryParams, PagedResult } from "@/types/query";
import { BuildQueryString } from "@/components/QueryString";
import { GetHeaders } from "@/components/ApiHeaders";
import { AppSettings } from "../../../config";

const API_BASE_URL = AppSettings.apiUrl;

export class EstoqueApiService {

    static async inserir(dto: EstoqueDto): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/Estoque`, {
            method: "POST",
            headers: GetHeaders(),
            body: JSON.stringify(dto),
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || "Erro ao inserir Estoque");
        }
    }

      static async alterar(idEstoque: string, dto: EstoqueDto): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/Estoque/${idEstoque}`, {
          method: "PUT",
          headers: GetHeaders(),
          body: JSON.stringify(dto),
        });
    
        if (!response.ok) {
          const error = await response.text();
          throw new Error(error || "Erro ao alterar Estoque");
        }
      }

      static async aitvarInativar(idEstoque: string, dto: EstoqueDto): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/Estoque/AtivarInativar/${idEstoque}`, {
          method: "PUT",
          headers: GetHeaders(),
        });
    
        if (!response.ok) {
          const error = await response.text();
          throw new Error(error || "Erro ao alterar Estoque");
        }
      }

    static async listar(params: QueryParams): Promise<PagedResult<Estoque>> {
        const queryString = BuildQueryString(params);
        const response = await fetch(`${API_BASE_URL}/Estoque?${queryString}`, {
            method: "GET",
            headers: GetHeaders()
        });

        if (!response.ok) {
            throw new Error("Erro ao listar itens");
        }
        return response.json();
    }

    static async buscarPorId(idEstoque: string): Promise<Estoque> {
        const response = await fetch(`${API_BASE_URL}/Estoque/${idEstoque}`, {
            method: "GET",
            headers: GetHeaders()
        });

        if (!response.ok) {
            throw new Error("Erro ao buscar Estoque")
        }
        return response.json();
    }
}


