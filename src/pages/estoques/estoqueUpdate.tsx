import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { EstoqueApiService } from "@/services/estoques/estoqueApi"
import { toast } from "@/hooks/use-toast";
import { User, Save, X } from "lucide-react";
import { Estoque, EstoqueDto } from "@/types/estoques/estoque"

const estoqueSchema = z.object({
    saldo: z.coerce.number().optional().default(0),
});

export default function EstoqueUpdate() {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const estoque = location.state?.estoque as Estoque | undefined;

    const form = useForm<EstoqueDto>({
        resolver: zodResolver(estoqueSchema),
        defaultValues: {
            saldo: estoque.saldo ?? 0,
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
                                    <div className="md:col-span-3">
                                        <p className="text-sm font-medium text-muted-foreground">
                                            Descrição do item </p>
                                        <p className="text-base text-foreground bg-muted px-3 py-2 rounded-md">
                                            {estoque?.item?.descricao ?? "—"}
                                        </p>
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="saldo"
                                        render={({ field }) => (
                                            <FormItem className="md:col-span-2">
                                                <FormLabel>Saldo</FormLabel>
                                                <FormControl>
                                                    <div className="flex items-center gap-2">
                                                        <Input
                                                            placeholder="Informe saldo de estoque"
                                                            {...field}
                                                            className="flex-1"
                                                        />
                                                        <span className="text-sm text-muted-foreground"><strong>Unidade</strong> {estoque?.item?.unidade?.sigla ?? "—"} </span>
                                                    </div>
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
                                onClick={() => navigate("/estoque")}
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

    async function onSubmit(values: EstoqueDto) {
        setIsLoading(true);
        try {
            await EstoqueApiService.alterar(estoque.id!, values);

            toast({
                title: "Sucesso!",
                description: "Estoque alterado com sucesso.",
                duration: 3000,
            });
            navigate("/estoque");
        } catch (error: any) {
            let errorMessage = "Erro ao alterar estoque";
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
