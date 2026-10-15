const BASE_URL = import.meta.env.VITE_API_URL;

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
    } else if (response.status == 409) {
      const errorData = await response.json();
      throw new Error(
        errorData.message ||
          "Parameter has been used before. Please check your input and try again.",
      );
    } else {
      const errorData = await response.json();
      console.log(errorData);
      throw new Error(
        errorData.message ||
          "Something went wrong when fetching. Check your connection and retry",
      );
    }
  }
  const data = await response.json();
  return data;
}

export const handleExpiredToken = async () => {
  const response = await fetch(`${BASE_URL}/user/refresh_token`, {
    method: "POST",
    credentials: "include",
  });

  if (response.status == 401) {
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("userInfo");

    throw new Error("Relogin");
  }

  const data = await response.json();

  sessionStorage.setItem("accessToken", data?.data.accessToken);
  sessionStorage.setItem("userInfo", JSON.stringify(data?.data.user));
};
