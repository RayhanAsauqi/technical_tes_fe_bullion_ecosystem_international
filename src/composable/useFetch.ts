import { ref } from "vue";
import Cookies from "js-cookie";

export function useFetch<T>() {
  const data = ref<T | null>(null);
  const error = ref<string | null>(null);
  const loading = ref<boolean>(false);

  async function request(url: string, options: RequestInit = {}): Promise<T | null> {
    loading.value = true;
    error.value = null;

    try {
      const token = Cookies.get("token");

      const defaultHeaders: Record<string, string> = {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      if (!(options.body instanceof FormData)) {
        defaultHeaders["Content-Type"] = "application/json";
      }

      const res = await fetch(url, {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
      });

      const result = await res.json();

      if (!res.ok) {
        throw result.message || "Terjadi kesalahan";
      }

      data.value = result as T;
      return result as T;
    } catch (err: any) {
      error.value = err;
      return null;
    } finally {
      loading.value = false;
    }
  }

  return {
    data,
    error,
    loading,
    request,
  };
}
