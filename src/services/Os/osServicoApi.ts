import { OsDto, Os } from "@/types/Os/os";
import { QueryParams, PagedResult } from "@/types/query";
import { BuildQueryString } from "@/components/QueryString";
import { GetHeaders } from "@/components/ApiHeaders";
import { AppSettings } from "../../../config";

const API_BASE_URL = AppSettings.apiUrl;

export class ServicoApiService {

    static async inserir(dto: OsDto): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/Os`, {
            method: "POST",
            headers: GetHeaders(),
            body: JSON.stringify(dto),
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || "Erro ao inserir ordem de serviço");
        }
    }

      static async alterar(idOs: string, dto: OsDto): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/Os/${idOs}`, {
          method: "PUT",
          headers: GetHeaders(),
          body: JSON.stringify(dto),
        });
    
        if (!response.ok) {
          const error = await response.text();
          throw new Error(error || "Erro ao alterar ordem de serviço");
        }
      }

    static async listar(params: QueryParams): Promise<PagedResult<Os>> {
        const queryString = BuildQueryString(params);
        const response = await fetch(`${API_BASE_URL}/Os?${queryString}`, {
            method: "GET",
            headers: GetHeaders()
        });

        if (!response.ok) {
            throw new Error("Erro ao listar Ordens de serviço");
        }
        return response.json();
    }

    static async buscarPorId(idOs: string): Promise<Os> {
        const response = await fetch(`${API_BASE_URL}/Os/${idOs}`, {
            method: "GET",
            headers: GetHeaders()
        });

        if (!response.ok) {
            throw new Error("Erro ao buscar ordens de serviço")
        }
        return response.json();
    }
}


