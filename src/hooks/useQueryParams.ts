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
    sortBy: undefined,
    sortDescending: false,
    filters: {}
  });

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

const setFilter = useCallback((key: string, value: string) => {
  setQueryParams((prev) => ({
    ...prev,
    pageNumber: 1,
    filters: {
      ...(prev.filters ?? {}),
      [key]: value,
    },
  }));
}, []);

const resetFilters = useCallback(() => {
  setQueryParams({
    pageNumber: 1,
    pageSize: initialPageSize,
    sortBy: undefined,
    sortDescending: false,
    filters: {},
  });
}, [initialPageSize]);


  return {
    queryParams,
    setQueryParams,
    setSort,
    setPage,
    setPageSize,
    resetFilters,
    setFilter
  };
}