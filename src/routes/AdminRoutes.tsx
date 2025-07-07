import React from "react";
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";

const AdminRoute = ({ children }: { children: ReactNode }) => {
  const { currentUser, isAuthenticated, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAdmin = async () => {
      if (loading) return;
      if (currentUser) {
        const tokenResult = await currentUser.getIdTokenResult(true);
        console.log("Claims:", tokenResult.claims);
        setIsAdmin(!!tokenResult.claims.admin);
      }
    };
    checkAdmin();
  }, [currentUser, loading]);

  if (loading || isAdmin === null) return <p>Loading...</p>;
  if (!currentUser || !isAdmin) return <Navigate to="/" replace />;

  return children;
};

export default AdminRoute;
