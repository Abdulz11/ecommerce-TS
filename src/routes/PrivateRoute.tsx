import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../context/authContext";

export default function PrivateRoute(props: {
  children: React.ReactNode;
  allowedRoles?: string[];
}) {
  const { accessToken, userInfo } = useAuthContext();
  console.log(accessToken);
  console.log(userInfo);

  if (!accessToken || !userInfo) {
    return <Navigate to='/signin' replace />;
  }
  if (
    props.allowedRoles?.length !== 0 &&
    props.allowedRoles?.includes(userInfo?.role)
  ) {
    return props.children;
  }
  return <Navigate to='/' replace />;
}
