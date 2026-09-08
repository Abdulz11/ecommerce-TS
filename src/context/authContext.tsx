import { useContext, createContext, useState } from "react";

export type UserInfo = {
  id: string;
  name: string;
  email: string;
  role: "STORE" | "CUSTOMER";
};

interface ObjAuthContext {
  accessToken: string;
  setAccessToken: React.Dispatch<React.SetStateAction<string>>;
  userInfo: UserInfo | null;
  setUserInfo: React.Dispatch<React.SetStateAction<UserInfo | null>>;
}
const AuthContext = createContext({} as ObjAuthContext);

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [accessToken, setAccessToken] = useState(
    sessionStorage.getItem("accessToken") || "",
  );
  const [userInfo, setUserInfo] = useState(
    JSON.parse(sessionStorage.getItem("userInfo") ?? "null") || null,
  );

  return (
    <AuthContext.Provider
      value={{ accessToken, setAccessToken, userInfo, setUserInfo }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuthContext() {
  return useContext(AuthContext);
}
