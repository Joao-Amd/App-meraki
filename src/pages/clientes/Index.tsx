import { useState, useEffect } from "react";
import { Users, Search, Plus, Building2, User as UserIcon, Phone, Mail, MapPin } from "lucide-react";
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
import { useNavigate } from "react-router-dom";
import { Cliente, TipoPessoa } from "@/types/cliente";
import { ClienteApiService } from "@/services/clientes/clienteApi";
import { useToast } from "@/hooks/use-toast";

const ClienteList = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadClientes();
  }, []);

  const loadClientes = async () => {
    try {
      const data = await ClienteApiService.listar();
      setClientes(data);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar os clientes. Verifique a conexão com o servidor.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredClientes = clientes.filter((cliente) =>
    cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.cpf?.includes(searchTerm) ||
    cliente.dadosCorporativo?.cnpj?.includes(searchTerm)
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Clientes</h1>
        </div>
        <p className="text-muted-foreground">Gerencie todos os clientes cadastrados</p>
      </div>

      <div className="bg-card rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, CPF ou CNPJ..."
              value={searchTerm}
              // onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  loadClientes();
                }
              }}
              className="pl-10"
            />
          </div>
          <Button onClick={() => navigate("/cadastro/cliente")}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Cliente
          </Button>
        </div>
      </div>

      <div className="bg-card rounded-lg shadow-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nome</TableHead>
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
                  Carregando...
                </TableCell>
              </TableRow>
            ) : filteredClientes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Nenhum cliente encontrado
                </TableCell>
              </TableRow>
            ) : (
              filteredClientes.map((cliente) => (
                <TableRow key={cliente.id} className="cursor-pointer hover:bg-muted/50">
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
    </div>
  );
};

export default ClienteList;