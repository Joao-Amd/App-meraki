import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type SearchListProps<T> = {
  placeholder: string;
  onSearch: (term: string, page: number) => Promise<{ items: T[]; totalPages: number }>;
  renderItem: (item: T) => React.ReactNode;
  onSelect: (item: T) => void;
};

export function SearchList<T>({
  placeholder,
  onSearch,
  renderItem,
  onSelect,
}: SearchListProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // debounce de 1s
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchTerm.length > 0) {
        fetchData(searchTerm, page);
      } else {
        setItems([]); // não mostra nada antes de buscar
      }
    }, 1000);
    return () => clearTimeout(timeout);
  }, [searchTerm, page]);

  const fetchData = async (term: string, page: number) => {
    setLoading(true);
    try {
      const result = await onSearch(term, page);
      setItems(result.items);
      setTotalPages(result.totalPages);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setSearchTerm(""); // limpa → lista tudo
      setPage(1);
    }
  };

  return (
    <div className="border rounded-md p-4 bg-muted/50 shadow-sm space-y-4">
      {/* Campo de busca */}
      <Input
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyDown}
        className="mb-2"
      />

      {/* Lista ou mensagem */}
      {searchTerm.length === 0 ? null : (
        loading ? (
          <p>Carregando...</p>
        ) : items.length === 0 ? (
          <p>Nenhum resultado encontrado.</p>
        ) : (
          <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto">
            {items.map((item, i) => (
              <div
                key={i}
                onClick={() => onSelect(item)}
                className="border rounded p-2 cursor-pointer hover:bg-primary/10"
              >
                {renderItem(item)}
              </div>
            ))}
          </div>
        )
      )}

      {/* Paginação só aparece se houver resultados */}
      {searchTerm.length > 0 && items.length > 0 && (
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
      )}
    </div>
  );
}
