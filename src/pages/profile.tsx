import StoreProfile from "../components/StoreProfile";
import CustomerProfile from "../components/CustomerProfile";
import { useAuthContext } from "../context/authContext";
import { Navigate } from "react-router-dom";

export default function Profile() {
  const { accessToken, userInfo } = useAuthContext();
  if (!accessToken) {
    return <Navigate to='/signin' replace />;
  }
  const role = userInfo?.role;

  return role === "CUSTOMER" ? <CustomerProfile /> : <StoreProfile />;
}
