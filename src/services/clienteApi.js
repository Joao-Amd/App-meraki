const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export class ClienteApiService {
  static async inserir(clienteDto) {
    const response = await fetch(`${API_URL}/Cadastros/Cliente`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(clienteDto),
    });

    if (!response.ok) {
      throw new Error(`Erro ao inserir cliente: ${response.statusText}`);
    }

    return response;
  }

  static async alterar(idCliente, clienteDto) {
    const response = await fetch(`${API_URL}/Cadastros/Cliente/${idCliente}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(clienteDto),
    });

    if (!response.ok) {
      throw new Error(`Erro ao alterar cliente: ${response.statusText}`);
    }

    return response;
  }

  static async listar() {
    const response = await fetch(`${API_URL}/Cadastros/Cliente`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Erro ao listar clientes: ${response.statusText}`);
    }

    return response.json();
  }

  static async buscarPorId(idCliente) {
    const response = await fetch(`${API_URL}/Cadastros/Cliente/${idCliente}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar cliente: ${response.statusText}`);
    }

    return response.json();
  }
}