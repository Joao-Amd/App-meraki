import { useState, useEffect, useCallback } from "react";
import { Users, Search, Plus, Building2, User as UserIcon, Phone, Mail, MapPin, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { Cliente, TipoPessoa} from "@/types/Clientes/cliente";
import { QueryParams, PagedResult } from "@/types/QueryParams";
import { ClienteApiService } from "@/services/clientes/clienteApi";
import { useToast } from "@/hooks/use-toast";

const SEARCH_FIELDS = [
  { value: "Nome", label: "Nome" },
  { value: "Cpf", label: "CPF" },
  { value: "Identificacao", label: "Identificação" },
];

const TIPO_PESSOA_OPTIONS = [
  { value: "all", label: "Todos" },
  { value: "0", label: "Pessoa Física" },
  { value: "1", label: "Pessoa Jurídica" },
];

const ClienteList = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [queryParams, setQueryParams] = useState<QueryParams>({
    pageNumber: 1,
    pageSize: 10,
    searchBy: undefined,
    searchTerm: undefined,
    sortBy: undefined,
    sortDescending: false,
  });

  const [searchField, setSearchField] = useState<string>("Nome");
  const [searchTerm, setSearchTerm] = useState("");
  const [tipoPessoaFilter, setTipoPessoaFilter] = useState<string>("all");

  const loadClientes = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await ClienteApiService.listar(queryParams);
      setClientes(result.items);
      setTotalPages(result.totalPages);
      setTotalCount(result.totalCount);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar os clientes.",
        variant: "destructive",
      });
      setClientes([]);
    } finally {
      setIsLoading(false);
    }
  }, [queryParams, toast]);

  useEffect(() => {
    loadClientes();
  }, [loadClientes]);

  const handleSearch = () => {
    let finalSearchBy = searchTerm ? searchField : undefined;
    let finalSearchTerm = searchTerm || undefined;

    // Se há filtro de tipoPessoa e não há busca por texto, usa tipoPessoa
    if (tipoPessoaFilter && !searchTerm) {
      finalSearchBy = "TipoPessoa";
      finalSearchTerm = tipoPessoaFilter;
    }

    setQueryParams((prev) => ({
      ...prev,
      pageNumber: 1,
      searchBy: finalSearchBy,
      searchTerm: finalSearchTerm,
    }));
  };

  const handleTipoPessoaChange = (value: string) => {
    setTipoPessoaFilter(value);
    if (value && value !== "all") {
      setQueryParams((prev) => ({
        ...prev,
        pageNumber: 1,
        searchBy: "TipoPessoa",
        searchTerm: value,
      }));
    } else {
      // Limpa o filtro de tipo pessoa
      setQueryParams((prev) => ({
        ...prev,
        pageNumber: 1,
        searchBy: searchTerm ? searchField : undefined,
        searchTerm: searchTerm || undefined,
      }));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleSort = (field: string) => {
    setQueryParams((prev) => ({
      ...prev,
      sortBy: field,
      sortDescending: prev.sortBy === field ? !prev.sortDescending : false,
    }));
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setQueryParams((prev) => ({ ...prev, pageNumber: newPage }));
    }
  };

  const handlePageSizeChange = (size: string) => {
    setQueryParams((prev) => ({
      ...prev,
      pageSize: parseInt(size),
      pageNumber: 1,
    }));
  };

  const getSortIcon = (field: string) => {
    if (queryParams.sortBy !== field) {
      return <ArrowUpDown className="ml-1 h-4 w-4 text-muted-foreground" />;
    }
    return queryParams.sortDescending ? (
      <ArrowDown className="ml-1 h-4 w-4" />
    ) : (
      <ArrowUp className="ml-1 h-4 w-4" />
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Clientes</h1>
            <p className="text-muted-foreground">{totalCount} cliente(s) encontrado(s)</p>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-card rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <Select value={tipoPessoaFilter} onValueChange={handleTipoPessoaChange}>
            <SelectTrigger className="w-full md:w-[160px]">
              <SelectValue placeholder="Tipo Pessoa" />
            </SelectTrigger>
            <SelectContent>
              {TIPO_PESSOA_OPTIONS.map((option) => (
                <SelectItem key={option.value || "all"} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={searchField} onValueChange={setSearchField}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Buscar por..." />
            </SelectTrigger>
            <SelectContent>
              {SEARCH_FIELDS.map((field) => (
                <SelectItem key={field.value} value={field.value}>
                  {field.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex flex-1 gap-2">
            <Input
              placeholder="Digite para buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyPress}
              className="flex-1"
            />
            <Button onClick={handleSearch} variant="secondary">
              <Search className="h-4 w-4" />
            </Button>
          </div>

          <Button onClick={() => navigate("/cadastro/cliente")}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Cliente
          </Button>
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-card rounded-lg shadow-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort("Identificacao")}
              >
                <div className="flex items-center">
                  ID
                  {getSortIcon("Identificacao")}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort("Nome")}
              >
                <div className="flex items-center">
                  Nome
                  {getSortIcon("Nome")}
                </div>
              </TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>CPF/CNPJ</TableHead>
              <TableHead>Contato</TableHead>
              <TableHead>Cidade</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    <span className="ml-2">Carregando...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : clientes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Nenhum cliente encontrado
                </TableCell>
              </TableRow>
            ) : (
              clientes.map((cliente) => (
                <TableRow
                  key={cliente.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => navigate(`/cadastro/cliente/${cliente.id}`)}
                >
                  <TableCell className="font-medium">{cliente.identificacao}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {cliente.tipoPessoa === TipoPessoa.Juridica ? (
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <UserIcon className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span>{cliente.nome}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={cliente.tipoPessoa === TipoPessoa.Juridica ? "default" : "secondary"}>
                      {cliente.tipoPessoa === TipoPessoa.Juridica ? "Jurídica" : "Física"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {cliente.tipoPessoa === TipoPessoa.Juridica
                      ? cliente.dadosCorporativo?.cnpj
                      : cliente.cpf}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1 text-sm">
                      {cliente.contato?.celular && (
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {cliente.contato.celular}
                        </span>
                      )}
                      {cliente.contato?.email && (
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {cliente.contato.email}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {cliente.endereco && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {cliente.endereco.cidade}/{cliente.endereco.uf}
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginação */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Itens por página:</span>
          <Select
            value={queryParams.pageSize.toString()}
            onValueChange={handlePageSizeChange}
          >
            <SelectTrigger className="w-[80px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Página {queryParams.pageNumber} de {totalPages}
          </span>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(queryParams.pageNumber - 1)}
              disabled={queryParams.pageNumber <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(queryParams.pageNumber + 1)}
              disabled={queryParams.pageNumber >= totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClienteList;
