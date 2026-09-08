const BASE_URL = import.meta.env.VITE_API_URL_DEV;

export function fetchData(
  url: string,
  method: string = "GET",
  options?: RequestInit,
) {
  const urlOptions = {
    method,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
    credentials: "include" as RequestCredentials,
    ...options,
  };
  return fetch(`${BASE_URL}${url}`, urlOptions);
}
