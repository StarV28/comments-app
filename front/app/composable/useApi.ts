import { useRuntimeConfig, useCookie } from "#app";

//-------------------------------------------------------------------------------------//
//---------------------------------------//

export const useApi = () => {
  const config = useRuntimeConfig();
  const baseUrl = config.public.apiUrl;

  const request = async <T>(
    url: string,
    options: Record<string, unknown> = {},
    ssr = false
  ) => {
    const token = useCookie("token");
    try {
      if (ssr && import.meta.server) {
        const { query, body, ...rest } = options;

        const { data, error } = await useFetch<T>(`${baseUrl}${url}`, {
          ...rest,
          server: true,
          lazy: false,
          params: options.params as Record<string, unknown>,
          body: options.body as Record<string, unknown>,
        });

        if (error.value) throw error.value;
        return data.value;
      } else {
        return await $fetch<T>(`${baseUrl}${url}`, {
          headers: {
            Authorization: token.value ? `Bearer ${token.value}` : "",
          },
          ...options,
        });
      }
    } catch (err: unknown) {
      if (err) throw err;
    }
  };

  return {
    get: <T>(url: string, options = {}, ssr = false) =>
      request<T>(url, { method: "GET", ...options }, ssr),
    post: <T>(url: string, body = {}, options = {}, ssr = false) =>
      request<T>(url, { method: "POST", body, ...options }, ssr),
    put: <T>(url: string, body = {}, options = {}, ssr = false) =>
      request<T>(url, { method: "PUT", body, ...options }, ssr),
    del: <T>(url: string, options = {}, ssr = false) =>
      request<T>(url, { method: "DELETE", ...options }, ssr),
  };
};
