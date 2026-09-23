const BASE_URL = import.meta.env.VITE_API_URL_DEV;

export function fetchData(
  url: string,
  method: string = "GET",
  options?: RequestInit,
  type: "json" | "multipart" = "json",
) {
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
  return fetch(`${BASE_URL}${url}`, urlOptions);
}

export const handleExpiredToken = async (fetchFunc: () => Promise<void>) => {
  const response = await fetchData("/store/refresh_token", "POST");
  const data = await response.json();
  // console.log(data.data.accessToken);
  sessionStorage.setItem("accessToken", data?.data.accessToken);
  sessionStorage.setItem("userInfo", JSON.stringify(data?.data.user));

  await fetchFunc();

  //  setAccessToken(data?.data.accessToken);
  //  setUserInfo(data?.data.user);
};
