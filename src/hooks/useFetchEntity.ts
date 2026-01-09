import { useState, useEffect } from "react";

export function useFetchEntity<T>(
  fetchFn: (id: string) => Promise<T>,
  id: string | undefined
) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!id) {
        setError("ID não informado");
        setLoading(false);
        return;
      }
      try {
        const result = await fetchFn(id);
        setData(result);
      } catch (err: any) {
        let msg = "Erro ao buscar dados";
        try {
          const parsed = JSON.parse(err.message || err.Message);
          msg = parsed.Message || msg;
        } catch {
          msg = err.Message || err.message || msg;
        }
        setError(msg);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, fetchFn]);

  return { data, error, loading };
}
