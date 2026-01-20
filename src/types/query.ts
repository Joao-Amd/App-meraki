export interface QueryParams {
  pageNumber: number;
  pageSize: number;
  sortBy?: string;
  sortDescending: boolean;
  filters?: Record<string, string>;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface FilterOption {
  value: string;
  label: string;
}

export interface SearchField {
  value: string;
  label: string;
}

