import { useState, useEffect, useCallback } from "react";
import { Package, Plus, Building2, User as UserIcon, Phone, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { useToast } from "@/hooks/use-toast";
import { Estoque } from "@/types/estoques/estoque"
import { EstoqueApiService } from "@/services/estoques/estoqueApi"
import { useQueryParams } from "@/hooks/useQueryParams";
import { ListFilters, SortableHeader, Pagination, FilterSelect } from "@/components/ListFilters";
import { ItemApiService } from "@/services/itens/itemApi";
import { SearchList } from "@/components/SearchList";

const EstoqueList = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [Estoques, setEstoque] = useState<Estoque[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const { queryParams, setFilter, setPage, setPageSize } = useQueryParams();

    const [searchField, setSearchField] = useState<string>("Descricao");
    const [searchTerm, setSearchTerm] = useState("");

    const [selectedItem, setSelectedItem] = useState<{ id: string; descricao: string } | null>(null);

    const loadEstoques = useCallback(async () => {
        setIsLoading(true);
        try {
            const result = await EstoqueApiService.listar(queryParams);
            setEstoque(result.items ?? []);
            setTotalPages(result.totalPages);
            setTotalCount(result.totalCount);
        } catch (error) {
            toast({
                title: "Erro",
                description: "Não foi possível carregar os Estoques.",
                variant: "destructive",
            });
            setEstoque([]);
        } finally {
            setIsLoading(false);
        }
    }, [queryParams, toast]);

    useEffect(() => {
        loadEstoques();
    }, [loadEstoques]);

    const handleSearch = () => {
        if (searchTerm) {
            setFilter(searchField, searchTerm);
        } else {
            setFilter(searchField, "")
        }
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    const handleEditarEstoque = async (id: string) => {
        try {
            const estoque = await EstoqueApiService.buscarPorId(id);

            if (!estoque) {
                throw new Error("Estoque não encontrado.");
            }

            navigate(`/alterar/estoque`, { state: { estoque } });
        } catch (error: any) {
            let mensagem = "Erro ao buscar estoque.";

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
            <PageHeader icon={<Package className="h-6 w-6 text-primary" />}
                title="Estoques"
                subtitle={`${totalCount} item(s) encontrado(s)`} />

            <ListFilters
                extraFilters={
                    <div className="relative overflow-visible">
                        <SearchList
                            placeholder="Buscar item..."
                            onSearch={(term, page) =>
                                ItemApiService.listar({
                                    pageNumber: page,
                                    pageSize: 10,
                                    filters: {"descricao" : term},
                                    sortBy: "descricao",
                                    sortDescending: false,
                                })
                            }
                            onSelect={(item: { id: string; descricao: string }) => {
                                // ao selecionar, já aplica o filtro
                                setSelectedItem(item);
                                setFilter("IdItem", item.id);
                            }}
                            renderItem={(item: { id: string; descricao: string }) => <div>{item.descricao}</div>}
                            selectedItem={selectedItem ? selectedItem.descricao : ""}
                            setSelectedItem={() => {
                                // ao remover, limpa o filtro e lista tudo
                                setSelectedItem(null);
                                setFilter("IdItem", undefined);
                            }}
                        />
                    </div>
                }
            />
            <div className="table-fixed w-full">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-1/5">Item</TableHead>
                            <TableHead className="w-1/5">Unidade</TableHead>
                            <TableHead className="w-1/5">Saldo</TableHead>
                            <TableHead className="w-1/5">Preço total</TableHead>
                            <TableHead className="w-1/5 text-center">Editar</TableHead>
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
                        ) : Estoques.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                    Nenhum estoque encontrado
                                </TableCell>
                            </TableRow>
                        ) : (
                            Estoques.map((estoque) => (
                                <TableRow
                                    key={estoque.id}
                                    className="cursor-pointer hover:bg-muted/50"
                                >
                                    <TableCell className="w-1/5 font-normal text-purple-600">{estoque.item.descricao}</TableCell>
                                    <TableCell className="w-1/5 font-normal">{estoque.item.unidade.sigla}</TableCell>
                                    <TableCell className="w-1/5 font-medium">{estoque.saldo}</TableCell>
                                    <TableCell className="w-1/5 text-green-600">
                                        {new Intl.NumberFormat("pt-BR", {
                                            style: "currency",
                                            currency: "BRL",
                                        }).format(estoque.precoTotal)}
                                    </TableCell>
                                    <TableCell className="w-1/5 text-center">
                                        <Button variant="ghost" size="icon" onClick={() => handleEditarEstoque(estoque.id)}>
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

    )
};

export default EstoqueList;