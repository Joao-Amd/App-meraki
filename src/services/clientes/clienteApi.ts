import { ClienteDto, Cliente } from "@/types/clientes/cliente";
import { QueryParams, PagedResult } from "@/types/query";
import { BuildQueryString } from "@/components/QueryString";
import { GetHeaders } from "@/components/ApiHeaders";
import { AppSettings } from "../../../config";

const API_BASE_URL = AppSettings.apiUrl;

export class ClienteApiService {

  static async inserir(dto: ClienteDto): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/Cadastros/Cliente`, {
      method: "POST",
      headers: GetHeaders(),
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
      headers: GetHeaders(),
      body: JSON.stringify(dto),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || "Erro ao alterar cliente");
    }
  }

  static async listar(params: QueryParams): Promise<PagedResult<Cliente>> {
    const queryString = BuildQueryString(params);
    const response = await fetch(`${API_BASE_URL}/Cadastros/Cliente?${queryString}`, {
      method: "GET",
      headers: GetHeaders(),
    });

    if (!response.ok) {
      throw new Error("Erro ao listar clientes");
    }

    return response.json();
  }

  static async buscarPorId(idCliente: string): Promise<Cliente> {
    const response = await fetch(`${API_BASE_URL}/Cadastros/Cliente/${idCliente}`, {
      method: "GET",
      headers: GetHeaders(),
    });

    if (!response.ok) {
      throw new Error("Erro ao buscar cliente");
    }

    return response.json();
  }   
}