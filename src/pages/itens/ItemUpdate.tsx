import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NumericFormat } from "react-number-format";
import { useLocation } from "react-router-dom";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ItemApiService } from "@/services/itens/itemApi";
import { unidadeApi } from "@/services/unidades/unidadeApi";
import { SearchList } from "@/components/SearchList";
import { toast } from "@/hooks/use-toast";
import { User, Save, X } from "lucide-react";
import { Item } from "@/types/itens/item";
import { Switch } from "@/components/ui/switch";

const itemSchema = z.object({
    descricao: z.string().min(1, "Descrição é obrigatória."),
    idUnidade: z.string().min(1, "Unidade é obrigatória."),
    preco: z.string().optional(),
    ativo: z.boolean().default(true),
});

export default function ItemUpdate() {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const item = location.state?.item as Item | undefined;
    const [selectedUnit, setSelectedUnit] = useState<{ id: string; sigla: string } | null>(item?.unidade ? { id: item.unidade.id, sigla: item.unidade.sigla } : null);

    const form = useForm<z.infer<typeof itemSchema>>({
        resolver: zodResolver(itemSchema),
        defaultValues: {
            descricao: item.descricao,
            idUnidade: item.idUnidade,
            preco: item?.preco != null ? String(item.preco) : "",
            ativo: item.ativo,
        },
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background p-6">
            <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
                <h1 className="text-2xl font-bold text-foreground">Alterar Item</h1>
                <p className="text-muted-foreground">Atualize os dados abaixo</p>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} autoComplete="off" className="space-y-6">
                        <Card className="shadow-lg border-border/50">
                            <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5 text-primary" />
                                    Dados
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="ativo"
                                        render={({ field }) => (
                                            <FormItem className="md:col-span-2">
                                                <div className="flex items-center gap-4 px-1 py-2">
                                                    <FormLabel className="text-base font-medium">Ativo</FormLabel>
                                                    <FormControl>
                                                        <Switch
                                                            checked={field.value}
                                                            onCheckedChange={field.onChange}
                                                        />
                                                    </FormControl>
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="descricao"
                                        render={({ field }) => (
                                            <FormItem className="md:col-span-2">
                                                <FormLabel>Descrição</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Informe uma descrição para o item" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="idUnidade"
                                        render={({ field }) => (
                                            <FormItem className="md:col-span-2">
                                                <FormLabel>Unidade</FormLabel>
                                                <FormControl>
                                                    <SearchList
                                                        placeholder="Buscar unidade..."
                                                        onSearch={(term, page) =>
                                                            unidadeApi.listar({
                                                                pageNumber: page,
                                                                pageSize: 10,
                                                                searchBy: "sigla",
                                                                searchTerm: term,
                                                                sortBy: "sigla",
                                                                sortDescending: false,
                                                            })
                                                        }
                                                        onSelect={(u: { id: string; sigla: string }) => {
                                                            form.setValue("idUnidade", u.id, { shouldValidate: true });
                                                            setSelectedUnit(u);
                                                        }}
                                                        renderItem={(u: { id: string; sigla: string }) => <div>{u.sigla}</div>}
                                                        selectedItem={selectedUnit ? selectedUnit.sigla : ""}
                                                        setSelectedItem={() => setSelectedUnit(null)}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="preco"
                                        render={({ field }) => (
                                            <FormItem className="md:col-span-2">
                                                <FormLabel>Preço</FormLabel>
                                                <FormControl>
                                                    <NumericFormat
                                                        value={field.value}
                                                        onValueChange={(values) => {
                                                            form.setValue("preco", values.value);
                                                        }}
                                                        thousandSeparator="."
                                                        decimalSeparator=","
                                                        prefix="R$ "
                                                        allowNegative={false}
                                                        customInput={Input}
                                                        placeholder="R$ 0,00"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex gap-3 justify-end">
                            <Button
                                type="button"
                                variant="outline"
                                size="lg"
                                onClick={() => navigate("/item")}
                                disabled={isLoading}
                            >
                                <X className="h-4 w-4" />
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                size="lg"
                                disabled={isLoading}
                                className="min-w-[150px]"
                            >
                                <Save className="h-4 w-4" />
                                {isLoading ? "Salvando..." : "Salvar Alterações"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );

    async function onSubmit(values: z.infer<typeof itemSchema>) {
        setIsLoading(true);
        try {
            const precoNormalizado = values.preco
                ? parseFloat(values.preco.replace(",", "."))
                : 0;

            await ItemApiService.alterar(item.id!, {
                descricao: values.descricao,
                idUnidade: values.idUnidade,
                preco: precoNormalizado,
                ativo: values.ativo,
            });

            toast({
                title: "Sucesso!",
                description: "Item alterado com sucesso.",
                duration: 3000,
            });
            navigate("/item");
        } catch (error: any) {
            let errorMessage = "Erro ao alterar item";
            try {
                const parsed = JSON.parse(error.message || error.Message);
                errorMessage = parsed.Message || errorMessage;
            } catch {
                errorMessage = error.Message || error.message || errorMessage;
            }
            toast({
                title: "Erro",
                description: errorMessage,
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    }
}
