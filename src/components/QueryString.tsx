import { QueryParams } from "@/types/query";

const BuildQueryString = (params: QueryParams): string => {
  const searchParams = new URLSearchParams();

  searchParams.append("pageNumber", params.pageNumber.toString());
  searchParams.append("pageSize", params.pageSize.toString());
  searchParams.append("sortDescending", params.sortDescending.toString());

  if (params.sortBy) {
    searchParams.append("sortBy", params.sortBy);
  }

  if (params.filters) {
    const filtersString = Object.entries(params.filters)
      .filter(([_, value]) => value && value.trim().length > 0) 
      .map(([key, value]) => `${key}:${value.trim()}`)          
      .join(",");

    if (filtersString) {
      searchParams.append("filters", filtersString);
    }
  }

  return searchParams.toString();
};

export {BuildQueryString}