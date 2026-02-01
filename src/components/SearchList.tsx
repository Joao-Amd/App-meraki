import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function SearchList<T>({
  placeholder,
  onSearch,
  onSelect,
  renderItem,
  selectedItem,
  setSelectedItem,
  getLabel,
}: {
  placeholder: string;
  onSearch: (term: string, page: number) => Promise<{ items: T[]; totalCount: number }>;
  onSelect: (item: T) => void;
  renderItem: (item: T) => React.ReactNode;
  selectedItem?: T | null;   // agora é o objeto
  setSelectedItem?: (item: T | null) => void;
  getLabel: (item: T) => string; // obrigatório
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [items, setItems] = useState<T[]>([]);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      const delayDebounce = setTimeout(() => {
        onSearch(searchTerm, page).then((res) => {
          setItems(res.items);
          setTotalPages(Math.ceil(res.totalCount / 5));
        });
      }, 500);
      return () => clearTimeout(delayDebounce);
    }
  }, [searchTerm, page, open]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      if (items.length === 0) {
        onSearch(searchTerm, page).then((res) => {
          setItems(res.items);
          setTotalPages(Math.ceil(res.totalCount / 5));
          setOpen(true);
        });
      } else {
        const first = items[0];
        onSelect(first);
        if (setSelectedItem) setSelectedItem(first);
        setSearchTerm(getLabel(first));
        setOpen(false);
      }
    }
  }

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
        setSearchTerm("");
        setItems([]);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative w-full">
      <Input
        className="bg-gray-100 border-2 border-purple-400 focus:border-purple-600 focus:ring-purple-600 rounded-md"
        placeholder={placeholder}
        value={selectedItem ? getLabel(selectedItem) : searchTerm}
        onChange={(e) => {
          const value = e.target.value;

          if (selectedItem && setSelectedItem) {
            setSelectedItem(null);
          }

          setSearchTerm(value);

          if (value.trim() !== "") {
            setOpen(true);
          } else {
            setOpen(false); 
            setItems([]);
          }
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
                      if (setSelectedItem) setSelectedItem(item);
                      setSearchTerm(getLabel(item));
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
    </div>
  );
}
