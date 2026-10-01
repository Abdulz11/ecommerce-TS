const BASE_URL = import.meta.env.VITE_API_URL_DEV;

export async function fetchData(
  url: string,
  method: string = "GET",
  options?: RequestInit,
  type: "json" | "multipart" = "json",
) {
  // headers
  const headers: HeadersInit = {
    Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
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
  console.log(`${BASE_URL}${url}`, urlOptions);
  const response = await fetch(`${BASE_URL}${url}`, urlOptions);

  if (!response.ok) {
    if (response.status == 401) {
      await handleExpiredToken();
      return fetchData(url, method, options, type);
    } else {
      throw new Error(
        "Something went wrong when fetching.Check your connection and retry",
      );
    }
  }
  const data = await response.json();
  return data;
}

export const handleExpiredToken = async () => {
  const response = await fetch(`${BASE_URL}/store/refresh_token`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Relogin");
  }

  const data = await response.json();

  sessionStorage.setItem("accessToken", data.data.accessToken);

  sessionStorage.setItem("accessToken", data?.data.accessToken);
  sessionStorage.setItem("userInfo", JSON.stringify(data?.data.user));
};
