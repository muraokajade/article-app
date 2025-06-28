import { User, onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../libs/firebase";

export const useAuth = () => {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // ← 追加
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unbscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const token = await user.getIdToken(true);
        setIdToken(token);

        const tokenResult = await user.getIdTokenResult();
        setIsAdmin(!!tokenResult.claims.admin);
      } else {
        setIdToken(null);
        setIsAdmin(false);
        
      }
      setLoading(false);
    });
    return () => unbscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
  };

  const isAuthenticated = !!user;

  return { user, idToken, isAuthenticated, loading, logout, isAdmin };
};
