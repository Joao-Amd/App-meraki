import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type SearchListProps<T> = {
  placeholder: string;
  onSearch: (term: string, page: number) => Promise<{ items: T[]; totalPages: number }>;
  renderItem: (item: T) => React.ReactNode;
  onSelect: (item: T) => void;
  selectedItem?: string; // sigla selecionada (controlado pelo pai)
  setSelectedItem?: (value: string | null) => void; // limpar seleção (controlado pelo pai)
};

export function SearchList<T>({
  placeholder,
  onSearch,
  renderItem,
  onSelect,
  selectedItem,
  setSelectedItem,
}: SearchListProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [open, setOpen] = useState(false);

  const emptySearchDoneRef = useRef(false);
  const skipNextFetchRef = useRef(false);

  const fetchData = async (term: string, pageNum: number) => {
    setLoading(true);
    try {
      const result = await onSearch(term, pageNum);
      setItems(result.items);
      setTotalPages(result.totalPages);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open) return;
    if (skipNextFetchRef.current) {
      skipNextFetchRef.current = false;
      return;
    }
    const timeout = setTimeout(() => {
      fetchData(searchTerm.trim(), page);
    }, 500);
    return () => clearTimeout(timeout);
  }, [searchTerm, page, open]);

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Backspace" || e.key === "Delete") && selectedItem && setSelectedItem) {
      setSelectedItem(null);
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();

      const term = searchTerm.trim();

      // impede múltiplas chamadas vazias
      if (term.length === 0) {
        if (!emptySearchDoneRef.current) {
          setPage(1);
          setOpen(true);
          skipNextFetchRef.current = true;
          await fetchData("", 1);
          emptySearchDoneRef.current = true;
        }
        return;
      }

      // força buscar antes de selecionar
      await fetchData(term, 1);

      if (items.length > 0) {
        onSelect(items[0]);
        setSearchTerm((items[0] as any).sigla ?? term);
      } else {
        onSelect({ sigla: term, id: term } as unknown as T);
        setSearchTerm(term);
      }
      setOpen(false);
      emptySearchDoneRef.current = false;
    }
  };

  const currentValue = searchTerm.length > 0 ? searchTerm : (selectedItem ?? "");

  return (
    <div className="border rounded-md p-4 bg-muted/50 shadow-sm space-y-4">
      <Input
        placeholder={placeholder}
        value={currentValue}
        onChange={(e) => {
          if (selectedItem && setSelectedItem) {
            setSelectedItem(null);
          }
          setSearchTerm(e.target.value);
          setOpen(true);
        }}
        onKeyDown={handleKeyDown}
        className="mb-2"
      />

      {open && (
        <>
          {items.length === 0 ? (
            <p className="text-xs text-gray-500">Nenhum resultado encontrado.</p>
          ) : (
            <div className="flex flex-col gap-[2px] max-h-[150px] overflow-y-auto overflow-x-hidden">
              {items.map((item, i) => (
                <div
                  key={i}
                  onClick={() => {
                    onSelect(item);
                    setSearchTerm((item as any).sigla ?? "");
                    setOpen(false);
                  }}
                  className="w-full rounded px-2 py-1 cursor-pointer text-[12px] leading-tight transition duration-200 hover:bg-primary/10 hover:shadow-sm hover:scale-[1.01] select-none"
                >
                  {renderItem(item)}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {open && items.length > 0 && (
        <div className="flex gap-2 justify-center">
          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i}
              type="button"
              className={`h-6 px-1 text-xs select-none ${page === i + 1 ? "opacity-50 cursor-default" : ""
                }`}
              variant="outline"
              disabled={page === i + 1}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                if (page !== i + 1) {
                  setPage(i + 1);
                  setOpen(true);
                }
              }}
            >
              {i + 1}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}

