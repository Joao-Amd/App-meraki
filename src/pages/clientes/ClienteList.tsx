import { useState, useEffect, useCallback } from "react";
import { Users, Plus, Building2, User as UserIcon, Phone, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PageHeader from "@/components/ui/PageHeader";
import { Pencil } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { Cliente, TipoPessoa } from "@/types/clientes/cliente";
import { ClienteApiService } from "@/services/clientes/clienteApi";
import { useToast } from "@/hooks/use-toast";
import { useQueryParams } from "@/hooks/useQueryParams";
import { ListFilters, SortableHeader, Pagination, FilterSelect } from "@/components/ListFilters";

const SEARCH_FIELDS = [
  { value: "Nome", label: "Nome" },
  { value: "Cpf", label: "CPF" },
  { value: "Identificacao", label: "Identificação" },
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

  const { queryParams, setSearch, setSort, setPage, setPageSize } = useQueryParams();

  const [searchField, setSearchField] = useState<string>("Nome");
  const [searchTerm, setSearchTerm] = useState("");
  const [tipoPessoaFilter, setTipoPessoaFilter] = useState<string>("all");

  const loadClientes = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await ClienteApiService.listar(queryParams);
      setClientes(result.items ?? []);
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

    if (tipoPessoaFilter && tipoPessoaFilter !== "all" && !searchTerm) {
      finalSearchBy = "TipoPessoa";
      finalSearchTerm = tipoPessoaFilter;
    }

    setSearch(finalSearchBy, finalSearchTerm);
  };

  const handleTipoPessoaChange = (value: string) => {
    setTipoPessoaFilter(value);
    if (value && value !== "all") {
      setSearch("TipoPessoa", value);
    } else {
      setSearch(searchTerm ? searchField : undefined, searchTerm || undefined);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleEditarCliente = async (id: string) => {
    try {
      const cliente = await ClienteApiService.buscarPorId(id);
      navigate(`/alterar/cliente`, { state: { cliente } });
    } catch (error: any) {
      let mensagem = "Erro ao buscar cliente.";
      try {
        const parsed = JSON.parse(error.message || error.Message);
        mensagem = parsed.Message || mensagem;
      } catch {
        mensagem = error.Message || error.message || mensagem;
      }
      toast({
        title: "Erro",
        description: mensagem,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader icon={<Users className="h-6 w-6 text-primary" />}
        title="Clientes"
        subtitle={`${totalCount} cliente(s) encontrado(s)`} />

      <ListFilters
        searchFields={SEARCH_FIELDS}
        searchField={searchField}
        onSearchFieldChange={setSearchField}
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        onSearch={handleSearch}
        extraFilters={
          <FilterSelect
            value={tipoPessoaFilter}
            onValueChange={handleTipoPessoaChange}
            options={TIPO_PESSOA_OPTIONS}
            placeholder="Tipo Pessoa"
          />
        }
        actions={
          <Button onClick={() => navigate("/cadastro/cliente")}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Cliente
          </Button>
        }
      />

      <div className="table-fixed w-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <SortableHeader
                  field="Identificacao"
                  label="Identificação"
                  currentSortBy={queryParams.sortBy}
                  sortDescending={queryParams.sortDescending}
                  onSort={setSort}
                />
              </TableHead>
              <TableHead>
                <SortableHeader
                  field="Nome"
                  label="Nome"
                  currentSortBy={queryParams.sortBy}
                  sortDescending={queryParams.sortDescending}
                  onSort={setSort}
                />
              </TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="w-1/6">Ativo</TableHead>
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
                >
                  <TableCell className="font-normal text-purple-600">{cliente.identificacao}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {cliente.tipoPessoa === TipoPessoa.Juridica ? (
                        <Building2 className="h-4 w-4  text-blue-600" />
                      ) : (
                        <UserIcon className="h-4 w-4 text-green-600" />
                      )}
                      <span className="font-bold">
                        {cliente.tipoPessoa === TipoPessoa.Juridica
                          ? cliente.dadosCorporativo.nomeFantasia + " (" + cliente.nome + ")"
                          : cliente.nome}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={cliente.tipoPessoa === TipoPessoa.Juridica ? "default" : "secondary"}
                      className={
                        cliente.tipoPessoa === TipoPessoa.Juridica
                          ? "bg-blue-100 text-blue-700 border border-blue-300"
                          : "bg-green-100 text-green-700 border border-green-300"
                      }
                    >
                      {cliente.tipoPessoa === TipoPessoa.Juridica ? "Jurídica" : "Física"}
                    </Badge>
                  </TableCell>
                  <TableCell className="w-1/6 font-normal">{cliente.ativo ? "Ativo" : "Inativo"}</TableCell>
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
                  <TableCell className="w-1/6 text-center">
                    <Button variant="ghost" size="icon" onClick={() => handleEditarCliente(cliente.id)}>
                      <Pencil className="h-4 w-4 text-blue-600" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Pagination
        pageNumber={queryParams.pageNumber}
        totalPages={totalPages}
        pageSize={queryParams.pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={setPageSize}
      />
    </div>
  );
};

export default ClienteList;