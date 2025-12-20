import { QueryParams } from "@/types/query";


const BuildQueryString = (params: QueryParams): string => {
        const searchParams = new URLSearchParams();
        searchParams.append("pageNumber", params.pageNumber.toString());
        searchParams.append("pageSize", params.pageSize.toString());
        searchParams.append("sortDescending", params.sortDescending.toString());

        if (params.searchBy) {
            searchParams.append("searchBy", params.searchBy);
        }
        if (params.searchTerm) {
            searchParams.append("searchTerm", params.searchTerm);
        }
        if (params.sortBy) {
            searchParams.append("sortBy", params.sortBy);
        }

        return searchParams.toString();
    };


    export {BuildQueryString}