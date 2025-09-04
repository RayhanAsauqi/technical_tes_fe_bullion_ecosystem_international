import { ref, onMounted } from "vue";
import Cookies from "js-cookie";

export function useFetch<T>(url: string) {
  const data = ref<T | null>(null);
  const loading = ref<boolean>(true);
  const error = ref<string | null>(null);

  async function fetchData() {
    loading.value = true;
    error.value = null;

    try {
      const token = Cookies.get("token");

      const res = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }

      const json = (await res.json()) as T;
      data.value = json;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Unexpected error occurred";
    } finally {
      loading.value = false;
    }
  }

  onMounted(fetchData);

  return { data, loading, error, refetch: fetchData };
}
