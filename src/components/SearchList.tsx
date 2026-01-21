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
    <div className="relative w-full">
      <Input
        className="bg-gray-100 border-2 border-purple-400 focus:border-purple-600 focus:ring-purple-600 rounded-md"
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
      />

      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-purple-300 rounded-md shadow-lg max-h-[250px] overflow-y-auto">
          {items.length === 0 ? (
            <p className="p-2 text-xs text-gray-500">Nenhum resultado encontrado.</p>
          ) : (
            <>
              <div className="flex flex-col gap-[2px]">
                {items.map((item, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      onSelect(item);
                      setSearchTerm((item as any).sigla ?? "");
                      setOpen(false);
                    }}
                    className="px-2 py-1 cursor-pointer text-sm hover:bg-purple-50"
                  >
                    {renderItem(item)}
                  </div>
                ))}
              </div>

              <div className="flex gap-2 justify-center p-2 border-t">
                {Array.from({ length: totalPages }, (_, i) => (
                  <Button
                    key={i}
                    type="button"
                    className={`h-6 px-2 text-xs ${page === i + 1 ? "opacity-50 cursor-default" : ""}`}
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
            </>
          )}
        </div>
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

