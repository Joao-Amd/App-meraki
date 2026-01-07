import { useState, useEffect, useCallback } from "react";
import { Package, Plus, Building2, User as UserIcon, Phone, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/ui/PageHeader";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Servico } from "@/types/servicos/servico";
import { ServicoApiService } from "@/services/servicos/servicoApi";
import { useQueryParams } from "@/hooks/useQueryParams";
import { ListFilters, SortableHeader, Pagination, FilterSelect } from "@/components/ListFilters";

const SEARCH_FIELDS = [
    { value: "Descricao", label: "Descrição" },
    { value: "Identificacao", label: "Identificação" },
];

const ATIVO_INATIVO = [
    { value: "all", label: "Todos" },
    { value: "1", label: "Ativo" },
    { value: "0", label: "Inativo" },
];

const ServicoList = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [servicos, setServico] = useState<Servico[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const { queryParams, setSearch, setSort, setPage, setPageSize } = useQueryParams();

    const [searchField, setSearchField] = useState<string>("Descricao");
    const [searchTerm, setSearchTerm] = useState("");
    const [ativoInativo, setAtivoInativo] = useState<string>("1");

    const loadservicos = useCallback(async () => {
        setIsLoading(true);
        try {
            const result = await ServicoApiService.listar(queryParams);
            setServico(result.items ?? []);
            setTotalPages(result.totalPages);
            setTotalCount(result.totalCount);
        } catch (error) {
            toast({
                title: "Erro",
                description: "Não foi possível carregar os serviços.",
                variant: "destructive",
            });
            setServico([]);
        } finally {
            setIsLoading(false);
        }
    }, [queryParams, toast]);

    useEffect(() => {
        loadservicos();
    }, [loadservicos]);

    const handleSearch = () => {
        let finalSearchBy = searchTerm ? searchField : undefined;
        let finalSearchTerm = searchTerm || undefined;

        if (ativoInativo && ativoInativo !== "all" && !searchTerm) {
            finalSearchBy = "Ativo";
            finalSearchTerm = ativoInativo;
        }

        setSearch(finalSearchBy, finalSearchTerm);
    };

    const handleEstadoServicoChange = (value: string) => {
        setAtivoInativo(value);
        if (value && value !== "all") {
            setSearch("Ativo", value);
        } else {
            setSearch(searchTerm ? searchField : undefined, searchTerm || undefined);
        }
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    return (

        <div className="container mx-auto px-4 py-8">
            <PageHeader icon={<Package className="h-6 w-6 text-primary" />}
                title="servicos"
                subtitle={`${totalCount} Serviço(s) encontrado(s)`} />

            <ListFilters
                searchFields={SEARCH_FIELDS}
                searchField={searchField}
                onSearchFieldChange={setSearchField}
                searchTerm={searchTerm}
                onSearchTermChange={setSearchTerm}
                onSearch={handleSearch}
                extraFilters={
                    <FilterSelect
                        value={ativoInativo}
                        onValueChange={handleEstadoServicoChange}
                        options={ATIVO_INATIVO}
                        placeholder="Ativo"
                    />
                }
                actions={
                    <Button onClick={() => navigate("/cadastro/Servico")}>
                        <Plus className="h-4 w-4 mr-2" />
                        Novo Serviço
                    </Button>
                }
            />

            <div className="bg-card rounded-lg shadow-md overflow-hidden">
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
                            <TableHead>Ativo</TableHead>
                            <TableHead>Descrição</TableHead>
                            <TableHead>
                                <SortableHeader
                                    field="Preco"
                                    label="Preço"
                                    currentSortBy={queryParams.sortBy}
                                    sortDescending={queryParams.sortDescending}
                                    onSort={setSort}
                                />
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                    <div className="flex Servicos-center justify-center">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                                        <span className="ml-2">Carregando...</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : servicos.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                    Nenhum Serviço encontrado
                                </TableCell>
                            </TableRow>
                        ) : (

                            servicos.map((Servico) => (
                                <TableRow
                                    key={Servico.id}
                                    className="cursor-pointer hover:bg-muted/50"
                                >
                                    <TableCell className="font-normal text-purple-600">{Servico.identificacao}</TableCell>
                                    <TableCell className="font-normal">{Servico.ativo ? "Ativo" : "Inativo"}</TableCell>
                                    <TableCell className="font-medium">{Servico.descricao}</TableCell>
                                    <TableCell className="font-medium text-green-600">{Servico.preco}</TableCell>
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

    )
};

export default ServicoList;