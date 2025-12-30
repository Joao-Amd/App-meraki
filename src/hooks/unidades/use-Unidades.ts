import { useEffect, useState } from "react";
import { unidadeApi } from "@/services/unidades/unidadeApi";
import { Unidade } from "@/types/unidades/unidade";

export function useUnidades(queryParams?: any) {
  const [unidades, setUnidades] = useState<Unidade[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUnidades = async () => {
      setLoading(true);
      try {
        const result = await unidadeApi.listar(queryParams);
        setUnidades(result.items ?? []);
      } finally {
        setLoading(false);
      }
    };
    fetchUnidades();
  }, [queryParams]); 

  return { unidades, loading };
}
