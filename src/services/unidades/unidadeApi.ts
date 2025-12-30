import { Unidade } from "@/types/unidades/unidade";
import { QueryParams, PagedResult } from "@/types/query";
import { BuildQueryString } from "@/components/QueryString";
import { GetHeaders } from "@/components/ApiHeaders";
import { AppSettings } from "../../../config";

const API_BASE_URL = AppSettings.apiUrl;


export class unidadeApi {

    static async listar(params: QueryParams): Promise<PagedResult<Unidade>> {
        const queryString = BuildQueryString(params);
        const response = await fetch(`${API_BASE_URL}/Unidade?${queryString}`, {
            method: "GET",
            headers: GetHeaders()
        });

        if (!response.ok) {
            throw new Error("Erro ao listar unidades");
        }
        return response.json();
    }
    
}