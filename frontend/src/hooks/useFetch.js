import { useEffect, useState } from "react";
import api from "../services/api";

export function useFetch(url, dependencies = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function fetchData() {
      try {
        setLoading(true);
        const response = await api.get(url);
        if (active) {
          setData(response.data);
          setError("");
        }
      } catch (err) {
        if (active) {
          setError(err.response?.data?.message || "Failed to load data.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    fetchData();
    return () => {
      active = false;
    };
  }, dependencies);

  return { data, loading, error, setData };
}
