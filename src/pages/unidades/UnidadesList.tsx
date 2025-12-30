import { useEffect, useState, useCallback } from "react";
import { unidadeApi } from "@/services/unidades/unidadeApi";
import { Unidade } from "@/types/unidades/unidade";
import { useQueryParams } from "@/hooks/useQueryParams";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const UnidadeList = () => {
    const { toast } = useToast();
    const [unidades, setUnidade] = useState<Unidade[]>([]);
    const [isLoadingUnidade, setIsLoadingUnidade] = useState(false);
    const { queryParams, setSearch, setPage } = useQueryParams();
    const [totalPages, setTotalPages] = useState(1);

    const loadUnidades = useCallback(async () => {
        setIsLoadingUnidade(true);
        try {
            const result = await unidadeApi.listar(queryParams);
            setUnidade(result.items ?? []);
            setTotalPages(result.totalPages);
        } catch (error) {
            toast({
                title: "Erro",
                description: "Não foi possível carregar as unidades.",
                variant: "destructive",
            });
            setUnidade([]);
        } finally {
            setIsLoadingUnidade(false);
        }
    }, [queryParams, toast]);

    useEffect(() => {
        loadUnidades();
    }, [loadUnidades]);

    return (
        <div className="container mx-auto px-4 py-8 space-y-6">
            {/* Campo de busca */}
            <Input
                placeholder="Buscar unidade..."
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-md"
            />

            {/* Grid de cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {isLoadingUnidade ? (
                    <p>Carregando...</p>
                ) : unidades.length === 0 ? (
                    <p>Nenhuma unidade encontrada.</p>
                ) : (
                    unidades.map((u) => (
                        <Card key={u.id}>
                            <CardHeader>
                                <CardTitle>{u.sigla + " (" + u.identificacao + ")"}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <p><strong>Id:</strong> {u.id}</p>
                                <p><strong>Descrição:</strong> {u.descricao}</p>
                                <p><strong>Sigla:</strong> {u.sigla}</p>
                                <p><strong>Fator:</strong> {u.fator}</p>
                            </CardContent>
                        </Card>
                    ))

                )}
            </div>

            {/* Paginação */}
            <div className="flex gap-2 justify-center">
                {Array.from({ length: totalPages }, (_, i) => (
                    <Button
                        key={i}
                        variant="outline"
                        onClick={() => setPage(i + 1)}
                    >
                        {i + 1}
                    </Button>
                ))}
            </div>
        </div>
    );
};

export default UnidadeList;
