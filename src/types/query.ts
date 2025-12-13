export interface QueryParams {
  pageNumber: number;
  pageSize: number;
  searchBy?: string;
  searchTerm?: string;
  sortBy?: string;
  sortDescending: boolean;
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
