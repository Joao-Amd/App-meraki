import { useState, useCallback } from "react";
import { QueryParams } from "@/types/query";

interface UseQueryParamsOptions {
  initialPageSize?: number;
}

export function useQueryParams(options: UseQueryParamsOptions = {}) {
  const { initialPageSize = 10 } = options;

  const [queryParams, setQueryParams] = useState<QueryParams>({
    pageNumber: 1,
    pageSize: initialPageSize,
    searchBy: undefined,
    searchTerm: undefined,
    sortBy: undefined,
    sortDescending: false,
  });

  const setSearch = useCallback((searchBy?: string, searchTerm?: string) => {
    setQueryParams((prev) => ({
      ...prev,
      pageNumber: 1,
      searchBy,
      searchTerm,
    }));
  }, []);

  const setSort = useCallback((field: string) => {
    setQueryParams((prev) => ({
      ...prev,
      sortBy: field,
      sortDescending: prev.sortBy === field ? !prev.sortDescending : false,
    }));
  }, []);

  const setPage = useCallback((page: number) => {
    setQueryParams((prev) => ({ ...prev, pageNumber: page }));
  }, []);

  const setPageSize = useCallback((size: number) => {
    setQueryParams((prev) => ({
      ...prev,
      pageSize: size,
      pageNumber: 1,
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setQueryParams({
      pageNumber: 1,
      pageSize: initialPageSize,
      searchBy: undefined,
      searchTerm: undefined,
      sortBy: undefined,
      sortDescending: false,
    });
  }, [initialPageSize]);

  return {
    queryParams,
    setQueryParams,
    setSearch,
    setSort,
    setPage,
    setPageSize,
    resetFilters,
  };
}