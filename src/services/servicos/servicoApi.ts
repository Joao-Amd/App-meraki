import { ServicoDto, Servico } from "@/types/servicos/servico";
import { QueryParams, PagedResult } from "@/types/query";
import { BuildQueryString } from "@/components/QueryString";
import { GetHeaders } from "@/components/ApiHeaders";
import { AppSettings } from "../../../config";

const API_BASE_URL = AppSettings.apiUrl;

export class ServicoApiService {

    static async inserir(dto: ServicoDto): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/Servico`, {
            method: "POST",
            headers: GetHeaders(),
            body: JSON.stringify(dto),
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || "Erro ao inserir Servico");
        }
    }

      static async alterar(idServico: string, dto: ServicoDto): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/Servico/${idServico}`, {
          method: "PUT",
          headers: GetHeaders(),
          body: JSON.stringify(dto),
        });
    
        if (!response.ok) {
          const error = await response.text();
          throw new Error(error || "Erro ao alterar serviço");
        }
      }

      static async aitvarInativar(idServico: string, dto: ServicoDto): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/Servico/AtivarInativar/${idServico}`, {
          method: "PUT",
          headers: GetHeaders(),
        });
    
        if (!response.ok) {
          const error = await response.text();
          throw new Error(error || "Erro ao alterar serviço");
        }
      }

    static async listar(params: QueryParams): Promise<PagedResult<Servico>> {
        const queryString = BuildQueryString(params);
        const response = await fetch(`${API_BASE_URL}/Servico?${queryString}`, {
            method: "GET",
            headers: GetHeaders()
        });

        if (!response.ok) {
            throw new Error("Erro ao listar serviços");
        }
        return response.json();
    }

    static async buscarPorId(idServico: string): Promise<Servico> {
        const response = await fetch(`${API_BASE_URL}/Servico/${idServico}`, {
            method: "GET",
            headers: GetHeaders()
        });

        if (!response.ok) {
            throw new Error("Erro ao buscar serviço")
        }
        return response.json();
    }
}


