import { Search, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FilterOption, SearchField } from "@/types/query";

interface ListFiltersProps {
  // Search (opcionais)
  searchFields?: SearchField[];
  searchField?: string;
  onSearchFieldChange?: (value: string) => void;
  searchTerm?: string;
  onSearchTermChange?: (value: string) => void;
  onSearch?: () => void;

  // Extra filters (opcional)
  extraFilters?: React.ReactNode;

  // Actions (opcional)
  actions?: React.ReactNode;
}

export function ListFilters({
  searchFields,
  searchField,
  onSearchFieldChange,
  searchTerm,
  onSearchTermChange,
  onSearch,
  extraFilters,
  actions,
}: ListFiltersProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && onSearch) {
      onSearch();
    }
  };

  return (
    <div className="bg-card rounded-lg shadow-md p-6 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        {extraFilters}

        {searchFields && searchField !== undefined && onSearchFieldChange && (
          <Select value={searchField} onValueChange={onSearchFieldChange}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Buscar por..." />
            </SelectTrigger>
            <SelectContent>
              {searchFields.map((field) => (
                <SelectItem key={field.value} value={field.value}>
                  {field.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {searchTerm !== undefined && onSearchTermChange && onSearch && (
          <div className="flex flex-1 gap-2">
            <Input
              placeholder="Digite para buscar..."
              value={searchTerm}
              onChange={(e) => onSearchTermChange(e.target.value)}
              onKeyDown={handleKeyPress}
              className="flex-1"
            />
            <Button onClick={onSearch} variant="secondary">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        )}

        {actions}
      </div>
    </div>
  );
}


interface SortableHeaderProps {
  field: string;
  label: string;
  currentSortBy?: string;
  sortDescending: boolean;
  onSort: (field: string) => void;
}

export function SortableHeader({
  field,
  label,
  currentSortBy,
  sortDescending,
  onSort,
}: SortableHeaderProps) {
  const getSortIcon = () => {
    if (currentSortBy !== field) {
      return <ArrowUpDown className="ml-1 h-4 w-4 text-muted-foreground" />;
    }
    return sortDescending ? (
      <ArrowDown className="ml-1 h-4 w-4" />
    ) : (
      <ArrowUp className="ml-1 h-4 w-4" />
    );
  };

  return (
    <div
      className="flex items-center cursor-pointer hover:bg-muted/50"
      onClick={() => onSort(field)}
    >
      {label}
      {getSortIcon()}
    </div>
  );
}

interface PaginationProps {
  pageNumber: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  pageSizeOptions?: number[];
}

export function Pagination({
  pageNumber,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 20, 50],
}: PaginationProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Itens por página:</span>
        <Select
          value={pageSize.toString()}
          onValueChange={(v) => onPageSizeChange(parseInt(v))}
        >
          <SelectTrigger className="w-[80px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {pageSizeOptions.map((size) => (
              <SelectItem key={size} value={size.toString()}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">
          Página {pageNumber} de {totalPages}
        </span>
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(pageNumber - 1)}
            disabled={pageNumber <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(pageNumber + 1)}
            disabled={pageNumber >= totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

interface FilterSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: FilterOption[];
  placeholder?: string;
  className?: string;
}

export function FilterSelect({
  value,
  onValueChange,
  options,
  placeholder,
  className = "w-full md:w-[160px]",
}: FilterSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}