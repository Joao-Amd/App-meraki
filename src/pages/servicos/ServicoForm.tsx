import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PageFormHeader from "@/components/ui/PageFormHeader";
import { useNavigate } from "react-router-dom";
import { useQueryParams } from "@/hooks/useQueryParams";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ServicoApiService } from "@/services/servicos/servicoApi";
import { toast } from "@/hooks/use-toast";
import { User, Save, X } from "lucide-react";

const servicoSchema = z.object({
  descricao: z.string().min(1, "Descrição é obrigatório."),
  preco: z.string().optional(),
});

export default function ServicoForm() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { queryParams } = useQueryParams();

  const form = useForm<z.infer<typeof servicoSchema>>({
    resolver: zodResolver(servicoSchema),
    defaultValues: {
      descricao: "",
      preco: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof servicoSchema>) => {
    setIsLoading(true);
    try {
      await ServicoApiService.inserir(values as any);
      toast({
        title: "Sucesso!",
        description: "Serviço cadastrado com sucesso.",
        duration: 3000,
      });
      form.reset();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao cadastrar serviço",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background p-6">
      <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
        <PageFormHeader
          title="Cadastro de serviço"
          subtitle="Preencha os dados abaixo para continuar"
        />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                    name="descricao"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Descrição</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Informe uma descrição para o serviço"
                            {...field}
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
                          <Input placeholder="00,00" {...field} />
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
                onClick={() => navigate("/Servico")}
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
                {isLoading ? "Salvando..." : "Salvar serviço"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
