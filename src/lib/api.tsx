const BASE_URL = import.meta.env.VITE_API_URL_DEV;

export function fetchData(
  url: string,
  method: string = "GET",
  options?: RequestInit,
  type: "json" | "multipart" = "json",
) {
  const headers: HeadersInit = {
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  };

  if (type == "json") {
    headers["Content-Type"] = "application/json";
  }
  const urlOptions = {
    method,
    headers,
    credentials: "include" as RequestCredentials,
    ...options,
  };
  return fetch(`${BASE_URL}${url}`, urlOptions);
}
