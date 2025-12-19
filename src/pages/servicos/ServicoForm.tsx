import { Wrench } from "lucide-react";

const ServicoForm = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Wrench className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Cadastro de Serviços</h1>
        </div>
        <p className="text-muted-foreground">
          Gerencie os tipos de serviços oferecidos
        </p>
      </div>

      <div className="bg-card rounded-lg shadow-md p-6">
        <p className="text-muted-foreground">Em desenvolvimento...</p>
      </div>
    </div>
  );
};

export default ServicoForm;