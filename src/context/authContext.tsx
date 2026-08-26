import { useContext, createContext, useState } from "react";

interface ObjAuthContext {
  accessToken: string;
  setAccessToken: React.Dispatch<React.SetStateAction<string>>;
  userInfo: any;
  setUserInfo: React.Dispatch<React.SetStateAction<any>>;
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
    JSON.parse(sessionStorage.getItem("userInfo") || ""),
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
