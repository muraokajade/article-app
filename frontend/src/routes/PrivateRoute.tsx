import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

type PrivateRouteProps = {
  children: React.ReactElement;
};

export const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>認証中.....</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
