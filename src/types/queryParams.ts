export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface QueryParams {
  pageNumber: number;
  pageSize: number;
  searchBy?: string;
  searchTerm?: string;
  sortBy?: string;
  sortDescending: boolean;
}