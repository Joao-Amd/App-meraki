export enum TipoPessoa {
  Fisica = 0,
  Juridica = 1,
}

export interface ClienteDto {
  nome: string;
  tipoPessoa: TipoPessoa;
  logradouro: string;
  numero?: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;
  telefone?: string;
  celular: string;
  email: string;
  razaoSocial?: string;
  nomeFantasia?: string;
  cpf: string;
  cnpj: string;
  inscricaoEstadual?: string;
  inscricaoMunicipal?: string;
}

export interface Cliente {
  id: string;
  identificacao: number;
  nome: string;
  tipoPessoa: TipoPessoa;
  cpf: string;
  dadosCorporativo?: DadosCorporativos;
  endereco: ClienteEndereco;
  contato: ClienteContato;
}

export interface DadosCorporativos {
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  inscricaoEstadual: string;
  inscricaoMunicipal: string;
}

export interface ClienteEndereco {
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;
}

export interface ClienteContato {
  telefone: string;
  celular: string;
  email: string;
}